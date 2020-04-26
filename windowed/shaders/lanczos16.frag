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

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 3) in vec4 t3;
layout(location = 4) in vec4 t4;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   mat4x3 pix;
   vec2 fraction = fract(vTexCoord * params . SourceSize . xy);



   vec4 abcd, pqrs;

   abcd = l(vec4(1 + fraction . x, fraction . x, 1 - fraction . x, 2 - fraction . x));
   pqrs = l(vec4(1 + fraction . y, fraction . y, 1 - fraction . y, 2 - fraction . y));



   vec3 c00 = texture(Source, t1 . xz). xyz;
   vec3 c10 = texture(Source, t1 . yz). xyz;
   vec3 c20 = texture(Source, t2 . xz). xyz;
   vec3 c30 = texture(Source, t2 . yz). xyz;
   vec3 c01 = texture(Source, t1 . xw). xyz;
   vec3 c11 = texture(Source, vTexCoord). xyz;
   vec3 c21 = texture(Source, t2 . xw). xyz;
   vec3 c31 = texture(Source, t2 . yw). xyz;
   vec3 c02 = texture(Source, t3 . xz). xyz;
   vec3 c12 = texture(Source, t3 . yz). xyz;
   vec3 c22 = texture(Source, t4 . xz). xyz;
   vec3 c32 = texture(Source, t4 . yz). xyz;
   vec3 c03 = texture(Source, t3 . xw). xyz;
   vec3 c13 = texture(Source, t3 . yw). xyz;
   vec3 c23 = texture(Source, t4 . xw). xyz;
   vec3 c33 = texture(Source, t4 . yw). xyz;

   pix[0]= mat4x3(- c00, c10, c20, - c30)* abcd;
   pix[1]= mat4x3(c01, c11, c21, c31)* abcd;
   pix[2]= mat4x3(c02, c12, c22, c32)* abcd;
   pix[3]= mat4x3(- c03, c13, c23, - c33)* abcd;


   FragColor = vec4(((pix * pqrs))/((dot(abcd, vec4(1.0))* dot(pqrs, vec4(1.0)))- 2 *(abcd . x + abcd . w)*(pqrs . x + pqrs . w)), 1);
}
