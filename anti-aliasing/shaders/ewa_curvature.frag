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
   float distortion;
}params;

#pragma parameterdistortion¡0.150.01.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;


















float boxFilter(float r2){
    return 1.0;
}

float gaussFilter(float r2){
    float alpha = 1.0;
    return exp(- alpha * r2);
}

float triFilter(float r2){
    float alpha = 1.0;
    float r = sqrt(r2);
    return max(0, 1. - r);
}

float sinc(float x){
    return sin(3.14159265358979323846 * x)/(3.14159265358979323846 * x);
}

float lanczosFilter(float r2){
    if(r2 == 0)
        return 1.;
    float r = sqrt(r2);
    return sinc(r)* sinc(r / 1.3);
}


float crFilter(float r2){
    float r = sqrt(r2);
    return(r >= 2.)? .0 :(r < 1.)?(3. * r * r2 - 5. * r2 + 2.):(- r * r2 + 5. * r2 - 8 * r + 4.);
}

float quadraticFilter(float r2){
    float a = 1.0;
    return 1.0 - r2 /(a * a);
}

float cubicFilter(float r2){
    float a = 1.0;
    float r = sqrt(r2);
    return 1.0 - 3 * r2 /(a * a)+ 2 * r * r2 /(a * a * a);
}









vec4 ewaFilter(sampler2D Source, vec2 p0, vec2 du, vec2 dv, int scale){

    vec4 foo = texture(Source, p0);


    if(scale < 2)
        return foo;

    p0 -= vec2(0.5, 0.5)/ scale;
    vec2 p = scale * p0;

    float ux = 0.8 * du . s * scale;
    float vx = 0.8 * du . t * scale;
    float uy = 0.8 * dv . s * scale;
    float vy = 0.8 * dv . t * scale;



    float A = vx * vx + vy * vy + 1;
    float B = - 2 *(ux * vx + uy * vy);
    float C = ux * ux + uy * uy + 1;
    float F = A * C - B * B / 4.;


    float bbox_du = 2. /(- B * B + 4.0 * C * A)* sqrt((- B * B + 4.0 * C * A)* C * F);
    float bbox_dv = 2. /(- B * B + 4.0 * C * A)* sqrt(A *(- B * B + 4.0 * C * A)* F);


    int u0 = int(floor(p . s - bbox_du));
    int u1 = int(ceil(p . s + bbox_du));
    int v0 = int(floor(p . t - bbox_dv));
    int v1 = int(ceil(p . t + bbox_dv));





    vec4 num = vec4(0., 0., 0., 1.);
    float den = 0;
    float ddq = 2 * A;
    float U = u0 - p . s;

    for(int v = v0;v <= v1;++ v){
        float V = v - p . t;
        float dq = A *(2 * U + 1)+ B * V;
        float q =(C * V + B * U)* V + A * U * U;

        for(int u = u0;u <= u1;++ u){
            if(q < F)
            {
                float r2 = q / F;
                float weight = gaussFilter(r2);

                num += weight * texture(Source, vec2(u + 0.5, v + 0.5)/ scale);
                den += weight;
            }
            q += dq;
            dq += ddq;
        }

    }


    vec4 color = num *(1. / den);
    return color;
}

vec4 texture2DEWA(sampler2D tex, vec2 coords){

    vec2 du = dFdx(coords);
    vec2 dv = dFdy(coords);

    int scale = textureSize(tex, 0). x;

    return ewaFilter(tex, coords, du, dv, scale);

}

vec2 radialDistortion(vec2 coord){
  vec2 cc = coord - vec2(0.5);
  float dist = dot(cc, cc)* params . distortion;
  return coord + cc *(1.0 - dist)* dist;
}

void main()
{
   FragColor = texture2DEWA(Source, radialDistortion(vTexCoord));
}
