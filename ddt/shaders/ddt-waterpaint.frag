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






















vec3 dtt = vec3(65536, 255, 1);

float reduce(vec3 color)
{
 return dot(color, dtt);
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

 float a = reduce(A);
 float b = reduce(B);
 float c = reduce(C);
 float d = reduce(D);

 float p = abs(pos . x);
 float q = abs(pos . y);

 float k = distance(pos, g1);
 float l = distance(pos, g2);

 if(abs(a - d)< abs(b - c))
 {
  if(k < l)
  {
   C = A + D - B;
  }
  else if(k > l)
  {
   B = A + D - C;
  }
 }
 else if(abs(a - d)> abs(b - c))
 {
  D = B + C - A;
 }

      vec3 color_old = bilinear(p, q, A, B, C, D);

      vec2 texsize = params . SourceSize . xy;
 float scale_factor = 1.0;
      vec2 delta = 0.5 /(texsize * scale_factor);
 float dx = delta . x;
 float dy = delta . y;

      vec3 c00 = texture(Source, vTexCoord + vec2(- dx, - dy)). xyz;
      vec3 c01 = texture(Source, vTexCoord + vec2(- dx, 0)). xyz;
      vec3 c02 = texture(Source, vTexCoord + vec2(- dx, dy)). xyz;
      vec3 c10 = texture(Source, vTexCoord + vec2(0, - dy)). xyz;
      vec3 c11 = texture(Source, vTexCoord + vec2(0, 0)). xyz;
      vec3 c12 = texture(Source, vTexCoord + vec2(0, dy)). xyz;
      vec3 c20 = texture(Source, vTexCoord + vec2(dx, - dy)). xyz;
      vec3 c21 = texture(Source, vTexCoord + vec2(dx, 0)). xyz;
      vec3 c22 = texture(Source, vTexCoord + vec2(dx, dy)). xyz;

      vec3 first = mix(c00, c20, fract(scale_factor * vTexCoord . x * texsize . x + 0.5));
      vec3 second = mix(c02, c22, fract(scale_factor * vTexCoord . x * texsize . x + 0.5));

      vec3 mid_horiz = mix(c01, c21, fract(scale_factor * vTexCoord . x * texsize . x + 0.5));
      vec3 mid_vert = mix(c10, c12, fract(scale_factor * vTexCoord . y * texsize . y + 0.5));

      vec3 res = mix(first, second, fract(scale_factor * vTexCoord . y * texsize . y + 0.5));

 float color = vec4(0.28 *(res + mid_horiz + mid_vert)+ 4.7 * abs(res - mix(mid_horiz, mid_vert, 0.5)), 1.0). x;

   FragColor = vec4((color + color_old)/ 2.0, 1.0);
}
