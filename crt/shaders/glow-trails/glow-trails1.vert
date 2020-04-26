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
   float trail_bright;
}params;

#pragma parametertrail_bright¡0.250.01.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

mat3 yiq_mat = mat3(
      0.2989, 0.5959, 0.2115,
      0.5870, - 0.2744, - 0.5229,
      0.1140, - 0.3216, 0.3114
);

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

