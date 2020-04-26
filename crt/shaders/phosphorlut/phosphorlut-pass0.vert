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
   float PHOSPHOR_SCALE_X;
   float PHOSPHOR_SCALE_Y;
   float phosphor_layout;
}params;

#pragma parameterPHOSPHOR_SCALE_X¡2.01.012.01.0
#pragma parameterPHOSPHOR_SCALE_Y¡4.01.012.01.0
#pragma parameterphosphor_layout¡1.01.03.01.0





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

