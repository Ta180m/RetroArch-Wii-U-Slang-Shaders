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
   float XBR_EDGE_STR;
   float XBR_WEIGHT;
   float XBR_ANTI_RINGING;
}params;

#pragma parameterXBR_EDGE_STR�0.60.05.00.5
#pragma parameterXBR_WEIGHT�1.00.001.500.05
#pragma parameterXBR_ANTI_RINGING�1.00.01.01.0





layout(std140) uniform UBO
{
   mat4 MVP;
}global;















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

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{

  if(any(lessThan(fract(vTexCoord * params . SourceSize . xy / 2.0), vec2(0.5, 0.5))))
  {
   FragColor = texture(Source, vTexCoord);
  }
 else
  {
   vec2 tex =(floor(vTexCoord * params . SourceSize . xy / 2.0)+ vec2(0.5, 0.5))* 2.0 / params . SourceSize . xy;

   vec2 g1 = vec2(2.0 / params . SourceSize . x, 0.0);
   vec2 g2 = vec2(0.0, 2.0 / params . SourceSize . y);

   vec3 P0 = texture(Source, vTexCoord - g1 - g2). xyz;
   vec3 P1 = texture(Source, vTexCoord + 2.0 * g1 - g2). xyz;
   vec3 P2 = texture(Source, vTexCoord - g1 + 2.0 * g2). xyz;
   vec3 P3 = texture(Source, vTexCoord + 2.0 * g1 + 2.0 * g2). xyz;

   vec3 B = texture(Source, vTexCoord - g2). xyz;
   vec3 C = texture(Source, vTexCoord + g1 - g2). xyz;
   vec3 D = texture(Source, vTexCoord - g1). xyz;
   vec3 E = texture(Source, vTexCoord). xyz;
   vec3 F = texture(Source, vTexCoord + g1). xyz;
   vec3 G = texture(Source, vTexCoord - g1 + g2). xyz;
   vec3 H = texture(Source, vTexCoord + g2). xyz;
   vec3 I = texture(Source, vTexCoord + g1 + g2). xyz;

   vec3 F4 = texture(Source, vTexCoord + 2.0 * g1). xyz;
   vec3 I4 = texture(Source, vTexCoord + g2 + 2.0 * g1). xyz;
   vec3 H5 = texture(Source, vTexCoord + 2.0 * g2). xyz;
   vec3 I5 = texture(Source, vTexCoord + 2.0 * g2 + g1). xyz;

   vec3 F6 = texture(Source, tex + g1 + 0.25 * g1 + 0.25 * g2). xyz;
   vec3 F7 = texture(Source, tex + g1 + 0.25 * g1 - 0.25 * g2). xyz;
   vec3 F8 = texture(Source, tex + g1 - 0.25 * g1 - 0.25 * g2). xyz;
   vec3 F9 = texture(Source, tex + g1 - 0.25 * g1 + 0.25 * g2). xyz;

   vec3 H6 = texture(Source, tex + 0.25 * g1 + 0.25 * g2 + g2). xyz;
   vec3 H7 = texture(Source, tex + 0.25 * g1 - 0.25 * g2 + g2). xyz;
   vec3 H8 = texture(Source, tex - 0.25 * g1 - 0.25 * g2 + g2). xyz;
   vec3 H9 = texture(Source, tex - 0.25 * g1 + 0.25 * g2 + g2). xyz;

   vec4 f0 = reduce4(F6, F7, F8, F9);
   vec4 h0 = reduce4(H6, H7, H8, H9);

   bool block_3d =((f0 . xyz == f0 . yzw)&&(h0 . xyz == h0 . yzw));

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












   float d_edge =(d_wd(d, b, g, e, c, p2, h, f, p1, h5, i, f4, i5, i4)- d_wd(c, f4, b, f, i4, p0, e, i, p3, d, h, i5, g, h5));


   float hv_edge =(hv_wd(f, i, e, h, c, i5, b, h5)- hv_wd(e, f, h, i, d, f4, g, i4));

   float limits = params . XBR_EDGE_STR + 0.000001;
   float edge_strength = smoothstep(0.0, limits, abs(d_edge));


   vec4 w1 = vec4(-(params . XBR_WEIGHT * 1.29633 / 10.0),(params . XBR_WEIGHT * 1.29633 / 10.0)+ 0.5,(params . XBR_WEIGHT * 1.29633 / 10.0)+ 0.5, -(params . XBR_WEIGHT * 1.29633 / 10.0));
   vec4 w2 = vec4(-(params . XBR_WEIGHT * 1.75068 / 10.0 / 2.0),(params . XBR_WEIGHT * 1.75068 / 10.0 / 2.0)+ 0.25,(params . XBR_WEIGHT * 1.75068 / 10.0 / 2.0)+ 0.25, -(params . XBR_WEIGHT * 1.75068 / 10.0 / 2.0));


   vec3 c1 =(mat4x3(P2, H, F, P1)* w1);
   vec3 c2 =(mat4x3(P0, E, I, P3)* w1);
   vec3 c3 =(mat4x3(D + G, E + H, F + I, F4 + I4)* w2);
   vec3 c4 =(mat4x3(C + B, F + E, I + H, I5 + H5)* w2);

   bool ir_lv1 =(((e != f)&&(e != h))&&(! eq(f, b)&& ! eq(f, c)|| ! eq(h, d)&& ! eq(h, g)|| eq(e, i)&&(! eq(f, f4)&& ! eq(f, i4)|| ! eq(h, h5)&& ! eq(h, i5))|| eq(e, g)|| eq(e, c)));



   vec3 color = mix(mix(c1, c2, step(0.0, d_edge)), mix(c3, c4, step(0.0, hv_edge)), 1 - edge_strength);












   vec3 min_sample = min4(E, F, H, I)+(1 - params . XBR_ANTI_RINGING)* mix((P2 - H)*(F - P1),(P0 - E)*(I - P3), step(0.0, d_edge));
   vec3 max_sample = max4(E, F, H, I)-(1 - params . XBR_ANTI_RINGING)* mix((P2 - H)*(F - P1),(P0 - E)*(I - P3), step(0.0, d_edge));

   color = clamp(color, min_sample, max_sample);

   color = block_3d ? color : E;

   FragColor = vec4(color, 1.0);
  }
}
