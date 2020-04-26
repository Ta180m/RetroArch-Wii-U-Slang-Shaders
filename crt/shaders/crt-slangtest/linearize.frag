#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

#pragma parameterOUT_GAMMA¡2.21.82.4
#pragma parameterBOOST¡1.00.22.00.02
#pragma parameterGAMMA¡2.52.03.00.02

layout(std140) uniform UBO
{
   mat4 MVP;
   float GAMMA;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

vec3 gamma(vec3 v)
{
   return pow(v, vec3(global . GAMMA));
}

void main()
{
   FragColor = vec4(gamma(texture(Source, vTexCoord). rgb), 1.0);
}
