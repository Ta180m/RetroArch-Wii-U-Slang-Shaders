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
   float Gamma;
   float Brightness;
   float Contrast;
   float Saturation;
   float HueShift;
   float HueRotation;
   float Ywidth;
   float Uwidth;
   float Vwidth;
   float TV_Pixels;
   float SizeX;
   float SizeY;
   float dark_scanline;
   float Phase_Y;
   float Phase_One;
   float Phase_Two;
}params;

#pragma parameterGamma¡2.50.010.00.03125
#pragma parameterBrightness¡0.0-1.02.00.03125
#pragma parameterContrast¡1.0-1.02.00.03125
#pragma parameterSaturation¡1.0-1.02.00.03125
#pragma parameterHueShift¡-2.5-6.06.00.015625
#pragma parameterHueRotation¡2.0-5.05.00.015625
#pragma parameterYwidth¡12.01.032.01.0
#pragma parameterUwidth¡23.01.032.01.0
#pragma parameterVwidth¡23.01.032.01.0
#pragma parameterSizeX¡256.01.04096.01.0
#pragma parameterSizeY¡240.01.04096.01.0
#pragma parameterTV_Pixels¡200.01.02400.01.0
#pragma parameterdark_scanline¡0.50.01.00.025
#pragma parameterPhase_Y¡2.00.012.00.025
#pragma parameterPhase_One¡0.00.012.00.025
#pragma parameterPhase_Two¡8.00.012.00.025
















layout(std140) uniform UBO
{
   mat4 MVP;
}global;




















































































































mat3 RGB_to_XYZ =
mat3(
 0.4306190, 0.3415419, 0.1783091,
 0.2220379, 0.7066384, 0.0713236,
 0.0201853, 0.1295504, 0.9390944
);

mat3 XYZ_to_sRGB =
mat3(
  3.2406, - 1.5372, - 0.4986,
 - 0.9689, 1.8758, 0.0415,
  0.0557, - 0.2040, 1.0570
);





float Mwidth = 24;

const int Ywidth_static = 1;
const int Uwidth_static = 1;
const int Vwidth_static = 1;

float Contrast_static = 1.;
float Saturation_static = 1.;





















float YUV_u = 0.492;
float YUV_v = 0.877;

mat3 RGB_to_YUV =
mat3(
      vec3(0.299, 0.587, 0.114),
      vec3(- 0.299, - 0.587, 0.886)* YUV_u,
      vec3(0.701, - 0.587, - 0.114)* YUV_v
);













float DeltaV = 1.;



float comb_line = 1.;




float RGB_y = Contrast_static / Ywidth_static / DeltaV;
float RGB_u = comb_line * Contrast_static * Saturation_static / YUV_u / Uwidth_static / DeltaV;
float RGB_v = comb_line * Contrast_static * Saturation_static / YUV_v / Vwidth_static / DeltaV;

mat3 YUV_to_RGB =
mat3(
      vec3(1., 1., 1.)* RGB_y,
      vec3(0., - 0.114 / 0.587, 1.)* RGB_u,
      vec3(1., - 0.299 / 0.587, 0.)* RGB_v
);

float pi = 3.1415926535897932384626433832795;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;





























































float sinn(float x)
{
 return sin(x *(pi * 2. / 24.));
}

