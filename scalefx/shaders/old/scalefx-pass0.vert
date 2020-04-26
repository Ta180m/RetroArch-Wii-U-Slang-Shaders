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


layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
 gl_Position = MVP * Position;
 vTexCoord = TexCoord;
}


