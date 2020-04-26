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

 float one_sixth = 1.0 / 6.0;
 float two_sixth = 2.0 / 6.0;
 float four_sixth = 4.0 / 6.0;
 float five_sixth = 5.0 / 6.0;

 float reduce(const vec3 color)
 {
  return dot(color, vec3(65536.0, 256.0, 1.0));
 }

 float DistYCbCr(const vec3 pixA, const vec3 pixB)
 {
  vec3 w = vec3(0.2627, 0.6780, 0.0593);
  float scaleB = 0.5 /(1.0 - w . b);
  float scaleR = 0.5 /(1.0 - w . r);
  vec3 diff = pixA - pixB;
  float Y = dot(diff, w);
  float Cb = scaleB *(diff . b - Y);
  float Cr = scaleR *(diff . r - Y);

  return sqrt(((1.0 * Y)*(1.0 * Y))+(Cb * Cb)+(Cr * Cr));
 }

 bool IsPixEqual(const vec3 pixA, const vec3 pixB)
 {
  return(DistYCbCr(pixA, pixB)< 30.0 / 255.0);
 }

 bool IsBlendingNeeded(const ivec4 blend)
 {
  return any(notEqual(blend, ivec4(0)));
 }















layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 3) in vec4 t3;
layout(location = 4) in vec4 t4;
layout(location = 5) in vec4 t5;
layout(location = 6) in vec4 t6;
layout(location = 7) in vec4 t7;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
vec2 f = fract(vTexCoord . xy * params . SourceSize . xy);








 vec3 src[25];

 src[21]= texture(Source, t1 . xw). rgb;
 src[22]= texture(Source, t1 . yw). rgb;
 src[23]= texture(Source, t1 . zw). rgb;
 src[6]= texture(Source, t2 . xw). rgb;
 src[7]= texture(Source, t2 . yw). rgb;
 src[8]= texture(Source, t2 . zw). rgb;
 src[5]= texture(Source, t3 . xw). rgb;
 src[0]= texture(Source, t3 . yw). rgb;
 src[1]= texture(Source, t3 . zw). rgb;
 src[4]= texture(Source, t4 . xw). rgb;
 src[3]= texture(Source, t4 . yw). rgb;
 src[2]= texture(Source, t4 . zw). rgb;
 src[15]= texture(Source, t5 . xw). rgb;
 src[14]= texture(Source, t5 . yw). rgb;
 src[13]= texture(Source, t5 . zw). rgb;
 src[19]= texture(Source, t6 . xy). rgb;
 src[18]= texture(Source, t6 . xz). rgb;
 src[17]= texture(Source, t6 . xw). rgb;
 src[9]= texture(Source, t7 . xy). rgb;
 src[10]= texture(Source, t7 . xz). rgb;
 src[11]= texture(Source, t7 . xw). rgb;

  float v[9];
  v[0]= reduce(src[0]);
  v[1]= reduce(src[1]);
  v[2]= reduce(src[2]);
  v[3]= reduce(src[3]);
  v[4]= reduce(src[4]);
  v[5]= reduce(src[5]);
  v[6]= reduce(src[6]);
  v[7]= reduce(src[7]);
  v[8]= reduce(src[8]);

  ivec4 blendResult = ivec4(0);








  if(((v[0]== v[1]&& v[3]== v[2])||(v[0]== v[3]&& v[1]== v[2]))== false)
  {
   float dist_03_01 = DistYCbCr(src[4], src[0])+ DistYCbCr(src[0], src[8])+ DistYCbCr(src[14], src[2])+ DistYCbCr(src[2], src[10])+(4.0 * DistYCbCr(src[3], src[1]));
   float dist_00_02 = DistYCbCr(src[5], src[3])+ DistYCbCr(src[3], src[13])+ DistYCbCr(src[7], src[1])+ DistYCbCr(src[1], src[11])+(4.0 * DistYCbCr(src[0], src[2]));
   bool dominantGradient =(3.6 * dist_03_01)< dist_00_02;
   blendResult[2]=((dist_03_01 < dist_00_02)&&(v[0]!= v[1])&&(v[0]!= v[3]))?((dominantGradient)? 2 : 1): 0;
  }







  if(((v[5]== v[0]&& v[4]== v[3])||(v[5]== v[4]&& v[0]== v[3]))== false)
  {
   float dist_04_00 = DistYCbCr(src[17], src[5])+ DistYCbCr(src[5], src[7])+ DistYCbCr(src[15], src[3])+ DistYCbCr(src[3], src[1])+(4.0 * DistYCbCr(src[4], src[0]));
   float dist_05_03 = DistYCbCr(src[18], src[4])+ DistYCbCr(src[4], src[14])+ DistYCbCr(src[6], src[0])+ DistYCbCr(src[0], src[2])+(4.0 * DistYCbCr(src[5], src[3]));
   bool dominantGradient =(3.6 * dist_05_03)< dist_04_00;
   blendResult[3]=((dist_04_00 > dist_05_03)&&(v[0]!= v[5])&&(v[0]!= v[3]))?((dominantGradient)? 2 : 1): 0;
  }







  if(((v[7]== v[8]&& v[0]== v[1])||(v[7]== v[0]&& v[8]== v[1]))== false)
  {
   float dist_00_08 = DistYCbCr(src[5], src[7])+ DistYCbCr(src[7], src[23])+ DistYCbCr(src[3], src[1])+ DistYCbCr(src[1], src[9])+(4.0 * DistYCbCr(src[0], src[8]));
   float dist_07_01 = DistYCbCr(src[6], src[0])+ DistYCbCr(src[0], src[2])+ DistYCbCr(src[22], src[8])+ DistYCbCr(src[8], src[10])+(4.0 * DistYCbCr(src[7], src[1]));
   bool dominantGradient =(3.6 * dist_07_01)< dist_00_08;
   blendResult[1]=((dist_00_08 > dist_07_01)&&(v[0]!= v[7])&&(v[0]!= v[1]))?((dominantGradient)? 2 : 1): 0;
  }







  if(((v[6]== v[7]&& v[5]== v[0])||(v[6]== v[5]&& v[7]== v[0]))== false)
  {
   float dist_05_07 = DistYCbCr(src[18], src[6])+ DistYCbCr(src[6], src[22])+ DistYCbCr(src[4], src[0])+ DistYCbCr(src[0], src[8])+(4.0 * DistYCbCr(src[5], src[7]));
   float dist_06_00 = DistYCbCr(src[19], src[5])+ DistYCbCr(src[5], src[3])+ DistYCbCr(src[21], src[7])+ DistYCbCr(src[7], src[1])+(4.0 * DistYCbCr(src[6], src[0]));
   bool dominantGradient =(3.6 * dist_05_07)< dist_06_00;
   blendResult[0]=((dist_05_07 < dist_06_00)&&(v[0]!= v[5])&&(v[0]!= v[7]))?((dominantGradient)? 2 : 1): 0;
  }

  vec3 dst[16];
  dst[0]= src[0];
  dst[1]= src[0];
  dst[2]= src[0];
  dst[3]= src[0];
  dst[4]= src[0];
  dst[5]= src[0];
  dst[6]= src[0];
  dst[7]= src[0];
  dst[8]= src[0];
  dst[9]= src[0];
  dst[10]= src[0];
  dst[11]= src[0];
  dst[12]= src[0];
  dst[13]= src[0];
  dst[14]= src[0];
  dst[15]= src[0];


  if(IsBlendingNeeded(blendResult)== true)
  {
   float dist_01_04 = DistYCbCr(src[1], src[4]);
   float dist_03_08 = DistYCbCr(src[3], src[8]);
   bool haveShallowLine =(2.2 * dist_01_04 <= dist_03_08)&&(v[0]!= v[4])&&(v[5]!= v[4]);
   bool haveSteepLine =(2.2 * dist_03_08 <= dist_01_04)&&(v[0]!= v[8])&&(v[7]!= v[8]);
   bool needBlend =(blendResult[2]!= 0);
   bool doLineBlend =(blendResult[2]>= 2 ||
          ((blendResult[1]!= 0 && ! IsPixEqual(src[0], src[4]))||
         (blendResult[3]!= 0 && ! IsPixEqual(src[0], src[8]))||
         (IsPixEqual(src[4], src[3])&& IsPixEqual(src[3], src[2])&& IsPixEqual(src[2], src[1])&& IsPixEqual(src[1], src[8])&& IsPixEqual(src[0], src[2])== false))== false);

   vec3 blendPix =(DistYCbCr(src[0], src[1])<= DistYCbCr(src[0], src[3]))? src[1]: src[3];
   dst[2]= mix(dst[2], blendPix,(needBlend && doLineBlend)?((haveShallowLine)?((haveSteepLine)? 1.0 / 3.0 : 0.25):((haveSteepLine)? 0.25 : 0.00)): 0.00);
   dst[9]= mix(dst[9], blendPix,(needBlend && doLineBlend && haveSteepLine)? 0.25 : 0.00);
   dst[10]= mix(dst[10], blendPix,(needBlend && doLineBlend && haveSteepLine)? 0.75 : 0.00);
   dst[11]= mix(dst[11], blendPix,(needBlend)?((doLineBlend)?((haveSteepLine)? 1.00 :((haveShallowLine)? 0.75 : 0.50)): 0.08677704501): 0.00);
   dst[12]= mix(dst[12], blendPix,(needBlend)?((doLineBlend)? 1.00 : 0.6848532563): 0.00);
   dst[13]= mix(dst[13], blendPix,(needBlend)?((doLineBlend)?((haveShallowLine)? 1.00 :((haveSteepLine)? 0.75 : 0.50)): 0.08677704501): 0.00);
   dst[14]= mix(dst[14], blendPix,(needBlend && doLineBlend && haveShallowLine)? 0.75 : 0.00);
   dst[15]= mix(dst[15], blendPix,(needBlend && doLineBlend && haveShallowLine)? 0.25 : 0.00);

   dist_01_04 = DistYCbCr(src[7], src[2]);
   dist_03_08 = DistYCbCr(src[1], src[6]);
   haveShallowLine =(2.2 * dist_01_04 <= dist_03_08)&&(v[0]!= v[2])&&(v[3]!= v[2]);
   haveSteepLine =(2.2 * dist_03_08 <= dist_01_04)&&(v[0]!= v[6])&&(v[5]!= v[6]);
   needBlend =(blendResult[1]!= 0);
   doLineBlend =(blendResult[1]>= 2 ||
        !((blendResult[0]!= 0 && ! IsPixEqual(src[0], src[2]))||
       (blendResult[2]!= 0 && ! IsPixEqual(src[0], src[6]))||
       (IsPixEqual(src[2], src[1])&& IsPixEqual(src[1], src[8])&& IsPixEqual(src[8], src[7])&& IsPixEqual(src[7], src[6])&& ! IsPixEqual(src[0], src[8]))));

   blendPix =(DistYCbCr(src[0], src[7])<= DistYCbCr(src[0], src[1]))? src[7]: src[1];
   dst[1]= mix(dst[1], blendPix,(needBlend && doLineBlend)?((haveShallowLine)?((haveSteepLine)? 1.0 / 3.0 : 0.25):((haveSteepLine)? 0.25 : 0.00)): 0.00);
   dst[6]= mix(dst[6], blendPix,(needBlend && doLineBlend && haveSteepLine)? 0.25 : 0.00);
   dst[7]= mix(dst[7], blendPix,(needBlend && doLineBlend && haveSteepLine)? 0.75 : 0.00);
   dst[8]= mix(dst[8], blendPix,(needBlend)?((doLineBlend)?((haveSteepLine)? 1.00 :((haveShallowLine)? 0.75 : 0.50)): 0.08677704501): 0.00);
   dst[9]= mix(dst[9], blendPix,(needBlend)?((doLineBlend)? 1.00 : 0.6848532563): 0.00);
   dst[10]= mix(dst[10], blendPix,(needBlend)?((doLineBlend)?((haveShallowLine)? 1.00 :((haveSteepLine)? 0.75 : 0.50)): 0.08677704501): 0.00);
   dst[11]= mix(dst[11], blendPix,(needBlend && doLineBlend && haveShallowLine)? 0.75 : 0.00);
   dst[12]= mix(dst[12], blendPix,(needBlend && doLineBlend && haveShallowLine)? 0.25 : 0.00);

   dist_01_04 = DistYCbCr(src[5], src[8]);
   dist_03_08 = DistYCbCr(src[7], src[4]);
   haveShallowLine =(2.2 * dist_01_04 <= dist_03_08)&&(v[0]!= v[8])&&(v[1]!= v[8]);
   haveSteepLine =(2.2 * dist_03_08 <= dist_01_04)&&(v[0]!= v[4])&&(v[3]!= v[4]);
   needBlend =(blendResult[0]!= 0);
   doLineBlend =(blendResult[0]>= 2 ||
        !((blendResult[3]!= 0 && ! IsPixEqual(src[0], src[8]))||
       (blendResult[1]!= 0 && ! IsPixEqual(src[0], src[4]))||
       (IsPixEqual(src[8], src[7])&& IsPixEqual(src[7], src[6])&& IsPixEqual(src[6], src[5])&& IsPixEqual(src[5], src[4])&& ! IsPixEqual(src[0], src[6]))));

   blendPix =(DistYCbCr(src[0], src[5])<= DistYCbCr(src[0], src[7]))? src[5]: src[7];
   dst[0]= mix(dst[0], blendPix,(needBlend && doLineBlend)?((haveShallowLine)?((haveSteepLine)? 1.0 / 3.0 : 0.25):((haveSteepLine)? 0.25 : 0.00)): 0.00);
   dst[15]= mix(dst[15], blendPix,(needBlend && doLineBlend && haveSteepLine)? 0.25 : 0.00);
   dst[4]= mix(dst[4], blendPix,(needBlend && doLineBlend && haveSteepLine)? 0.75 : 0.00);
   dst[5]= mix(dst[5], blendPix,(needBlend)?((doLineBlend)?((haveSteepLine)? 1.00 :((haveShallowLine)? 0.75 : 0.50)): 0.08677704501): 0.00);
   dst[6]= mix(dst[6], blendPix,(needBlend)?((doLineBlend)? 1.00 : 0.6848532563): 0.00);
   dst[7]= mix(dst[7], blendPix,(needBlend)?((doLineBlend)?((haveShallowLine)? 1.00 :((haveSteepLine)? 0.75 : 0.50)): 0.08677704501): 0.00);
   dst[8]= mix(dst[8], blendPix,(needBlend && doLineBlend && haveShallowLine)? 0.75 : 0.00);
   dst[9]= mix(dst[9], blendPix,(needBlend && doLineBlend && haveShallowLine)? 0.25 : 0.00);


   dist_01_04 = DistYCbCr(src[3], src[6]);
   dist_03_08 = DistYCbCr(src[5], src[2]);
   haveShallowLine =(2.2 * dist_01_04 <= dist_03_08)&&(v[0]!= v[6])&&(v[7]!= v[6]);
   haveSteepLine =(2.2 * dist_03_08 <= dist_01_04)&&(v[0]!= v[2])&&(v[1]!= v[2]);
   needBlend =(blendResult[3]!= 0);
   doLineBlend =(blendResult[3]>= 2 ||
        !((blendResult[2]!= 0 && ! IsPixEqual(src[0], src[6]))||
       (blendResult[0]!= 0 && ! IsPixEqual(src[0], src[2]))||
       (IsPixEqual(src[6], src[5])&& IsPixEqual(src[5], src[4])&& IsPixEqual(src[4], src[3])&& IsPixEqual(src[3], src[2])&& ! IsPixEqual(src[0], src[4]))));

   blendPix =(DistYCbCr(src[0], src[3])<= DistYCbCr(src[0], src[5]))? src[3]: src[5];
   dst[3]= mix(dst[3], blendPix,(needBlend && doLineBlend)?((haveShallowLine)?((haveSteepLine)? 1.0 / 3.0 : 0.25):((haveSteepLine)? 0.25 : 0.00)): 0.00);
   dst[12]= mix(dst[12], blendPix,(needBlend && doLineBlend && haveSteepLine)? 0.25 : 0.00);
   dst[13]= mix(dst[13], blendPix,(needBlend && doLineBlend && haveSteepLine)? 0.75 : 0.00);
   dst[14]= mix(dst[14], blendPix,(needBlend)?((doLineBlend)?((haveSteepLine)? 1.00 :((haveShallowLine)? 0.75 : 0.50)): 0.08677704501): 0.00);
   dst[15]= mix(dst[15], blendPix,(needBlend)?((doLineBlend)? 1.00 : 0.6848532563): 0.00);
   dst[4]= mix(dst[4], blendPix,(needBlend)?((doLineBlend)?((haveShallowLine)? 1.00 :((haveSteepLine)? 0.75 : 0.50)): 0.08677704501): 0.00);
   dst[5]= mix(dst[5], blendPix,(needBlend && doLineBlend && haveShallowLine)? 0.75 : 0.00);
   dst[6]= mix(dst[6], blendPix,(needBlend && doLineBlend && haveShallowLine)? 0.25 : 0.00);
  }

  vec3 res = mix(mix(mix(mix(dst[6], dst[7], step(0.25, f . x)), mix(dst[8], dst[9], step(0.75, f . x)), step(0.50, f . x)),
                               mix(mix(dst[5], dst[0], step(0.25, f . x)), mix(dst[1], dst[10], step(0.75, f . x)), step(0.50, f . x)), step(0.25, f . y)),
                          mix(mix(mix(dst[4], dst[3], step(0.25, f . x)), mix(dst[2], dst[11], step(0.75, f . x)), step(0.50, f . x)),
                               mix(mix(dst[15], dst[14], step(0.25, f . x)), mix(dst[13], dst[12], step(0.75, f . x)), step(0.50, f . x)), step(0.75, f . y)),
                                                                                                                                      step(0.50, f . y));

   FragColor = vec4(res, 1.0);
}
