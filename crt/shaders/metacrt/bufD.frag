#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4





uniform Push
{
   vec4 SourceSize;
   vec4 OriginalSize;
   vec4 OutputSize;
   uint FrameCount;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;































vec2 hash21(float p)
{
 vec3 p3 = fract(vec3(p)* vec3(443.897, 441.423, 437.195));
 p3 += dot(p3, p3 . yzx + 19.19);
    return fract((p3 . xx + p3 . yz)* p3 . zy);

}


vec2 hash23(vec3 p3)
{
 p3 = fract(p3 * vec3(443.897, 441.423, 437.195));
    p3 += dot(p3, p3 . yzx + 19.19);
    return fract((p3 . xx + p3 . yz)* p3 . zy);
}


float hash13(vec3 p3)
{
 p3 = fract(p3 * 443.8975);
    p3 += dot(p3, p3 . yzx + 19.19);
    return fract((p3 . x + p3 . y)* p3 . z);
}






vec4 LoadVec4(sampler2D tex, in ivec2 vAddr)
{
    return texelFetch(tex, vAddr, 0);
}

vec3 LoadVec3(sampler2D tex, in ivec2 vAddr)
{
    return LoadVec4(tex, vAddr). xyz;
}

bool AtAddress(ivec2 p, ivec2 c){ return all(equal(p, c));}

void StoreVec4(in ivec2 vAddr, in vec4 vValue, inout vec4 fragColor, in ivec2 fragCoord)
{
    fragColor = AtAddress(fragCoord, vAddr)? vValue : fragColor;
}

void StoreVec3(in ivec2 vAddr, in vec3 vValue, inout vec4 fragColor, in ivec2 fragCoord)
{
    StoreVec4(vAddr, vec4(vValue, 0.0), fragColor, fragCoord);
}





struct CameraState
{
    vec3 vPos;
    vec3 vTarget;
    float fFov;
    vec2 vJitter;
    float fPlaneInFocus;
};

void Cam_LoadState(out CameraState cam, sampler2D tex, ivec2 addr)
{
    vec4 vPos = LoadVec4(tex, addr + ivec2(0, 0));
    cam . vPos = vPos . xyz;
    vec4 targetFov = LoadVec4(tex, addr + ivec2(1, 0));
    cam . vTarget = targetFov . xyz;
    cam . fFov = targetFov . w;
    vec4 jitterDof = LoadVec4(tex, addr + ivec2(2, 0));
    cam . vJitter = jitterDof . xy;
    cam . fPlaneInFocus = jitterDof . z;
}

void Cam_StoreState(ivec2 addr, const in CameraState cam, inout vec4 fragColor, in ivec2 fragCoord)
{
    StoreVec4(addr + ivec2(0, 0), vec4(cam . vPos, 0), fragColor, fragCoord);
    StoreVec4(addr + ivec2(1, 0), vec4(cam . vTarget, cam . fFov), fragColor, fragCoord);
    StoreVec4(addr + ivec2(2, 0), vec4(cam . vJitter, cam . fPlaneInFocus, 0), fragColor, fragCoord);
}

mat3 Cam_GetWorldToCameraRotMatrix(const CameraState cameraState)
{
    vec3 vForward = normalize(cameraState . vTarget - cameraState . vPos);
 vec3 vRight = normalize(cross(vec3(0, 1, 0), vForward));
 vec3 vUp = normalize(cross(vForward, vRight));

    return mat3(vRight, vUp, vForward);
}

vec2 Cam_GetViewCoordFromUV(const in vec2 vUV)
{
 vec2 vWindow = vUV * 2.0 - 1.0;
 vWindow . x *= params . SourceSize . x / params . SourceSize . y;

 return vWindow;
}

void Cam_GetCameraRay(const vec2 vUV, const CameraState cam, out vec3 vRayOrigin, out vec3 vRayDir)
{
    vec2 vView = Cam_GetViewCoordFromUV(vUV);
    vRayOrigin = cam . vPos;
    float fPerspDist = 1.0 / tan(radians(cam . fFov));
    vRayDir = normalize(Cam_GetWorldToCameraRotMatrix(cam)* vec3(vView, fPerspDist));
}

vec2 Cam_GetUVFromWindowCoord(const in vec2 vWindow)
{
    vec2 vScaledWindow = vWindow;
    vScaledWindow . x *= params . SourceSize . y / params . SourceSize . x;

    return(vScaledWindow * 0.5 + 0.5);
}

vec2 Cam_WorldToWindowCoord(const in vec3 vWorldPos, const in CameraState cameraState)
{
    vec3 vOffset = vWorldPos - cameraState . vPos;
    vec3 vCameraLocal;

    vCameraLocal = vOffset * Cam_GetWorldToCameraRotMatrix(cameraState);

    vec2 vWindowPos = vCameraLocal . xy /(vCameraLocal . z * tan(radians(cameraState . fFov)));

    return vWindowPos;
}

float EncodeDepthAndObject(float depth, int objectId)
{



    return depth;
}

float DecodeDepthAndObjectId(float value, out int objectId)
{
    objectId = 0;
    return max(0.0, value);


}







vec3 Tonemap(vec3 x)
{
    float a = 0.010;
    float b = 0.132;
    float c = 0.010;
    float d = 0.163;
    float e = 0.101;

    return(x *(a * x + b))/(x *(c * x + d)+ e);
}

vec3 TAA_ColorSpace(vec3 color)
{
    return Tonemap(color);
}

void main()
{
    CameraState camCurr;
 Cam_LoadState(camCurr, Source, ivec2(0));

    CameraState camPrev;
 Cam_LoadState(camPrev, Source, ivec2(0));

    vec2 vUV = vec2(vTexCoord . xy * params . OutputSize . xy). xy / params . SourceSize . xy;
  vec2 vUnJitterUV = vUV - camCurr . vJitter / params . SourceSize . xy;

    FragColor = textureLod(Source, vUnJitterUV, 0.0);



    vec3 vRayOrigin, vRayDir;
    Cam_GetCameraRay(vUV, camCurr, vRayOrigin, vRayDir);
    float fDepth;
    int iObjectId;
    vec4 vCurrTexel = texelFetch(Source, ivec2(vec2(vTexCoord . xy * params . OutputSize . xy). xy), 0);
    fDepth = DecodeDepthAndObjectId(vCurrTexel . w, iObjectId);
    vec3 vWorldPos = vRayOrigin + vRayDir * fDepth;

    vec2 vPrevUV = Cam_GetUVFromWindowCoord(Cam_WorldToWindowCoord(vWorldPos, camPrev));

    if(all(greaterThanEqual(vPrevUV, vec2(0)))&& all(lessThan(vPrevUV, vec2(1))))
 {
        vec3 vMin = vec3(10000);
        vec3 vMax = vec3(- 10000);

     ivec2 vCurrXY = ivec2(floor(vec2(vTexCoord . xy * params . OutputSize . xy). xy));

        int iNeighborhoodSize = 1;
        for(int iy = - iNeighborhoodSize;iy <= iNeighborhoodSize;iy ++)
        {
            for(int ix = - iNeighborhoodSize;ix <= iNeighborhoodSize;ix ++)
            {
                ivec2 iOffset = ivec2(ix, iy);
          vec3 vTest = TAA_ColorSpace(texelFetch(Source, vCurrXY + iOffset, 0). rgb);

                vMin = min(vMin, vTest);
                vMax = max(vMax, vTest);
            }
        }

        float epsilon = 0.001;
        vMin -= epsilon;
        vMax += epsilon;

        float fBlend = 0.0f;


        vec4 vHistory = textureLod(Source, vPrevUV, 0.0);

        vec3 vPrevTest = TAA_ColorSpace(vHistory . rgb);
        if(all(greaterThanEqual(vPrevTest, vMin))&& all(lessThanEqual(vPrevTest, vMax)))
        {
            fBlend = 0.9;

        }

        FragColor . rgb = mix(FragColor . rgb, vHistory . rgb, fBlend);
    }
    else
    {

    }



    FragColor . rgb +=(hash13(vec3(vec2(vTexCoord . xy * params . OutputSize . xy), float(params . FrameCount)))* 2.0 - 1.0)* 0.03;

 Cam_StoreState(ivec2(0), camCurr, FragColor, ivec2(vec2(vTexCoord . xy * params . OutputSize . xy). xy));
 Cam_StoreState(ivec2(3, 0), camPrev, FragColor, ivec2(vec2(vTexCoord . xy * params . OutputSize . xy). xy));
}
