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
   float scanlines;
   float scandark;
   float deconverge;
   float pincushion;
   float hertzroll;
}params;

#pragma parameterscanlines¡1.00.01.01.0
#pragma parameterscandark¡0.1750.01.00.05
#pragma parameterdeconverge¡1.00.01.01.0
#pragma parameterpincushion¡0.00.01.01.0
#pragma parameterhertzroll¡1.00.01.01.0


vec4 Zero = vec4(0.0);
vec4 Half = vec4(0.5);
vec4 One = vec4(1.0);
vec4 Two = vec4(2.0);
vec3 Gray = vec3(0.3, 0.59, 0.11);
float Pi = 3.1415926535;
float Pi2 = 6.283185307;


vec4 A = vec4(0.5);
vec4 A2 = vec4(1.0);
vec4 B = vec4(0.5);
float P = 1.0;
float CCFrequency = 3.59754545;
float NotchUpperFrequency = 3.59754545 + 2.0;
float NotchLowerFrequency = 3.59754545 - 2.0;
float YFrequency = 6.0;
float IFrequency = 1.2;
float QFrequency = 0.6;
float NotchHalfWidth = 2.0;
float ScanTime = 52.6;
float Pi2ScanTime = 6.283185307 * 52.6;
float MaxC = 2.1183;
vec4 YTransform = vec4(0.299, 0.587, 0.114, 0.0);
vec4 ITransform = vec4(0.595716, - 0.274453, - 0.321263, 0.0);
vec4 QTransform = vec4(0.211456, - 0.522591, 0.311135, 0.0);
vec3 YIQ2R = vec3(1.0, 0.956, 0.621);
vec3 YIQ2G = vec3(1.0, - 0.272, - 0.647);
vec3 YIQ2B = vec3(1.0, - 1.106, 1.703);
vec4 MinC = vec4(- 1.1183);
vec4 CRange = vec4(3.2366);
vec4 InvCRange = vec4(1.0 / 3.2366);
float Pi2Length = Pi2 / 63.0;
vec4 NotchOffset = vec4(0.0, 1.0, 2.0, 3.0);
vec4 W = vec4(Pi2 * CCFrequency * ScanTime);


vec3 RedMatrix = vec3(1.0, 0.0, 0.0);
vec3 GrnMatrix = vec3(0.0, 1.0, 0.0);
vec3 BluMatrix = vec3(0.0, 0.0, 1.0);
vec3 DCOffset = vec3(0.0, 0.0, 0.0);
vec3 ColorScale = vec3(0.95, 0.95, 0.95);
float Saturation = 1.4;


vec3 ConvergeX = vec3(- 0.4, 0.0, 0.2);
vec3 ConvergeY = vec3(0.0, - 0.4, 0.2);
vec3 RadialConvergeX = vec3(1.0, 1.0, 1.0);
vec3 RadialConvergeY = vec3(1.0, 1.0, 1.0);


float PincushionAmount = 0.015;
float CurvatureAmount = 0.015;

float ScanlineScale = 1.0;
float ScanlineHeight = 1.0;
float ScanlineBrightScale = 1.0;
float ScanlineBrightOffset = 0.0;
float ScanlineOffset = 0.0;
vec3 Floor = vec3(0.05, 0.05, 0.05);


float SixtyHertzRate =(60.0 / 59.97 - 1.0);
float SixtyHertzScale = 0.1;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

vec4 ColorConvolution(vec2 UV, vec2 InverseRes)
{
 vec3 InPixel = texture(Source, UV). rgb;


 float RedValue = dot(InPixel, RedMatrix);
 float GrnValue = dot(InPixel, GrnMatrix);
 float BluValue = dot(InPixel, BluMatrix);
 vec3 OutColor = vec3(RedValue, GrnValue, BluValue);


 OutColor =(OutColor * ColorScale)+ DCOffset;


 float Luma = dot(OutColor, Gray);
 vec3 Chroma = OutColor - Luma;
 OutColor =(Chroma * Saturation)+ Luma;

 return vec4(OutColor, 1.0);
}

