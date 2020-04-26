#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float GLOW_WHITEPOINT;
   float GLOW_ROLLOFF;
}params;

#pragma parameterGLOW_WHITEPOINT¡1.00.51.10.02
#pragma parameterGLOW_ROLLOFF¡3.01.26.00.1

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
    vec3 color = 1.15 * texture(Source, vTexCoord). rgb;
    vec3 factor = clamp(color / params . GLOW_WHITEPOINT, 0.0, 1.0);

    FragColor = vec4(pow(factor, vec3(params . GLOW_ROLLOFF)), 1.0);
}
