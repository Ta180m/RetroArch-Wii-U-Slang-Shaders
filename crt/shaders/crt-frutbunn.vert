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
   float CURVATURE;
   float SCANLINES;
   float CURVED_SCANLINES;
   float LIGHT;
   float light;
   float blur;
}params;

#pragma parameterCURVATURE¡1.00.01.01.0
#pragma parameterSCANLINES¡1.00.01.01.0
#pragma parameterCURVED_SCANLINES¡1.00.01.01.0
#pragma parameterLIGHT¡1.00.01.01.0
#pragma parameterlight¡9.00.020.01.0'
#pragma parameterblur¡1.00.08.00.05

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

