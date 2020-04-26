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

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

