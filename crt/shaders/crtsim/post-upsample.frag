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
   float bloom_scale_up;
}params;

#pragma parameterbloom_scale_up¡0.020.00.030.001

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
uniform sampler2D Source;


void main()
{
 vec4 bloom = vec4(0.0);
 vec2 BloomScale = vec2(params . bloom_scale_up);
 bloom += texture(Source, vTexCoord +(Poisson0 . yx * BloomScale));
 bloom += texture(Source, vTexCoord +(Poisson1 . yx * BloomScale));
 bloom += texture(Source, vTexCoord +(Poisson2 . yx * BloomScale));
 bloom += texture(Source, vTexCoord +(Poisson3 . yx * BloomScale));
 bloom += texture(Source, vTexCoord +(Poisson4 . yx * BloomScale));
 bloom += texture(Source, vTexCoord +(Poisson5 . yx * BloomScale));
 bloom += texture(Source, vTexCoord +(Poisson6 . yx * BloomScale));
 bloom *= InvNumSamples;

   FragColor = vec4(bloom);
}
