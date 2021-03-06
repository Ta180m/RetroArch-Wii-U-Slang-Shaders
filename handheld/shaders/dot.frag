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

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 c00_10;
layout(location = 2) in vec4 c00_01;
layout(location = 3) in vec4 c20_01;
layout(location = 4) in vec4 c21_02;
layout(location = 5) in vec4 c12_22;
layout(location = 6) in vec2 c11;
layout(location = 7) in vec2 pixel_no;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec3 mid_color = lookup(pixel_no, 0.0, 0.0, texture(Source, vTexCoord). rgb);
   vec3 color = vec3(0.0, 0.0, 0.0);
   color += lookup(pixel_no, - 1.0, - 1.0, texture(Source, vTexCoord). rgb);
   color += lookup(pixel_no, 0.0, - 1.0, texture(Source, vTexCoord). rgb);
   color += lookup(pixel_no, 1.0, - 1.0, texture(Source, vTexCoord). rgb);
   color += lookup(pixel_no, - 1.0, 0.0, texture(Source, vTexCoord). rgb);
   color += mid_color;
   color += lookup(pixel_no, 1.0, 0.0, texture(Source, vTexCoord). rgb);
   color += lookup(pixel_no, - 1.0, 1.0, texture(Source, vTexCoord). rgb);
   color += lookup(pixel_no, 0.0, 1.0, texture(Source, vTexCoord). rgb);
   color += lookup(pixel_no, 1.0, 1.0, texture(Source, vTexCoord). rgb);
   vec3 out_color = mix(1.2 * mid_color, color, 0.65);

   FragColor = vec4(out_color, 1.0);
}
