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

float XBR_EDGE_STR = 0.0;
float XBR_WEIGHT = 0.0;
float XBR_ANTI_RINGING = 0.0;















vec3 Y = vec3(.2126, .7152, .0722);

vec3 dtt = vec3(65536., 255., 1.);

vec4 reduce4(vec3 A, vec3 B, vec3 C, vec3 D)
{
  return(dtt * mat4x3(A, B, C, D));
}

float RGBtoYUV(vec3 color)
{
  return dot(color, Y);
}

float df(float A, float B)
{
  return abs(A - B);
}

bool eq(float A, float B)
{
 return(df(A, B)< 15.0);
}











float d_wd(float b0, float b1, float c0, float c1, float c2, float d0, float d1, float d2, float d3, float e1, float e2, float e3, float f2, float f3)
{
 return(1.0 *(df(c1, c2)+ df(c1, c0)+ df(e2, e1)+ df(e2, e3))+ 0.0 *(df(d2, d3)+ df(d0, d1))+ 0.0 *(df(d1, d3)+ df(d0, d2))+ 2.0 * df(d1, d2)+ - 1.0 *(df(c0, c2)+ df(e1, e3))+ 0.0 *(df(b0, b1)+ df(f2, f3)));
}

float hv_wd(float i1, float i2, float i3, float i4, float e1, float e2, float e3, float e4)
{
 return(2.0 *(df(i1, i2)+ df(i3, i4))+ 1.0 *(df(i1, e1)+ df(i2, e2)+ df(i3, e3)+ df(i4, e4))+ 0.0 *(df(i1, e2)+ df(i3, e4)+ df(e1, i2)+ df(e3, i4)));
}

vec3 min4(vec3 a, vec3 b, vec3 c, vec3 d)
{
    return min(a, min(b, min(c, d)));
}
vec3 max4(vec3 a, vec3 b, vec3 c, vec3 d)
{
    return max(a, max(b, max(c, d)));
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord * 1.0001;
}

