#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 SourceSize;
   float SCALE;
   float OUT_X;
   float OUT_Y;
}params;

#pragma parameterSCALE¡0.66670.66671.50.33333
#pragma parameterOUT_X¡1600.01600.04800.08000.0
#pragma parameterOUT_Y¡800.0800.02400.0400.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 tex_border;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D BORDER;

void main()
{
 vec4 frame = texture(Source, vTexCoord). rgba;
 vec4 border = texture(BORDER, tex_border). rgba;
 FragColor = vec4(mix(frame, border, border . a));
}
