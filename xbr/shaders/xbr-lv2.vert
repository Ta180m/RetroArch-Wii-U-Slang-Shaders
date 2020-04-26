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
   float small_details;
}params;

#pragma parameterXBR_Y_WEIGHT¡48.00.0100.01.0
#pragma parameterXBR_EQ_THRESHOLD¡15.00.050.01.0
#pragma parameterXBR_LV1_COEFFICIENT¡0.50.030.00.5
#pragma parameterXBR_LV2_COEFFICIENT¡2.01.03.00.1
#pragma parametersmall_details¡0.00.01.01.0









layout(std140) uniform UBO
{
   mat4 MVP;
}global;















float coef = 2.0;
vec3 rgbw = vec3(14.352, 28.176, 5.472);
vec4 eq_threshold = vec4(15.0, 15.0, 15.0, 15.0);

vec4 delta = vec4(1.0 / 3.0, 1.0 / 3.0, 1.0 / 3.0, 1.0 / 3.0);
vec4 delta_l = vec4(0.5 / 3.0, 1.0 / 3.0, 0.5 / 3.0, 1.0 / 3.0);
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


vec4 diff(vec4 A, vec4 B)
{
    return vec4(notEqual(A, B));
}


vec4 eq(vec4 A, vec4 B)
{
    return(step(df(A, B), vec4(params . XBR_EQ_THRESHOLD)));
}


vec4 neq(vec4 A, vec4 B)
{
    return(vec4(1.0, 1.0, 1.0, 1.0)- eq(A, B));
}


vec4 wd(vec4 a, vec4 b, vec4 c, vec4 d, vec4 e, vec4 f, vec4 g, vec4 h)
{
    return(df(a, b)+ df(a, c)+ df(d, e)+ df(d, f)+ 4.0 * df(g, h));
}

vec4 weighted_distance(vec4 a, vec4 b, vec4 c, vec4 d, vec4 e, vec4 f, vec4 g, vec4 h, vec4 i, vec4 j, vec4 k, vec4 l)
{
 return(df(a, b)+ df(a, c)+ df(d, e)+ df(d, f)+ df(i, j)+ df(k, l)+ 2.0 * df(g, h));
}

float c_df(vec3 c1, vec3 c2)
{
      vec3 df = abs(c1 - c2);
      return df . r + df . g + df . b;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 texCoord;
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
   texCoord = TexCoord;


   float dx = params . SourceSize . z;
   float dy = params . SourceSize . w;

   t1 = TexCoord . xxxy + vec4(- dx, 0, dx, - 2.0 * dy);
   t2 = TexCoord . xxxy + vec4(- dx, 0, dx, - dy);
   t3 = TexCoord . xxxy + vec4(- dx, 0, dx, 0);
   t4 = TexCoord . xxxy + vec4(- dx, 0, dx, dy);
   t5 = TexCoord . xxxy + vec4(- dx, 0, dx, 2.0 * dy);
   t6 = TexCoord . xyyy + vec4(- 2.0 * dx, - dy, 0, dy);
   t7 = TexCoord . xyyy + vec4(2.0 * dx, - dy, 0, dy);
}