vec4 Deconverge(vec2 UV)
{
 vec2 InverseRes = 1.0 / params . SourceSize . xy;
 vec2 InverseSrcRes = 1.0 / params . OriginalSize . xy;

 vec3 CoordX = UV . x * RadialConvergeX;
 vec3 CoordY = UV . y * RadialConvergeY;

 CoordX += ConvergeX * InverseRes . x -(RadialConvergeX - 1.0)* 0.5;
 CoordY += ConvergeY * InverseRes . y -(RadialConvergeY - 1.0)* 0.5;

 float RedValue = ColorConvolution(vec2(CoordX . x, CoordY . x), InverseSrcRes). r;
 float GrnValue = ColorConvolution(vec2(CoordX . y, CoordY . y), InverseSrcRes). g;
 float BluValue = ColorConvolution(vec2(CoordX . z, CoordY . z), InverseSrcRes). b;

 if(params . deconverge > 0.5)return vec4(RedValue, GrnValue, BluValue, 1.0);
 else return vec4(texture(Source, UV));
}

vec4 ScanlinePincushion(vec2 UV)
{
 vec4 InTexel = Deconverge(UV);

 vec2 PinUnitCoord = UV * Two . xy - One . xy;
 float PincushionR2 = pow(length(PinUnitCoord), 2.0);
 vec2 PincushionCurve = PinUnitCoord * PincushionAmount * PincushionR2;
 vec2 BaseCoord = UV;
 vec2 ScanCoord = UV;

 BaseCoord *= One . xy - PincushionAmount * 0.2;
 BaseCoord += PincushionAmount * 0.1;
 BaseCoord += PincushionCurve;

 ScanCoord *= One . xy - PincushionAmount * 0.2;
 ScanCoord += PincushionAmount * 0.1;
 ScanCoord += PincushionCurve;

 vec2 CurveClipUnitCoord = UV * Two . xy - One . xy;
 float CurvatureClipR2 = pow(length(CurveClipUnitCoord), 2.0);
 vec2 CurvatureClipCurve = CurveClipUnitCoord * CurvatureAmount * CurvatureClipR2;
 vec2 ScreenClipCoord = UV;
 ScreenClipCoord -= Half . xy;
 ScreenClipCoord *= One . xy - CurvatureAmount * 0.2;
 ScreenClipCoord += Half . xy;
 ScreenClipCoord += CurvatureClipCurve;

 if(params . pincushion > 0.5){

  if(BaseCoord . x < 0.0)return vec4(0.0, 0.0, 0.0, 1.0);
  if(BaseCoord . y < 0.0)return vec4(0.0, 0.0, 0.0, 1.0);
  if(BaseCoord . x > 1.0)return vec4(0.0, 0.0, 0.0, 1.0);
  if(BaseCoord . y > 1.0)return vec4(0.0, 0.0, 0.0, 1.0);
 }


 float InnerSine = ScanCoord . y * params . OriginalSize . y * ScanlineScale;
 float ScanBrightMod = sin(InnerSine * Pi + ScanlineOffset * params . OriginalSize . y);
 float ScanBrightness = mix(1.0,(pow(ScanBrightMod * ScanBrightMod, ScanlineHeight)* ScanlineBrightScale + 1.0)* 0.5, params . scandark);
 vec3 ScanlineTexel = InTexel . rgb * ScanBrightness;


 ScanlineTexel = Floor +(One . xyz - Floor)* ScanlineTexel;
 if(params . scanlines > 0.5)return vec4(ScanlineTexel, 1.0);
 else return vec4(InTexel);
}

vec4 SixtyHertz(vec2 UV)
{
 vec4 InPixel = ScanlinePincushion(UV);
 float Milliseconds = float(params . FrameCount)* 15.0;
 float TimeStep = fract(Milliseconds * SixtyHertzRate);
 float BarPosition = 1.0 - fract(UV . y + TimeStep)* SixtyHertzScale;
 vec4 OutPixel = InPixel * BarPosition;
 if(params . hertzroll > 0.5)return OutPixel;
 else return InPixel;
}

void main()
{
 vec4 OutPixel = SixtyHertz(vTexCoord . xy);
 FragColor = OutPixel;
}
