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
   float SIGMA;
   float BSIGMA;
}params;

#pragma parameterSIGMA¡10.01.020.01.0
#pragma parameterBSIGMA¡0.10.010.50.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;



float normpdf(in float x, in float sigma)
{
 return 0.39894 * exp(- 0.5 * x * x /(sigma * sigma))/ sigma;
}

float normpdf3(in vec3 v, in float sigma)
{
 return 0.39894 * exp(- 0.5 * dot(v, v)/(sigma * sigma))/ sigma;
}

void main()
{
 vec2 fragcoord = vTexCoord * params . OutputSize . xy;
 vec3 c = texture(Source,(fragcoord . xy / params . OutputSize . xy)). rgb;


 const int kSize =(15 - 1)/ 2;
 float kernel[15];
 vec3 final_colour = vec3(0.0);


 float Z = 0.0;
 for(int j = 0;j <= kSize;++ j)
 {
  kernel[kSize + j]= kernel[kSize - j]= normpdf(float(j), params . SIGMA);
 }

 vec3 cc;
 float factor;
 float bZ = 1.0 / normpdf(0.0, params . BSIGMA);

 for(int i = - kSize;i <= kSize;++ i)
 {
  for(int j = - kSize;j <= kSize;++ j)
  {
   cc = texture(Source,(fragcoord . xy + vec2(float(i), float(j)))/ params . OutputSize . xy). rgb;
   factor = normpdf3(cc - c, params . BSIGMA)* bZ * kernel[kSize + j]* kernel[kSize + i];
   Z += factor;
   final_colour += factor * cc;
  }
 }

 FragColor = vec4(final_colour / Z, 1.0);
}
