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
   vTexCoord = TexCoord * 1.0004;

    vec2 ps = vec2(1.0)/ params . SourceSize . xy;
 float dx = ps . x;
 float dy = ps . y;







 t1 = vTexCoord . xxxy + vec4(- dx, 0, dx, - 2.0 * dy);
 t2 = vTexCoord . xxxy + vec4(- dx, 0, dx, - dy);
 t3 = vTexCoord . xxxy + vec4(- dx, 0, dx, 0);
 t4 = vTexCoord . xxxy + vec4(- dx, 0, dx, dy);
 t5 = vTexCoord . xxxy + vec4(- dx, 0, dx, 2.0 * dy);
 t6 = vTexCoord . xyyy + vec4(- 2.0 * dx, - dy, 0, dy);
 t7 = vTexCoord . xyyy + vec4(2.0 * dx, - dy, 0, dy);
}

