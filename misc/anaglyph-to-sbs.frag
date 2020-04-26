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

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;


vec2 Warp(vec2 pos){
  pos = pos * 2.0 - 1.0;
  pos *= vec2(1.0 +(pos . y * pos . y)* params . warpX, 1.0 +(pos . x * pos . x)* params . warpY);
  return pos * 0.5 + 0.5;}

void main()
{
 vec2 coord1 =(params . warp_enable > 0.5)? Warp((vTexCoord . xy - vec2(params . eye_sep, params . y_loc))):(vTexCoord . xy - vec2(params . eye_sep, params . y_loc));
 vec2 coord2 =(params . warp_enable > 0.5)? Warp((vTexCoord . xy + vec2(params . eye_sep, - params . y_loc))):(vTexCoord . xy + vec2(params . eye_sep, - params . y_loc));

 vec4 frame1;
 vec4 frame2;
if(params . eye_swap < 0.5){
 frame1 = texture(Source, coord1);
 frame2 = texture(Source, coord2);}
else {
 frame1 = texture(Source, coord2);
 frame2 = texture(Source, coord1);}

if(params . anaglyph_selector == 0.0){
 frame1 . rgb = vec3(frame1 . r);
 frame2 . rgb = vec3(max(frame2 . g, frame2 . b));}
else if(params . anaglyph_selector == 1.0){
 frame1 . rgb = vec3(max(frame1 . r, frame1 . b));
 frame2 . rgb = vec3(frame2 . g);}
else {
 frame1 . rgb = vec3(max(frame1 . r, frame1 . g));
 frame2 . rgb = vec3(frame2 . b);}

if(params . palette > 0.5)
 FragColor = frame1 + frame2;
else
 FragColor = vec4(frame1 . r + frame2 . r, 0.0, 0.0, 1.0);
}
