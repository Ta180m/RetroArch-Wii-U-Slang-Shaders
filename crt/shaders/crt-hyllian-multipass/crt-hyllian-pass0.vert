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
   float SHARPNESS;
   float CRT_ANTI_RINGING;
   float InputGamma;
}params;

#pragma parameterSHARPNESS¡1.01.05.01.0
#pragma parameterCRT_ANTI_RINGING¡0.80.01.00.1
#pragma parameterInputGamma¡2.50.05.00.1





layout(std140) uniform UBO
{
   mat4 MVP;
}global;



















float B = 0.0;
float C = 0.5;

mat4 invX = mat4((- B - 6.0 * C)/ 6.0,(12.0 - 9.0 * B - 6.0 * C)/ 6.0, -(12.0 - 9.0 * B - 6.0 * C)/ 6.0,(B + 6.0 * C)/ 6.0,
                                   (3.0 * B + 12.0 * C)/ 6.0,(- 18.0 + 12.0 * B + 6.0 * C)/ 6.0,(18.0 - 15.0 * B - 12.0 * C)/ 6.0, - C,
                                   (- 3.0 * B - 6.0 * C)/ 6.0, 0.0,(3.0 * B + 6.0 * C)/ 6.0, 0.0,
                                              B / 6.0,(6.0 - 2.0 * B)/ 6.0, B / 6.0, 0.0);


layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

