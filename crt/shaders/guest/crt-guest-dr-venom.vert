#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4
























uniform Push
{
   vec4 SourceSize;
   vec4 OutputSize;
   float TATE;
   float IOS;
   float OS;
   float BLOOM;
   float brightboost;
   float saturation;
   float gsl;
   float scanline;
   float beam_min;
   float beam_max;
   float h_sharp;
   float s_sharp;
   float csize;
   float warpX;
   float warpY;
   float glow;
   float shadowMask;
   float maskDark;
   float maskLight;
   float CGWG;
   float GTW;
   float gamma_out;
}params;

#pragma parameterTATE¡0.00.01.01.0

#pragma parameterIOS¡0.00.01.01.0

#pragma parameterOS¡2.00.02.01.0

#pragma parameterBLOOM¡0.00.020.01.0

#pragma parameterbrightboost¡1.100.502.000.01

#pragma parametersaturation¡1.00.12.00.05

#pragma parametergsl¡0.00.01.01.0

#pragma parameterscanline¡8.01.012.01.0

#pragma parameterbeam_min¡1.300.52.00.05

#pragma parameterbeam_max¡1.00.52.00.05

#pragma parameterh_sharp¡5.01.520.00.25

#pragma parameters_sharp¡0.00.00.200.01

#pragma parametercsize¡0.00.00.050.01

#pragma parameterwarpX¡0.00.00.1250.01

#pragma parameterwarpY¡0.00.00.1250.01

#pragma parameterglow¡0.040.00.50.01

#pragma parametershadowMask¡0.0-1.05.01.0

#pragma parametermaskDark¡0.50.02.00.1

#pragma parametermaskLight¡1.50.02.00.1

#pragma parameterCGWG¡0.40.01.00.05

#pragma parameterGTW¡1.100.51.50.01

#pragma parametergamma_out¡2.41.03.00.05


layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord * 1.0001;
}

