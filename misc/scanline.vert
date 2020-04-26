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
   float SCANLINE_BASE_BRIGHTNESS;
   float SCANLINE_SINE_COMP_A;
   float SCANLINE_SINE_COMP_B;
}params;

#pragma parameterSCANLINE_BASE_BRIGHTNESS¡0.950.01.00.01
#pragma parameterSCANLINE_SINE_COMP_A¡0.00.00.100.01
#pragma parameterSCANLINE_SINE_COMP_B¡0.150.01.00.05





layout(std140) uniform UBO
{
   mat4 MVP;
}global;



layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 omega;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;

   omega = vec2(3.141592654 * params . OutputSize . x, 2.0 * 3.141592654 * params . SourceSize . y);
}

