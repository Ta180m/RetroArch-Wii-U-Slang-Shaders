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
   float RAA_SHR0;
   float RAA_SMT0;
   float RAA_DVT0;
}params;

#pragma parameterRAA_SHR0¡2.00.0010.00.05
#pragma parameterRAA_SMT0¡0.50.0510.00.05
#pragma parameterRAA_DVT0¡1.00.0510.00.05

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

