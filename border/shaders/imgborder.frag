#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4


#pragma parameterbox_scale¡4.01.010.01.0
#pragma parameterlocation_x¡0.50.01.00.05
#pragma parameterlocation_y¡0.50.01.00.05
#pragma parameterin_res_x¡320.0100.0600.01.0
#pragma parameterin_res_y¡240.064.0512.01.0
#pragma parameterborder_on_top¡1.00.01.01.0
#pragma parameterborder_zoom_x¡1.00.04.00.01
#pragma parameterborder_zoom_y¡1.00.04.00.01




uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   uint FrameCount;
   float box_scale;
   float location_x;
   float location_y;
   float in_res_x;
   float in_res_y;
   float border_on_top;
   float border_zoom_x;
   float border_zoom_y;
   float OS_MASK_TOP;
   float OS_MASK_BOTTOM;
   float OS_MASK_LEFT;
   float OS_MASK_RIGHT;
}params;

#pragma parameterOS_MASK_TOP¡0.00.01.00.01
#pragma parameterOS_MASK_BOTTOM¡0.00.01.00.01
#pragma parameterOS_MASK_LEFT¡0.00.01.00.01
#pragma parameterOS_MASK_RIGHT¡0.00.01.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 screen_coord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;
uniform sampler2D BORDER;

void main()
{
vec4 screen = texture(Source, screen_coord);
vec4 background = vec4(texture(BORDER, vTexCoord));
if(screen_coord . x < 0.9999 - params . OS_MASK_RIGHT && screen_coord . x > 0.0001 + params . OS_MASK_LEFT && screen_coord . y < 0.9999 - params . OS_MASK_BOTTOM && screen_coord . y > 0.0001 + params . OS_MASK_TOP && params . border_on_top > 0.5)
background . a *= 0.0;
   FragColor = vec4(mix(screen, background, background . a));
}

