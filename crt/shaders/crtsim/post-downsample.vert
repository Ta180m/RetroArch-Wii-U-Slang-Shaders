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
   float bloom_scale_down;
}params;

#pragma parameterbloom_scale_down¡0.0150.00.030.001

layout(std140) uniform UBO
{
   mat4 MVP;
}global;











vec2 Poisson0 = vec2(0.000000, 0.000000);
vec2 Poisson1 = vec2(0.000000, 1.000000);
vec2 Poisson2 = vec2(0.000000, - 1.000000);
vec2 Poisson3 = vec2(- 0.866025, 0.500000);
vec2 Poisson4 = vec2(- 0.866025, - 0.500000);
vec2 Poisson5 = vec2(0.866025, 0.500000);
vec2 Poisson6 = vec2(0.866025, - 0.500000);

float InvNumSamples = 0.1428571428571429;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

