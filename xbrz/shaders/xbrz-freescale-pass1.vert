#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4





















































float DistYCbCr(vec3 pixA, vec3 pixB)
{
  vec3 w = vec3(0.2627, 0.6780, 0.0593);
  float scaleB = 0.5 /(1.0 - w . b);
  float scaleR = 0.5 /(1.0 - w . r);
  vec3 diff = pixA - pixB;
  float Y = dot(diff . rgb, w);
  float Cb = scaleB *(diff . b - Y);
  float Cr = scaleR *(diff . r - Y);

  return sqrt(((1.0 * Y)*(1.0 * Y))+(Cb * Cb)+(Cr * Cr));
}

bool IsPixEqual(const vec3 pixA, const vec3 pixB)
{
  return(DistYCbCr(pixA, pixB)< 30.0 / 255.0);
}

float get_left_ratio(vec2 center, vec2 origin, vec2 direction, vec2 scale)
{
  vec2 P0 = center - origin;
  vec2 proj = direction *(dot(P0, direction)/ dot(direction, direction));
  vec2 distv = P0 - proj;
  vec2 orth = vec2(- direction . y, direction . x);
  float side = sign(dot(P0, orth));
  float v = side * length(distv * scale);


  return smoothstep(- sqrt(2.0)/ 2.0, sqrt(2.0)/ 2.0, v);
}

uniform Push
{
   vec4 OriginalSize;
   vec4 OutputSize;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

