#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4












































uniform Push
{
   float FIR_GAIN;
   float FIR_INVGAIN;
   float PHASE_NOISE;
}params;

#pragma parameterFIR_GAIN�1.50.05.00.1
#pragma parameterFIR_INVGAIN�1.10.05.00.1
#pragma parameterPHASE_NOISE�1.00.05.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   uint FrameCount;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;






























float FIR[20]= float[20](
   - 0.008030271,
    0.003107906,
    0.016841352,
    0.032545161,
    0.049360136,
    0.066256720,
    0.082120150,
    0.095848433,
    0.106453014,
    0.113151423,
    0.115441842,
    0.113151423,
    0.106453014,
    0.095848433,
    0.082120150,
    0.066256720,
    0.049360136,
    0.032545161,
    0.016841352,
    0.003107906
);



float counts_per_scanline_reciprocal = 1.0 /(4433618.75 / 15625);

float width_ratio;
float height_ratio;
float altv;
float invx;


float rand(vec2 co)
{
    float a = 12.9898;
    float b = 78.233;
    float c = 43758.5453;
    float dt = dot(co . xy, vec2(a, b));
    float sn = mod(dt, 3.14);

    return fract(sin(sn)* c);
}

float modulated(vec2 xy, float sinwt, float coswt)
{
    vec3 rgb = texture(Source, vec2((0)*(invx)+ xy . x, xy . y)). xyz;
    vec3 yuv = mat3x3(0.299, - 0.14713, 0.615, 0.587, - 0.28886, - 0.514991, 0.114, 0.436, - 0.10001)* rgb;

    return clamp(yuv . x + yuv . y * sinwt + yuv . z * coswt, 0.0, 1.0);
}

vec2 modem_uv(vec2 xy, float ofs){
    float t =(xy . x + ofs * invx)* global . SourceSize . x;
    float wt = t * 2 * 3.14159265358 / width_ratio;

    float sinwt = sin(wt);
    float coswt = cos(wt + altv);

    vec3 rgb = texture(Source, vec2((ofs)*(invx)+ xy . x, xy . y)). xyz;
    vec3 yuv = mat3x3(0.299, - 0.14713, 0.615, 0.587, - 0.28886, - 0.514991, 0.114, 0.436, - 0.10001)* rgb;
    float signal = clamp(yuv . x + yuv . y * sinwt + yuv . z * coswt, 0.0, 1.0);

    if(params . PHASE_NOISE != 0)
    {

        vec2 seed = xy . yy * global . FrameCount;
        wt = wt + params . PHASE_NOISE *(rand(seed)- 0.5);
        sinwt = sin(wt);
        coswt = cos(wt + altv);
    }

    return vec2(signal * sinwt, signal * coswt);
}

void main()
{
    vec2 xy = vTexCoord;
    width_ratio = global . SourceSize . x *(counts_per_scanline_reciprocal);
    height_ratio = global . SourceSize . y / 312;
    altv = mod(floor(xy . y * 312 + 0.5), 2.0)* 3.14159265358;
    invx = 0.25 *(counts_per_scanline_reciprocal);


    vec2 filtered = vec2(0.0, 0.0);
    for(int i = 0;i < 20;i ++){
        vec2 uv = modem_uv(xy, i - 20 * 0.5);
        filtered += params . FIR_GAIN * uv * FIR[i];
    }

    float t = xy . x * global . SourceSize . x;
    float wt = t * 2 * 3.14159265358 / width_ratio;

    float sinwt = sin(wt);
    float coswt = cos(wt + altv);

    float luma = modulated(xy, sinwt, coswt)- params . FIR_INVGAIN *(filtered . x * sinwt + filtered . y * coswt);
    vec3 yuv_result = vec3(luma, filtered . x, filtered . y);

    FragColor = vec4(mat3x3(1.0, 1.0, 1.0, 0.0, - 0.39465, 2.03211, 1.13983, - 0.58060, 0.0)* yuv_result, 1.0);
}
