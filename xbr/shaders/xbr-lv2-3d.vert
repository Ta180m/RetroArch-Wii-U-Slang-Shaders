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
   float XBR_LV1_COEFFICIENT;
   float XBR_LV2_COEFFICIENT;
   float XBR_RES;
   float XBR_SCALE;
}params;

#pragma parameterXBR_Y_WEIGHT¡48.00.0100.01.0
#pragma parameterXBR_EQ_THRESHOLD¡15.00.050.01.0
#pragma parameterXBR_LV1_COEFFICIENT¡0.50.030.00.5
#pragma parameterXBR_LV2_COEFFICIENT¡2.01.03.00.1
#pragma parameterXBR_RES¡2.01.08.01.0
#pragma parameterXBR_SCALE¡3.01.05.01.0











layout(std140) uniform UBO
{
   mat4 MVP;
}global;













float coef = 2.0;
vec3 rgbw = vec3(14.352, 28.176, 5.472);
vec4 eq_threshold = vec4(15.0, 15.0, 15.0, 15.0);

vec4 delta = vec4(1.0 / params . XBR_SCALE, 1.0 / params . XBR_SCALE, 1.0 / params . XBR_SCALE, 1.0 / params . XBR_SCALE);
vec4 delta_l = vec4(0.5 / params . XBR_SCALE, 1.0 / params . XBR_SCALE, 0.5 / params . XBR_SCALE, 1.0 / params . XBR_SCALE);
vec4 delta_u = delta_l . yxwz;

vec4 Ao = vec4(1.0, - 1.0, - 1.0, 1.0);
vec4 Bo = vec4(1.0, 1.0, - 1.0, - 1.0);
vec4 Co = vec4(1.5, 0.5, - 0.5, 0.5);
vec4 Ax = vec4(1.0, - 1.0, - 1.0, 1.0);
vec4 Bx = vec4(0.5, 2.0, - 0.5, - 2.0);
vec4 Cx = vec4(1.0, 1.0, - 0.5, 0.0);
vec4 Ay = vec4(1.0, - 1.0, - 1.0, 1.0);
vec4 By = vec4(2.0, 0.5, - 2.0, - 0.5);
vec4 Cy = vec4(2.0, 0.0, - 1.0, 0.5);
vec4 Ci = vec4(0.25, 0.25, 0.25, 0.25);

vec3 Y = vec3(0.2126, 0.7152, 0.0722);


vec4 df(vec4 A, vec4 B)
{
    return vec4(abs(A - B));
}


bvec4 eq(vec4 A, vec4 B)
{
    return(lessThan(df(A, B), vec4(params . XBR_EQ_THRESHOLD)));
}

vec4 weighted_distance(vec4 a, vec4 b, vec4 c, vec4 d, vec4 e, vec4 f, vec4 g, vec4 h)
{
 return(df(a, b)+ df(a, c)+ df(d, e)+ df(d, f)+ 4.0 * df(g, h));
}

float c_df(vec3 c1, vec3 c2)
{
      vec3 df = abs(c1 - c2);
      return df . r + df . g + df . b;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;

void main()
{
 gl_Position = global . MVP * Position;
 vTexCoord = TexCoord;

 vec2 ps = params . XBR_RES / params . SourceSize . xy;
 float dx = ps . x;
 float dy = ps . y;

 t1 = vec4(dx, 0, 0, dy);
}

