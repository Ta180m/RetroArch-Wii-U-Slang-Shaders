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
   float XBR_Y_WEIGHT;
   float XBR_EQ_THRESHOLD;
   float XBR_EQ_THRESHOLD2;
   float XBR_LV2_COEFFICIENT;
   float corner_type;
}params;

#pragma parameterXBR_Y_WEIGHT¡48.00.0100.01.0
#pragma parameterXBR_EQ_THRESHOLD¡10.00.050.01.0
#pragma parameterXBR_EQ_THRESHOLD2¡2.00.04.01.0
#pragma parameterXBR_LV2_COEFFICIENT¡2.01.03.01.0
#pragma parametercorner_type¡3.01.03.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

mat3 yuv = mat3(0.299, 0.587, 0.114, - 0.169, - 0.331, 0.499, 0.499, - 0.418, - 0.0813);
vec4 delta = vec4(0.4, 0.4, 0.4, 0.4);

vec4 df(vec4 A, vec4 B)
{
 return vec4(abs(A - B));
}

float c_df(vec3 c1, vec3 c2){
 vec3 df = abs(c1 - c2);
 return df . r + df . g + df . b;
}

bvec4 eq(vec4 A, vec4 B)
{
 return lessThan(df(A, B), vec4(params . XBR_EQ_THRESHOLD));
}

bvec4 eq2(vec4 A, vec4 B)
{
 return lessThan(df(A, B), vec4(params . XBR_EQ_THRESHOLD2));
}

bvec4 and(bvec4 A, bvec4 B)
{
 return bvec4(A . x && B . x, A . y && B . y, A . z && B . z, A . w && B . w);
}

bvec4 or(bvec4 A, bvec4 B)
{
 return bvec4(A . x || B . x, A . y || B . y, A . z || B . z, A . w || B . w);
}

vec4 weighted_distance(vec4 a, vec4 b, vec4 c, vec4 d, vec4 e, vec4 f, vec4 g, vec4 h)
{
 return(df(a, b)+ df(a, c)+ df(d, e)+ df(d, f)+ 4.0 * df(g, h));
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
   vTexCoord = TexCoord * 1.0004;

    vec2 ps = vec2(1.0)/ params . SourceSize . xy;
 float dx = ps . x;
 float dy = ps . y;







 t1 = vTexCoord . xxxy + vec4(- dx, 0, dx, - 2.0 * dy);
 t2 = vTexCoord . xxxy + vec4(- dx, 0, dx, - dy);
 t3 = vTexCoord . xxxy + vec4(- dx, 0, dx, 0);
 t4 = vTexCoord . xxxy + vec4(- dx, 0, dx, dy);
 t5 = vTexCoord . xxxy + vec4(- dx, 0, dx, 2.0 * dy);
 t6 = vTexCoord . xyyy + vec4(- 2.0 * dx, - dy, 0, dy);
 t7 = vTexCoord . xyyy + vec4(2.0 * dx, - dy, 0, dy);
}

