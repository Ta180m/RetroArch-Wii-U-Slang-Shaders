#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4



























float XBR_EDGE_STR = 0.6;
float XBR_WEIGHT = 1.0;
float XBR_ANTI_RINGING = 1.0;

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

#pragma parameterMODE�0.00.02.01.0
#pragma parameterXBR_EDGE_SHP�0.40.03.00.1
#pragma parameterXBR_TEXTURE_SHP�1.00.02.00.1





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

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 3) in vec4 t3;
layout(location = 4) in vec4 t4;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{

 float wp1, wp2, wp3, wp4, wp5, wp6, weight1, weight2;
 if(params . MODE == 1.0)
 {
  wp1 = 1.0;
  wp2 = 0.0;
  wp3 = 0.0;
  wp4 = 0.0;
  wp5 = 0.0;
  wp6 = 0.0;

  weight1 =(XBR_WEIGHT * 1.29633 / 10.0);
  weight2 =(XBR_WEIGHT * 1.75068 / 10.0 / 2.0);
 }
 else if(params . MODE == 2.0)
 {
  wp1 = 1.0;
  wp2 = 0.0;
  wp3 = 1.0;
  wp4 = 3.0;
  wp5 = - 2.0;
  wp6 = 0.0;

  weight1 =(1.29633 / 10.0);
  weight2 =(1.75068 / 10.0 / 2.0);
 }
 else
 {
  wp1 = 1.0;
  wp2 = 0.0;
  wp3 = 2.0;
  wp4 = 3.0;
  wp5 = - 2.0;
  wp6 = 1.0;

  weight1 =(XBR_WEIGHT * 1.29633 / 10.0);
  weight2 =(XBR_WEIGHT * 1.75068 / 10.0 / 2.0);
 }


 vec3 P0 = texture(Source, t1 . xy). xyz;
 vec3 P1 = texture(Source, t1 . zy). xyz;
 vec3 P2 = texture(Source, t1 . xw). xyz;
 vec3 P3 = texture(Source, t1 . zw). xyz;

 vec3 B = texture(Source, t2 . xy). xyz;
 vec3 C = texture(Source, t2 . zy). xyz;
 vec3 H5 = texture(Source, t2 . xw). xyz;
 vec3 I5 = texture(Source, t2 . zw). xyz;

 vec3 D = texture(Source, t3 . xy). xyz;
 vec3 F4 = texture(Source, t3 . zy). xyz;
 vec3 G = texture(Source, t3 . xw). xyz;
 vec3 I4 = texture(Source, t3 . zw). xyz;

 vec3 E = texture(Source, t4 . xy). xyz;
 vec3 F = texture(Source, t4 . zy). xyz;
 vec3 H = texture(Source, t4 . xw). xyz;
 vec3 I = texture(Source, t4 . zw). xyz;

 float b = RGBtoYUV(B);
 float c = RGBtoYUV(C);
 float d = RGBtoYUV(D);
 float e = RGBtoYUV(E);
 float f = RGBtoYUV(F);
 float g = RGBtoYUV(G);
 float h = RGBtoYUV(H);
 float i = RGBtoYUV(I);

 float i4 = RGBtoYUV(I4);float p0 = RGBtoYUV(P0);
 float i5 = RGBtoYUV(I5);float p1 = RGBtoYUV(P1);
 float h5 = RGBtoYUV(H5);float p2 = RGBtoYUV(P2);
 float f4 = RGBtoYUV(F4);float p3 = RGBtoYUV(P3);












 float d_edge =(d_wd(wp1, wp2, wp3, wp4, wp5, wp6, d, b, g, e, c, p2, h, f, p1, h5, i, f4, i5, i4)- d_wd(wp1, wp2, wp3, wp4, wp5, wp6, c, f4, b, f, i4, p0, e, i, p3, d, h, i5, g, h5));


 float hv_edge =(hv_wd(wp1, wp2, wp3, wp4, wp5, wp6, f, i, e, h, c, i5, b, h5)- hv_wd(wp1, wp2, wp3, wp4, wp5, wp6, e, f, h, i, d, f4, g, i4));

 float limits = XBR_EDGE_STR + 0.000001;
 float edge_strength = smoothstep(0.0, limits, abs(d_edge));

 vec4 w1, w2;
 vec3 c3, c4;
 if(params . MODE == 2.0)
 {
  float contrast = max(max4float(df(e, f), df(e, i), df(e, h), df(f, h)), max(df(f, i), df(h, i)))/(e + 0.001);

  float wgt1 = weight1 *(smoothstep(0.0, 0.6, contrast)* params . XBR_EDGE_SHP + params . XBR_TEXTURE_SHP);
  float wgt2 = weight2 *(smoothstep(0.0, 0.6, contrast)* params . XBR_EDGE_SHP + params . XBR_TEXTURE_SHP);


  w1 = vec4(- wgt1, wgt1 + 0.5, wgt1 + 0.5, - wgt1);
  w2 = vec4(- wgt2, wgt2 + 0.25, wgt2 + 0.25, - wgt2);
  c3 =(mat4x3(P0 + 2.0 *(D + G)+ P2, B + 2.0 *(E + H)+ H5, C + 2.0 *(F + I)+ I5, P1 + 2.0 *(F4 + I4)+ P3)* w2)/ 3.0;
  c4 =(mat4x3(P0 + 2.0 *(C + B)+ P1, D + 2.0 *(F + E)+ F4, G + 2.0 *(I + H)+ I4, P2 + 2.0 *(I5 + H5)+ P3)* w2)/ 3.0;
 }
 else
 {

  w1 = vec4(- weight1, weight1 + 0.5, weight1 + 0.5, - weight1);
  w2 = vec4(- weight2, weight2 + 0.25, weight2 + 0.25, - weight2);
  c3 =(mat4x3(D + G, E + H, F + I, F4 + I4)* w2);
  c4 =(mat4x3(C + B, F + E, I + H, I5 + H5)* w2);
 }


 vec3 c1 =(mat4x3(P2, H, F, P1)* w1);
 vec3 c2 =(mat4x3(P0, E, I, P3)* w1);


 vec3 color = mix(mix(c1, c2, step(0.0, d_edge)), mix(c3, c4, step(0.0, hv_edge)), 1. - edge_strength);


 vec3 min_sample = min4(E, F, H, I)+(1. - XBR_ANTI_RINGING)* mix((P2 - H)*(F - P1),(P0 - E)*(I - P3), step(0.0, d_edge));
 vec3 max_sample = max4(E, F, H, I)-(1. - XBR_ANTI_RINGING)* mix((P2 - H)*(F - P1),(P0 - E)*(I - P3), step(0.0, d_edge));
 color = clamp(color, min_sample, max_sample);

   FragColor = vec4(color, 1.0);
}
