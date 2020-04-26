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

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out vec4 t2;
layout(location = 3) out vec4 t3;
layout(location = 4) out vec4 t4;
layout(location = 5) out vec4 t5;
layout(location = 6) out vec4 t6;
layout(location = 7) out vec4 t7;

void main()
{
   gl_Position = global . MVP * Position;







   float dx = global . SourceSize . z;
   float dy = global . SourceSize . w;

   vTexCoord = TexCoord;
   t1 = vTexCoord . xxxy + vec4(- dx, 0, dx, - 2.0 * dy);
   t2 = vTexCoord . xxxy + vec4(- dx, 0, dx, - dy);
   t3 = vTexCoord . xxxy + vec4(- dx, 0, dx, 0);
   t4 = vTexCoord . xxxy + vec4(- dx, 0, dx, dy);
   t5 = vTexCoord . xxxy + vec4(- dx, 0, dx, 2.0 * dy);
   t6 = vTexCoord . xyyy + vec4(- 2.0 * dx, - dy, 0, dy);
   t7 = vTexCoord . xyyy + vec4(2.0 * dx, - dy, 0, dy);
}

