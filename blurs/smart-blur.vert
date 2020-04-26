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
   float SB_RED_THRESHOLD;
   float SB_GREEN_THRESHOLD;
   float SB_BLUE_THRESHOLD;
}params;

#pragma parameterSB_RED_THRESHOLD¡0.20.00.60.01
#pragma parameterSB_GREEN_THRESHOLD¡0.20.00.60.01
#pragma parameterSB_BLUE_THRESHOLD¡0.20.00.60.01

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
 float dy = params . SourceSize . w;

 t1 = vTexCoord . xxxy + vec4(- dx, 0.0, dx, - dy);
 t2 = vTexCoord . xxxy + vec4(- dx, 0.0, dx, 0.0);
 t3 = vTexCoord . xxxy + vec4(- dx, 0.0, dx, dy);
}

