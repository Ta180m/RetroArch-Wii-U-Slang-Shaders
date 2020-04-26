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
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

float character(float n, vec2 p)
{
 p = floor(p * vec2(4.0, - 4.0)+ 2.5);
 if(clamp(p . x, 0.0, 4.0)== p . x && clamp(p . y, 0.0, 4.0)== p . y)
 {
  if(int(mod(n / exp2(p . x + 5.0 * p . y), 2.0))== 1)return 1.0;
 }
 return 0.0;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

