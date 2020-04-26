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

void main()
{
 vec4 rgba = texture(Source, vTexCoord . xy);

 vec4 yuva = vec4(0.0);

 yuva . x = rgba . r * 0.299 + rgba . g * 0.587 + rgba . b * 0.114;
 yuva . y = rgba . r * - 0.169 + rgba . g * - 0.331 + rgba . b * 0.5 + 0.5;
 yuva . z = rgba . r * 0.5 + rgba . g * - 0.419 + rgba . b * - 0.081 + 0.5;
 yuva . w = 1.0;

 FragColor = yuva;
}
