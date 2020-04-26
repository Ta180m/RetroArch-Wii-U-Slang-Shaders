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
   float EQ_THRESH2;
   float DIFF_THRESH2;
}params;

#pragma parameterEQ_THRESH2¡0.010.01.00.01
#pragma parameterDIFF_THRESH2¡0.060.01.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;




vec3 df3(vec3 c1, vec3 c2)
{
      return abs(c1 - c2);
}

bvec3 eq3(vec3 A, vec3 B)
{
 return lessThanEqual(df3(A, B), vec3(params . EQ_THRESH2));
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;

    vec2 ps = vec2(params . SourceSize . zw);
 float dx = ps . x;
 float dy = ps . y;
 t1 = vTexCoord . xyyy + vec4(0, - dy, 0, dy);
}

