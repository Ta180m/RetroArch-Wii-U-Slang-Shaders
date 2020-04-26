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
   float CURVE_HEIGHT;
}params;

#pragma parameterCURVE_HEIGHT¡0.80.12.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;














































float CtG(vec3 RGB){ return sqrt((1.0 / 3.0)*((RGB * RGB). r +(RGB * RGB). g +(RGB * RGB). b));}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

