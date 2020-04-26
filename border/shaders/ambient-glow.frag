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
   float integer_scale;
   float overscale;
   float effect;
   float scanline_toggle;
   float SCANLINE_BASE_BRIGHTNESS;
   float SCANLINE_SINE_COMP_A;
   float SCANLINE_SINE_COMP_B;
   float interp_toggle;
   float OS_MASK_TOP;
   float OS_MASK_BOTTOM;
   float OS_MASK_LEFT;
   float OS_MASK_RIGHT;
   float aspect_x;
   float aspect_y;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

#pragma parametereffect¡1.00.13.00.1
#pragma parameteraspect_x¡64.01.0256.1.0
#pragma parameteraspect_y¡49.01.0256.1.0
#pragma parameterinteger_scale¡1.00.01.01.0
#pragma parameteroverscale¡0.00.01.01.0
#pragma parameterinterp_toggle¡0.00.01.01.0
#pragma parameterscanline_toggle¡0.00.01.01.0
#pragma parameterSCANLINE_BASE_BRIGHTNESS¡0.950.01.00.01
#pragma parameterSCANLINE_SINE_COMP_A¡0.000.00.100.01
#pragma parameterSCANLINE_SINE_COMP_B¡0.150.01.00.05
#pragma parameterOS_MASK_TOP¡0.00.01.00.005
#pragma parameterOS_MASK_BOTTOM¡0.00.01.00.005
#pragma parameterOS_MASK_LEFT¡0.00.01.00.005
#pragma parameterOS_MASK_RIGHT¡0.00.01.00.005

layout(location = 0) in vec2 border_coord;
layout(location = 1) in vec2 screen_coord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;

vec4 scanline(vec2 coord, vec4 frame)
{
 vec2 omega = vec2(3.1415 * params . OutputSize . x, 2.0 * 3.1415 * params . SourceSize . y);
 vec2 sine_comp = vec2(params . SCANLINE_SINE_COMP_A, params . SCANLINE_SINE_COMP_B);
 vec3 res = frame . xyz;
 vec3 scanline = res *(params . SCANLINE_BASE_BRIGHTNESS + dot(sine_comp * sin(coord * omega), vec2(1.0, 1.0)));
 return vec4(scanline . x, scanline . y, scanline . z, 1.0);
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

vec4 border(vec2 screen_coord, vec2 border_coord, vec2 texture_size, vec2 video_size,
 vec2 output_size, float frame_count, sampler2D decal)
{
 vec4 background;
 vec4 color = texture(Source, border_coord, 10.0)* 1.25 + 0.125;
 background = color * color * params . effect;

 vec2 coord =(params . interp_toggle < 0.5)? screen_coord : interp_coord(screen_coord, texture_size);
 vec4 frame = texture(decal, coord);
 frame =(params . scanline_toggle > 0.5)? scanline(coord, frame): frame;
 vec2 fragcoord =(coord . xy);
 if(fragcoord . x < 1.0 - params . OS_MASK_RIGHT && fragcoord . x > 0.0 + params . OS_MASK_LEFT &&
  fragcoord . y < 1.0 - params . OS_MASK_BOTTOM && fragcoord . y > 0.0 + params . OS_MASK_TOP)
   return frame;

 else return background;
}

void main()
{
 FragColor = border(screen_coord, border_coord, params . SourceSize . xy, params . SourceSize . xy,
  params . OutputSize . xy, float(params . FrameCount), Original);
}
