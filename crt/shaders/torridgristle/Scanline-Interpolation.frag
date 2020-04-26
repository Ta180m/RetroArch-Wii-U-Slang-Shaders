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
   vec2 texCoordHard = vec2(vTexCoord . x,(floor(vTexCoord . y * params . SourceSize . y)+ 0.5)/ params . SourceSize . y);
   FragColor = vec4(texture(Source, texCoordHard). rgb, 1.0);
}
