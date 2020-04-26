#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4














uniform Push
{
   float hardScan;
   float hardPix;
   float warpX;
   float warpY;
   float maskDark;
   float maskLight;
   float scaleInLinearGamma;
   float shadowMask;
   float brightBoost;
   float hardBloomScan;
   float hardBloomPix;
   float bloomAmount;
   float shape;
   float DIFFUSION;
}param;

#pragma parameterhardScan¡-8.0-20.00.01.0
#pragma parameterhardPix¡-3.0-20.00.01.0
#pragma parameterwarpX¡0.0310.00.1250.01
#pragma parameterwarpY¡0.0410.00.1250.01
#pragma parametermaskDark¡0.50.02.00.1
#pragma parametermaskLight¡1.50.02.00.1
#pragma parameterscaleInLinearGamma¡1.00.01.01.0
#pragma parametershadowMask¡3.00.04.01.0
#pragma parameterbrightBoost¡1.00.02.00.05
#pragma parameterhardBloomPix¡-1.5-2.0-0.50.1
#pragma parameterhardBloomScan¡-2.0-4.0-1.00.1
#pragma parameterbloomAmount¡0.400.01.00.05
#pragma parametershape¡2.00.010.00.05
#pragma parameterDIFFUSION¡0.00.01.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 FragCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D ORIG_LINEARIZED;
uniform sampler2D BloomPass;
uniform sampler2D GlowPass;











float ToLinear1(float c)
{
    return c;
}
vec3 ToLinear(vec3 c)
{
    return c;
}
vec3 ToSrgb(vec3 c)
{
    return pow(c, vec3(1.0 / 2.2));
}








































vec3 Fetch(vec2 pos, vec2 off){
  pos =(floor(pos * global . SourceSize . xy + off)+ vec2(0.5, 0.5))/ global . SourceSize . xy;

  return ToLinear(param . brightBoost *(texture(ORIG_LINEARIZED, pos . xy). rgb));



}


vec2 Dist(vec2 pos)
{
    pos = pos * global . SourceSize . xy;

    return -((pos - floor(pos))- vec2(0.5));
}


float Gaus(float pos, float scale)
{
    return exp2(scale * pow(abs(pos), param . shape));
}


vec3 Horz3(vec2 pos, float off)
{
    vec3 b = Fetch(pos, vec2(- 1.0, off));
    vec3 c = Fetch(pos, vec2(0.0, off));
    vec3 d = Fetch(pos, vec2(1.0, off));
    float dst = Dist(pos). x;


    float scale = param . hardPix;
    float wb = Gaus(dst - 1.0, scale);
    float wc = Gaus(dst + 0.0, scale);
    float wd = Gaus(dst + 1.0, scale);


    return(b * wb + c * wc + d * wd)/(wb + wc + wd);
}


vec3 Horz5(vec2 pos, float off){
    vec3 a = Fetch(pos, vec2(- 2.0, off));
    vec3 b = Fetch(pos, vec2(- 1.0, off));
    vec3 c = Fetch(pos, vec2(0.0, off));
    vec3 d = Fetch(pos, vec2(1.0, off));
    vec3 e = Fetch(pos, vec2(2.0, off));

    float dst = Dist(pos). x;

    float scale = param . hardPix;
    float wa = Gaus(dst - 2.0, scale);
    float wb = Gaus(dst - 1.0, scale);
    float wc = Gaus(dst + 0.0, scale);
    float wd = Gaus(dst + 1.0, scale);
    float we = Gaus(dst + 2.0, scale);


    return(a * wa + b * wb + c * wc + d * wd + e * we)/(wa + wb + wc + wd + we);
}


vec3 Horz7(vec2 pos, float off)
{
    vec3 a = Fetch(pos, vec2(- 3.0, off));
    vec3 b = Fetch(pos, vec2(- 2.0, off));
    vec3 c = Fetch(pos, vec2(- 1.0, off));
    vec3 d = Fetch(pos, vec2(0.0, off));
    vec3 e = Fetch(pos, vec2(1.0, off));
    vec3 f = Fetch(pos, vec2(2.0, off));
    vec3 g = Fetch(pos, vec2(3.0, off));

    float dst = Dist(pos). x;

    float scale = param . hardBloomPix;
    float wa = Gaus(dst - 3.0, scale);
    float wb = Gaus(dst - 2.0, scale);
    float wc = Gaus(dst - 1.0, scale);
    float wd = Gaus(dst + 0.0, scale);
    float we = Gaus(dst + 1.0, scale);
    float wf = Gaus(dst + 2.0, scale);
    float wg = Gaus(dst + 3.0, scale);


    return(a * wa + b * wb + c * wc + d * wd + e * we + f * wf + g * wg)/(wa + wb + wc + wd + we + wf + wg);
}


