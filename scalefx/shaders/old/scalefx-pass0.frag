#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4










































#pragma namesfxp0



float eq(vec3 A, vec3 B)
{
 float r = 0.5 *(A . r + B . r);
 vec3 d = A - B;
 vec3 c = vec3(2 + r, 4, 3 - r);

 return 1 - sqrt(dot(c * d, d))/ 3;
}


layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 SourceSize;
};


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;




void main()
{









 vec3 A = textureOffset(Source, vTexCoord, ivec2(- 1, - 1)). rgb;
 vec3 B = textureOffset(Source, vTexCoord, ivec2(0, - 1)). rgb;
 vec3 C = textureOffset(Source, vTexCoord, ivec2(1, - 1)). rgb;
 vec3 E = textureOffset(Source, vTexCoord, ivec2(0, 0)). rgb;
 vec3 F = textureOffset(Source, vTexCoord, ivec2(1, 0)). rgb;


 FragColor = vec4(eq(E, A), eq(E, B), eq(E, C), eq(E, F));
}
