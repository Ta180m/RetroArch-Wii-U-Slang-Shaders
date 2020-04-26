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
















vec3 Y = vec3(0.2126, 0.7152, 0.0722);



vec2 dx = vec2(0.0009765625, 0.0);
vec2 dy = vec2(0.0, 0.001953125);
vec2 x2 = vec2(0.001953125, 0.0);
vec2 y2 = vec2(0.0, 0.00390625);
vec4 xy = vec4(0.0009765625, 0.001953125, - 0.0009765625, - 0.001953125);
vec4 zw = vec4(0.001953125, 0.001953125, - 0.001953125, - 0.001953125);
vec4 wz = vec4(0.0009765625, 0.00390625, - 0.0009765625, - 0.00390625);


vec4 noteq(vec4 A, vec4 B)
{
 return vec4(notEqual(A, B));
}

vec4 not(vec4 A)
{
 return vec4(1.0)- A;
}

vec4 df(vec4 A, vec4 B)
{
    return abs(A - B);
}

vec4 eq(vec4 A, vec4 B)
{
    return vec4(lessThan(df(A, B), vec4(0.6)));
}


vec4 eq2(vec4 A, vec4 B)
{
    return vec4(lessThan(df(A, B), vec4(0.01)));
}


vec4 weighted_distance(vec4 a, vec4 b, vec4 c, vec4 d, vec4 e, vec4 f, vec4 g, vec4 h)
{
    return(df(a, b)+ df(a, c)+ df(d, e)+ df(d, f)+ 4.0 * df(g, h));
}


