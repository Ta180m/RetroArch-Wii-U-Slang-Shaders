#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float mixfactor;
}param;

#pragma parametermixfactor¡0.750.01.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D PassFeedback0;

void main()
{
    vec4 current = pow(texture(Source, vTexCoord), vec4(2.2));
    vec4 fdback = pow(texture(PassFeedback0, vTexCoord), vec4(2.2));
    vec4 mixed =(1.0 - param . mixfactor)* current + param . mixfactor * fdback;

    FragColor = pow(mixed, vec4(1.0 / 2.2));
}
