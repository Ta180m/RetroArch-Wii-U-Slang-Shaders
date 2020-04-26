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
   float RESOLUTION_X;
   float RESOLUTION_Y;
   float CONTRAST;
}params;

#pragma parameterRESOLUTION_X¡0.00.01920.01.0

#pragma parameterRESOLUTION_Y¡0.00.01920.01.0

#pragma parameterCONTRAST¡3.00.010.00.1


layout(std140) uniform UBO
{
   mat4 MVP;
}global;

vec3 dt = vec3(1.0, 1.0, 1.0);
vec3 dtt = vec3(0.001, 0.001, 0.001);




layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 3) in vec4 t3;
layout(location = 4) in vec4 t4;
layout(location = 5) in vec4 t5;
layout(location = 6) in vec4 t6;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
  vec3 c11 = texture(Source, vTexCoord). xyz;
  vec3 c00 = texture(Source, t1 . xy). xyz;
  vec3 c20 = texture(Source, t1 . zw). xyz;
  vec3 c22 = texture(Source, t2 . xy). xyz;
  vec3 c02 = texture(Source, t2 . zw). xyz;
  vec3 s00 = texture(Source, t3 . xy). xyz;
  vec3 s20 = texture(Source, t3 . zw). xyz;
  vec3 s22 = texture(Source, t4 . xy). xyz;
  vec3 s02 = texture(Source, t4 . zw). xyz;
  vec3 c01 = texture(Source, t5 . xy). xyz;
  vec3 c21 = texture(Source, t5 . zw). xyz;
  vec3 c10 = texture(Source, t6 . xy). xyz;
  vec3 c12 = texture(Source, t6 . zw). xyz;

  float d1 = dot(abs(c00 - c22), dt)+ 0.0001;
  float d2 = dot(abs(c20 - c02), dt)+ 0.0001;
  float hl = dot(abs(c01 - c21), dt)+ 0.0001;
  float vl = dot(abs(c10 - c12), dt)+ 0.0001;
  float m1 = dot(abs(s00 - s22), dt)+ 0.0001;
  float m2 = dot(abs(s02 - s20), dt)+ 0.0001;

  vec3 mn1 = min(min(c00, c01), c02);
  vec3 mn2 = min(min(c10, c11), c12);
  vec3 mn3 = min(min(c20, c21), c22);
  vec3 mx1 = max(max(c00, c01), c02);
  vec3 mx2 = max(max(c10, c11), c12);
  vec3 mx3 = max(max(c20, c21), c22);

  mn1 = min(min(mn1, mn2), mn3);
  mx1 = max(max(mx1, mx2), mx3);

  vec3 t1 =(hl *(c10 + c12)+ vl *(c01 + c21)+(hl + vl)* c11)/(3.0 *(hl + vl));
  vec3 t2 =(d1 *(c20 + c02)+ d2 *(c00 + c22)+(d1 + d2)* c11)/(3.0 *(d1 + d2));

  c11 = 0.25 *(t1 + t2 +(m2 *(s00 + s22)+ m1 *(s02 + s20))/(m1 + m2));

  vec3 dif1 = abs(c11 - mn1)+ dtt;
  vec3 dif2 = abs(c11 - mx1)+ dtt;



  float dif = max(length(dif1), length(dif2));
  float filterparam = clamp(2.25 * dif, 1.0, 2.0);

  dif1 = vec3(pow(dif1 . x, filterparam), pow(dif1 . y, filterparam), pow(dif1 . z, filterparam));
  dif2 = vec3(pow(dif2 . x, filterparam), pow(dif2 . y, filterparam), pow(dif2 . z, filterparam));

  c11 = vec3((dif1 . x * mx1 . x + dif2 . x * mn1 . x)/(dif1 . x + dif2 . x),
               (dif1 . y * mx1 . y + dif2 . y * mn1 . y)/(dif1 . y + dif2 . y),
      (dif1 . z * mx1 . z + dif2 . z * mn1 . z)/(dif1 . z + dif2 . z));
   FragColor = vec4(c11, 1.0);
}
