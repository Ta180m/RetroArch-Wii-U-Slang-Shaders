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

      vec2 ps = vec2(1.0 / params . SourceSize . x, 1.0 / params . SourceSize . y);
 float dx = ps . x;
 float dy = ps . y;







 t1 = vTexCoord . xxxy + vec4(- dx, 0., dx, - 2.0 * dy);
 t2 = vTexCoord . xxxy + vec4(- dx, 0., dx, - dy);
 t3 = vTexCoord . xxxy + vec4(- dx, 0., dx, 0.);
 t4 = vTexCoord . xxxy + vec4(- dx, 0., dx, dy);
 t5 = vTexCoord . xxxy + vec4(- dx, 0., dx, 2.0 * dy);
 t6 = vTexCoord . xyyy + vec4(- 2.0 * dx, - dy, 0., dy);
 t7 = vTexCoord . xyyy + vec4(2.0 * dx, - dy, 0., dy);
}

