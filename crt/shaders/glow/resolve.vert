#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4




uniform Push
{
   float BLOOM_STRENGTH;
   float OUTPUT_GAMMA;
   float CURVATURE;
   float moire_mitigation;
   float warpX;
   float warpY;
   float shadowMask;
   float maskDark;
   float maskLight;
}params;

#pragma parameterBLOOM_STRENGTH¡0.450.00.80.05
#pragma parameterOUTPUT_GAMMA¡2.21.82.60.02
#pragma parameterCURVATURE¡0.00.01.01.0
#pragma parametermoire_mitigation¡4.01.010.01.0
#pragma parameterwarpX¡0.0310.00.1250.01
#pragma parameterwarpY¡0.0410.00.1250.01
#pragma parametershadowMask¡0.00.04.01.0
#pragma parametermaskDark¡0.50.02.00.1
#pragma parametermaskLight¡1.50.02.00.1




layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   vec4 CRTPassSize;
   uint FrameCount;
}global;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
}

