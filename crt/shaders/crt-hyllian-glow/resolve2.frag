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
   float BLOOM_STRENGTH;
   float SOURCE_BOOST;
}params;

#pragma parameterBLOOM_STRENGTH¡0.450.01.00.01
#pragma parameterSOURCE_BOOST¡1.151.01.30.01







layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D CRT_PASS;

void main()
{
 vec3 source = params . SOURCE_BOOST * texture(CRT_PASS, vTexCoord). rgb;
 vec3 bloom = texture(Source, vTexCoord). rgb;
 source += params . BLOOM_STRENGTH * bloom;
 FragColor = vec4(pow(clamp(source, 0.0, 1.0), vec3((1.0 / 2.2),(1.0 / 2.2),(1.0 / 2.2))), 1.0);
}
