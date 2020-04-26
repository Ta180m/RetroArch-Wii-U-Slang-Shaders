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

 float one_sixth = 1.0 / 6.0;
 float two_sixth = 2.0 / 6.0;
 float four_sixth = 4.0 / 6.0;
 float five_sixth = 5.0 / 6.0;

 float reduce(const vec3 color)
 {
  return dot(color, vec3(65536.0, 256.0, 1.0));
 }

 float DistYCbCr(const vec3 pixA, const vec3 pixB)
 {
  vec3 w = vec3(0.2627, 0.6780, 0.0593);
  float scaleB = 0.5 /(1.0 - w . b);
  float scaleR = 0.5 /(1.0 - w . r);
  vec3 diff = pixA - pixB;
  float Y = dot(diff, w);
  float Cb = scaleB *(diff . b - Y);
  float Cr = scaleR *(diff . r - Y);

  return sqrt(((1.0 * Y)*(1.0 * Y))+(Cb * Cb)+(Cr * Cr));
 }

 bool IsPixEqual(const vec3 pixA, const vec3 pixB)
 {
  return(DistYCbCr(pixA, pixB)< 30.0 / 255.0);
 }

 bool IsBlendingNeeded(const ivec4 blend)
 {
  return any(notEqual(blend, ivec4(0)));
 }















layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out vec4 t2;
layout(location = 3) out vec4 t3;
layout(location = 4) out vec4 t4;
layout(location = 5) out vec4 t5;
layout(location = 6) out vec4 t6;
layout(location = 7) out vec4 t7;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;

vec2 ps = vec2(params . SourceSize . z, params . SourceSize . w);
float dx = ps . x;
float dy = ps . y;







t1 = vTexCoord . xxxy + vec4(- dx, 0.0, dx, - 2.0 * dy);
t2 = vTexCoord . xxxy + vec4(- dx, 0.0, dx, - dy);
t3 = vTexCoord . xxxy + vec4(- dx, 0.0, dx, 0.0);
t4 = vTexCoord . xxxy + vec4(- dx, 0.0, dx, dy);
t5 = vTexCoord . xxxy + vec4(- dx, 0.0, dx, 2.0 * dy);
t6 = vTexCoord . xyyy + vec4(- 2.0 * dx, - dy, 0.0, dy);
t7 = vTexCoord . xyyy + vec4(2.0 * dx, - dy, 0.0, dy);
}

