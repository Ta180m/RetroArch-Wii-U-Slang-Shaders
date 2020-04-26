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
   float grade;
}params;

#pragma parametergrade¡0.650.101.00.05

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   float xtotal = floor(params . SourceSize . x / 32.0);
   float ytotal = floor(params . SourceSize . y / 32.0);

   float ltotal = 0.0;
   vec2 dx = vec2(params . SourceSize . z, 0.0)* 32.0;
 vec2 dy = vec2(0.0, params . SourceSize . w)* 32.0;

 for(float i = 0.0;i <= xtotal;i ++)
 {
  for(float j = 0.0;j <= ytotal;j ++)
   {
    ltotal += length(textureLod(Source, i * dx + j * dy, 5.0). rgb);
   }
   }

   ltotal = inversesqrt(3.0)* ltotal /((xtotal + 1.0)*(ytotal + 1.0));

   FragColor = vec4(pow(ltotal, params . grade));
}
