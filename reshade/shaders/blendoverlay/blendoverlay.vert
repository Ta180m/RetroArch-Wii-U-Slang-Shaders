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
   float OverlayMix;
   float LUTWidth;
   float LUTHeight;
}params;

#pragma parameterOverlayMix¡1.00.01.00.05
#pragma parameterLUTWidth¡6.01.01920.01.0
#pragma parameterLUTHeight¡4.01.01920.01.0





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

