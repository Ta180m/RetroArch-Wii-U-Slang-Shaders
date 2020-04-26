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

#pragma parameterOUT_GAMMA¡2.21.82.4
#pragma parameterBOOST¡1.00.22.00.02
#pragma parameterGAMMA¡2.52.03.00.02

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = MVP * Position;
   vTexCoord = TexCoord;
}

