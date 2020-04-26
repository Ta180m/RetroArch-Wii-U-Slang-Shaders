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
   float CRT_MULRES_X;
   float CRT_MULRES_Y;
   float PHOSPHOR;
   float InputGamma;
   float OutputGamma;
   float SHARPNESS;
   float COLOR_BOOST;
   float RED_BOOST;
   float GREEN_BOOST;
   float BLUE_BOOST;
   float SCANLINES_STRENGTH;
   float BEAM_MIN_WIDTH;
   float BEAM_MAX_WIDTH;
   float CRT_ANTI_RINGING;
}params;

#pragma parameterCRT_MULRES_X¡2.01.08.01.0
#pragma parameterCRT_MULRES_Y¡2.01.08.01.0
#pragma parameterPHOSPHOR¡1.00.01.01.0
#pragma parameterInputGamma¡2.40.05.00.1
#pragma parameterOutputGamma¡2.20.05.00.1
#pragma parameterSHARPNESS¡1.01.05.01.0
#pragma parameterCOLOR_BOOST¡1.51.02.00.05
#pragma parameterRED_BOOST¡1.01.02.00.01
#pragma parameterGREEN_BOOST¡1.01.02.00.01
#pragma parameterBLUE_BOOST¡1.01.02.00.01
#pragma parameterSCANLINES_STRENGTH¡0.720.01.00.02
#pragma parameterBEAM_MIN_WIDTH¡0.860.01.00.02
#pragma parameterBEAM_MAX_WIDTH¡1.00.01.00.02
#pragma parameterCRT_ANTI_RINGING¡0.80.01.00.1
















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

