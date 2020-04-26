#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4









layout(std140) uniform UBO
{
   mat4 MVP;
}global;

uniform push_constant
{
   vec4 SourceSize;
   vec4 OutputSize;
   float GIN;
   float GOUT;
   float Y;
   float I;
   float Q;
}params;

#pragma parameterGIN¡2.20.010.00.05
#pragma parameterGOUT¡2.20.010.00.05
#pragma parameterY¡1.10.010.00.01
#pragma parameterI¡1.10.010.00.01
#pragma parameterQ¡1.10.010.00.01

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;


void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
}

