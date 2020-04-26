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
   float height;
   float width;
   float location;
}params;

#pragma parameterheight¡1.0-3.03.00.01
#pragma parameterwidth¡1.0-3.03.00.05
#pragma parameterlocation¡0.0001-2.02.00.001

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 vTexCoord1;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord =((TexCoord . xy - vec2(0.5 -(params . location), 0.5))* mat2x2(0.0, 1.0001 *(params . width), - 2.0001 *(params . height), 0.0))+ vec2(0.5, 0.);
   vTexCoord1 =((TexCoord . xy - vec2(0.5 +(params . location), 0.5))* mat2x2(0.0, - 1.0001 *(params . width), 2.0001 *(params . height), 0.0))+ vec2(0.5, 0.);
}

