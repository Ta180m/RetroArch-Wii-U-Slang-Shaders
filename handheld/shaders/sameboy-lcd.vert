#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4



























layout(std140) uniform UBO
{
   vec4 SourceSize;
   vec4 OriginalSize;
   vec4 OutputSize;
   mat4 MVP;
}global;

uniform Push
{
   float COLOR_LOW;
   float COLOR_HIGH;
   float SCANLINE_DEPTH;
}params;

#pragma parameterCOLOR_LOW�0.80.01.50.05
#pragma parameterCOLOR_HIGH�1.00.01.50.05
#pragma parameterSCANLINE_DEPTH�0.10.02.00.05





layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
}

