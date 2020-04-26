#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4












































uniform Push
{
   float FIR_GAIN;
   float FIR_INVGAIN;
   float PHASE_NOISE;
}params;

#pragma parameterFIR_GAIN¡1.50.05.00.1
#pragma parameterFIR_INVGAIN¡1.10.05.00.1
#pragma parameterPHASE_NOISE¡1.00.05.00.1

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

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
}

