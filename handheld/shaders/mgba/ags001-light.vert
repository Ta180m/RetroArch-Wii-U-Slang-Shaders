#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4












layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;

uniform Push
{
   float reflectionBrightness;
   float reflectionDistanceX;
   float reflectionDistanceY;
   float lightBrightness;
}params;

#pragma parameterreflectionBrightness¡0.070.01.00.01
#pragma parameterreflectionDistanceX¡0.0-1.01.00.005
#pragma parameterreflectionDistanceY¡0.025-1.01.00.005
#pragma parameterlightBrightness¡1.00.01.00.01

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
 gl_Position = global . MVP * Position;
 vTexCoord = TexCoord;
}