float coss(float x)
{
 return cos(x *(pi * 2. / 24.));
}

     vec3 monitor(sampler2D tex, vec2 p)
{

 vec2 size = vec2(params . SizeX, params . SizeY);


      vec2 uv = vec2(

  p . x + p . x *(params . Ywidth / 8.)/ size . x,



  (floor(p . y * params . SourceSize . y)+ 0.5)/ params . SourceSize . y);

      vec2 sh =(params . SourceSize . xy / params . SourceSize . xy / size)* vec2(14. / 10., - 1.0);

      vec2 pc = uv * params . SourceSize . xy / params . SourceSize . xy * size * vec2(10., 1.);
 float alpha = dot(floor(vec2(pc . x, pc . y)), vec2(2., params . Phase_Y * 2.));
 alpha += params . Phase_One * 2.;







 float ustep = params . SourceSize . x / params . SourceSize . x / size . x / 10.;

 float border = params . SourceSize . x / params . SourceSize . x;
 float ss = 2.0;





 if(mod(uv . y * params . SourceSize . y / params . SourceSize . y * size . y, 2.0)> 1.)
 {



  alpha = - alpha + 12012.0;
  ss = - 2.0;
 }

 float ysum = 0., usum = 0., vsum = 0.;
 for(int i = 0;i < Mwidth;++ i)
 {
       vec4 res = texture(tex, uv);













       vec3 yuv =(res . xyz * RGB_to_YUV);
  float a1 = alpha +(params . HueShift + 2.5)* 2. - yuv . x * ss * params . HueRotation;
  float sig = yuv . x + dot(yuv . yz, sign(vec2(sinn(a1), coss(a1))));

       vec4 res1 = texture(tex, uv + sh);
       vec3 yuv1 =(res1 . xyz * RGB_to_YUV);
  float a2 =(params . HueShift + 2.5)* 2. + 12012.0 - alpha + yuv . x * ss * params . HueRotation;
  float sig1 = yuv1 . x + dot(yuv1 . yz, sign(vec2(sinn(a2), coss(a2))));



  if(i < params . Ywidth)
   ysum += sig;


  if(i < params . Uwidth)
   usum +=(sig + sig1)* sinn(alpha);
  if(i < params . Vwidth)
   vsum +=(sig - sig1)* coss(alpha);






  alpha -= ss;
  uv . x -= ustep;
 }


 ysum *= params . Contrast / params . Ywidth;
 usum *= params . Contrast * params . Saturation / params . Uwidth;
 vsum *= params . Contrast * params . Saturation / params . Vwidth;


      vec3 rgb =(YUV_to_RGB * vec3(ysum + params . Brightness * Ywidth_static, usum, vsum));






      vec3 rgb1 = clamp(rgb, 0.0, 1.0);
 rgb = pow(rgb1, vec3(params . Gamma, params . Gamma, params . Gamma));

























































      vec3 xyz1 =(rgb * RGB_to_XYZ);
      vec3 srgb = clamp((xyz1 * XYZ_to_sRGB), 0.0, 1.0);
      vec3 a1 = 12.92 * srgb;
      vec3 a2 = 1.055 * pow(srgb, vec3(1. / 2.4))- 0.055;
      vec3 ssrgb;
   ssrgb . x =(srgb . x < 0.0031308 ? a1 . x : a2 . x);
   ssrgb . y =(srgb . y < 0.0031308 ? a1 . y : a2 . y);
   ssrgb . z =(srgb . z < 0.0031308 ? a1 . z : a2 . z);
 return ssrgb;



}


     vec4 monitor_sample(sampler2D tex, vec2 p, vec2 sample_)
{





      vec2 size = params . SourceSize . xy;
      vec2 next = vec2(.25, 1.)/ size;
      vec2 f = fract(vec2(4., 1.)* size * p);
 sample_ *= vec2(4., 1.)* size;
      vec2 l;
      vec2 r;
 if(f . x + sample_ . x < 1.)
 {
  l . x = f . x + sample_ . x;
  r . x = 0.;
 }
 else
 {
  l . x = 1. - f . x;
  r . x = min(1., f . x + sample_ . x - 1.);
 }
 if(f . y + sample_ . y < 1.)
 {
  l . y = f . y + sample_ . y;
  r . y = 0.;
 }
 else
 {
  l . y = 1. - f . y;
  r . y = min(1., f . y + sample_ . y - 1.);
 }
      vec3 top = mix(monitor(tex, p), monitor(tex, p + vec2(next . x, 0.)), r . x /(l . x + r . x));
      vec3 bottom = mix(monitor(tex, p + vec2(0., next . y)), monitor(tex, p + next), r . x /(l . x + r . x));
 return vec4(mix(top, bottom, r . y /(l . y + r . y)), 1.0);
}

void main()
{



 FragColor = vec4(monitor(Source, vTexCoord), 1.);


}
