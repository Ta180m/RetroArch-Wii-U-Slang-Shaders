#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float signalResolution;
   float addNoise;
   float noiseStrength;
   uint FrameCount;
}params;

#pragma parametersignalResolution¡700.020.02000.010.0
#pragma parameteraddNoise¡0.00.01.01.0
#pragma parameternoiseStrength¡0.00.01.00.05



layout(std140) uniform UBO
{
   mat4 MVP;
}global;
















float rand2(vec2 co)
{
    float c = 43758.5453;
    float dt = dot(co . xy, vec2(12.9898, 78.233));
    float sn = mod(dt, 3.14);

    return fract(sin(sn)* c);
}

float rand(vec2 co)
{
    return fract(sin(dot(co . xy, vec2(12.9898, 78.233)))* 43758.5453);
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
}

