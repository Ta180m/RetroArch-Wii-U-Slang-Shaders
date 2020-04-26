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

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 tex_border;

void main()
{
 gl_Position = global . MVP * Position;
 vec2 scale =(params . OutputSize . xy * params . SourceSize . zw)/ params . SCALE;
 vec2 middle = vec2(0.5, 0.5);
 vec2 diff = TexCoord . xy - middle;
 vTexCoord = middle + diff * scale;

 middle = vec2(0.5, 0.5);
 vec2 dist = TexCoord - middle;
 tex_border = middle + dist * params . OutputSize . xy / vec2(params . OUT_X, params . OUT_Y);
}

