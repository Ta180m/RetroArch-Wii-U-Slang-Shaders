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
   float VL_LO;
   float VL_HI;
   float CB_LO;
   float CB_HI;
}params;

#pragma parameterVL_LO¡1.250.010.00.05
#pragma parameterVL_HI¡1.750.010.00.05
#pragma parameterCB_LO¡5.250.025.00.05
#pragma parameterCB_HI¡5.750.025.00.05

layout(std140) uniform UBO
{
   mat4 MVP;
}global;





vec2 sigmoid(vec2 signal){
 return smoothstep(vec2(params . VL_LO, params . CB_LO), vec2(params . VL_HI, params . CB_HI), signal);
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

