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

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 tex_border;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Reference;

vec4 scanlines(vec4 frame, vec2 coord, vec2 texture_size, vec2
 video_size, vec2 output_size)
{
 float lines = fract(coord . y * texture_size . y);
 float scale_factor = floor((output_size . y / video_size . y)+ 0.4999);
    float lightness = 1.0 - params . DARKNESS;
 return(params . scanline_toggle > 0.5 &&(lines <(1.0 / scale_factor * params . THICKNESS)))
  ? frame * vec4(lightness, lightness, lightness, lightness): frame;
}

vec2 interp_coord(vec2 coord, vec2 texture_size)
{
 vec2 p = coord . xy;
 p = p * texture_size . xy + vec2(0.5, 0.5);
 vec2 i = floor(p);
 vec2 f = p - i;

 f = f * f * f * f *(f *(f *(- 20.0 * f + vec2(70.0, 70.0))- vec2(84.0, 84.0))+ vec2(35.0, 35.0));
 p = i + f;
 p =(p - vec2(0.5, 0.5))* 1.0 / texture_size;
 return p;
}

vec4 border(vec2 texture_size, vec2 video_size, vec2 output_size,
 float frame_count, vec2 tex, sampler2D decal, vec2 tex_border, sampler2D ORIG)
{
 vec4 effect = texture(decal, tex_border);
 effect += vec4(vec3(params . BRIGHTNESS), effect . w);

 vec2 coord =(params . interp_toggle < 0.5)? tex : interp_coord(tex, texture_size);
 vec4 frame = texture(ORIG, coord);
 frame = scanlines(frame, tex, texture_size, video_size, output_size);
 vec2 fragcoord =(coord . xy);
 if(fragcoord . x < 1.0 - params . OS_MASK_RIGHT && fragcoord . x > 0.0 + params . OS_MASK_LEFT &&
  fragcoord . y < 1.0 - params . OS_MASK_BOTTOM && fragcoord . y > 0.0 + params . OS_MASK_TOP)
   return frame;

 else return effect;
}

void main()
{
 FragColor = border(params . SourceSize . xy, params . SourceSize . xy, params . OutputSize . xy,
  float(params . FrameCount), vTexCoord, Source, tex_border, Reference);
}
