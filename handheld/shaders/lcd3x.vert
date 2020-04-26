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
   float brighten_scanlines;
   float brighten_lcd;
}params;

#pragma parameterbrighten_scanlines¡16.01.032.00.5

#pragma parameterbrighten_lcd¡4.01.012.00.1


layout(std140) uniform UBO
{
   mat4 MVP;
}global;

vec2 omega = vec2(3.141592654)* vec2(2.0)* params . SourceSize . xy;
vec3 offsets = vec3(3.141592654)* vec3(1.0 / 2, 1.0 / 2 - 2.0 / 3, 1.0 / 2 - 4.0 / 3);

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

