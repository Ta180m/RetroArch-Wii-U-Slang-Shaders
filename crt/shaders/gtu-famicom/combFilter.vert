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
   float combFilter;
   float phaseOffset;
}params;

#pragma parametercombFilter¡0.00.01.01.0
#pragma parameterphaseOffset¡0.0-0.50.50.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;









layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out float colorPhase;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
    vec2 pos =(vTexCoord . xy * params . OutputSize . xy * params . SourceSize . xy * params . SourceSize . zw)- 0.5;
    colorPhase = 8.0 + pos . x + pos . y * 4.0 + params . FrameCount * 4.0 + 4.0 + params . phaseOffset * 12.0;
}

