#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4




uniform Push
{
   float BLOOM_STRENGTH;
   float OUTPUT_GAMMA;
   float CURVATURE;
   float moire_mitigation;
   float warpX;
   float warpY;
   float shadowMask;
   float maskDark;
   float maskLight;
}params;

#pragma parameterBLOOM_STRENGTH¡0.450.00.80.05
#pragma parameterOUTPUT_GAMMA¡2.21.82.60.02
#pragma parameterCURVATURE¡0.00.01.01.0
#pragma parametermoire_mitigation¡4.01.010.01.0
#pragma parameterwarpX¡0.0310.00.1250.01
#pragma parameterwarpY¡0.0410.00.1250.01
#pragma parametershadowMask¡0.00.04.01.0
#pragma parametermaskDark¡0.50.02.00.1
#pragma parametermaskLight¡1.50.02.00.1




layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   vec4 CRTPassSize;
   uint FrameCount;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D CRTPass;








vec4 Srgb(vec4 c){ return pow(c, vec4(1.0 / 2.2));}



float Linear(float c){ return pow(c, 2.2);}







float Noise(vec2 p, float x){ p += x;
 vec3 p3 = fract(vec3(p . xyx)* 10.1031);
 p3 += dot(p3, p3 . yzx + 19.19);
 return(fract((p3 . x + p3 . y)* p3 . z)* 2.0 - 1.0)/ pow(2.0, 11.0 - params . moire_mitigation);}


float Noise1(vec2 uv, float n){
 float a = 1.0, b = 2.0, c = - 12.0, t = 1.0;
 return(1.0 / max(a * 4.0 + b * 4.0, - c))*(
  Noise(uv + vec2(- 1.0, - 1.0)* t, n)* a +
  Noise(uv + vec2(0.0, - 1.0)* t, n)* b +
  Noise(uv + vec2(1.0, - 1.0)* t, n)* a +
  Noise(uv + vec2(- 1.0, 0.0)* t, n)* b +
  Noise(uv + vec2(0.0, 0.0)* t, n)* c +
  Noise(uv + vec2(1.0, 0.0)* t, n)* b +
  Noise(uv + vec2(- 1.0, 1.0)* t, n)* a +
  Noise(uv + vec2(0.0, 1.0)* t, n)* b +
  Noise(uv + vec2(1.0, 1.0)* t, n)* a +
 0.0);}


float Noise2(vec2 uv, float n){
 float a = 1.0, b = 2.0, c = - 2.0, t = 1.0;
 return(1.0 /(a * 4.0 + b * 4.0))*(
  Noise1(uv + vec2(- 1.0, - 1.0)* t, n)* a +
  Noise1(uv + vec2(0.0, - 1.0)* t, n)* b +
  Noise1(uv + vec2(1.0, - 1.0)* t, n)* a +
  Noise1(uv + vec2(- 1.0, 0.0)* t, n)* b +
  Noise1(uv + vec2(0.0, 0.0)* t, n)* c +
  Noise1(uv + vec2(1.0, 0.0)* t, n)* b +
  Noise1(uv + vec2(- 1.0, 1.0)* t, n)* a +
  Noise1(uv + vec2(0.0, 1.0)* t, n)* b +
  Noise1(uv + vec2(1.0, 1.0)* t, n)* a +
 0.0);}


float Noise3(vec2 uv){ return Noise2(uv, fract(mod(float(global . FrameCount)/ 60.0, 600.0)));}


vec2 Noise4(vec2 uv, vec2 c, float a){

 vec2 g = vec2(Noise3(uv)* 2.0);

 float rcpStep = 1.0 /(256.0 - 1.0);

 vec2 black = vec2(0.5 * Linear(rcpStep));

 vec2 white = vec2(2.0 - Linear(1.0 - rcpStep));

 return vec2(clamp(c + g * min(c + black, min(white - c, a)), 0.0, 1.0));}















vec2 Quad4(vec2 pp){
 int q =(int(pp . x)& 1)+((int(pp . y)& 1)<< 1);
 if(q == 0)return pp + vec2(0.25, - 0.25);
 if(q == 1)return pp + vec2(0.25, 0.25);
 if(q == 2)return pp + vec2(- 0.25, - 0.25);
         return pp + vec2(- 0.25, 0.25);}


vec2 Rot(float r, float a){ return vec2(r * cos(a * 3.14159), r * sin(a * 3.14159));}






vec2 Jit(vec2 pp){

 pp = Quad4(pp);

 float n = Noise(pp, fract(mod(float(global . FrameCount)/ 60.0, 600.0)));
 float m = Noise(pp, fract(mod(float(global . FrameCount)/ 60.0, 600.0)* 0.333))* 0.5 + 0.5;
 m = sqrt(m)/ 4.0;
 return pp + Rot(0.707 * 0.5 * m, n);}






