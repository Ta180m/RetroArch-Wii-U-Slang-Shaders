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

void main()
{
 gl_Position = global . MVP * Position;
 vTexCoord = TexCoord;
 vec2 ps = params . SourceSize . zw;
 float dx = ps . x;
 float dy = ps . y;
 t1 = vTexCoord . xxxy + vec4(- dx, 0., dx, 0.);
}

