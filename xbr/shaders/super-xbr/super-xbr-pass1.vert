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
   float MODE;
   float XBR_EDGE_SHP;
   float XBR_TEXTURE_SHP;
}params;

#pragma parameterMODE¡0.00.02.01.0
#pragma parameterXBR_EDGE_SHP¡0.40.03.00.1
#pragma parameterXBR_TEXTURE_SHP¡1.00.02.00.1





layout(std140) uniform UBO
{
   mat4 MVP;
}global;



vec3 Y = vec3(.2126, .7152, .0722);

float RGBtoYUV(vec3 color)
{
  return dot(color, Y);
}

float df(float A, float B)
{
  return abs(A - B);
}











float d_wd(float wp1, float wp2, float wp3, float wp4, float wp5, float wp6, float b0, float b1, float c0, float c1, float c2, float d0, float d1, float d2, float d3, float e1, float e2, float e3, float f2, float f3)
{
 return(wp1 *(df(c1, c2)+ df(c1, c0)+ df(e2, e1)+ df(e2, e3))+ wp2 *(df(d2, d3)+ df(d0, d1))+ wp3 *(df(d1, d3)+ df(d0, d2))+ wp4 * df(d1, d2)+ wp5 *(df(c0, c2)+ df(e1, e3))+ wp6 *(df(b0, b1)+ df(f2, f3)));
}

float hv_wd(float wp1, float wp2, float wp3, float wp4, float wp5, float wp6, float i1, float i2, float i3, float i4, float e1, float e2, float e3, float e4)
{
 return(wp4 *(df(i1, i2)+ df(i3, i4))+ wp1 *(df(i1, e1)+ df(i2, e2)+ df(i3, e3)+ df(i4, e4))+ wp3 *(df(i1, e2)+ df(i3, e4)+ df(e1, i2)+ df(e3, i4)));
}

vec3 min4(vec3 a, vec3 b, vec3 c, vec3 d)
{
    return min(a, min(b, min(c, d)));
}
vec3 max4(vec3 a, vec3 b, vec3 c, vec3 d)
{
    return max(a, max(b, max(c, d)));
}

float max4float(float a, float b, float c, float d)
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