void JitGaus4(inout vec2 sumC, inout vec2 sumW, vec2 pp, vec2 mm){
 vec2 jj = Jit(pp);
 vec2 c = jj;
 vec2 vv = mm - jj;
 float w = exp2(- 1.0 * dot(vv, vv));
 sumC += c * vec2(w);sumW += vec2(w);}









vec2 ResolveJitGaus4(vec2 pp){
 vec2 ppp =(pp);
 vec2 sumC = vec2(0.0);
 vec2 sumW = vec2(0.0);
 JitGaus4(sumC, sumW, ppp + vec2(- 1.0, - 2.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(0.0, - 2.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(1.0, - 2.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(- 2.0, - 1.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(- 1.0, - 1.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(0.0, - 1.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(1.0, - 1.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(2.0, - 1.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(- 2.0, 0.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(- 1.0, 0.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(0.0, 0.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(1.0, 0.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(2.0, 0.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(- 2.0, 1.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(- 1.0, 1.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(0.0, 1.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(1.0, 1.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(2.0, 1.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(- 1.0, 2.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(0.0, 2.0), pp);
 JitGaus4(sumC, sumW, ppp + vec2(1.0, 2.0), pp);
 return sumC / sumW;}

vec2 moire_resolve(vec2 coord){
   vec2 pp = coord;
   vec2 cc = vec2(0.0, 0.0);

   cc = ResolveJitGaus4(pp);
   cc = Noise4(pp, cc, 1.0 / 32.0);
   cc =(params . CURVATURE < 0.5)? pp : cc + vec2(0.0105, 0.015);

   return cc;
}


vec2 Warp(vec2 pos)
{
    pos = pos * 2.0 - 1.0;
    pos *= vec2(1.0 +(pos . y * pos . y)* params . warpX, 1.0 +(pos . x * pos . x)* params . warpY);

    return pos * 0.5 + 0.5;
}


vec3 Mask(vec2 pos)
{
    vec3 mask = vec3(params . maskDark, params . maskDark, params . maskDark);


    if(params . shadowMask == 1.0)
    {
        float line = params . maskLight;
        float odd = 0.0;

        if(fract(pos . x * 0.166666666)< 0.5)odd = 1.0;
        if(fract((pos . y + odd)* 0.5)< 0.5)line = params . maskDark;

        pos . x = fract(pos . x * 0.333333333);

        if(pos . x < 0.333)mask . r = params . maskLight;
        else if(pos . x < 0.666)mask . g = params . maskLight;
        else mask . b = params . maskLight;
        mask *= line;
    }


    else if(params . shadowMask == 2.0)
    {
        pos . x = fract(pos . x * 0.333333333);

        if(pos . x < 0.333)mask . r = params . maskLight;
        else if(pos . x < 0.666)mask . g = params . maskLight;
        else mask . b = params . maskLight;
    }


    else if(params . shadowMask == 3.0)
    {
        pos . x += pos . y * 3.0;
        pos . x = fract(pos . x * 0.166666666);

        if(pos . x < 0.333)mask . r = params . maskLight;
        else if(pos . x < 0.666)mask . g = params . maskLight;
        else mask . b = params . maskLight;
    }


    else if(params . shadowMask == 4.0)
    {
        pos . xy = floor(pos . xy * vec2(1.0, 0.5));
        pos . x += pos . y * 3.0;
        pos . x = fract(pos . x * 0.166666666);

        if(pos . x < 0.333)mask . r = params . maskLight;
        else if(pos . x < 0.666)mask . g = params . maskLight;
        else mask . b = params . maskLight;
    }

    return mask;
}

void main()
{
   vec2 pp = moire_resolve(vTexCoord . xy);
   pp =(params . CURVATURE > 0.5)? Warp(pp): pp;





    vec3 source = 1.15 * texture(CRTPass, pp). rgb;
    vec3 bloom = texture(Source, pp). rgb;
    source += params . BLOOM_STRENGTH * bloom;

    FragColor = vec4(pow(clamp(source, 0.0, 1.0), vec3(1.0 / params . OUTPUT_GAMMA)), 1.0);

    if(pp . x > 0.0106 && pp . x < 0.9999 && pp . y > 0.016 && pp . y < 0.9999)
        FragColor . rgb = FragColor . rgb;
    else
FragColor . rgb = vec3(0.0);
if(params . shadowMask > 0.0)
        FragColor . rgb = pow(pow(FragColor . rgb, vec3(2.2))* Mask(vTexCoord . xy * global . OutputSize . xy * 1.000001), vec3(1.0 / 2.2));
}
