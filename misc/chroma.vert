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
   float BrightenLevel;
   float BrightenAmount;
   float ContrastAmount;
   float ChromaLevel;
   float IAmount;
   float QAmount;
   float ITilt;
   float QTilt;
   float ITiltHigh;
   float QTiltHigh;
   float ITiltMid;
   float QTiltMid;
   float ITiltLow;
   float QTiltLow;
   float LumBoost;
}params;

#pragma parameterBrightenLevel¡2.01.010.01.0
#pragma parameterBrightenAmount¡0.00.01.00.1
#pragma parameterContrastAmount¡0.00.01.00.1
#pragma parameterChromaLevel¡2.01.010.01.0
#pragma parameterIAmount¡0.00.01.00.1
#pragma parameterQAmount¡0.00.01.00.1
#pragma parameterITilt¡0.50.40.60.01
#pragma parameterQTilt¡0.50.40.60.01
#pragma parameterITiltHigh¡0.50.40.60.01
#pragma parameterQTiltHigh¡0.50.40.60.01
#pragma parameterITiltMid¡0.50.40.60.01
#pragma parameterQTiltMid¡0.50.40.60.01
#pragma parameterITiltLow¡0.50.40.60.01
#pragma parameterQTiltLow¡0.50.40.60.01
#pragma parameterLumBoost¡0.00.01.00.1

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

