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




float cf2 = 2.0;
float cf3 = 4.0;
float cf4 = 4.0;
vec4 eq_thresholdold = vec4(15.0, 15.0, 15.0, 15.0);
vec4 eq_threshold = vec4(2.0, 2.0, 2.0, 2.0);
vec4 eq_threshold3 = vec4(25.0, 25.0, 25.0, 25.0);
vec3 Yuv_weight = vec3(4.0, 1.0, 2.0);
mat3 yuv = mat3(0.299, 0.587, 0.114, - 0.169, - 0.331, 0.499, 0.499, - 0.418, - 0.0813);
mat3 yuvT = mat3(0.299, - 0.169, 0.499, 0.587, - 0.331, - 0.418, 0.114, 0.499, - 0.0813);
vec3 yuv_weighted0 = vec3(1.196, 2.348, 0.228);
vec3 yuv_weighted1 = vec3(- 0.169, - 0.331, 0.499);
vec3 yuv_weighted2 = vec3(0.898, - 0.836, - 0.163);
vec4 maximo = vec4(255.0, 255.0, 255.0, 255.0);


vec4 df(vec4 A, vec4 B)
{
 return vec4(abs(A - B));
}

bvec4 rd(vec4 A, vec4 B, vec4 C, vec4 D)
{
    return(greaterThan(df(C, D)/(df(A, B)+ 0.000000001), vec4(2.0)));
}

bvec4 id(vec4 A, vec4 B, vec4 C, vec4 D)
{
    return greaterThan(df(C, D), df(A, B));
}


vec4 remapTo01(vec4 v, vec4 high)
{
 return(v / high);
}

bvec4 eq(vec4 A, vec4 B)
{
 return lessThan(df(A, B), eq_threshold);
}

bvec4 eq3(vec4 A, vec4 B)
{
 return lessThan(df(A, B), eq_threshold3);
}

vec4 weighted_distance(vec4 a, vec4 b, vec4 c, vec4 d, vec4 e, vec4 f, vec4 g, vec4 h)
{
 return(df(a, b)+ df(a, c)+ df(d, e)+ df(d, f)+ 4.0 * df(g, h));
}

bvec4 and(bvec4 A, bvec4 B)
{
 return bvec4(A . x && B . x, A . y && B . y, A . z && B . z, A . w && B . w);
}

