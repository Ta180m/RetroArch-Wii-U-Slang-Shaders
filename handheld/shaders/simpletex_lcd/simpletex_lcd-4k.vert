#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4



















































#pragma parameterGRID_INTENSITY¡1.00.01.00.05
#pragma parameterGRID_WIDTH¡1.00.01.00.05
#pragma parameterGRID_BIAS¡0.00.01.00.05
#pragma parameterDARKEN_GRID¡0.00.01.00.05
#pragma parameterDARKEN_COLOUR¡0.00.02.00.05

uniform Push
{
   float GRID_INTENSITY;
   float GRID_WIDTH;
   float GRID_BIAS;
   float DARKEN_GRID;
   float DARKEN_COLOUR;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}registers;

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

