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
   float amp;
   float phase;
   float lines_black;
   float lines_white;
}params;

#pragma parameteramp¡1.25000.0002.0000.05
#pragma parameterphase¡0.50000.0002.0000.05
#pragma parameterlines_black¡0.00000.0001.0000.05
#pragma parameterlines_white¡1.00000.0002.0000.05

layout(std140) uniform UBO
{
   mat4 MVP;
}global;





layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out float angle;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;

   float omega = 2.0 * 3.141592654 * 0.500000;
   angle = vTexCoord . y * omega * params . SourceSize . y + params . phase;
}

