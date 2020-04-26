#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4










































#pragma namesfxp7


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


