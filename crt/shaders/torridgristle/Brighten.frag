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
   float BrightenLevel;
   float BrightenAmount;
}params;

#pragma parameterBrightenLevel¡2.01.010.01.0
#pragma parameterBrightenAmount¡0.10.01.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    vec3 Picture = texture(Source, vTexCoord). xyz;
    Picture = clamp(Picture, 0.0, 1.0);

    FragColor = vec4(mix(Picture, 1.0 - pow(1.0 - Picture, vec3(params . BrightenLevel)), params . BrightenAmount), 1.0);
}
