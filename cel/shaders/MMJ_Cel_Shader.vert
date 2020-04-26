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
   float WhtCutoff;
   float BlkCutoff;
   float ShdLevels;
   float SatModify;
   float OtlModify;
   float ShdWeight;
}params;

#pragma parameterWhtCutoff¡0.970.501.000.01
#pragma parameterBlkCutoff¡0.030.000.500.01
#pragma parameterShdLevels¡9.01.016.01.0
#pragma parameterSatModify¡1.150.002.000.01
#pragma parameterOtlModify¡0.200.001.000.01
#pragma parameterShdWeight¡0.500.001.000.01








layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 TEX0;
layout(location = 2) out vec4 TEX1;
layout(location = 3) out vec4 TEX2;
layout(location = 4) out vec4 TEX3;

void main()
{
 gl_Position = global . MVP * Position;
 vTexCoord = TexCoord;

 TEX0 = vTexCoord . xyxy;
    vec4 offset;
    offset . xy = -(offset . zw = vec2(params . SourceSize . z, 0.0));
    TEX1 = TEX0 + offset;

    offset . xy = -(offset . zw = vec2(0.0, params . SourceSize . w));
    TEX2 = TEX0 + offset;
    TEX3 = TEX1 + offset;
}

