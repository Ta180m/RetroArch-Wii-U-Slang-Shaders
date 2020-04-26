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
 vec3 col = vec3(0.0);
 float dy = params . SourceSize . w;

 float k_total = 0.0;
 for(int i = - 4;i <= 4;i ++)
  {
  float k = exp(- 0.35 *(i)*(i));
  k_total += k;
  col += k * texture(Source, vTexCoord + vec2(0.0, float(i)* dy)). rgb;
  }
   FragColor = vec4(col / k_total, 1.0);
}
