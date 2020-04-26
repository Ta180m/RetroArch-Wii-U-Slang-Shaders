#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   uint FrameCount;
   float percent;
   float enable_480i;
   float top_field_first;
   float input_gamma;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

#pragma parameterinput_gamma¡2.50.05.00.1
#pragma parameterpercent¡0.00.01.00.05
#pragma parameterenable_480i¡1.00.01.01.0
#pragma parametertop_field_first¡0.00.01.01.0










layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

