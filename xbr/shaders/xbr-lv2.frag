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

layout(location = 0) in vec2 texCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 3) in vec4 t3;
layout(location = 4) in vec4 t4;
layout(location = 5) in vec4 t5;
layout(location = 6) in vec4 t6;
layout(location = 7) in vec4 t7;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    vec4 edri, edr, edr_l, edr_u, px;
    vec4 irlv0, irlv1, irlv2l, irlv2u, block_3d;
    vec4 fx, fx_l, fx_u;

    vec2 fp = fract(texCoord * params . SourceSize . xy);

    vec3 A1 = texture(Source, t1 . xw). xyz;
    vec3 B1 = texture(Source, t1 . yw). xyz;
    vec3 C1 = texture(Source, t1 . zw). xyz;
    vec3 A = texture(Source, t2 . xw). xyz;
    vec3 B = texture(Source, t2 . yw). xyz;
    vec3 C = texture(Source, t2 . zw). xyz;
    vec3 D = texture(Source, t3 . xw). xyz;
    vec3 E = texture(Source, t3 . yw). xyz;
    vec3 F = texture(Source, t3 . zw). xyz;
    vec3 G = texture(Source, t4 . xw). xyz;
    vec3 H = texture(Source, t4 . yw). xyz;
    vec3 I = texture(Source, t4 . zw). xyz;
    vec3 G5 = texture(Source, t5 . xw). xyz;
    vec3 H5 = texture(Source, t5 . yw). xyz;
    vec3 I5 = texture(Source, t5 . zw). xyz;
    vec3 A0 = texture(Source, t6 . xy). xyz;
    vec3 D0 = texture(Source, t6 . xz). xyz;
    vec3 G0 = texture(Source, t6 . xw). xyz;
    vec3 C4 = texture(Source, t7 . xy). xyz;
    vec3 F4 = texture(Source, t7 . xz). xyz;
    vec3 I4 = texture(Source, t7 . xw). xyz;

    vec4 b = vec4(dot(B, rgbw), dot(D, rgbw), dot(H, rgbw), dot(F, rgbw));
    vec4 c = vec4(dot(C, rgbw), dot(A, rgbw), dot(G, rgbw), dot(I, rgbw));
    vec4 d = b . yzwx;
    vec4 e = vec4(dot(E, rgbw));
    vec4 f = b . wxyz;
    vec4 g = c . zwxy;
    vec4 h = b . zwxy;
    vec4 i = c . wxyz;

 vec4 i4, i5, h5, f4;

 float y_weight = params . XBR_Y_WEIGHT;

 if(params . small_details < 0.5)
 {
  i4 = vec4(dot(I4, rgbw), dot(C1, rgbw), dot(A0, rgbw), dot(G5, rgbw));
  i5 = vec4(dot(I5, rgbw), dot(C4, rgbw), dot(A1, rgbw), dot(G0, rgbw));
  h5 = vec4(dot(H5, rgbw), dot(F4, rgbw), dot(B1, rgbw), dot(D0, rgbw));
 }
 else
 {
  i4 =(y_weight * Y * mat4x3(I4, C1, A0, G5));
  i5 =(y_weight * Y * mat4x3(I5, C4, A1, G0));
  h5 =(y_weight * Y * mat4x3(H5, F4, B1, D0));
 }
 f4 = h5 . yzwx;


    fx =(Ao * fp . y + Bo * fp . x);
    fx_l =(Ax * fp . y + Bx * fp . x);
    fx_u =(Ay * fp . y + By * fp . x);

    irlv1 = irlv0 = diff(e, f)* diff(e, h);










    irlv1 =(irlv0 *(neq(f, b)* neq(f, c)+ neq(h, d)* neq(h, g)+ eq(e, i)*(neq(f, f4)* neq(f, i4)+ neq(h, h5)* neq(h, i5))+ eq(e, g)+ eq(e, c)));


    irlv2l = diff(e, g)* diff(d, g);
    irlv2u = diff(e, c)* diff(b, c);

    vec4 fx45i = clamp((fx + delta - Co - Ci)/(2.0 * delta), 0.0, 1.0);
    vec4 fx45 = clamp((fx + delta - Co)/(2.0 * delta), 0.0, 1.0);
    vec4 fx30 = clamp((fx_l + delta_l - Cx)/(2.0 * delta_l), 0.0, 1.0);
    vec4 fx60 = clamp((fx_u + delta_u - Cy)/(2.0 * delta_u), 0.0, 1.0);

 vec4 wd1, wd2;
 if(params . small_details < 0.5)
 {
  wd1 = wd(e, c, g, i, h5, f4, h, f);
  wd2 = wd(h, d, i5, f, i4, b, e, i);
 }
 else
 {
  wd1 = weighted_distance(e, c, g, i, f4, h5, h, f, b, d, i4, i5);
  wd2 = weighted_distance(h, d, i5, f, b, i4, e, i, g, h5, c, f4);
 }

    edri = step(wd1, wd2)* irlv0;
    edr = step(wd1 + vec4(0.1, 0.1, 0.1, 0.1), wd2)* step(vec4(0.5, 0.5, 0.5, 0.5), irlv1);
    edr_l = step(params . XBR_LV2_COEFFICIENT * df(f, g), df(h, c))* irlv2l * edr;
    edr_u = step(params . XBR_LV2_COEFFICIENT * df(h, c), df(f, g))* irlv2u * edr;

    fx45 = edr * fx45;
    fx30 = edr_l * fx30;
    fx60 = edr_u * fx60;
    fx45i = edri * fx45i;

    px = step(df(e, f), df(e, h));


    vec4 maximos = max(max(fx30, fx60), max(fx45, fx45i));





    vec3 res1 = E;
    res1 = mix(res1, mix(H, F, px . x), maximos . x);
    res1 = mix(res1, mix(B, D, px . z), maximos . z);

    vec3 res2 = E;
    res2 = mix(res2, mix(F, B, px . y), maximos . y);
    res2 = mix(res2, mix(D, H, px . w), maximos . w);

    vec3 res = mix(res1, res2, step(c_df(E, res1), c_df(E, res2)));

    FragColor = vec4(res, 1.0);
}
