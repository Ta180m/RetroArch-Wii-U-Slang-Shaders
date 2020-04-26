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

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Original;


void main()
{
 vec4 bloom = vec4(0.0);
 vec2 BloomScale = vec2(params . bloom_scale_down);
 bloom += texture(Original, vTexCoord +(Poisson0 * BloomScale));
 bloom += texture(Original, vTexCoord +(Poisson1 * BloomScale));
 bloom += texture(Original, vTexCoord +(Poisson2 * BloomScale));
 bloom += texture(Original, vTexCoord +(Poisson3 * BloomScale));
 bloom += texture(Original, vTexCoord +(Poisson4 * BloomScale));
 bloom += texture(Original, vTexCoord +(Poisson5 * BloomScale));
 bloom += texture(Original, vTexCoord +(Poisson6 * BloomScale));
 bloom *= InvNumSamples;

   FragColor = vec4(bloom);
}
