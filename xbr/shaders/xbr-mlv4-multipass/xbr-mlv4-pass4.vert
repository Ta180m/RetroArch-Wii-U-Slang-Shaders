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
   vec4 REFSize;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;





















vec3 bin = vec3(4.0, 2.0, 1.0);
vec4 low = vec4(- 64.0, - 64.0, - 64.0, - 64.0);
vec4 high = vec4(64.0, 64.0, 64.0, 64.0);

mat2x4 sym_vectors = mat2x4(1., 1., - 1., - 1., 1., - 1., - 1., 1.);

     vec4 remapFrom01(vec4 v, vec4 low, vec4 high)
{
 return floor((mix(low, high, v))+ 0.5);
}

float c_df(vec3 c1, vec3 c2)
{
      vec3 df = abs(c1 - c2);
 return df . r + df . g + df . b;
}


     vec4 unpack_info(float i)
{
      vec4 info;
 info . x = floor((modf(i / 2.0, i))+ 0.5);
 info . y = floor((modf(i / 2.0, i))+ 0.5);
 info . z = floor((modf(i / 2.0, i))+ 0.5);
 info . w = i;

 return info;
}


float df(float A, float B)
{
 return abs(A - B);
}













layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out float scale_factor;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord * 1.0001;
      vec2 ps = vec2(1.0 / params . REFSize . x, 1.0 / params . REFSize . y);
 float dx = ps . x;
 float dy = ps . y;









 t1 = vec4(dx, 0., 0., dy);
 scale_factor = params . OutputSize . x / params . REFSize . x;
}

