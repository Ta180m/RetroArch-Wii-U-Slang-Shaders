#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   uint FrameCount;
   float CRTgamma;
   float monitorgamma;
   float d;
   float R;
   float cornersize;
   float cornersmooth;
   float x_tilt;
   float y_tilt;
   float overscan_x;
   float overscan_y;
   float DOTMASK;
   float SHARPER;
   float scanline_weight;
   float CURVATURE;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
}global;

#pragma parameterCRTgamma¡2.40.15.00.1
#pragma parametermonitorgamma¡2.20.15.00.1
#pragma parameterd¡1.50.13.00.1
#pragma parameterCURVATURE¡1.00.01.01.0
#pragma parameterR¡2.00.110.00.1
#pragma parametercornersize¡0.030.0011.00.005
#pragma parametercornersmooth¡1000.080.02000.0100.0
#pragma parameterx_tilt¡0.0-0.50.50.05
#pragma parametery_tilt¡0.0-0.50.50.05
#pragma parameteroverscan_x¡100.0-125.0125.01.0
#pragma parameteroverscan_y¡100.0-125.0125.01.0
#pragma parameterDOTMASK¡0.30.00.30.3
#pragma parameterSHARPER¡1.01.03.01.0
#pragma parameterscanline_weight¡0.30.10.50.05















































vec2 aspect = vec2(1.0, 0.75);
vec2 overscan = vec2(1.01, 1.01);

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 sinangle;
layout(location = 2) out vec2 cosangle;
layout(location = 3) out vec3 stretch;
layout(location = 4) out vec2 ilfac;
layout(location = 5) out vec2 one;
layout(location = 6) out float mod_factor;
layout(location = 7) out vec2 TextureSize;

float intersect(vec2 xy)
{
    float A = dot(xy, xy)+ registers . d * registers . d;
    float B = 2.0 *(registers . R *(dot(xy, sinangle)- registers . d * cosangle . x * cosangle . y)- registers . d * registers . d);
    float C = registers . d * registers . d + 2.0 * registers . R * registers . d * cosangle . x * cosangle . y;

    return(- B - sqrt(B * B - 4.0 * A * C))/(2.0 * A);
}

vec2 bkwtrans(vec2 xy)
{
    float c = intersect(xy);
    vec2 point =(vec2(c, c)* xy - vec2(- registers . R, - registers . R)* sinangle)/ vec2(registers . R, registers . R);
    vec2 poc = point / cosangle;

    vec2 tang = sinangle / cosangle;
    float A = dot(tang, tang)+ 1.0;
    float B = - 2.0 * dot(poc, tang);
    float C = dot(poc, poc)- 1.0;

    float a =(- B + sqrt(B * B - 4.0 * A * C))/(2.0 * A);
    vec2 uv =(point - a * sinangle)/ cosangle;
    float r = max(abs(registers . R * acos(a)), 1e-5);;

    return uv * r / sin(r / registers . R);
}

vec2 fwtrans(vec2 uv)
{
    float r = max(abs(sqrt(dot(uv, uv))), 1e-5);;
    uv *= sin(r / registers . R)/ r;
    float x = 1.0 - cos(r / registers . R);
    float D = registers . d / registers . R + x * cosangle . x * cosangle . y + dot(uv, sinangle);

    return registers . d *(uv * cosangle - x * sinangle)/ D;
}

vec3 maxscale()
{
    vec2 c = bkwtrans(- registers . R * sinangle /(1.0 + registers . R / registers . d * cosangle . x * cosangle . y));
    vec2 a = vec2(0.5, 0.5)* aspect;

    vec2 lo = vec2(fwtrans(vec2(- a . x, c . y)). x,
                   fwtrans(vec2(c . x, - a . y)). y)/ aspect;

    vec2 hi = vec2(fwtrans(vec2(+ a . x, c . y)). x,
                   fwtrans(vec2(c . x, + a . y)). y)/ aspect;

    return vec3((hi + lo)* aspect * 0.5, max(hi . x - lo . x, hi . y - lo . y));
}







vec4 scanlineWeights(float distance, vec4 color)
{











        vec4 wid = 0.3 + 0.1 * pow(color, vec4(3.0));
        vec4 weights = vec4(distance / wid);

        return 0.4 * exp(- weights * weights)/ wid;






}

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord * vec2(1.00001);



    sinangle = sin(vec2(registers . x_tilt, registers . y_tilt));
    cosangle = cos(vec2(registers . x_tilt, registers . y_tilt));
    stretch = maxscale();
    TextureSize = vec2(registers . SHARPER * registers . SourceSize . x, registers . SourceSize . y);


    ilfac = vec2(1.0, clamp(floor(registers . SourceSize . y / 200.0), 1.0, 2.0));





    one = ilfac / TextureSize;


    mod_factor = vTexCoord . x * registers . SourceSize . x * registers . OutputSize . x / registers . SourceSize . x;
}

