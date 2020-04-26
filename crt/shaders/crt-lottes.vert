#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float hardScan;
   float hardPix;
   float warpX;
   float warpY;
   float maskDark;
   float maskLight;
   float scaleInLinearGamma;
   float shadowMask;
   float brightBoost;
   float hardBloomScan;
   float hardBloomPix;
   float bloomAmount;
   float shape;
}params;

#pragma parameterhardScan¡-8.0-20.00.01.0
#pragma parameterhardPix¡-3.0-20.00.01.0
#pragma parameterwarpX¡0.0310.00.1250.01
#pragma parameterwarpY¡0.0410.00.1250.01
#pragma parametermaskDark¡0.50.02.00.1
#pragma parametermaskLight¡1.50.02.00.1
#pragma parameterscaleInLinearGamma¡1.00.01.01.0
#pragma parametershadowMask¡3.00.04.01.0
#pragma parameterbrightBoost¡1.00.02.00.05
#pragma parameterhardBloomPix¡-1.5-2.0-0.50.1
#pragma parameterhardBloomScan¡-2.0-4.0-1.00.1
#pragma parameterbloomAmount¡0.150.01.00.05
#pragma parametershape¡2.00.010.00.05

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
}














