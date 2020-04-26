#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4








































uniform Push
{
   vec4 SourceSize;
   vec4 OutputSize;
   float REVERSEAA_SHARPNESS;
}params;

#pragma parameterREVERSEAA_SHARPNESS¡2.00.010.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

