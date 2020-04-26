#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4





















































float DistYCbCr(vec3 pixA, vec3 pixB)
{
  vec3 w = vec3(0.2627, 0.6780, 0.0593);
  float scaleB = 0.5 /(1.0 - w . b);
  float scaleR = 0.5 /(1.0 - w . r);
  vec3 diff = pixA - pixB;
  float Y = dot(diff . rgb, w);
  float Cb = scaleB *(diff . b - Y);
  float Cr = scaleR *(diff . r - Y);

  return sqrt(((1.0 * Y)*(1.0 * Y))+(Cb * Cb)+(Cr * Cr));
}

bool IsPixEqual(const vec3 pixA, const vec3 pixB)
{
  return(DistYCbCr(pixA, pixB)< 30.0 / 255.0);
}

float get_left_ratio(vec2 center, vec2 origin, vec2 direction, vec2 scale)
{
  vec2 P0 = center - origin;
  vec2 proj = direction *(dot(P0, direction)/ dot(direction, direction));
  vec2 distv = P0 - proj;
  vec2 orth = vec2(- direction . y, direction . x);
  float side = sign(dot(P0, orth));
  float v = side * length(distv * scale);


  return smoothstep(- sqrt(2.0)/ 2.0, sqrt(2.0)/ 2.0, v);
}

uniform Push
{
   vec4 OriginalSize;
   vec4 OutputSize;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;







void main()
{






  vec2 scale = params . OutputSize . xy * params . OriginalSize . zw;
  vec2 pos = fract(vTexCoord * params . OriginalSize . xy)- vec2(0.5, 0.5);
  vec2 coord = vTexCoord - pos * params . OriginalSize . zw;

  vec3 B = texture(Original, coord + params . OriginalSize . zw * vec2(0, - 1)). rgb;
  vec3 D = texture(Original, coord + params . OriginalSize . zw * vec2(- 1, 0)). rgb;
  vec3 E = texture(Original, coord + params . OriginalSize . zw * vec2(0, 0)). rgb;
  vec3 F = texture(Original, coord + params . OriginalSize . zw * vec2(1, 0)). rgb;
  vec3 H = texture(Original, coord + params . OriginalSize . zw * vec2(0, 1)). rgb;

  vec4 info = floor(texture(Source, coord)* 255.0 + 0.5);




  vec4 blendResult = floor(mod(info, 4.0));
  vec4 doLineBlend = floor(mod(info / 4.0, 4.0));
  vec4 haveShallowLine = floor(mod(info / 16.0, 4.0));
  vec4 haveSteepLine = floor(mod(info / 64.0, 4.0));

  vec3 res = E;





  if(blendResult . z > 0)
  {
    vec2 origin = vec2(0.0, 1.0 / sqrt(2.0));
    vec2 direction = vec2(1.0, - 1.0);
    if(doLineBlend . z > 0.0)
    {
      origin = haveShallowLine . z > 0.0 ? vec2(0.0, 0.25): vec2(0.0, 0.5);
      direction . x += haveShallowLine . z;
      direction . y -= haveSteepLine . z;
    }

    vec3 blendPix = mix(H, F, step(DistYCbCr(E, F), DistYCbCr(E, H)));
    res = mix(res, blendPix, get_left_ratio(pos, origin, direction, scale));
  }




  if(blendResult . w > 0)
  {
    vec2 origin = vec2(- 1.0 / sqrt(2.0), 0.0);
    vec2 direction = vec2(1.0, 1.0);
    if(doLineBlend . w > 0.0)
    {
      origin = haveShallowLine . w > 0.0 ? vec2(- 0.25, 0.0): vec2(- 0.5, 0.0);
      direction . y += haveShallowLine . w;
      direction . x += haveSteepLine . w;
    }

    vec3 blendPix = mix(H, D, step(DistYCbCr(E, D), DistYCbCr(E, H)));
    res = mix(res, blendPix, get_left_ratio(pos, origin, direction, scale));
  }




   if(blendResult . y > 0)
  {
    vec2 origin = vec2(1.0 / sqrt(2.0), 0.0);
    vec2 direction = vec2(- 1.0, - 1.0);

    if(doLineBlend . y > 0.0)
    {
      origin = haveShallowLine . y > 0.0 ? vec2(0.25, 0.0): vec2(0.5, 0.0);
      direction . y -= haveShallowLine . y;
      direction . x -= haveSteepLine . y;
    }

    vec3 blendPix = mix(F, B, step(DistYCbCr(E, B), DistYCbCr(E, F)));
    res = mix(res, blendPix, get_left_ratio(pos, origin, direction, scale));
  }




  if(blendResult . x > 0)
  {
    vec2 origin = vec2(0.0, - 1.0 / sqrt(2.0));
    vec2 direction = vec2(- 1.0, 1.0);
    if(doLineBlend . x > 0.0)
    {
      origin = haveShallowLine . x > 0.0 ? vec2(0.0, - 0.25): vec2(0.0, - 0.5);
      direction . x -= haveShallowLine . x;
      direction . y += haveSteepLine . x;
    }

    vec3 blendPix = mix(D, B, step(DistYCbCr(E, B), DistYCbCr(E, D)));
    res = mix(res, blendPix, get_left_ratio(pos, origin, direction, scale));
  }

  FragColor = vec4(res, 1.0);
}
