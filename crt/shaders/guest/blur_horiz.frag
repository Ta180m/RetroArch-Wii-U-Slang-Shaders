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
   float TAPSH;
   float GLOW_FALLOFF_H;
}params;

#pragma parameterTAPSH¡4.01.010.01.0
#pragma parameterGLOW_FALLOFF_H¡0.300.01.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;



void main()
{
 vec3 col = vec3(0.0);
 float dx = params . SourceSize . z;

 float k_total = 0.;
 for(float i = - params . TAPSH;i <= params . TAPSH;i ++)
  {
  float k = exp(- params . GLOW_FALLOFF_H *(i)*(i));
  k_total += k;
  col += k * texture(Source, vTexCoord + vec2(float(i)* dx, 0.0)). rgb;
  }
   FragColor = vec4(col / k_total, 1.0);
}
