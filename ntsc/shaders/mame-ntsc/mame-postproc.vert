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

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

