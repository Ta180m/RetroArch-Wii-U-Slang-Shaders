#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4










































uniform Push
{
   vec4 SourceSize;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;



float dist(vec3 A, vec3 B)
{
 float r = 0.5 *(A . r + B . r);
 vec3 d = A - B;
 vec3 c = vec3(2 + r, 4, 3 - r);

 return sqrt(dot(c * d, d))/ 3;
}


void main()
{











 vec3 A = textureOffset(Source, vTexCoord, ivec2(- 1, - 1)). rgb;
 vec3 B = textureOffset(Source, vTexCoord, ivec2(0, - 1)). rgb;
 vec3 C = textureOffset(Source, vTexCoord, ivec2(1, - 1)). rgb;
 vec3 E = textureOffset(Source, vTexCoord, ivec2(0, 0)). rgb;
 vec3 F = textureOffset(Source, vTexCoord, ivec2(1, 0)). rgb;


 FragColor = vec4(dist(E, A), dist(E, B), dist(E, C), dist(E, F));
}
