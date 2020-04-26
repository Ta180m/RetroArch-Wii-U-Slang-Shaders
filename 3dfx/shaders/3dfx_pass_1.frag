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

void main()
{
      vec3 outcolor = texture(Source, vTexCoord). rgb;

      vec2 pixel;

 pixel . x = params . SourceSize . z;
 pixel . y = params . SourceSize . w;

      vec3 pixel1 = texture(Source, vTexCoord + vec2((pixel . x), 0)). rgb;
      vec3 pixel2 = texture(Source, vTexCoord + vec2(- pixel . x, 0)). rgb;
      vec3 pixelblend;


 {
       vec3 pixeldiff;
       vec3 pixelmake;
       vec3 pixeldiffleft;

  pixelmake . rgb = vec3(0.0);
  pixeldiff . rgb = pixel2 . rgb - outcolor . rgb;

  pixeldiffleft . rgb = pixel1 . rgb - outcolor . rgb;

  if(pixeldiff . r > 0.04)pixeldiff . r = 0.04;
  if(pixeldiff . g >(0.04 / 2))pixeldiff . g =(0.04 / 2);
  if(pixeldiff . b > 0.04)pixeldiff . b = 0.04;

  if(pixeldiff . r < - 0.04)pixeldiff . r = - 0.04;
  if(pixeldiff . g < -(0.04 / 2))pixeldiff . g = -(0.04 / 2);
  if(pixeldiff . b < - 0.04)pixeldiff . b = - 0.04;

  if(pixeldiffleft . r > 0.04)pixeldiffleft . r = 0.04;
  if(pixeldiffleft . g >(0.04 / 2))pixeldiffleft . g =(0.04 / 2);
  if(pixeldiffleft . b > 0.04)pixeldiffleft . b = 0.04;

  if(pixeldiffleft . r < - 0.04)pixeldiffleft . r = - 0.04;
  if(pixeldiffleft . g < -(0.04 / 2))pixeldiffleft . g = -(0.04 / 2);
  if(pixeldiffleft . b < - 0.04)pixeldiffleft . b = - 0.04;

  pixelmake . rgb =(pixeldiff . rgb / 4)+(pixeldiffleft . rgb / 16);
  outcolor . rgb =(outcolor . rgb + pixelmake . rgb);
 }

   FragColor = vec4(outcolor, 1.0);
}
