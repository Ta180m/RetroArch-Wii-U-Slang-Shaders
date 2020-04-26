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






















vec3 Y = vec3(.2126, .7152, .0722);

float luma(vec3 color)
{
  return dot(color, Y);
}

     vec3 bilinear(float p, float q, vec3 A, vec3 B, vec3 C, vec3 D)
{
 return((1 - p)*(1 - q)* A + p *(1 - q)* B +(1 - p)* q * C + p * q * D);
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec2 loc;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
     vec2 pos = fract(loc * 1.00001)- vec2(0.4999, 0.4999);
      vec2 dir = sign(pos);

      vec2 g1 = dir * t1 . xy;
      vec2 g2 = dir * t1 . zw;

      vec3 A = texture(Source, vTexCoord). xyz;
      vec3 B = texture(Source, vTexCoord + g1). xyz;
      vec3 C = texture(Source, vTexCoord + g2). xyz;
      vec3 D = texture(Source, vTexCoord + g1 + g2). xyz;

 float a = luma(A);
 float b = luma(B);
 float c = luma(C);
 float d = luma(D);

 float p = abs(pos . x);
 float q = abs(pos . y);

 float k = distance(pos, g1);
 float l = distance(pos, g2);

 float wd1 = abs(a - d);
 float wd2 = abs(b - c);

 if(wd1 < wd2)
 {
  if(k < l)
  {
   C = A + D - B;
  }
  else
  {
   B = A + D - C;
  }
 }
 else if(wd1 > wd2)
 {
  D = B + C - A;
 }

      vec3 color = bilinear(p, q, A, B, C, D);
   FragColor = vec4(color, 1.0);
}
