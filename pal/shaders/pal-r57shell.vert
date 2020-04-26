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

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

