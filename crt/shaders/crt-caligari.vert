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
   float SPOT_WIDTH;
   float SPOT_HEIGHT;
   float COLOR_BOOST;
   float InputGamma;
   float OutputGamma;
}params;



#pragma parameterSPOT_WIDTH¡0.90.11.50.05
#pragma parameterSPOT_HEIGHT¡0.650.11.50.05

#pragma parameterCOLOR_BOOST¡1.451.02.00.05

#pragma parameterInputGamma¡2.40.05.00.1
#pragma parameterOutputGamma¡2.20.05.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 onex;
layout(location = 2) out vec2 oney;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
   onex = vec2(params . SourceSize . z, 0.0);
   oney = vec2(0.0, params . SourceSize . w);
}

