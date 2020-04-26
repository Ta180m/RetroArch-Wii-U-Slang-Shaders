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
vec4 eq_threshold = vec4(15.0, 15.0, 15.0, 15.0);
vec4 eq_threshold2 = vec4(5.0, 5.0, 5.0, 5.0);
vec4 eq_threshold3 = vec4(25.0, 25.0, 25.0, 25.0);
float y_weight = 48.0;
float u_weight = 7.0;
float v_weight = 6.0;
mat3x3 yuv = mat3x3(0.299, 0.587, 0.114, - 0.169, - 0.331, 0.499, 0.499, - 0.418, - 0.0813);
mat3x3 yuv_weighted = mat3x3(y_weight * yuv[0], u_weight * yuv[1], v_weight * yuv[2]);
vec4 maximo = vec4(255.0, 255.0, 255.0, 255.0);

     vec4 df(vec4 A, vec4 B)
{
 return vec4(abs(A - B));
}

    bvec4 rd(vec4 A, vec4 B, vec4 C, vec4 D)
{
    return greaterThan((df(C, D)/(df(A, B)+ 0.000000001)), vec4(2., 2., 2., 2.));
}

    bvec4 id(vec4 A, vec4 B, vec4 C, vec4 D)
{
    return greaterThan(df(C, D), df(A, B));
}

     vec4 remapTo01(vec4 v, vec4 high)
{
 return(v / high);
}

     vec4 remapFrom01(vec4 v, vec4 high)
{
 return floor((high * v)+ 0.5);
}


    bvec4 eq(vec4 A, vec4 B)
{
 return lessThan(df(A, B), eq_threshold);
}

    bvec4 eq2(vec4 A, vec4 B)
{
 return lessThan(df(A, B), eq_threshold2);
}

    bvec4 eq3(vec4 A, vec4 B)
{
 return lessThan(df(A, B), eq_threshold3);
}

     vec4 weighted_distance(vec4 a, vec4 b, vec4 c, vec4 d, vec4 e, vec4 f, vec4 g, vec4 h)
{
 return(df(a, b)+ df(a, c)+ df(d, e)+ df(d, f)+ 4.0 * df(g, h));
}

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
uniform sampler2D REF;

