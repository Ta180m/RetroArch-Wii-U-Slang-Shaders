#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float GLOW_WHITEPOINT;
   float GLOW_ROLLOFF;
}params;

#pragma parameterGLOW_WHITEPOINT¡1.00.51.10.02
#pragma parameterGLOW_ROLLOFF¡3.01.26.00.1

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

