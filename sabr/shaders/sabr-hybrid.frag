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






















vec4 Ai = vec4(1.0, - 1.0, - 1.0, 1.0);
vec4 B45 = vec4(1.0, 1.0, - 1.0, - 1.0);
vec4 C45 = vec4(1.5, 0.5, - 0.5, 0.5);
vec4 B30 = vec4(0.5, 2.0, - 0.5, - 2.0);
vec4 C30 = vec4(1.0, 1.0, - 0.5, 0.0);
vec4 B60 = vec4(2.0, 0.5, - 2.0, - 0.5);
vec4 C60 = vec4(2.0, 0.0, - 1.0, 0.5);

vec4 M45 = vec4(0.4, 0.4, 0.4, 0.4);
vec4 M30 = vec4(0.2, 0.4, 0.2, 0.4);
vec4 M60 = M30 . yxwz;
vec4 Mshift = vec4(0.2, 0.2, 0.2, 0.2);

float coef = 2.0;

vec4 threshold = vec4(0.32, 0.32, 0.32, 0.32);

vec3 lum = vec3(0.21, 0.72, 0.07);

     vec4 lum_to(vec3 v0, vec3 v1, vec3 v2, vec3 v3){
 return vec4(dot(lum, v0), dot(lum, v1), dot(lum, v2), dot(lum, v3));
}

     vec4 lum_df(vec4 A, vec4 B){
 return abs(A - B);
}

    bvec4 lum_eq(vec4 A, vec4 B){
 return lessThan(lum_df(A, B), vec4(threshold));
}

     vec4 lum_wd(vec4 a, vec4 b, vec4 c, vec4 d, vec4 e, vec4 f, vec4 g, vec4 h){
 return lum_df(a, b)+ lum_df(a, c)+ lum_df(d, e)+ lum_df(d, f)+ 4.0 * lum_df(g, h);
}

float c_df(vec3 c1, vec3 c2){
      vec3 df = abs(c1 - c2);
 return df . r + df . g + df . b;
}


layout(location = 0) in vec2 tc;
layout(location = 1) in vec4 xyp_1_2_3;
layout(location = 2) in vec4 xyp_5_10_15;
layout(location = 3) in vec4 xyp_6_7_8;
layout(location = 4) in vec4 xyp_9_14_9;
layout(location = 5) in vec4 xyp_11_12_13;
layout(location = 6) in vec4 xyp_16_17_18;
layout(location = 7) in vec4 xyp_21_22_23;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Original;

void main()
{















      vec3 P1 = texture(Original, xyp_1_2_3 . xw). rgb;
      vec3 P2 = texture(Original, xyp_1_2_3 . yw). rgb;
      vec3 P3 = texture(Original, xyp_1_2_3 . zw). rgb;

      vec3 P6 = texture(Original, xyp_6_7_8 . xw). rgb;
      vec3 P7 = texture(Original, xyp_6_7_8 . yw). rgb;
      vec3 P8 = texture(Original, xyp_6_7_8 . zw). rgb;

      vec3 P11 = texture(Original, xyp_11_12_13 . xw). rgb;
      vec3 P12 = texture(Original, xyp_11_12_13 . yw). rgb;
      vec3 P13 = texture(Original, xyp_11_12_13 . zw). rgb;

      vec3 P16 = texture(Original, xyp_16_17_18 . xw). rgb;
      vec3 P17 = texture(Original, xyp_16_17_18 . yw). rgb;
      vec3 P18 = texture(Original, xyp_16_17_18 . zw). rgb;

      vec3 P21 = texture(Original, xyp_21_22_23 . xw). rgb;
      vec3 P22 = texture(Original, xyp_21_22_23 . yw). rgb;
      vec3 P23 = texture(Original, xyp_21_22_23 . zw). rgb;

      vec3 P5 = texture(Original, xyp_5_10_15 . xy). rgb;
      vec3 P10 = texture(Original, xyp_5_10_15 . xz). rgb;
      vec3 P15 = texture(Original, xyp_5_10_15 . xw). rgb;

      vec3 P9 = texture(Original, xyp_9_14_9 . xy). rgb;
      vec3 P14 = texture(Original, xyp_9_14_9 . xz). rgb;
      vec3 P19 = texture(Original, xyp_9_14_9 . xw). rgb;


      vec4 p7 = lum_to(P7, P11, P17, P13);
      vec4 p8 = lum_to(P8, P6, P16, P18);
      vec4 p11 = p7 . yzwx;
      vec4 p12 = lum_to(P12, P12, P12, P12);
      vec4 p13 = p7 . wxyz;
      vec4 p14 = lum_to(P14, P2, P10, P22);
      vec4 p16 = p8 . zwxy;
      vec4 p17 = p7 . zwxy;
      vec4 p18 = p8 . wxyz;
      vec4 p19 = lum_to(P19, P3, P5, P21);
      vec4 p22 = p14 . wxyz;
      vec4 p23 = lum_to(P23, P9, P1, P15);

      vec2 fp = fract(tc * params . SourceSize . xy);

      vec4 ma45 = smoothstep(C45 - M45, C45 + M45, Ai * fp . y + B45 * fp . x);
      vec4 ma30 = smoothstep(C30 - M30, C30 + M30, Ai * fp . y + B30 * fp . x);
      vec4 ma60 = smoothstep(C60 - M60, C60 + M60, Ai * fp . y + B60 * fp . x);
      vec4 marn = smoothstep(C45 - M45 + Mshift, C45 + M45 + Mshift, Ai * fp . y + B45 * fp . x);

      vec4 e45 = lum_wd(p12, p8, p16, p18, p22, p14, p17, p13);
      vec4 econt = lum_wd(p17, p11, p23, p13, p7, p19, p12, p18);
      vec4 e30 = lum_df(p13, p16);
      vec4 e60 = lum_df(p8, p17);





















      vec4 final45 = vec4(1.0);
      vec4 final30 = vec4(0.0);
      vec4 final60 = vec4(0.0);
      vec4 final36 = vec4(0.0);
      vec4 finalrn = vec4(0.0);

      vec4 px = step(lum_df(p12, p17), lum_df(p12, p13));

      vec4 mac = final36 * max(ma30, ma60)+ final30 * ma30 + final60 * ma60 + final45 * ma45 + finalrn * marn;

      vec3 res1 = P12;
 res1 = mix(res1, mix(P13, P17, px . x), mac . x);
 res1 = mix(res1, mix(P7, P13, px . y), mac . y);
 res1 = mix(res1, mix(P11, P7, px . z), mac . z);
 res1 = mix(res1, mix(P17, P11, px . w), mac . w);

      vec3 res2 = P12;
 res2 = mix(res2, mix(P17, P11, px . w), mac . w);
 res2 = mix(res2, mix(P11, P7, px . z), mac . z);
 res2 = mix(res2, mix(P7, P13, px . y), mac . y);
 res2 = mix(res2, mix(P13, P17, px . x), mac . x);

   FragColor = vec4(mix(res1, res2, step(c_df(P12, res1), c_df(P12, res2))), 1.0);
}
