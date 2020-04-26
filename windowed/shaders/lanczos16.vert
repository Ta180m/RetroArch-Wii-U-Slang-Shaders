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

float floatpi = 1.5707963267948966192313216916398;
float pi = 3.1415926535897932384626433832795;

vec4 l(vec4 x)
{
   vec4 res;

   res =(x == vec4(0.0, 0.0, 0.0, 0.0))? vec4(pi * floatpi): sin(x * floatpi)* sin(x * pi)/(x * x);

   return res;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out vec4 t2;
layout(location = 3) out vec4 t3;
layout(location = 4) out vec4 t4;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord * 1.000001;
   vec2 ps = params . SourceSize . zw;
   float dx = ps . x;
   float dy = ps . y;

   t1 = vTexCoord . xxyy + vec4(- dx, 0.0, - dy, 0.0);
   t2 = vTexCoord . xxyy + vec4(dx, 2.0 * dx, - dy, 0.0);
   t3 = vTexCoord . xxyy + vec4(- dx, 0.0, dy, 2.0 * dy);
   t4 = vTexCoord . xxyy + vec4(dx, 2.0 * dx, dy, 2.0 * dy);
}

