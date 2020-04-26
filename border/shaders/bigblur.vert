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
   float aspect_x;
   float aspect_y;
   float border_zoom;
   float BRIGHTNESS;
   float integer_scale;
   float overscale;
   float scanline_toggle;
   float interp_toggle;
   float THICKNESS;
   float DARKNESS;
   float OS_MASK_TOP;
   float OS_MASK_BOTTOM;
   float OS_MASK_LEFT;
   float OS_MASK_RIGHT;
}params;

#pragma parameteraspect_x¡64.01.0256.1.0
#pragma parameteraspect_y¡49.01.0256.1.0
#pragma parameterborder_zoom¡1.50.5100.5
#pragma parameterBRIGHTNESS¡0.0-1.01.00.05
#pragma parameterinteger_scale¡1.00.01.01.0
#pragma parameteroverscale¡0.00.01.01.0
#pragma parameterscanline_toggle¡0.00.01.01.0
#pragma parameterinterp_toggle¡0.00.01.01.0
#pragma parameterTHICKNESS¡2.01.012.01.0
#pragma parameterDARKNESS¡0.350.01.00.05
#pragma parameterOS_MASK_TOP¡0.00.01.00.005
#pragma parameterOS_MASK_BOTTOM¡0.00.01.00.005
#pragma parameterOS_MASK_LEFT¡0.00.01.00.005
#pragma parameterOS_MASK_RIGHT¡0.00.01.00.005

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
 vec2 out_res = params . OutputSize . xy;
 vec2 corrected_size = params . SourceSize . xy * vec2(params . aspect_x / params . aspect_y, 1.0)
   * vec2(params . SourceSize . y / params . SourceSize . x, 1.0);
 float full_scale =(params . integer_scale > 0.5)? floor(params . OutputSize . y /
  params . SourceSize . y)+ params . overscale : params . OutputSize . y / params . SourceSize . y;
 vec2 scale =(params . OutputSize . xy / corrected_size)/ full_scale;
 vec2 middle = vec2(0.49999, 0.49999);
 vec2 diff = TexCoord . xy - middle;
 vTexCoord = middle + diff * scale;
 vec2 zoom_coord =(((TexCoord . xy - middle)/ params . border_zoom)* vec2(params . OutputSize . x / params . OutputSize . y, 1.0)
  / vec2(params . aspect_x / params . aspect_y, 1.0))+ middle;
 tex_border = zoom_coord;
}

