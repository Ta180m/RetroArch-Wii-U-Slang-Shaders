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
layout(location = 1) in vec2 dot_size;
layout(location = 2) in vec2 one_texel;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D MASK;






void main()
{
   FragColor = texture(MASK, fract((vTexCoord . xy * params . OutputSize . xy)/ vec2(2., floor(params . OutputSize . y / params . SourceSize . y + 0.000001))))* texture(Source, vTexCoord);
}
