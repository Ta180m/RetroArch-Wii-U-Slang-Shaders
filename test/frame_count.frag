#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

layout(std140) uniform UBO
{
   mat4 MVP;
   uint FrameCount;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec3 current = texture(Source, vTexCoord). rgb;
   FragColor = sqrt(0.5 + 0.4 * sin(float(global . FrameCount)* 6.28 * 0.01))*
      vec4(current, 1.0);
}