float Scan(vec2 pos, float off)
{
    float dst = Dist(pos). y;

    return Gaus(dst + off, param . hardScan);
}


float BloomScan(vec2 pos, float off)
{
    float dst = Dist(pos). y;

    return Gaus(dst + off, param . hardBloomScan);
}


vec3 Tri(vec2 pos)
{
    vec3 a = Horz3(pos, - 1.0);
    vec3 b = Horz5(pos, 0.0);
    vec3 c = Horz3(pos, 1.0);

    float wa = Scan(pos, - 1.0);
    float wb = Scan(pos, 0.0);
    float wc = Scan(pos, 1.0);

    return a * wa + b * wb + c * wc;
}


vec3 Bloom(vec2 pos)
{
    vec3 a = Horz5(pos, - 2.0);
    vec3 b = Horz7(pos, - 1.0);
    vec3 c = Horz7(pos, 0.0);
    vec3 d = Horz7(pos, 1.0);
    vec3 e = Horz5(pos, 2.0);

    float wa = BloomScan(pos, - 2.0);
    float wb = BloomScan(pos, - 1.0);
    float wc = BloomScan(pos, 0.0);
    float wd = BloomScan(pos, 1.0);
    float we = BloomScan(pos, 2.0);

    return a * wa + b * wb + c * wc + d * wd + e * we;
}


vec2 Warp(vec2 pos)
{
    pos = pos * 2.0 - 1.0;
    pos *= vec2(1.0 +(pos . y * pos . y)* param . warpX, 1.0 +(pos . x * pos . x)* param . warpY);

    return pos * 0.5 + 0.5;
}


vec3 Mask(vec2 pos)
{
    vec3 mask = vec3(param . maskDark, param . maskDark, param . maskDark);


    if(param . shadowMask == 1.0)
    {
        float line = param . maskLight;
        float odd = 0.0;

        if(fract(pos . x * 0.166666666)< 0.5)odd = 1.0;
        if(fract((pos . y + odd)* 0.5)< 0.5)line = param . maskDark;

        pos . x = fract(pos . x * 0.333333333);

        if(pos . x < 0.333)mask . r = param . maskLight;
        else if(pos . x < 0.666)mask . g = param . maskLight;
        else mask . b = param . maskLight;
        mask *= line;
    }


    else if(param . shadowMask == 2.0)
    {
        pos . x = fract(pos . x * 0.333333333);

        if(pos . x < 0.333)mask . r = param . maskLight;
        else if(pos . x < 0.666)mask . g = param . maskLight;
        else mask . b = param . maskLight;
    }


    else if(param . shadowMask == 3.0)
    {
        pos . x += pos . y * 3.0;
        pos . x = fract(pos . x * 0.166666666);

        if(pos . x < 0.333)mask . r = param . maskLight;
        else if(pos . x < 0.666)mask . g = param . maskLight;
        else mask . b = param . maskLight;
    }


    else if(param . shadowMask == 4.0)
    {
        pos . xy = floor(pos . xy * vec2(1.0, 0.5));
        pos . x += pos . y * 3.0;
        pos . x = fract(pos . x * 0.166666666);

        if(pos . x < 0.333)mask . r = param . maskLight;
        else if(pos . x < 0.666)mask . g = param . maskLight;
        else mask . b = param . maskLight;
    }

    return mask;
}

void main()
{
    vec2 pos = Warp(vTexCoord);
    vec3 outColor = Tri(pos). rgb;
    vec3 diff = texture(GlowPass, pos). rgb;

    if(param . shadowMask > 0.0)
        outColor . rgb *= Mask(vTexCoord . xy / global . OutputSize . zw * 1.000001);


    outColor . rgb += mix(vec3(0.0), texture(BloomPass, pos). rgb, param . bloomAmount);








    outColor += diff * param . DIFFUSION;
    FragColor = vec4(ToSrgb(outColor . rgb), 1.0);
}
