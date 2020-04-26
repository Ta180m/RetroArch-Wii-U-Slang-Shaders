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
 vec2 p = vTexCoord . xy;

 p = p * params . SourceSize . xy + vec2(0.5, 0.5);

 vec2 i = floor(p);
 vec2 f = p - i;









 f = f * f * f * f *(f *(f *(- 20.0 * f + vec2(70.0, 70.0))- vec2(84.0, 84.0))+ vec2(35.0, 35.0));

 p = i + f;

 p =(p - vec2(0.5, 0.5))* params . SourceSize . zw;


   FragColor = vec4(texture(Source, p). rgb, 1.0);
}
