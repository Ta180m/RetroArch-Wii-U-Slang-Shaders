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




layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 3) in vec4 t3;
layout(location = 4) in vec4 t4;
layout(location = 5) in vec4 t5;
layout(location = 6) in vec4 t6;
layout(location = 7) in vec4 t7;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

float coef = 2.0;
float cf = 4.0;
vec4 eq_threshold = vec4(15.0, 15.0, 15.0, 15.0);
float y_weight = 48.0;
float u_weight = 7.0;
float v_weight = 6.0;
mat3 yuv = mat3(0.299, 0.587, 0.114, - 0.169, - 0.331, 0.499, 0.499, - 0.418, - 0.0813);
mat3 yuv_weighted = mat3(y_weight * yuv[0], u_weight * yuv[1], v_weight * yuv[2]);
vec4 bin1 = vec4(1.0, 2.0, 4.0, 8.0);
vec4 bin2 = vec4(16.0, 32.0, 64.0, 128.0);
vec4 maximo = vec4(255.0, 255.0, 255.0, 255.0);

vec4 df(vec4 A, vec4 B)
{
 return vec4(abs(A - B));
}

vec4 remapTo01(vec4 v, vec4 high)
{
 return(v / high);
}

vec4 remapFrom01(vec4 v, vec4 high)
{
 return(high * v + vec4(0.5, 0.5, 0.5, 0.5));
}

