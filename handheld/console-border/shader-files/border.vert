#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4





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
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

#pragma parameterbox_scale¡4.01.010.01.0
#pragma parameterlocation_x¡0.50.01.00.05
#pragma parameterlocation_y¡0.50.01.00.05
#pragma parameterin_res_x¡320.0100.0600.01.0
#pragma parameterin_res_y¡240.064.0512.01.0
#pragma parameterborder_on_top¡1.00.01.01.0
#pragma parameterborder_zoom_x¡1.00.04.00.01
#pragma parameterborder_zoom_y¡1.00.04.00.01

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 screen_coord;

void main()
{
   gl_Position = global . MVP * Position;
   vec2 corrected_size = vec2(params . in_res_x, params . in_res_y);
   vec2 scale =(params . OutputSize . xy / corrected_size)/ params . box_scale;
   vec2 middle = vec2(params . location_x, params . location_y);
   vec2 diff = TexCoord . xy - middle;
   screen_coord = middle + diff * scale;
   middle = vec2(0.4999, 0.4999);
   vTexCoord = middle + diff * vec2(params . border_zoom_x, params . border_zoom_y);
}

