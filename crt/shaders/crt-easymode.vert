#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float BRIGHT_BOOST;
   float DILATION;
   float GAMMA_INPUT;
   float GAMMA_OUTPUT;
   float MASK_SIZE;
   float MASK_STAGGER;
   float MASK_STRENGTH;
   float MASK_DOT_HEIGHT;
   float MASK_DOT_WIDTH;
   float SCANLINE_CUTOFF;
   float SCANLINE_BEAM_WIDTH_MAX;
   float SCANLINE_BEAM_WIDTH_MIN;
   float SCANLINE_BRIGHT_MAX;
   float SCANLINE_BRIGHT_MIN;
   float SCANLINE_STRENGTH;
   float SHARPNESS_H;
   float SHARPNESS_V;
}params;

#pragma parameterSHARPNESS_H¡0.50.01.00.05
#pragma parameterSHARPNESS_V¡1.00.01.00.05
#pragma parameterMASK_STRENGTH¡0.30.01.00.01
#pragma parameterMASK_DOT_WIDTH¡1.01.0100.01.0
#pragma parameterMASK_DOT_HEIGHT¡1.01.0100.01.0
#pragma parameterMASK_STAGGER¡0.00.0100.01.0
#pragma parameterMASK_SIZE¡1.01.0100.01.0
#pragma parameterSCANLINE_STRENGTH¡1.00.01.00.05
#pragma parameterSCANLINE_BEAM_WIDTH_MIN¡1.50.55.00.5
#pragma parameterSCANLINE_BEAM_WIDTH_MAX¡1.50.55.00.5
#pragma parameterSCANLINE_BRIGHT_MIN¡0.350.01.00.05
#pragma parameterSCANLINE_BRIGHT_MAX¡0.650.01.00.05
#pragma parameterSCANLINE_CUTOFF¡400.01.01000.01.0
#pragma parameterGAMMA_INPUT¡2.00.15.00.1
#pragma parameterGAMMA_OUTPUT¡1.80.15.00.1
#pragma parameterBRIGHT_BOOST¡1.21.02.00.01
#pragma parameterDILATION¡1.00.01.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
}






























