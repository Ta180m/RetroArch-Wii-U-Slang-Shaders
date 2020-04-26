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
uniform sampler2D Original;

vec3 Y = vec3(.2126, .7152, .0722);


float RGBtoYUV(vec3 color)
{
  return dot(color, Y);
}

void main()
{
 vec2 tex = vTexCoord;

 vec4 c0 = texture(Source, tex);
 vec4 c1 = texture(Original, tex);

 FragColor = vec4(c0 . xyz - c1 . xyz, RGBtoYUV(c0 . rgb));
}
