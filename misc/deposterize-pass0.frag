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
   float EQ_THRESH1;
   float DIFF_THRESH1;
}params;

#pragma parameterEQ_THRESH1¡0.010.01.00.01
#pragma parameterDIFF_THRESH1¡0.060.01.00.01




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
 return lessThanEqual(df3(A, B), vec3(params . EQ_THRESH1));
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec3 res;

 vec3 D = texture(Source, t1 . xw). rgb;
 vec3 E = texture(Source, t1 . yw). rgb;
 vec3 F = texture(Source, t1 . zw). rgb;

 bvec3 test1 = eq3(D, F);
 bvec3 test2 = eq3(D, E);
 bvec3 test3 = eq3(E, F);

 bvec3 test4 = lessThanEqual(df3(E, F), vec3(params . DIFF_THRESH1, params . DIFF_THRESH1, params . DIFF_THRESH1));
 bvec3 test5 = lessThanEqual(df3(D, E), vec3(params . DIFF_THRESH1, params . DIFF_THRESH1, params . DIFF_THRESH1));

 res =((test1 == bvec3(false))&&((test4 == bvec3(true))&&(test2 == bvec3(true))||(test5 == bvec3(true))&&(test3 == bvec3(true))))? 0.5 *(D + F): E;

   FragColor = vec4(res, 1.0);
}
