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

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec3 res;

 vec3 B = texture(Source, t1 . xy). rgb;
 vec3 E = texture(Source, t1 . xz). rgb;
 vec3 H = texture(Source, t1 . xw). rgb;

 bvec3 test1 = eq3(B, H);
 bvec3 test2 = eq3(B, E);
 bvec3 test3 = eq3(E, H);

 bvec3 test4 = lessThanEqual(df3(E, H), vec3(params . DIFF_THRESH2, params . DIFF_THRESH2, params . DIFF_THRESH2));
 bvec3 test5 = lessThanEqual(df3(B, E), vec3(params . DIFF_THRESH2, params . DIFF_THRESH2, params . DIFF_THRESH2));

 res =((test1 == bvec3(false))&&((test4 == bvec3(true))&&(test2 == bvec3(true))||(test5 == bvec3(true))&&(test3 == bvec3(true))))? 0.5 *(B + H): E;

 FragColor = vec4(res, 1.0);
}
