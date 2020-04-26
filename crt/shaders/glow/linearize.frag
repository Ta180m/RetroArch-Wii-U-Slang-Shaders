#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float INPUT_GAMMA;
}params;

#pragma parameterINPUT_GAMMA¡2.42.02.60.02

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;

#pragma formatR8G8B8A8_SRGB
layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    vec3 color = texture(Source, vTexCoord). rgb;

    FragColor = vec4(pow(color, vec3(params . INPUT_GAMMA)), 1.0);
}
