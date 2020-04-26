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

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void weights(out vec4 x, out vec4 y, vec2 t)
{
   vec2 t2 = t * t;
   vec2 t3 = t2 * t;

   vec4 xs = vec4(1.0, t . x, t2 . x, t3 . x);
   vec4 ys = vec4(1.0, t . y, t2 . y, t3 . y);

   vec4 p0 = vec4(+ 0.0, - 0.5, + 1.0, - 0.5);
   vec4 p1 = vec4(+ 1.0, 0.0, - 2.5, + 1.5);
   vec4 p2 = vec4(+ 0.0, + 0.5, + 2.0, - 1.5);
   vec4 p3 = vec4(+ 0.0, 0.0, - 0.5, + 0.5);

   x = vec4(dot(xs, p0), dot(xs, p1), dot(xs, p2), dot(xs, p3));
   y = vec4(dot(ys, p0), dot(ys, p1), dot(ys, p2), dot(ys, p3));
}

void main()
{
   vec2 uv = vTexCoord * global . SourceSize . xy - 0.5;
   vec2 texel = floor(uv);
   vec2 tex =(texel + 0.5)* global . SourceSize . zw;
   vec2 phase = uv - texel;



   vec4 x;
   vec4 y;
   weights(x, y, phase);

   vec3 color;
   vec4 row = x * y . x;
   color = textureLodOffset(Source, tex, 0.0, ivec2(- 1, - 1)). rgb * row . x;
   color += textureLodOffset(Source, tex, 0.0, ivec2(+ 0, - 1)). rgb * row . y;
   color += textureLodOffset(Source, tex, 0.0, ivec2(+ 1, - 1)). rgb * row . z;
   color += textureLodOffset(Source, tex, 0.0, ivec2(+ 2, - 1)). rgb * row . w;

   row = x * y . y;
   color += textureLodOffset(Source, tex, 0.0, ivec2(- 1, + 0)). rgb * row . x;
   color += textureLodOffset(Source, tex, 0.0, ivec2(+ 0, + 0)). rgb * row . y;
   color += textureLodOffset(Source, tex, 0.0, ivec2(+ 1, + 0)). rgb * row . z;
   color += textureLodOffset(Source, tex, 0.0, ivec2(+ 2, + 0)). rgb * row . w;

   row = x * y . z;
   color += textureLodOffset(Source, tex, 0.0, ivec2(- 1, + 1)). rgb * row . x;
   color += textureLodOffset(Source, tex, 0.0, ivec2(+ 0, + 1)). rgb * row . y;
   color += textureLodOffset(Source, tex, 0.0, ivec2(+ 1, + 1)). rgb * row . z;
   color += textureLodOffset(Source, tex, 0.0, ivec2(+ 2, + 1)). rgb * row . w;

   row = x * y . w;
   color += textureLodOffset(Source, tex, 0.0, ivec2(- 1, + 2)). rgb * row . x;
   color += textureLodOffset(Source, tex, 0.0, ivec2(+ 0, + 2)). rgb * row . y;
   color += textureLodOffset(Source, tex, 0.0, ivec2(+ 1, + 2)). rgb * row . z;
   color += textureLodOffset(Source, tex, 0.0, ivec2(+ 2, + 2)). rgb * row . w;

   FragColor = vec4(color, 1.0);
}
