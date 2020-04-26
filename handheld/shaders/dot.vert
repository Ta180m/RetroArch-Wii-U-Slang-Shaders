#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;












float dist(vec2 coord, vec2 source)
{
   vec2 delta = coord - source;
   return sqrt(dot(delta, delta));
}

float color_bloom(vec3 color)
{
   vec3 gray_coeff = vec3(0.30, 0.59, 0.11);
   float bright = dot(color, gray_coeff);
   return mix(1.0 + 0.05, 1.0 - 0.05, bright);
}

vec3 lookup(vec2 pixel_no, float offset_x, float offset_y, vec3 color)
{
   vec2 offset = vec2(offset_x, offset_y);
   float delta = dist(fract(pixel_no), offset + vec2(0.5, 0.5));
   return color * exp(- 2.4 * delta * color_bloom(color));
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 c00_10;
layout(location = 2) out vec4 c00_01;
layout(location = 3) out vec4 c20_01;
layout(location = 4) out vec4 c21_02;
layout(location = 5) out vec4 c12_22;
layout(location = 6) out vec2 c11;
layout(location = 7) out vec2 pixel_no;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;

   float dx = global . SourceSize . z;
   float dy = global . SourceSize . w;

   c00_10 = vec4(vTexCoord + vec2(- dx, - dy), vTexCoord + vec2(0, - dy));
   c20_01 = vec4(vTexCoord + vec2(dx, - dy), vTexCoord + vec2(- dx, 0));
   c21_02 = vec4(vTexCoord + vec2(dx, 0), vTexCoord + vec2(- dx, dy));
   c12_22 = vec4(vTexCoord + vec2(0, dy), vTexCoord + vec2(dx, dy));
   c11 = vTexCoord;
   pixel_no = vTexCoord * global . SourceSize . xy;
}

