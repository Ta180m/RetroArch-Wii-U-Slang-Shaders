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

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;

void main()
{
 vec4 trails = texture(Source, vTexCoord). rgba;
 vec4 current = pow(texture(Original, vTexCoord). rgba, vec4(2.2));
   FragColor = vec4(pow(current + vec4(clamp(trails . r - current . r, 0.0, 1.0)* params . trail_bright), vec4(1.0 / 2.2)));
}
