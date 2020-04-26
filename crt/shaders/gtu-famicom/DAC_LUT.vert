#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   uint FrameCount;
}global;









layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out float colorPhase;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
    vec2 pos =(vTexCoord . xy * global . OutputSize . xy)- 0.5;
    colorPhase = 8.0001 + pos . x + pos . y * 4.0001 + global . FrameCount * 4.0001;
}

