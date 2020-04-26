#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

#pragma nameMMJ_ColorPass















uniform Push
{
   vec4 MMJ_OutlineSize;
   vec4 OriginalSize;
   float ColorLevels;
   float ColorSaturation;
   float ColorWeight;
}params;

#pragma parameterColorLevels¡12.01.032.01.0
#pragma parameterColorSaturation¡1.150.002.000.05
#pragma parameterColorWeight¡0.500.001.000.05







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


