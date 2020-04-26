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
   float FIR_SIZE;
   float F_COL;
   float F_LUMA_LP;
   float F_COL_BW;
}params;

#pragma parameterFIR_SIZE¡29.01.050.01.0
#pragma parameterF_COL¡0.250.250.50.25
#pragma parameterF_LUMA_LP¡0.166670.00010.3333330.02
#pragma parameterF_COL_BW¡50.010.0200.01.0

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
   vTexCoord = TexCoord * 1.0004;
}

