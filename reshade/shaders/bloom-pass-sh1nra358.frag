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
   float BloomIntensity;
}params;

#pragma parameterBloomIntensity¡3.01.04.00.1


layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec4 color = texture(Source, vTexCoord);
   FragColor = vec4(color . rgb * pow(abs(max(color . r, max(color . g, color . b))), 2.0), 2.0f)* params . BloomIntensity;
}
