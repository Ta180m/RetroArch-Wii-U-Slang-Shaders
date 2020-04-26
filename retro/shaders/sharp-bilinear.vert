#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float SHARP_BILINEAR_PRE_SCALE;
   float AUTO_PRESCALE;
}params;

#pragma parameterSHARP_BILINEAR_PRE_SCALE¡4.01.010.01.0
#pragma parameterAUTO_PRESCALE¡1.00.01.01.0

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