bvec4 or(bvec4 A, bvec4 B)
{
 return bvec4(A . x || B . x, A . y || B . y, A . z || B . z, A . w || B . w);
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 t1;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 bvec4 edr0, edr, edr_left, edr_up, edr3_left, edr3_up, edr4_left, edr4_up;
 bvec4 interp_restriction_lv1, interp_restriction_lv2_left, interp_restriction_lv2_up;
 bvec4 interp_restriction_lv3_left, interp_restriction_lv3_up;
 bvec4 interp_restriction_lv4_left, interp_restriction_lv4_up;

               vec3 A3 = texture(Source, vTexCoord + vec2((- 1),(- 3))* t1). rgb;vec3 B3 = texture(Source, vTexCoord + vec2((0),(- 3))* t1). rgb;vec3 C3 = texture(Source, vTexCoord + vec2((1),(- 3))* t1). rgb;
               vec3 A1 = texture(Source, vTexCoord + vec2((- 1),(- 2))* t1). rgb;vec3 B1 = texture(Source, vTexCoord + vec2((0),(- 2))* t1). rgb;vec3 C1 = texture(Source, vTexCoord + vec2((1),(- 2))* t1). rgb;
 vec3 A2 = texture(Source, vTexCoord + vec2((- 3),(- 1))* t1). rgb;vec3 A0 = texture(Source, vTexCoord + vec2((- 2),(- 1))* t1). rgb;vec3 A = texture(Source, vTexCoord + vec2((- 1),(- 1))* t1). rgb;vec3 B = texture(Source, vTexCoord + vec2((0),(- 1))* t1). rgb;vec3 C = texture(Source, vTexCoord + vec2((1),(- 1))* t1). rgb;vec3 C4 = texture(Source, vTexCoord + vec2((2),(- 1))* t1). rgb;vec3 C6 = texture(Source, vTexCoord + vec2((3),(- 1))* t1). rgb;
 vec3 D2 = texture(Source, vTexCoord + vec2((- 3),(0))* t1). rgb;vec3 D0 = texture(Source, vTexCoord + vec2((- 2),(0))* t1). rgb;vec3 D = texture(Source, vTexCoord + vec2((- 1),(0))* t1). rgb;vec3 E = texture(Source, vTexCoord + vec2((0),(0))* t1). rgb;vec3 F = texture(Source, vTexCoord + vec2((1),(0))* t1). rgb;vec3 F4 = texture(Source, vTexCoord + vec2((2),(0))* t1). rgb;vec3 F6 = texture(Source, vTexCoord + vec2((3),(0))* t1). rgb;
 vec3 G2 = texture(Source, vTexCoord + vec2((- 3),(1))* t1). rgb;vec3 G0 = texture(Source, vTexCoord + vec2((- 2),(1))* t1). rgb;vec3 G = texture(Source, vTexCoord + vec2((- 1),(1))* t1). rgb;vec3 H = texture(Source, vTexCoord + vec2((0),(1))* t1). rgb;vec3 I = texture(Source, vTexCoord + vec2((1),(1))* t1). rgb;vec3 I4 = texture(Source, vTexCoord + vec2((2),(1))* t1). rgb;vec3 I6 = texture(Source, vTexCoord + vec2((3),(1))* t1). rgb;
               vec3 G5 = texture(Source, vTexCoord + vec2((- 1),(2))* t1). rgb;vec3 H5 = texture(Source, vTexCoord + vec2((0),(2))* t1). rgb;vec3 I5 = texture(Source, vTexCoord + vec2((1),(2))* t1). rgb;
               vec3 G7 = texture(Source, vTexCoord + vec2((- 1),(3))* t1). rgb;vec3 H7 = texture(Source, vTexCoord + vec2((0),(3))* t1). rgb;vec3 I7 = texture(Source, vTexCoord + vec2((1),(3))* t1). rgb;

 mat4x3 bdhf0 = yuvT * mat4x3(B, D, H, F);
 bdhf0 = mat4x3(abs(bdhf0[0]), abs(bdhf0[1]), abs(bdhf0[2]), abs(bdhf0[3]));
 vec4 b = Yuv_weight * bdhf0;

 mat4x3 bdhf1 = yuvT * mat4x3(C, A, G, I);
 bdhf1 = mat4x3(abs(bdhf1[0]), abs(bdhf1[1]), abs(bdhf1[2]), abs(bdhf1[3]));
 vec4 c = Yuv_weight * bdhf1;

 mat4x3 bdhf2 = yuvT * mat4x3(E, E, E, E);
 bdhf2 = mat4x3(abs(bdhf2[0]), abs(bdhf2[1]), abs(bdhf2[2]), abs(bdhf2[3]));
 vec4 e = Yuv_weight * bdhf2;

 vec4 d = b . yzwx;
 vec4 f = b . wxyz;
 vec4 g = c . zwxy;
 vec4 h = b . zwxy;
 vec4 i = c . wxyz;

 mat4x3 bdhf3 = yuvT * mat4x3(I4, C1, A0, G5);
 bdhf3 = mat4x3(abs(bdhf3[0]), abs(bdhf3[1]), abs(bdhf3[2]), abs(bdhf3[3]));
 vec4 i4 = Yuv_weight * bdhf3;

 mat4x3 bdhf4 = yuvT * mat4x3(I5, C4, A1, G0);
 bdhf4 = mat4x3(abs(bdhf4[0]), abs(bdhf4[1]), abs(bdhf4[2]), abs(bdhf4[3]));
 vec4 i5 = Yuv_weight * bdhf4;

 mat4x3 bdhf5 = yuvT * mat4x3(H5, F4, B1, D0);
 bdhf5 = mat4x3(abs(bdhf5[0]), abs(bdhf5[1]), abs(bdhf5[2]), abs(bdhf5[3]));
 vec4 h5 = Yuv_weight * bdhf5;

 vec4 f4 = h5 . yzwx;
 vec4 c1 = i4 . yzwx;
 vec4 g0 = i5 . wxyz;
 vec4 b1 = h5 . zwxy;
 vec4 d0 = h5 . wxyz;

 mat4x3 bdhf6 = yuvT * mat4x3(I6, C3, A2, G7);
 bdhf6 = mat4x3(abs(bdhf6[0]), abs(bdhf6[1]), abs(bdhf6[2]), abs(bdhf6[3]));
 vec4 i6 = Yuv_weight * bdhf6;

 mat4x3 bdhf7 = yuvT * mat4x3(I7, C6, A3, G2);
 bdhf7 = mat4x3(abs(bdhf7[0]), abs(bdhf7[1]), abs(bdhf7[2]), abs(bdhf7[3]));
 vec4 i7 = Yuv_weight * bdhf7;

 mat4x3 bdhf8 = yuvT * mat4x3(H7, F6, B3, D2);
 bdhf8 = mat4x3(abs(bdhf8[0]), abs(bdhf8[1]), abs(bdhf8[2]), abs(bdhf8[3]));
 vec4 h7 = Yuv_weight * bdhf8;

 vec4 f6 = h7 . yzwx;
 vec4 c3 = i6 . yzwx;
 vec4 g2 = i7 . wxyz;
 vec4 b3 = h7 . zwxy;
 vec4 d2 = h7 . wxyz;

 interp_restriction_lv1 = and(notEqual(e, f), notEqual(e, h));
 interp_restriction_lv2_left = or(and(and(notEqual(e, g), notEqual(d, g)), eq(e, d)), eq(h, g));
 interp_restriction_lv2_up = or(and(and(notEqual(e, c), notEqual(b, c)), eq(e, b)), eq(f, c));
 interp_restriction_lv3_left = or(and(and(notEqual(e, g0), notEqual(d0, g0)), eq(d, d0)), eq(g, g0));
 interp_restriction_lv3_up = or(and(and(notEqual(e, c1), notEqual(b1, c1)), eq(b, b1)), eq(c, c1));
 interp_restriction_lv4_left = or(and(and(notEqual(e, g2), notEqual(d2, g2)), eq(d0, d2)), eq(g0, g2));
 interp_restriction_lv4_up = or(and(and(notEqual(e, c3), notEqual(b3, c3)), eq(b1, b3)), eq(c1, c3));

 vec4 wd1 = weighted_distance(e, c, g, i, h5, f4, h, f);
 vec4 wd2 = weighted_distance(h, d, i5, f, i4, b, e, i);

 bvec4 comp1 = and(not(eq(h, d)), not(id(h, g, h, d)));
 bvec4 comp2 = and(not(eq(f, b)), not(id(f, c, f, b)));

 edr0 = and(lessThanEqual(wd1, wd2), interp_restriction_lv1);
 edr = and(lessThan(wd1, wd2), and(interp_restriction_lv1,(or(comp2, or(comp1, or(eq(e, g), eq(e, c)))))));
 edr_left = and(lessThanEqual((cf2 * df(f, g)), df(h, c)), and(interp_restriction_lv2_left, edr));
 edr_up = and(greaterThanEqual(df(f, g),(cf2 * df(h, c))), and(interp_restriction_lv2_up, edr));
 edr3_left = and(lessThanEqual((cf3 * df(f, g0)), df(h, c1)), and(interp_restriction_lv3_left, edr_left));
 edr3_up = and(greaterThanEqual(df(f, g0),(cf3 * df(h, c1))), and(interp_restriction_lv3_up, edr_up));
 edr4_left = and(lessThanEqual((cf4 * df(f, g2)), df(h, c3)), and(interp_restriction_lv4_left, edr3_left));
 edr4_up = and(greaterThanEqual(df(f, g2),(cf4 * df(h, c3))), and(interp_restriction_lv4_up, edr3_up));

 vec4 info;
 info . x =(edr0 . x == true)? 1.0 : 0.0;
 info . y =(edr0 . y == true)? 1.0 : 0.0;
 info . z =(edr0 . z == true)? 1.0 : 0.0;
 info . w =(edr0 . w == true)? 1.0 : 0.0;

 info . x =(edr . x == true)? 2.0 : info . x;
 info . y =(edr . y == true)? 2.0 : info . y;
 info . z =(edr . z == true)? 2.0 : info . z;
 info . w =(edr . w == true)? 2.0 : info . w;

 info . x = and(edr_up, not(edr_left)). x == true ? 3.0 : info . x;
 info . y = and(edr_up, not(edr_left)). y == true ? 3.0 : info . y;
 info . z = and(edr_up, not(edr_left)). z == true ? 3.0 : info . z;
 info . w = and(edr_up, not(edr_left)). w == true ? 3.0 : info . w;

 info . x = and(edr_left, not(edr_up)). x == true ? 4.0 : info . x;
 info . y = and(edr_left, not(edr_up)). y == true ? 4.0 : info . y;
 info . z = and(edr_left, not(edr_up)). z == true ? 4.0 : info . z;
 info . w = and(edr_left, not(edr_up)). w == true ? 4.0 : info . w;

 info . x = and(edr3_up, not(edr3_left)). x == true ? 5.0 : info . x;
 info . y = and(edr3_up, not(edr3_left)). y == true ? 5.0 : info . y;
 info . z = and(edr3_up, not(edr3_left)). z == true ? 5.0 : info . z;
 info . w = and(edr3_up, not(edr3_left)). w == true ? 5.0 : info . w;

 info . x = and(edr3_left, not(edr3_up)). x == true ? 6.0 : info . x;
 info . y = and(edr3_left, not(edr3_up)). y == true ? 6.0 : info . y;
 info . z = and(edr3_left, not(edr3_up)). z == true ? 6.0 : info . z;
 info . w = and(edr3_left, not(edr3_up)). w == true ? 6.0 : info . w;

 info . x = and(edr4_up, not(edr4_left)). x == true ? 7.0 : info . x;
 info . y = and(edr4_up, not(edr4_left)). y == true ? 7.0 : info . y;
 info . z = and(edr4_up, not(edr4_left)). z == true ? 7.0 : info . z;
 info . w = and(edr4_up, not(edr4_left)). w == true ? 7.0 : info . w;

 info . x = and(edr4_left, not(edr4_up)). x == true ? 8.0 : info . x;
 info . y = and(edr4_left, not(edr4_up)). y == true ? 8.0 : info . y;
 info . z = and(edr4_left, not(edr4_up)). z == true ? 8.0 : info . z;
 info . w = and(edr4_left, not(edr4_up)). w == true ? 8.0 : info . w;

 FragColor = vec4(remapTo01(info, maximo));
}
