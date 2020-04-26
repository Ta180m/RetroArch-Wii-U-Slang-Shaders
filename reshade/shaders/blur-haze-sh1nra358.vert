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
   float GaussStrength;
   float BloomStrength;
   float SW;
   float BRIGHT;
}params;





#pragma parameterGaussStrength¡0.300.01.00.01

#pragma parameterBloomStrength¡0.330.0001.0000.005

#pragma parameterSW¡2.01.04.00.25

#pragma parameterBRIGHT¡0.50.30.60.01


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