bvec4 eq(vec4 A, vec4 B)
{
 return lessThan(df(A, B), eq_threshold);
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













































void main()
{
 bvec4 edr, edr_left, edr_up, edr3_left, edr3_up, px;
 bvec4 interp_restriction_lv1, interp_restriction_lv2_left, interp_restriction_lv2_up;
 bvec4 interp_restriction_lv3_left, interp_restriction_lv3_up;
 bvec2 px0, px1, px2, px3;
 bvec4 lin0, lin1, lin2, lin3;


 vec3 A1 = texture(Source, t1 . xw). rgb;
 vec3 B1 = texture(Source, t1 . yw). rgb;
 vec3 C1 = texture(Source, t1 . zw). rgb;

 vec3 A = texture(Source, t2 . xw). rgb;
 vec3 B = texture(Source, t2 . yw). rgb;
 vec3 C = texture(Source, t2 . zw). rgb;

 vec3 D = texture(Source, t3 . xw). rgb;
 vec3 E = texture(Source, t3 . yw). rgb;
 vec3 F = texture(Source, t3 . zw). rgb;

 vec3 G = texture(Source, t4 . xw). rgb;
 vec3 H = texture(Source, t4 . yw). rgb;
 vec3 I = texture(Source, t4 . zw). rgb;

 vec3 G5 = texture(Source, t5 . xw). rgb;
 vec3 H5 = texture(Source, t5 . yw). rgb;
 vec3 I5 = texture(Source, t5 . zw). rgb;

 vec3 A0 = texture(Source, t6 . xy). rgb;
 vec3 D0 = texture(Source, t6 . xz). rgb;
 vec3 G0 = texture(Source, t6 . xw). rgb;

 vec3 C4 = texture(Source, t7 . xy). rgb;
 vec3 F4 = texture(Source, t7 . xz). rgb;
 vec3 I4 = texture(Source, t7 . xw). rgb;

 vec4 b =(yuv_weighted[0]* mat4x3(B, D, H, F));
 vec4 c =(yuv_weighted[0]* mat4x3(C, A, G, I));
 vec4 e =(yuv_weighted[0]* mat4x3(E, E, E, E));
 vec4 d = b . yzwx;
 vec4 f = b . wxyz;
 vec4 g = c . zwxy;
 vec4 h = b . zwxy;
 vec4 i = c . wxyz;

 vec4 i4 =(yuv_weighted[0]* mat4x3(I4, C1, A0, G5));
 vec4 i5 =(yuv_weighted[0]* mat4x3(I5, C4, A1, G0));
 vec4 h5 =(yuv_weighted[0]* mat4x3(H5, F4, B1, D0));
 vec4 f4 = h5 . yzwx;

 vec4 c1 = i4 . yzwx;
 vec4 g0 = i5 . wxyz;
 vec4 b1 = h5 . zwxy;
 vec4 d0 = h5 . wxyz;


 bvec4 interp_restriction_lv0 = and(notEqual(e, f), notEqual(e, h));
 bvec4 comp1 = and(not(eq(h, h5)), not(eq(h, i5)));
 bvec4 comp2 = and(not(eq(h, d)), not(eq(h, g)));
 bvec4 comp3 = and(not(eq(f, f4)), not(eq(f, i4)));
 bvec4 comp4 = and(not(eq(f, b)), not(eq(f, c)));
 bvec4 comp5 = and(eq(e, i), or(comp3, comp1));
 interp_restriction_lv1 = or(comp4, or(comp2, or(comp5, or(eq(e, g), eq(e, c)))));
 interp_restriction_lv2_left = and(notEqual(e, g), notEqual(d, g));
 interp_restriction_lv2_up = and(notEqual(e, c), notEqual(b, c));
 interp_restriction_lv3_left = and(notEqual(e, g0), notEqual(d0, g0));
 interp_restriction_lv3_up = and(notEqual(e, c1), notEqual(b1, c1));

 bvec4 edr0 = and(lessThan(weighted_distance(e, c, g, i, h5, f4, h, f), weighted_distance(h, d, i5, f, i4, b, e, i)), interp_restriction_lv0);

 edr = and(edr0, interp_restriction_lv1);
 edr_left = and(lessThanEqual((coef * df(f, g)), df(h, c)), and(interp_restriction_lv2_left, edr));
 edr_up = and(greaterThanEqual(df(f, g),(coef * df(h, c))), and(interp_restriction_lv2_up, edr));
 edr3_left = and(lessThanEqual((cf * df(f, g0)), df(h, c1)), and(interp_restriction_lv3_left, edr_left));
 edr3_up = and(greaterThanEqual(df(f, g0),(cf * df(h, c1))), and(interp_restriction_lv3_up, edr_up));

 px = lessThanEqual(df(e, f), df(e, h));

 lin0 = lin1 = lin2 = lin3 = bvec4(1, 1, 1, 1);

                                                                                                          if(edr_left . x &&(! edr_up . x)){ px0 = bvec2(0, px . x);px3 = bvec2(px . x, 1);if(edr3_left . x){ lin0 = bvec4(0, 1, 0, 0);lin3 = bvec4(1, 0, 0, 0);} else { lin0 = bvec4(0, 0, 1, 0);lin3 = bvec4(0, 1, 1, 0);} } else if(edr_up . x &&(! edr_left . x)){ px0 = bvec2(false, px . x);px1 = bvec2(! px . x, false);if(edr3_up . x){ lin0 = bvec4(0, 1, 0, 1);lin1 = bvec4(1, 0, 0, 1);} else { lin0 = bvec4(0, 0, 1, 1);lin1 = bvec4(0, 1, 1, 1);} } else if(edr . x){ edr_left . x = edr_up . x = edr3_left . x = edr3_up . x = false;px0 = bvec2(false, px . x);lin0 = bvec4(0, 0, 0, 1);} else if(edr0 . x){ edr_left . x = edr_up . x = edr3_left . x = edr3_up . x = false;px0 = bvec2(false, px . x);lin0 = bvec4(0, 0, 0, 0);};
                                                                                                          if(edr_left . y &&(! edr_up . y)){ px1 = bvec2(0, px . y);px0 = bvec2(px . y, 1);if(edr3_left . y){ lin1 = bvec4(0, 1, 0, 0);lin0 = bvec4(1, 0, 0, 0);} else { lin1 = bvec4(0, 0, 1, 0);lin0 = bvec4(0, 1, 1, 0);} } else if(edr_up . y &&(! edr_left . y)){ px1 = bvec2(false, px . y);px2 = bvec2(! px . y, false);if(edr3_up . y){ lin1 = bvec4(0, 1, 0, 1);lin2 = bvec4(1, 0, 0, 1);} else { lin1 = bvec4(0, 0, 1, 1);lin2 = bvec4(0, 1, 1, 1);} } else if(edr . y){ edr_left . y = edr_up . y = edr3_left . y = edr3_up . y = false;px1 = bvec2(false, px . y);lin1 = bvec4(0, 0, 0, 1);} else if(edr0 . y){ edr_left . y = edr_up . y = edr3_left . y = edr3_up . y = false;px1 = bvec2(false, px . y);lin1 = bvec4(0, 0, 0, 0);};
                                                                                                          if(edr_left . z &&(! edr_up . z)){ px2 = bvec2(0, px . z);px1 = bvec2(px . z, 1);if(edr3_left . z){ lin2 = bvec4(0, 1, 0, 0);lin1 = bvec4(1, 0, 0, 0);} else { lin2 = bvec4(0, 0, 1, 0);lin1 = bvec4(0, 1, 1, 0);} } else if(edr_up . z &&(! edr_left . z)){ px2 = bvec2(false, px . z);px3 = bvec2(! px . z, false);if(edr3_up . z){ lin2 = bvec4(0, 1, 0, 1);lin3 = bvec4(1, 0, 0, 1);} else { lin2 = bvec4(0, 0, 1, 1);lin3 = bvec4(0, 1, 1, 1);} } else if(edr . z){ edr_left . z = edr_up . z = edr3_left . z = edr3_up . z = false;px2 = bvec2(false, px . z);lin2 = bvec4(0, 0, 0, 1);} else if(edr0 . z){ edr_left . z = edr_up . z = edr3_left . z = edr3_up . z = false;px2 = bvec2(false, px . z);lin2 = bvec4(0, 0, 0, 0);};
                                                                                                          if(edr_left . w &&(! edr_up . w)){ px3 = bvec2(0, px . w);px2 = bvec2(px . w, 1);if(edr3_left . w){ lin3 = bvec4(0, 1, 0, 0);lin2 = bvec4(1, 0, 0, 0);} else { lin3 = bvec4(0, 0, 1, 0);lin2 = bvec4(0, 1, 1, 0);} } else if(edr_up . w &&(! edr_left . w)){ px3 = bvec2(false, px . w);px0 = bvec2(! px . w, false);if(edr3_up . w){ lin3 = bvec4(0, 1, 0, 1);lin0 = bvec4(1, 0, 0, 1);} else { lin3 = bvec4(0, 0, 1, 1);lin0 = bvec4(0, 1, 1, 1);} } else if(edr . w){ edr_left . w = edr_up . w = edr3_left . w = edr3_up . w = false;px3 = bvec2(false, px . w);lin3 = bvec4(0, 0, 0, 1);} else if(edr0 . w){ edr_left . w = edr_up . w = edr3_left . w = edr3_up . w = false;px3 = bvec2(false, px . w);lin3 = bvec4(0, 0, 0, 0);};

 vec4 info =






                         (mat4(edr3_left, edr3_up, px0 . x, px1 . x, px2 . x, px3 . x, px0 . y, px1 . y, px2 . y, px3 . y)* bin1);

 info +=





                         (mat4(lin0 . x, lin1 . x, lin2 . x, lin3 . x, lin0 . y, lin1 . y, lin2 . y, lin3 . y, lin0 . z, lin1 . z, lin2 . z, lin3 . z, lin0 . w, lin1 . w, lin2 . w, lin3 . w)* bin2);

   FragColor = vec4(remapTo01(info, maximo));
}
