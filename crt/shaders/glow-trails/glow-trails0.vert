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
   float mixfactor;
   float threshold;
}params;

#pragma parametermixfactor¡0.50.01.00.01
#pragma parameterthreshold¡0.90.01.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

float key(float avg)
{
 float guess = 1.5 -(1.5 /(avg * 0.1 + 1.0));
 return max(0.0, guess)+ 0.1;
}

mat3 yiq2rgb_mat = mat3(
   1.0, 1.0, 1.0,
   0.956, - 0.2720, - 1.1060,
   0.6210, - 0.6474, 1.7046
);

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

