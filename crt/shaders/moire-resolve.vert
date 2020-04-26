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
   float moire_test;
   float moire_mitigation;
   float warpX;
   float warpY;
   float shadowMask;
   float maskDark;
   float maskLight;
   float THICKNESS;
   float DARKNESS;
   float scanline_toggle;
   float mask_curvature;
}params;

#pragma parametermoire_test¡0.00.01.01.0
#pragma parametermoire_mitigation¡4.01.010.01.0
#pragma parameterwarpX¡0.0310.00.1250.01
#pragma parameterwarpY¡0.0410.00.1250.01
#pragma parametermaskDark¡0.50.02.00.1
#pragma parametermaskLight¡1.50.02.00.1
#pragma parametershadowMask¡3.00.04.01.0
#pragma parameterTHICKNESS¡2.01.012.01.0
#pragma parameterDARKNESS¡0.350.01.00.05
#pragma parameterscanline_toggle¡0.00.01.01.0
#pragma parametermask_curvature¡0.00.01.01.0




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

