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
   float DOTMASK_STRENGTH;
   float maskDark;
   float maskLight;
   float shadowMask;
}global;

#pragma parameterDOTMASK_STRENGTH¡0.30.01.00.01
#pragma parametermaskDark¡0.50.02.00.1
#pragma parametermaskLight¡1.50.02.00.1
#pragma parametershadowMask¡3.00.05.01.0



layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

