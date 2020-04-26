#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;





















vec3 dt = vec3(1.0);

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out vec4 t2;
layout(location = 3) out vec4 t3;
layout(location = 4) out vec4 t4;
layout(location = 5) out vec4 t5;
layout(location = 6) out vec4 t6;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
   float x = 0.5 * global . SourceSize . z;
   float y = 0.5 * global . SourceSize . w;
   vec2 dg1 = vec2(x, y);
   vec2 dg2 = vec2(- x, y);
   vec2 sd1 = dg1 * 0.5;
   vec2 sd2 = dg2 * 0.5;
   vec2 ddx = vec2(x, 0.0);
   vec2 ddy = vec2(0.0, y);
   t1 = vec4(vTexCoord - sd1, vTexCoord - ddy);
   t2 = vec4(vTexCoord - sd2, vTexCoord + ddx);
   t3 = vec4(vTexCoord + sd1, vTexCoord + ddy);
   t4 = vec4(vTexCoord + sd2, vTexCoord - ddx);
   t5 = vec4(vTexCoord - dg1, vTexCoord - dg2);
   t6 = vec4(vTexCoord + dg1, vTexCoord + dg2);
}