float df1(vec3 A, vec3 B)
{
 float rmean =(A . r + B . r)/ 2.0;
 vec3 diff = A - B;
 vec3 K = vec3(17.0 + rmean, 20.0, 3.0 - rmean);
 return sqrt(dot(K * diff, diff));
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    vec4 edr, edri, edr_left, edr_up, edr3_left, edr3_up;
    vec4 interp_restriction_lv1, interp_restriction_lv2_left, interp_restriction_lv2_up, interp_restriction_lv3_left, interp_restriction_lv3_up;
    vec4 fx, fx_left, fx_up, final_fx, fx3_left, fx3_up;
    bvec4 nc, px;

    vec2 fp = fract(vTexCoord . xy * params . SourceSize . xy);
    vec2 TexCoord_0 = vTexCoord . xy - fp * params . SourceSize . zw + 0.5 * params . SourceSize . zw;

    vec3 A = texture(Source, TexCoord_0 + xy . zw). xyz;
    vec3 B = texture(Source, TexCoord_0 - dy). xyz;
    vec3 C = texture(Source, TexCoord_0 + xy . xw). xyz;
    vec3 D = texture(Source, TexCoord_0 - dx). xyz;
    vec3 E = texture(Source, TexCoord_0). xyz;
    vec3 F = texture(Source, TexCoord_0 + dx). xyz;
    vec3 G = texture(Source, TexCoord_0 + xy . zy). xyz;
    vec3 H = texture(Source, TexCoord_0 + dy). xyz;
    vec3 I = texture(Source, TexCoord_0 + xy . xy). xyz;
    vec3 A1 = texture(Source, TexCoord_0 + wz . zw). xyz;
    vec3 C1 = texture(Source, TexCoord_0 + wz . xw). xyz;
    vec3 A0 = texture(Source, TexCoord_0 + zw . zw). xyz;
    vec3 G0 = texture(Source, TexCoord_0 + zw . zy). xyz;
    vec3 C4 = texture(Source, TexCoord_0 + zw . xw). xyz;
    vec3 I4 = texture(Source, TexCoord_0 + zw . xy). xyz;
    vec3 G5 = texture(Source, TexCoord_0 + wz . zy). xyz;
    vec3 I5 = texture(Source, TexCoord_0 + wz . xy). xyz;
    vec3 B1 = texture(Source, TexCoord_0 - y2). xyz;
    vec3 D0 = texture(Source, TexCoord_0 - x2). xyz;
    vec3 H5 = texture(Source, TexCoord_0 + y2). xyz;
    vec3 F4 = texture(Source, TexCoord_0 + x2). xyz;

    vec4 b = vec4(dot(B, Y), dot(D, Y), dot(H, Y), dot(F, Y));
    vec4 c = vec4(dot(C, Y), dot(A, Y), dot(G, Y), dot(I, Y));
    vec4 d = b . yzwx;
    vec4 e = vec4(dot(E, Y));
    vec4 f = b . wxyz;
    vec4 g = c . zwxy;
    vec4 h = b . zwxy;
    vec4 i = c . wxyz;
    vec4 i4 = vec4(dot(I4, Y), dot(C1, Y), dot(A0, Y), dot(G5, Y));
    vec4 i5 = vec4(dot(I5, Y), dot(C4, Y), dot(A1, Y), dot(G0, Y));
    vec4 h5 = vec4(dot(H5, Y), dot(F4, Y), dot(B1, Y), dot(D0, Y));
    vec4 f4 = h5 . yzwx;
    vec4 c4 = i5 . yzwx;
    vec4 g5 = i4 . wxyz;
    vec4 c1 = i4 . yzwx;
    vec4 g0 = i5 . wxyz;
    vec4 b1 = h5 . zwxy;
    vec4 d0 = h5 . wxyz;

    vec4 Ao = vec4(1.0, - 1.0, - 1.0, 1.0);
    vec4 Bo = vec4(1.0, 1.0, - 1.0, - 1.0);
    vec4 Co = vec4(1.5, 0.5, - 0.5, 0.5);
    vec4 Ax = vec4(1.0, - 1.0, - 1.0, 1.0);
    vec4 Bx = vec4(0.5, 2.0, - 0.5, - 2.0);
    vec4 Cx = vec4(1.0, 1.0, - 0.5, 0.0);
    vec4 Ay = vec4(1.0, - 1.0, - 1.0, 1.0);
    vec4 By = vec4(2.0, 0.5, - 2.0, - 0.5);
    vec4 Cy = vec4(2.0, 0.0, - 1.0, 0.5);

    vec4 Az = vec4(6.0, - 2.0, - 6.0, 2.0);
    vec4 Bz = vec4(2.0, 6.0, - 2.0, - 6.0);
    vec4 Cz = vec4(5.0, 3.0, - 3.0, - 1.0);
    vec4 Aw = vec4(2.0, - 6.0, - 2.0, 6.0);
    vec4 Bw = vec4(6.0, 2.0, - 6.0, - 2.0);
    vec4 Cw = vec4(5.0, - 1.0, - 3.0, 3.0);



    fx = vec4(greaterThan(Ao * fp . y + Bo * fp . x, Co));
    fx_left = vec4(greaterThan(Ax * fp . y + Bx * fp . x, Cx));
    fx_up = vec4(greaterThan(Ay * fp . y + By * fp . x, Cy));
    fx3_left = vec4(greaterThan(Az * fp . y + Bz * fp . x, Cz));
    fx3_up = vec4(greaterThan(Aw * fp . y + Bw * fp . x, Cw));












    interp_restriction_lv1 = sign(noteq(e, f)* noteq(e, h)*(not(eq(f, b))* not(eq(f, c))+ not(eq(h, d))* not(eq(h, g))+ eq(e, i)*(not(eq(f, f4))* not(eq(f, i4))+ not(eq(h, h5))* not(eq(h, i5)))+ eq(e, g)+ eq(e, c)));


    interp_restriction_lv2_left = noteq(e, g)* noteq(d, g);
    interp_restriction_lv2_up = noteq(e, c)* noteq(b, c);
    interp_restriction_lv3_left = eq2(g, g0)* noteq(d0, g0);
    interp_restriction_lv3_up = eq2(c, c1)* noteq(b1, c1);

    vec4 wd1 = weighted_distance(e, c, g, i, h5, f4, h, f);
    vec4 wd2 = weighted_distance(h, d, i5, f, i4, b, e, i);

    edri = vec4(lessThanEqual(wd1, wd2))* interp_restriction_lv1;
    edr = vec4(lessThan(wd1, wd2))* interp_restriction_lv1;

    vec4 w1, w2;
    w1 . x = df1(F, G);w1 . y = df1(B, I);w1 . z = df1(D, C);w1 . w = df1(H, A);
    w2 . x = df1(H, C);w2 . y = df1(F, A);w2 . z = df1(B, G);w2 . w = df1(D, I);

    edr = edr * sign(not(edri . yzwx)+ not(edri . wxyz));
    edr_left = vec4(lessThanEqual(2.0 * w1, w2))* interp_restriction_lv2_left * edr *(not(edri . yzwx)* eq(e, c));
    edr_up = vec4(greaterThanEqual(w1, 2.0 * w2))* interp_restriction_lv2_up * edr *(not(edri . wxyz)* eq(e, g));
    edr3_left = interp_restriction_lv3_left;
    edr3_up = interp_restriction_lv3_up;

    nc = bvec4(edr *(fx + edr_left *(fx_left + edr3_left * fx3_left * eq(e, c4))+ edr_up *(fx_up + edr3_up * fx3_up * eq(e, g5))));

    w1 . x = df1(E, F);w1 . y = df1(E, B);w1 . z = df1(E, D);w1 . w = df1(E, H);
    w2 = w1 . wxyz;

    px = lessThanEqual(w1, w2);

    vec3 res1 = nc . x ? px . x ? F : H : nc . y ? px . y ? B : F : nc . z ? px . z ? D : B : nc . w ? px . w ? H : D : E;
    vec3 res2 = nc . w ? px . w ? H : D : nc . z ? px . z ? D : B : nc . y ? px . y ? B : F : nc . x ? px . x ? F : H : E;

    vec2 df12;

    df12 . x = dot(abs(res1 - E), Y);
    df12 . y = dot(abs(res2 - E), Y);

    vec3 res = mix(res1, res2, step(df12 . x, df12 . y));

   FragColor = vec4(res, 1.0);
}
