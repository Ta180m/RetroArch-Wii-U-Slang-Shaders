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
uniform sampler2D PassOutput6;

void main()
{
 vec4 inputY = texture(PassOutput6, vTexCoord . xy);
 vec4 inputUV = texture(Source, vTexCoord . xy);

 vec4 yuva = vec4(inputY . x,(inputUV . y - 0.5),(inputUV . z - 0.5), 1.0);

 vec4 rgba = vec4(0.0);

 rgba . r = yuva . x * 1.0 + yuva . y * 0.0 + yuva . z * 1.4;
 rgba . g = yuva . x * 1.0 + yuva . y * - 0.343 + yuva . z * - 0.711;
 rgba . b = yuva . x * 1.0 + yuva . y * 1.765 + yuva . z * 0.0;
 rgba . a = 1.0;

 FragColor = rgba;
}
