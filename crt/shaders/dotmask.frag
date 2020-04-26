#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4









layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float DOTMASK_STRENGTH;
   float maskDark;
   float maskLight;
   float shadowMask;
}global;

#pragma parameterDOTMASK_STRENGTH¡0.30.01.00.01
#pragma parametermaskDark¡0.50.02.00.1
#pragma parametermaskLight¡1.50.02.00.1
#pragma parametershadowMask¡3.00.05.01.0



layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;



vec3 Mask(vec2 pos){
  vec3 mask = vec3(global . maskDark, global . maskDark, global . maskDark);


  if(global . shadowMask == 1.0){
    float line = global . maskLight;
    float odd = 0.0;
    if(fract(pos . x / 6.0)< 0.5)odd = 1.0;
    if(fract((pos . y + odd)/ 2.0)< 0.5)line = global . maskDark;
    pos . x = fract(pos . x / 3.0);

    if(pos . x < 0.333)mask . r = global . maskLight;
    else if(pos . x < 0.666)mask . g = global . maskLight;
    else mask . b = global . maskLight;
    mask *= line;
  }


  else if(global . shadowMask == 2.0){
    pos . x = fract(pos . x / 3.0);

    if(pos . x < 0.333)mask . r = global . maskLight;
    else if(pos . x < 0.666)mask . g = global . maskLight;
    else mask . b = global . maskLight;
  }


  else if(global . shadowMask == 3.0){
    pos . x += pos . y * 3.0;
    pos . x = fract(pos . x / 6.0);

    if(pos . x < 0.333)mask . r = global . maskLight;
    else if(pos . x < 0.666)mask . g = global . maskLight;
    else mask . b = global . maskLight;
  }


  else if(global . shadowMask == 4.0){
    pos . xy = floor(pos . xy * vec2(1.0, 0.5));
    pos . x += pos . y * 3.0;
    pos . x = fract(pos . x / 6.0);

    if(pos . x < 0.333)mask . r = global . maskLight;
    else if(pos . x < 0.666)mask . g = global . maskLight;
    else mask . b = global . maskLight;
  }

  return mask;
}


float Pi = 3.1415926536;

vec3 SinPhosphor(vec3 image)
{
    float MaskR = sin(global . OutputSize . x * vTexCoord . x * Pi * 1.0 + Pi * 0.00000 + vTexCoord . y * global . OutputSize . y * Pi * 0.5)* 0.5 + 0.5;
    float MaskG = sin(global . OutputSize . x * vTexCoord . x * Pi * 1.0 + Pi * 1.33333 + vTexCoord . y * global . OutputSize . y * Pi * 0.5)* 0.5 + 0.5;
    float MaskB = sin(global . OutputSize . x * vTexCoord . x * Pi * 1.0 + Pi * 0.66667 + vTexCoord . y * global . OutputSize . y * Pi * 0.5)* 0.5 + 0.5;

    vec3 Mask = vec3(MaskR, MaskG, MaskB);

    Mask = min(Mask * 2.0, 1.0);

    return vec3(Mask * image);
}


vec3 cgwg_mask(vec3 image)
{
   float mask = 1.0 - global . DOTMASK_STRENGTH;

   vec3 dotMaskWeights = mix(vec3(1.0, mask, 1.0),
        vec3(mask, 1.0, mask),
        floor(mod(vTexCoord . x * global . SourceSize . x * global . OutputSize . x / global . SourceSize . x, 2.0)));
   return image * dotMaskWeights;
}

void main()
{
   vec3 res = texture(Source, vTexCoord). rgb;

   if(global . shadowMask == 0.0)
   {
      res = cgwg_mask(res);
      FragColor = vec4(res, 1.0);
      return;
 }
   else if(global . shadowMask == 5.0)
   {
      res *= SinPhosphor(res);
   }
   else
   {

      res = pow(res, vec3(2.2));
      res *= Mask(floor(1.000001 * vTexCoord . xy * global . OutputSize . xy + vec2(0.5)));
   }
   FragColor = vec4(pow(res, vec3(1.0 / 2.2)), 1.0);
}
