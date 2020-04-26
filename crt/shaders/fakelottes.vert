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
   float shadowMask;
   float SCANLINE_SINE_COMP_B;
   float warpX;
   float warpY;
   float maskDark;
   float maskLight;
   float crt_gamma;
   float monitor_gamma;
   float SCANLINE_SINE_COMP_A;
   float SCANLINE_BASE_BRIGHTNESS;
}params;

#pragma parametershadowMask¡1.00.04.01.0
#pragma parameterSCANLINE_SINE_COMP_B¡0.400.01.00.05
#pragma parameterwarpX¡0.0310.00.1250.01
#pragma parameterwarpY¡0.0410.00.1250.01
#pragma parametermaskDark¡0.50.02.00.1
#pragma parametermaskLight¡1.50.02.00.1
#pragma parametercrt_gamma¡2.51.04.00.05
#pragma parametermonitor_gamma¡2.21.04.00.05
#pragma parameterSCANLINE_SINE_COMP_A¡0.00.00.100.01
#pragma parameterSCANLINE_BASE_BRIGHTNESS¡0.950.01.00.01

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

