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
   float K;
}params;


#pragma parameterK¡0.80.01.00.01



layout(std140) uniform UBO
{
   mat4 MVP;
}global;






















float d(vec2 pt1, vec2 pt2)
{
       vec2 v = pt2 - pt1;
  return sqrt(dot(v, v));
}

     vec3 resampler(vec3 x)
    {
           vec3 res;

      res = lessThanEqual(x, vec3(0.5, 0.5, 0.5))== bvec3(true)?(- 2 * params . K * x * x + 0.5 *(params . K + 1)):(lessThanEqual(x, vec3(1.5, 1.5, 1.5))== bvec3(true)?(params . K * x * x +(- 2 * params . K - 0.5)* x + 0.75 *(params . K + 1)): vec3(0.00001, 0.00001, 0.00001));

      return res;
    }

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

