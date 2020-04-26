#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float CURVATURE_X;
   float CURVATURE_Y;
   float MASK_BRIGHTNESS;
   float SCANLINE_WEIGHT;
   float SCANLINE_GAP_BRIGHTNESS;
   float BLOOM_FACTOR;
   float INPUT_GAMMA;
   float OUTPUT_GAMMA;
}param;

#pragma parameterCURVATURE_X¡0.100.01.00.01
#pragma parameterCURVATURE_Y¡0.150.01.00.01
#pragma parameterMASK_BRIGHTNESS¡0.700.01.00.01
#pragma parameterSCANLINE_WEIGHT¡6.00.015.00.1
#pragma parameterSCANLINE_GAP_BRIGHTNESS¡0.120.01.00.01
#pragma parameterBLOOM_FACTOR¡1.50.05.00.01
#pragma parameterINPUT_GAMMA¡2.40.05.00.01
#pragma parameterOUTPUT_GAMMA¡2.20.05.00.01

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
layout(location = 1) out float filterWidth;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
    filterWidth =(global . SourceSize . y * global . OutputSize . w)* 0.333333333;
}

