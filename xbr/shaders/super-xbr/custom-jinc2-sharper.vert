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
   float JINC2_WINDOW_SINC;
   float JINC2_SINC;
   float JINC2_AR_STRENGTH;
}params;

#pragma parameterJINC2_WINDOW_SINC¡0.420.01.00.01
#pragma parameterJINC2_SINC¡0.920.01.00.01
#pragma parameterJINC2_AR_STRENGTH¡1.00.01.00.1



layout(std140) uniform UBO
{
   mat4 MVP;
}global;
















vec3 Y = vec3(0.299, 0.587, 0.114);

float df(float A, float B)
{
 return abs(A - B);
}


float d(vec2 pt1, vec2 pt2)
{
  vec2 v = pt2 - pt1;
  return sqrt(dot(v, v));
}

vec3 min4(vec3 a, vec3 b, vec3 c, vec3 d)
{
    return min(a, min(b, min(c, d)));
}
vec3 max4(vec3 a, vec3 b, vec3 c, vec3 d)
{
    return max(a, max(b, max(c, d)));
}

vec4 resampler(vec4 x)
{
 vec4 res;
 res =(x == vec4(0.0, 0.0, 0.0, 0.0))? vec4((params . JINC2_WINDOW_SINC * 3.1415926535897932384626433832795)*(params . JINC2_SINC * 3.1415926535897932384626433832795)): sin(x *(params . JINC2_WINDOW_SINC * 3.1415926535897932384626433832795))* sin(x *(params . JINC2_SINC * 3.1415926535897932384626433832795))/(x * x);
 return res;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord * 1.0001;
}

