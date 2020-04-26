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
   float NTSC_CRT_GAMMA;
   float NTSC_DISPLAY_GAMMA;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

#pragma parameterNTSC_CRT_GAMMA¡2.50.010.00.1
#pragma parameterNTSC_DISPLAY_GAMMA¡2.10.010.00.1

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 one;
layout(location = 2) out vec2 pix_no;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
   pix_no = TexCoord * registers . SourceSize . xy;
   one = 1.0 / registers . SourceSize . xy;
}

