#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4









layout(std140) uniform UBO
{
   vec4 SourceSize;
   vec4 OriginalSize;
   vec4 OutputSize;
   uint FrameCount;
   mat4 MVP;
   float x_scale;
   float y_scale;
}global;

#pragma parameterx_scale¡3.01.0100.01.0
#pragma parametery_scale¡3.01.0100.01.0

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   FragColor = vec4(texture(Source, vTexCoord). rgb, 1.0);
}
