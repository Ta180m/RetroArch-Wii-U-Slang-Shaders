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
   float minimum;
   float maximum;
}params;

#pragma parameterminimumí0.050.01.00.01
#pragma parametermaximumí0.080.01.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;









vec4 Ai = vec4(1.0, - 1.0, - 1.0, 1.0);
vec4 B45 = vec4(1.0, 1.0, - 1.0, - 1.0);
vec4 C45 = vec4(1.5, 0.5, - 0.5, 0.5);
vec4 B30 = vec4(0.5, 2.0, - 0.5, - 2.0);
vec4 C30 = vec4(1.0, 1.0, - 0.5, 0.0);
vec4 B60 = vec4(2.0, 0.5, - 2.0, - 0.5);
vec4 C60 = vec4(2.0, 0.0, - 1.0, 0.5);

vec4 M45 = vec4(0.4, 0.4, 0.4, 0.4);
vec4 M30 = vec4(0.2, 0.4, 0.2, 0.4);
vec4 M60 = M30 . yxwz;
vec4 Mshift = vec4(0.2);


float coef = 2.0;

vec4 threshold = vec4(0.32);


vec3 lum = vec3(0.21, 0.72, 0.07);


bvec4 _and_(bvec4 A, bvec4 B){
 return bvec4(A . x && B . x, A . y && B . y, A . z && B . z, A . w && B . w);
}


bvec4 _or_(bvec4 A, bvec4 B){
 return bvec4(A . x || B . x, A . y || B . y, A . z || B . z, A . w || B . w);
}


vec4 lum_to(vec3 v0, vec3 v1, vec3 v2, vec3 v3){
 return vec4(dot(lum, v0), dot(lum, v1), dot(lum, v2), dot(lum, v3));
}


vec4 lum_df(vec4 A, vec4 B){
 return abs(A - B);
}


bvec4 lum_eq(vec4 A, vec4 B){
 return lessThan(lum_df(A, B), threshold);
}

vec4 lum_wd(vec4 a, vec4 b, vec4 c, vec4 d, vec4 e, vec4 f, vec4 g, vec4 h){
 return lum_df(a, b)+ lum_df(a, c)+ lum_df(d, e)+ lum_df(d, f)+ 4.0 * lum_df(g, h);
}


float c_df(vec3 c1, vec3 c2){
 vec3 df = abs(c1 - c2);
 return df . r + df . g + df . b;
}


float thresh(float thr1, float thr2, float val){
 val =(val < thr1)? 0.0 : val;
 val =(val > thr2)? 1.0 : val;
 return val;
}


float avg_intensity(vec4 pix){
 return dot(pix . rgb, vec3(0.2126, 0.7152, 0.0722));
}

vec4 get_pixel(sampler2D tex, vec2 coords, float dx, float dy){
 return texture(tex, coords + vec2(dx, dy));
}


float IsEdge(sampler2D tex, vec2 coords){
  float dxtex = params . SourceSize . z;
  float dytex = params . SourceSize . w;
  int k = - 1;
  float delta;

  float pix[9];

  for(int i = - 1;i < 2;i ++){
   for(int j = - 1;j < 2;j ++){
    k ++;
    pix[k]= avg_intensity(get_pixel(tex, coords, float(i)* dxtex,
                                          float(j)* dytex));
   }
  }


  float delta_lum =(abs(pix[1]- pix[7])+
          abs(pix[5]- pix[3])+
          abs(pix[0]- pix[8])+
          abs(pix[2]- pix[6])
           )/ 4.;


































  return thresh(params . minimum, params . maximum, clamp(delta_lum, 0.0, 1.0));
}

float normpdf(in float x, in float sigma)
{
 return 0.39894 * exp(- 0.5 * x * x /(sigma * sigma))/ sigma;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 tc;
layout(location = 1) out vec4 xyp_1_2_3;
layout(location = 2) out vec4 xyp_5_10_15;
layout(location = 3) out vec4 xyp_6_7_8;
layout(location = 4) out vec4 xyp_9_14_9;
layout(location = 5) out vec4 xyp_11_12_13;
layout(location = 6) out vec4 xyp_16_17_18;
layout(location = 7) out vec4 xyp_21_22_23;

void main()
{
   gl_Position = global . MVP * Position;

    float x = params . SourceSize . z;
 float y = params . SourceSize . w;

 tc = TexCoord * vec2(1.0004, 1.0);
 xyp_1_2_3 = tc . xxxy + vec4(- x, 0.0, x, - 2.0 * y);
 xyp_6_7_8 = tc . xxxy + vec4(- x, 0.0, x, - y);
 xyp_11_12_13 = tc . xxxy + vec4(- x, 0.0, x, 0.0);
 xyp_16_17_18 = tc . xxxy + vec4(- x, 0.0, x, y);
 xyp_21_22_23 = tc . xxxy + vec4(- x, 0.0, x, 2.0 * y);
 xyp_5_10_15 = tc . xyyy + vec4(- 2.0 * x, - y, 0.0, y);
 xyp_9_14_9 = tc . xyyy + vec4(2.0 * x, - y, 0.0, y);
}

