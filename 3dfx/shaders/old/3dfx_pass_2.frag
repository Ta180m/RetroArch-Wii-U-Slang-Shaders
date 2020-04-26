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
   float LEIFX_BLURFACTOR;
}params;

#pragma parameterLEIFX_BLURFACTOR¡0.690.001.000.01



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



 float blendy;
 float blenda;

 float blendfactor;

      vec3 pixel1 = texture(Source, vTexCoord + vec2((pixel . x * 0.15), 0)). rgb;
      vec3 pixel2 = texture(Source, vTexCoord + vec2(- pixel . x * 0.22, 0)). rgb;
      vec3 pixel0 = texture(Source, vTexCoord + vec2(0, 0)). rgb;

      vec3 pixelblend;


 float gary1 = dot(pixel1 . rgb, vec3(1.0));
 float gary2 = dot(pixel2 . rgb, vec3(1.0));

 float mean = 1.0;
 mean = gary1 - gary2;

 if(mean < 0)mean *= - 1;
 if(mean > 1)mean = 1;
 mean = pow(mean, params . LEIFX_BLURFACTOR);

 if(mean > 1)
      mean = 1;

 {

  blendy = 1 - mean;
  blenda = 1 - blendy;
  pixel0 /= 3;
  pixel1 /= 3;
  pixel2 /= 3;
     pixelblend . rgb = pixel0 + pixel1 + pixel2;
  outcolor . rgb =(pixelblend . rgb * blendy)+(outcolor . rgb * blenda);
 }

   FragColor = vec4(outcolor, 1.0);
}
