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





vec3 bin = vec3(4.0, 2.0, 1.0);
vec4 low = vec4(- 64.0, - 64.0, - 64.0, - 64.0);
vec4 high = vec4(64.0, 64.0, 64.0, 64.0);

vec4 remapFrom01(vec4 v, vec4 low, vec4 high)
{
 return floor((mix(low, high, v))+ 0.5);
}

float c_df(vec3 c1, vec3 c2)
{
 vec3 df = abs(c1 - c2);
 return df . r + df . g + df . b;
}

vec4 unpack_info(float i)
{
 vec4 info;
 info . x = floor((modf(i / 2.0, i))+ 0.5);
 info . y = floor((modf(i / 2.0, i))+ 0.5);
 info . z = floor((modf(i / 2.0, i))+ 0.5);
 info . w = i;

 return info;
}

float df(float A, float B)
{
 return abs(A - B);
}













layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in float scale_factor;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;

void main()
{
 vec2 fp = fract(vTexCoord * params . OriginalSize . xy)- vec2(0.4999, 0.4999);

 vec2 pxcoord = floor(vTexCoord * params . OriginalSize . xy)* params . OriginalSize . zw;

 vec4 UL = texture(Source, pxcoord + 0.25 * t1 . xy + 0.25 * t1 . zw);
 vec4 UR = texture(Source, pxcoord + 0.75 * t1 . xy + 0.25 * t1 . zw);
 vec4 DL = texture(Source, pxcoord + 0.25 * t1 . xy + 0.75 * t1 . zw);
 vec4 DR = texture(Source, pxcoord + 0.75 * t1 . xy + 0.75 * t1 . zw);

 vec4 ulparam = remapFrom01(UL, low, high);
 vec4 urparam = remapFrom01(UR, low, high);
 vec4 dlparam = remapFrom01(DL, low, high);
 vec4 drparam = remapFrom01(DR, low, high);

 vec3 E = texture(Original, vTexCoord). xyz;

 vec3 ax, ay, PX, PY, PZ, PW;
 float info;
 vec2 iq;

                        info = ulparam . w;ay . z = floor((modf(info / 2.0, info))+ 0.5);ay . y = floor((modf(info / 2.0, info))+ 0.5);ay . x = floor((modf(info / 2.0, info))+ 0.5);ax . z = floor((modf(info / 2.0, info))+ 0.5);ax . y = floor((modf(info / 2.0, info))+ 0.5);ax . x = floor((info)+ 0.5);iq . x = dot(ax, bin)- 2.0;iq . y = dot(ay, bin)- 2.0;PX = texture(Original, vTexCoord + iq . x * t1 . xy + iq . y * t1 . zw). xyz;;
                        info = urparam . w;ay . z = floor((modf(info / 2.0, info))+ 0.5);ay . y = floor((modf(info / 2.0, info))+ 0.5);ay . x = floor((modf(info / 2.0, info))+ 0.5);ax . z = floor((modf(info / 2.0, info))+ 0.5);ax . y = floor((modf(info / 2.0, info))+ 0.5);ax . x = floor((info)+ 0.5);iq . x = dot(ax, bin)- 2.0;iq . y = dot(ay, bin)- 2.0;PY = texture(Original, vTexCoord + iq . x * t1 . xy + iq . y * t1 . zw). xyz;;
                        info = dlparam . w;ay . z = floor((modf(info / 2.0, info))+ 0.5);ay . y = floor((modf(info / 2.0, info))+ 0.5);ay . x = floor((modf(info / 2.0, info))+ 0.5);ax . z = floor((modf(info / 2.0, info))+ 0.5);ax . y = floor((modf(info / 2.0, info))+ 0.5);ax . x = floor((info)+ 0.5);iq . x = dot(ax, bin)- 2.0;iq . y = dot(ay, bin)- 2.0;PZ = texture(Original, vTexCoord + iq . x * t1 . xy + iq . y * t1 . zw). xyz;;
                        info = drparam . w;ay . z = floor((modf(info / 2.0, info))+ 0.5);ay . y = floor((modf(info / 2.0, info))+ 0.5);ay . x = floor((modf(info / 2.0, info))+ 0.5);ax . z = floor((modf(info / 2.0, info))+ 0.5);ax . y = floor((modf(info / 2.0, info))+ 0.5);ax . x = floor((info)+ 0.5);iq . x = dot(ax, bin)- 2.0;iq . y = dot(ay, bin)- 2.0;PW = texture(Original, vTexCoord + iq . x * t1 . xy + iq . y * t1 . zw). xyz;;

 vec3 fp1 = vec3(fp, - 1.);

 vec3 color;
 vec4 fx;

 vec4 inc = vec4(abs(ulparam . x / ulparam . y), abs(urparam . x / urparam . y), abs(dlparam . x / dlparam . y), abs(drparam . x / drparam . y));
 vec4 level = max(inc, 1.0 / inc);

 fx . x = clamp(dot(fp1, ulparam . xyz)* scale_factor /(8. * level . x)+ 0.5, 0.0, 1.0);
 fx . y = clamp(dot(fp1, urparam . xyz)* scale_factor /(8. * level . y)+ 0.5, 0.0, 1.0);
 fx . z = clamp(dot(fp1, dlparam . xyz)* scale_factor /(8. * level . z)+ 0.5, 0.0, 1.0);
 fx . w = clamp(dot(fp1, drparam . xyz)* scale_factor /(8. * level . w)+ 0.5, 0.0, 1.0);

 vec3 c1, c2, c3, c4;

 c1 = mix(E, PX, fx . x);
 c2 = mix(E, PY, fx . y);
 c3 = mix(E, PZ, fx . z);
 c4 = mix(E, PW, fx . w);

 color = c1;
 color =((c_df(c2, E)> c_df(color, E)))? c2 : color;
 color =((c_df(c3, E)> c_df(color, E)))? c3 : color;
 color =((c_df(c4, E)> c_df(color, E)))? c4 : color;

 FragColor = vec4(color, 1.0);
}
