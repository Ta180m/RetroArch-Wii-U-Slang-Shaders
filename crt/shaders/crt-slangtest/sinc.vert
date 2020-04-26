#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4


layout(std140) uniform UBO
{
   vec4 SourceSize;
   float OUT_GAMMA;
   float BOOST;
}global;

layout(std140) uniform UBO1
{
   mat4 MVP;
};


layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = MVP * Position;
   vTexCoord = TexCoord;
}

