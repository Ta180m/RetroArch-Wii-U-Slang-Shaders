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
   float FB_RES;
   float SIGMA_R;
   float SIGMA_D;
}params;

#pragma parameterFB_RES¡2.01.08.01.0
#pragma parameterSIGMA_R¡0.40.02.00.1
#pragma parameterSIGMA_D¡3.00.010.00.2

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

