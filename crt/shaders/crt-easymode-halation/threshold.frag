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
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D ORIG_LINEARIZED;

void main()
{
vec3 diff = clamp(texture(Source, vTexCoord). rgb - texture(ORIG_LINEARIZED, vTexCoord). rgb, 0.0, 1.0);
   FragColor = vec4(diff, 1.0);
}
