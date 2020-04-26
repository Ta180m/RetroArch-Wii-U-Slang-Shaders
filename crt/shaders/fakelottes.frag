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
   float shadowMask;
   float SCANLINE_SINE_COMP_B;
   float warpX;
   float warpY;
   float maskDark;
   float maskLight;
   float crt_gamma;
   float monitor_gamma;
   float SCANLINE_SINE_COMP_A;
   float SCANLINE_BASE_BRIGHTNESS;
}params;

#pragma parametershadowMask¡1.00.04.01.0
#pragma parameterSCANLINE_SINE_COMP_B¡0.400.01.00.05
#pragma parameterwarpX¡0.0310.00.1250.01
#pragma parameterwarpY¡0.0410.00.1250.01
#pragma parametermaskDark¡0.50.02.00.1
#pragma parametermaskLight¡1.50.02.00.1
#pragma parametercrt_gamma¡2.51.04.00.05
#pragma parametermonitor_gamma¡2.21.04.00.05
#pragma parameterSCANLINE_SINE_COMP_A¡0.00.00.100.01
#pragma parameterSCANLINE_BASE_BRIGHTNESS¡0.950.01.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

vec4 scanline(vec2 coord, vec4 frame)
{

 vec2 omega = vec2(3.1415 * params . OutputSize . x, 2.0 * 3.1415 * params . SourceSize . y);
 vec2 sine_comp = vec2(params . SCANLINE_SINE_COMP_A, params . SCANLINE_SINE_COMP_B);
 vec3 res = frame . xyz;




 vec3 scanline = res *(params . SCANLINE_BASE_BRIGHTNESS + dot(sine_comp * sin(coord * omega), vec2(1.0, 1.0)));

 return vec4(scanline . x, scanline . y, scanline . z, 1.0);



}



vec2 Warp(vec2 pos)
{
    pos = pos * 2.0 - 1.0;
    pos *= vec2(1.0 +(pos . y * pos . y)* params . warpX, 1.0 +(pos . x * pos . x)* params . warpY);

    return pos * 0.5 + 0.5;
}




 vec4 Mask(vec2 pos)
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


  else mask = vec3(1., 1., 1.);

  return vec4(mask, 1.0);
 }


void main()
{

 vec2 pos = Warp(vTexCoord . xy);






 vec4 in_gamma = vec4(params . monitor_gamma, params . monitor_gamma, params . monitor_gamma, 1.0);
 vec4 out_gamma = vec4(1.0 / params . crt_gamma, 1.0 / params . crt_gamma, 1.0 / params . crt_gamma, 1.0);
 vec4 res = pow(texture(Source, pos), in_gamma);






 res *= Mask(vTexCoord * params . OutputSize . xy * 1.0001);




    FragColor = pow(scanline(pos, res), out_gamma);



}
