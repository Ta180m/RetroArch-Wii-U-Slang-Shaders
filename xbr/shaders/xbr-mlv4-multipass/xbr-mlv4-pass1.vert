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
mat3x3 yuv = mat3x3(0.299, 0.587, 0.114, - 0.169, - 0.331, 0.499, 0.499, - 0.418, - 0.0813);
mat3x3 yuvT = mat3x3(0.299, - 0.169, 0.499,
                                              0.587, - 0.331, - 0.418,
                                              0.114, 0.499, - 0.0813);
mat3x3 yuv_weighted = mat3x3(Yuv_weight . x * yuv[0], Yuv_weight . y * yuv[1], Yuv_weight . z * yuv[2]);
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

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 t1;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord * 1.0004;

      vec2 ps = vec2(1.0 / params . SourceSize . x, 1.0 / params . SourceSize . y);
 float dx = ps . x;
 float dy = ps . y;









 t1 = vec2(dx, dy);
}

