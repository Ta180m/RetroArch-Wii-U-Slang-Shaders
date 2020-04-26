#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

vec3 gamma(vec3 v)
{
   return v * v;
}

void main()
{
   FragColor = vec4(gamma(texture(Source, vTexCoord). rgb), 1.0);
}
