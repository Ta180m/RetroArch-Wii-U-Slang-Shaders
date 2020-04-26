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
   float CURVE_HEIGHT;
}params;

#pragma parameterCURVE_HEIGHT¡0.80.12.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;














































float CtG(vec3 RGB){ return sqrt((1.0 / 3.0)*((RGB * RGB). r +(RGB * RGB). g +(RGB * RGB). b));}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec2 tex = vTexCoord;

 float px = params . SourceSize . z;
 float py = params . SourceSize . w;









 vec3 c19 = clamp(texture(Source, vTexCoord + vec2(- 3 * px, 0)). rgb, 0.0, 1.0);
 vec3 c21 = clamp(texture(Source, vTexCoord + vec2(- 2 * px, - py)). rgb, 0.0, 1.0);
 vec3 c10 = clamp(texture(Source, vTexCoord + vec2(- 2 * px, 0)). rgb, 0.0, 1.0);
 vec3 c20 = clamp(texture(Source, vTexCoord + vec2(- 2 * px, py)). rgb, 0.0, 1.0);
 vec3 c24 = clamp(texture(Source, vTexCoord + vec2(- px, - 2 * py)). rgb, 0.0, 1.0);
 vec3 c1 = clamp(texture(Source, vTexCoord + vec2(- px, - py)). rgb, 0.0, 1.0);
 vec3 c4 = clamp(texture(Source, vTexCoord + vec2(- px, 0)). rgb, 0.0, 1.0);
 vec3 c6 = clamp(texture(Source, vTexCoord + vec2(- px, py)). rgb, 0.0, 1.0);
 vec3 c15 = clamp(texture(Source, vTexCoord + vec2(- px, 2 * py)). rgb, 0.0, 1.0);
 vec3 c22 = clamp(texture(Source, vTexCoord + vec2(0, - 3 * py)). rgb, 0.0, 1.0);
 vec3 c9 = clamp(texture(Source, vTexCoord + vec2(0, - 2 * py)). rgb, 0.0, 1.0);
 vec3 c2 = clamp(texture(Source, vTexCoord + vec2(0, - py)). rgb, 0.0, 1.0);
 vec3 c0 = clamp(texture(Source, vTexCoord). rgb, 0.0, 1.0);
 vec3 c7 = clamp(texture(Source, vTexCoord + vec2(0, py)). rgb, 0.0, 1.0);
 vec3 c12 = clamp(texture(Source, vTexCoord + vec2(0, 2 * py)). rgb, 0.0, 1.0);
 vec3 c13 = clamp(texture(Source, vTexCoord + vec2(0, 3 * py)). rgb, 0.0, 1.0);
 vec3 c23 = clamp(texture(Source, vTexCoord + vec2(px, - 2 * py)). rgb, 0.0, 1.0);
 vec3 c3 = clamp(texture(Source, vTexCoord + vec2(px, - py)). rgb, 0.0, 1.0);
 vec3 c5 = clamp(texture(Source, vTexCoord + vec2(px, 0)). rgb, 0.0, 1.0);
 vec3 c8 = clamp(texture(Source, vTexCoord + vec2(px, py)). rgb, 0.0, 1.0);
 vec3 c14 = clamp(texture(Source, vTexCoord + vec2(px, 2 * py)). rgb, 0.0, 1.0);
 vec3 c18 = clamp(texture(Source, vTexCoord + vec2(2 * px, - py)). rgb, 0.0, 1.0);
 vec3 c11 = clamp(texture(Source, vTexCoord + vec2(2 * px, 0)). rgb, 0.0, 1.0);
 vec3 c17 = clamp(texture(Source, vTexCoord + vec2(2 * px, py)). rgb, 0.0, 1.0);
 vec3 c16 = clamp(texture(Source, vTexCoord + vec2(3 * px, 0)). rgb, 0.0, 1.0);


 vec3 blur =(2 *(c2 + c4 + c5 + c7)+(c1 + c3 + c6 + c8)+ 4 * c0)/ 16;
 float blur_Y =(blur . r *(1.0 / 3.0)+ blur . g *(1.0 / 3.0)+ blur . b *(1.0 / 3.0));








 float edge = length(abs(blur - c0)+ abs(blur - c1)+ abs(blur - c2)+ abs(blur - c3)
     + abs(blur - c4)+ abs(blur - c5)+ abs(blur - c6)+ abs(blur - c7)+ abs(blur - c8)
     + 0.25 *(abs(blur - c9)+ abs(blur - c10)+ abs(blur - c11)+ abs(blur - c12)))*(1.0 / 3.0);


 edge *= min((0.8 + 2.7 * pow(2,(- 7.4 * blur_Y))), 3.2);


 float c0_Y = CtG(c0);

 float kernel[25] = float[25](float(c0_Y), float(CtG(c1)), float(CtG(c2)), float(CtG(c3)), float(CtG(c4)), float(CtG(c5)), float(CtG(c6)), float(CtG(c7)), float(CtG(c8)), float(CtG(c9)), float(CtG(c10)), float(CtG(c11)), float(CtG(c12)), float(CtG(c13)), float(CtG(c14)), float(CtG(c15)), float(CtG(c16)), float(CtG(c17)), float(CtG(c18)), float(CtG(c19)), float(CtG(c20)), float(CtG(c21)), float(CtG(c22)), float(CtG(c23)), float(CtG(c24)));


 float mdiff_c0 = 0.03 + 4 *(abs(kernel[0]- kernel[2])+ abs(kernel[0]- kernel[4])
      + abs(kernel[0]- kernel[5])+ abs(kernel[0]- kernel[7])
      + 0.25 *(abs(kernel[0]- kernel[1])+ abs(kernel[0]- kernel[3])
      + abs(kernel[0]- kernel[6])+ abs(kernel[0]- kernel[8])));

 float mdiff_c9 =(abs(kernel[9]- kernel[2])+ abs(kernel[9]- kernel[24])
      + abs(kernel[9]- kernel[23])+ abs(kernel[9]- kernel[22])
      + 0.5 *(abs(kernel[9]- kernel[1])+ abs(kernel[9]- kernel[3])));

 float mdiff_c10 =(abs(kernel[10]- kernel[20])+ abs(kernel[10]- kernel[19])
      + abs(kernel[10]- kernel[21])+ abs(kernel[10]- kernel[4])
      + 0.5 *(abs(kernel[10]- kernel[1])+ abs(kernel[10]- kernel[6])));

 float mdiff_c11 =(abs(kernel[11]- kernel[17])+ abs(kernel[11]- kernel[5])
      + abs(kernel[11]- kernel[18])+ abs(kernel[11]- kernel[16])
      + 0.5 *(abs(kernel[11]- kernel[3])+ abs(kernel[11]- kernel[8])));

 float mdiff_c12 =(abs(kernel[12]- kernel[13])+ abs(kernel[12]- kernel[15])
      + abs(kernel[12]- kernel[7])+ abs(kernel[12]- kernel[14])
      + 0.5 *(abs(kernel[12]- kernel[6])+ abs(kernel[12]- kernel[8])));

 vec4 weights = vec4((min((mdiff_c0 / mdiff_c9), 2.0)),(min((mdiff_c0 / mdiff_c10), 2.0)),
       (min((mdiff_c0 / mdiff_c11), 2.0)),(min((mdiff_c0 / mdiff_c12), 2.0)));








 float neg_laplace =(0.25 *(kernel[2]+ kernel[4]+ kernel[5]+ kernel[7])
      +(kernel[1]+ kernel[3]+ kernel[6]+ kernel[8])
      +((kernel[9]* weights . x)+(kernel[10]* weights . y)
      +(kernel[11]* weights . z)+(kernel[12]* weights . w)))
      /(5 + weights . x + weights . y + weights . z + weights . w);


 float sharpen_val = 0.01 +(params . CURVE_HEIGHT /((params . CURVE_HEIGHT * 1.5)* pow(edge, 3.5)+ 0.5))
      -(params . CURVE_HEIGHT /(8192 * pow((edge * 2.2), 4.5)+ 0.5));


 float sharpdiff =(c0_Y - neg_laplace)*(sharpen_val * 0.8);


 for(int i = 0;i < 2;++ i)
 {
  for(int i1 = 1 + i;i1 < 25 - i;++ i1)
  {
   float temp = kernel[i1 - 1];
   kernel[i1 - 1]= min(kernel[i1 - 1], kernel[i1]);
   kernel[i1]= max(temp, kernel[i1]);
  }

  for(int i2 = 23 - i;i2 > i;-- i2)
  {
   float temp = kernel[i2 - 1];
   kernel[i2 - 1]= min(kernel[i2 - 1], kernel[i2]);
   kernel[i2]= max(temp, kernel[i2]);
  }
 }

 float nmax = max(((kernel[23]+ kernel[24])/ 2), c0_Y);
 float nmin = min(((kernel[0]+ kernel[1])/ 2), c0_Y);


 float nmax_scale = max((1 /((nmax - c0_Y)+ 0.004)), 10.0);
 float nmin_scale = max((1 /((c0_Y - nmin)+ 0.016)), 10.0);


 sharpdiff = mix((tanh((max(sharpdiff, 0.0))* nmax_scale)/ nmax_scale),(max(sharpdiff, 0.0)), 0.167)
      + mix((tanh((min(sharpdiff, 0.0))* nmin_scale)/ nmin_scale),(min(sharpdiff, 0.0)), 0.250);


   FragColor = vec4(c0 . rgbb + sharpdiff);
}
