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

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;

   float dx = params . SourceSize . z;

    t1 = vTexCoord . xxxy + vec4(- 4.0 * dx, - 3.0 * dx, - 2.0 * dx, 0);
    t2 = vTexCoord . xxxy + vec4(- dx, 0, dx, 0);
    t3 = vTexCoord . xxxy + vec4(2.0 * dx, 3.0 * dx, 4.0 * dx, 0);
}