void main()
{
 vec4 PA = texture(Source, t2 . xw);
 vec4 PB = texture(Source, t2 . yw);
 vec4 PC = texture(Source, t2 . zw);

 vec4 PD = texture(Source, t3 . xw);
 vec4 PE = texture(Source, t3 . yw);
 vec4 PF = texture(Source, t3 . zw);

 vec4 PG = texture(Source, t4 . xw);
 vec4 PH = texture(Source, t4 . yw);
 vec4 PI = texture(Source, t4 . zw);

 vec3 A1 = texture(REF, t1 . xw). rgb;
 vec3 B1 = texture(REF, t1 . yw). rgb;
 vec3 C1 = texture(REF, t1 . zw). rgb;

 vec3 A = texture(REF, t2 . xw). rgb;
 vec3 B = texture(REF, t2 . yw). rgb;
 vec3 C = texture(REF, t2 . zw). rgb;

 vec3 D = texture(REF, t3 . xw). rgb;
 vec3 E = texture(REF, t3 . yw). rgb;
 vec3 F = texture(REF, t3 . zw). rgb;

 vec3 G = texture(REF, t4 . xw). rgb;
 vec3 H = texture(REF, t4 . yw). rgb;
 vec3 I = texture(REF, t4 . zw). rgb;

 vec3 G5 = texture(REF, t5 . xw). rgb;
 vec3 H5 = texture(REF, t5 . yw). rgb;
 vec3 I5 = texture(REF, t5 . zw). rgb;

 vec3 A0 = texture(REF, t6 . xy). rgb;
 vec3 D0 = texture(REF, t6 . xz). rgb;
 vec3 G0 = texture(REF, t6 . xw). rgb;

 vec3 C4 = texture(REF, t7 . xy). rgb;
 vec3 F4 = texture(REF, t7 . xz). rgb;
 vec3 I4 = texture(REF, t7 . xw). rgb;

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

      vec4 pe = remapFrom01(PE, maximo);
      vec4 pf = remapFrom01(PF, maximo);
      vec4 ph = remapFrom01(PH, maximo);
      vec4 pb = remapFrom01(PB, maximo);
      vec4 pd = remapFrom01(PD, maximo);

      vec4 f2 = vec4(pf . z, pb . w, pd . x, ph . y);
      vec4 h2 = vec4(ph . z, pf . w, pb . x, pd . y);
      vec4 f1 = vec4(pf . y, pb . z, pd . w, ph . x);
      vec4 h3 = vec4(ph . w, pf . x, pb . y, pd . z);

     bvec4 nbrs;

 nbrs . x =((pe . y > 1.0)||(pe . w > 1.0));
 nbrs . y =((pe . z > 1.0)||(pe . x > 1.0));
 nbrs . z =((pe . w > 1.0)||(pe . y > 1.0));
 nbrs . w =((pe . x > 1.0)||(pe . z > 1.0));

     bvec4 jag1;

 jag1 . x =((f2 . x > 1.0)||(h2 . x > 1.0));
 jag1 . y =((f2 . y > 1.0)||(h2 . y > 1.0));
 jag1 . z =((f2 . z > 1.0)||(h2 . z > 1.0));
 jag1 . w =((f2 . w > 1.0)||(h2 . w > 1.0));

     bvec4 jag2;

 jag2 . x =((f2 . x > 2.0)||(h2 . x > 2.0));
 jag2 . y =((f2 . y > 2.0)||(h2 . y > 2.0));
 jag2 . z =((f2 . z > 2.0)||(h2 . z > 2.0));
 jag2 . w =((f2 . w > 2.0)||(h2 . w > 2.0));

     bvec4 jag3;

 jag3 . x =((f2 . x > 4.0)||(h2 . x > 4.0));
 jag3 . y =((f2 . y > 4.0)||(h2 . y > 4.0));
 jag3 . z =((f2 . z > 4.0)||(h2 . z > 4.0));
 jag3 . w =((f2 . w > 4.0)||(h2 . w > 4.0));


 pe . x =(pe . x == 7.0 || pe . x == 8.0)?((jag3 . x)? pe . x :(pe . x - float(2.0))): pe . x;
 pe . y =(pe . y == 7.0 || pe . y == 8.0)?((jag3 . y)? pe . y :(pe . y - float(2.0))): pe . y;
 pe . z =(pe . z == 7.0 || pe . z == 8.0)?((jag3 . z)? pe . z :(pe . z - float(2.0))): pe . z;
 pe . w =(pe . w == 7.0 || pe . w == 8.0)?((jag3 . w)? pe . w :(pe . w - float(2.0))): pe . w;


 pe . x =(pe . x == 5.0 || pe . x == 6.0)?((jag2 . x)? pe . x :(pe . x - float(2.0))): pe . x;
 pe . y =(pe . y == 5.0 || pe . y == 6.0)?((jag2 . y)? pe . y :(pe . y - float(2.0))): pe . y;
 pe . z =(pe . z == 5.0 || pe . z == 6.0)?((jag2 . z)? pe . z :(pe . z - float(2.0))): pe . z;
 pe . w =(pe . w == 5.0 || pe . w == 6.0)?((jag2 . w)? pe . w :(pe . w - float(2.0))): pe . w;

     bvec4 jag91;

 jag91 . x =((id(h, i, e, h). x || id(i4, i, f4, i4). x)&&(f2 . x > 1.0)&&(f1 . x > 1.0));
 jag91 . y =((id(h, i, e, h). y || id(i4, i, f4, i4). y)&&(f2 . y > 1.0)&&(f1 . y > 1.0));
 jag91 . z =((id(h, i, e, h). z || id(i4, i, f4, i4). z)&&(f2 . z > 1.0)&&(f1 . z > 1.0));
 jag91 . w =((id(h, i, e, h). w || id(i4, i, f4, i4). w)&&(f2 . w > 1.0)&&(f1 . w > 1.0));

     bvec4 jag92;

 jag92 . x =((id(f, i, e, f). x || id(i5, i, h5, i5). x)&&(h2 . x > 1.0)&&(h3 . x > 1.0));
 jag92 . y =((id(f, i, e, f). y || id(i5, i, h5, i5). y)&&(h2 . y > 1.0)&&(h3 . y > 1.0));
 jag92 . z =((id(f, i, e, f). z || id(i5, i, h5, i5). z)&&(h2 . z > 1.0)&&(h3 . z > 1.0));
 jag92 . w =((id(f, i, e, f). w || id(i5, i, h5, i5). w)&&(h2 . w > 1.0)&&(h3 . w > 1.0));

 bvec4 jag93 =(rd(h, g, e, g));
 bvec4 jag94 =(rd(f, c, e, c));

     bvec4 jag9;

 jag9 . x =(!(jag91 . x && jag93 . x || jag92 . x && jag94 . x));
 jag9 . y =(!(jag91 . y && jag93 . y || jag92 . y && jag94 . y));
 jag9 . z =(!(jag91 . z && jag93 . z || jag92 . z && jag94 . z));
 jag9 . w =(!(jag91 . w && jag93 . w || jag92 . w && jag94 . w));


 pe . x =((pe . x == 0.0)||(! nbrs . x || jag1 . x)&& jag9 . x)? pe . x : float(1.0);
 pe . y =((pe . y == 0.0)||(! nbrs . y || jag1 . y)&& jag9 . y)? pe . y : float(1.0);
 pe . z =((pe . z == 0.0)||(! nbrs . z || jag1 . z)&& jag9 . z)? pe . z : float(1.0);
 pe . w =((pe . w == 0.0)||(! nbrs . w || jag1 . w)&& jag9 . w)? pe . w : float(1.0);

 FragColor = vec4(remapTo01(pe, maximo));
}
