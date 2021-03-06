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
   float MASK;
   float MASK_INTENSITY;
   float SCANLINE_THINNESS;
   float SCAN_BLUR;
   float CURVATURE;
   float TRINITRON_CURVE;
   float CORNER;
   float CRT_GAMMA;
}params;

#pragma parameterMASKˇ1.00.03.01.0
#pragma parameterMASK_INTENSITYˇ0.50.01.00.05
#pragma parameterSCANLINE_THINNESSˇ0.50.01.00.1
#pragma parameterSCAN_BLURˇ2.51.03.00.1
#pragma parameterCURVATUREˇ0.020.00.250.01
#pragma parameterTRINITRON_CURVEˇ0.00.01.01.0
#pragma parameterCORNERˇ3.00.011.01.0
#pragma parameterCRT_GAMMAˇ2.40.051.00.1

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

