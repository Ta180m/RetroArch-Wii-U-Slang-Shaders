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

   float dy = params . SourceSize . w;

    t1 = vTexCoord . xyyy + vec4(0, - 4.0 * dy, - 3.0 * dy, - 2.0 * dy);
    t2 = vTexCoord . xyyy + vec4(0, - dy, 0, dy);
    t3 = vTexCoord . xyyy + vec4(0, 2.0 * dy, 3.0 * dy, 4.0 * dy);
}

