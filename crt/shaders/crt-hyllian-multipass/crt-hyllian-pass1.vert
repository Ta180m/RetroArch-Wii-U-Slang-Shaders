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
   float OutputGamma;
   float PHOSPHOR;
   float COLOR_BOOST;
   float RED_BOOST;
   float GREEN_BOOST;
   float BLUE_BOOST;
   float SCANLINES_STRENGTH;
   float BEAM_MIN_WIDTH;
   float BEAM_MAX_WIDTH;
}params;

#pragma parameterOutputGamma¡2.20.05.00.1
#pragma parameterPHOSPHOR¡1.00.01.01.0
#pragma parameterCOLOR_BOOST¡1.51.02.00.05
#pragma parameterRED_BOOST¡1.01.02.00.01
#pragma parameterGREEN_BOOST¡1.01.02.00.01
#pragma parameterBLUE_BOOST¡1.01.02.00.01
#pragma parameterSCANLINES_STRENGTH¡0.720.01.00.02
#pragma parameterBEAM_MIN_WIDTH¡0.860.01.00.02
#pragma parameterBEAM_MAX_WIDTH¡1.00.01.00.02











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

