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
   float eye_sep;
   float y_loc;
   float BOTH;
   float ana_zoom;
   float WIDTH;
   float HEIGHT;
   float palette;
   float warp_enable;
   float warpX;
   float warpY;
   float anaglyph_selector;
   float eye_swap;
}params;

#pragma parametereye_sep¡0.5-1.05.00.01
#pragma parametery_loc¡0.50-1.01.00.025
#pragma parameterBOTH¡1.0-2.02.00.005
#pragma parameterana_zoom¡0.75-2.02.00.05
#pragma parameterWIDTH¡3.051.07.00.05
#pragma parameterHEIGHT¡2.01.05.00.1
#pragma parameterpalette¡0.00.01.01.0
#pragma parameterwarp_enable¡1.00.01.01.0
#pragma parameterwarpX¡0.30.00.50.05
#pragma parameterwarpY¡0.30.00.50.05
#pragma parameteranaglyph_selector¡0.00.02.01.0
#pragma parametereye_swap¡0.00.01.01.0

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
   vTexCoord =((TexCoord . xy * 1.00001 - 0.5)* params . ana_zoom + 0.5)* vec2(params . WIDTH, params . HEIGHT)- vec2(params . BOTH, 0.0);
}

