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
   float SW;
   float AR;
   float PR;
   float AG;
   float PG;
   float AB;
   float PB;
   float sat;
   float GTH;
}params;

#pragma parameterSW¡1.00.01.01.0
#pragma parameterAR¡0.070.01.00.01
#pragma parameterPR¡0.050.01.00.01
#pragma parameterAG¡0.070.01.00.01
#pragma parameterPG¡0.050.01.00.01
#pragma parameterAB¡0.070.01.00.01
#pragma parameterPB¡0.050.01.00.01
#pragma parametersat¡0.100.01.00.01
#pragma parameterGTH¡5.00.0255.01.0

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

