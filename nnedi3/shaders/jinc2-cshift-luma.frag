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

#pragma parameterJINC2_WINDOW_SINC�0.440.01.00.01

#pragma parameterJINC2_SINC�0.820.01.00.01

#pragma parameterJINC2_AR_STRENGTH�0.50.01.00.1


layout(std140) uniform UBO
{
   mat4 MVP;
}global;







float d(vec2 pt1, vec2 pt2)
{
  vec2 v = pt2 - pt1;
  return sqrt(dot(v, v));
}

float min4(float a, float b, float c, float d)
{
    return min(a, min(b, min(c, d)));
}

float max4(float a, float b, float c, float d)
{
    return max(a, max(b, max(c, d)));
}

vec4 resampler(vec4 x)
{
 vec4 res;
 res =(x == vec4(0.0, 0.0, 0.0, 0.0))? vec4((params . JINC2_WINDOW_SINC * 3.1415926535897932384626433832795)*(params . JINC2_SINC * 3.1415926535897932384626433832795)): sin(x *(params . JINC2_WINDOW_SINC * 3.1415926535897932384626433832795))* sin(x *(params . JINC2_SINC * 3.1415926535897932384626433832795))/(x * x);
 return res;
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   float color;
   mat4x4 weights;

   vec2 dx = vec2(1.0, 0.0);
   vec2 dy = vec2(0.0, 1.0);


   vec2 pc = vec2(((vTexCoord . x / params . SourceSize . z)- 0.5),((vTexCoord . y / params . SourceSize . w)- 0.5));

   vec2 tc =(floor(pc - vec2(0.5, 0.5))+ vec2(0.5, 0.5));

   weights[0]= resampler(vec4(d(pc, tc - dx - dy), d(pc, tc - dy), d(pc, tc + dx - dy), d(pc, tc + 2.0 * dx - dy)));
   weights[1]= resampler(vec4(d(pc, tc - dx), d(pc, tc), d(pc, tc + dx), d(pc, tc + 2.0 * dx)));
   weights[2]= resampler(vec4(d(pc, tc - dx + dy), d(pc, tc + dy), d(pc, tc + dx + dy), d(pc, tc + 2.0 * dx + dy)));
   weights[3]= resampler(vec4(d(pc, tc - dx + 2.0 * dy), d(pc, tc + 2.0 * dy), d(pc, tc + dx + 2.0 * dy), d(pc, tc + 2.0 * dx + 2.0 * dy)));

   dx = dx * params . SourceSize . zw;
   dy = dy * params . SourceSize . zw;
   tc = tc * params . SourceSize . zw;



   float c00 = texture(Source, tc - dx - dy). x;
   float c10 = texture(Source, tc - dy). x;
   float c20 = texture(Source, tc + dx - dy). x;
   float c30 = texture(Source, tc + 2.0 * dx - dy). x;
   float c01 = texture(Source, tc - dx). x;
   float c11 = texture(Source, tc). x;
   float c21 = texture(Source, tc + dx). x;
   float c31 = texture(Source, tc + 2.0 * dx). x;
   float c02 = texture(Source, tc - dx + dy). x;
   float c12 = texture(Source, tc + dy). x;
   float c22 = texture(Source, tc + dx + dy). x;
   float c32 = texture(Source, tc + 2.0 * dx + dy). x;
   float c03 = texture(Source, tc - dx + 2.0 * dy). x;
   float c13 = texture(Source, tc + 2.0 * dy). x;
   float c23 = texture(Source, tc + dx + 2.0 * dy). x;
   float c33 = texture(Source, tc + 2.0 * dx + 2.0 * dy). x;


   float min_sample = min4(c11, c21, c12, c22);
   float max_sample = max4(c11, c21, c12, c22);

      color = dot(vec4(c00, c10, c20, c30), weights[0]);
      color += dot(vec4(c01, c11, c21, c31), weights[1]);
      color += dot(vec4(c02, c12, c22, c32), weights[2]);
      color += dot(vec4(c03, c13, c23, c33), weights[3]);
   color = color /(dot(weights * vec4(1.0), vec4(1.0)));


   float aux = color;
   color = clamp(color, min_sample, max_sample);

   color = mix(aux, color, params . JINC2_AR_STRENGTH);


   FragColor = vec4(color, 1.0, 1.0, 1.0);
}
