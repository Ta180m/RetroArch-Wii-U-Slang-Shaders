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
   float frequency;
}params;

#pragma parameterfrequency¡275.050.0500.025.0




layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{


 mat2 rotation_matrix = mat2(0.707, 0.707, - 0.707, 0.707);
 vec2 st2 =(vTexCoord * rotation_matrix);
 vec2 nearest = 2.0 * fract(params . frequency * st2)- 1.0;
 float dist = length(nearest);
 vec3 texcolor = texture(Source, vTexCoord). rgb;
 vec3 black = texcolor;


 vec4 cmyk;
 cmyk . xyz = 1.0 - texcolor;
 cmyk . w = min(cmyk . x, min(cmyk . y, cmyk . z));

 mat2 k_matrix = mat2(0.707, 0.707, - 0.707, 0.707);
 vec2 Kst = params . frequency *(vTexCoord * k_matrix);
 vec2 Kuv = 2.0 * fract(Kst)- 1.0;
 float k = step(0.0, sqrt(cmyk . w)- length(Kuv));
 mat2 c_matrix = mat2(0.966, 0.259, - 0.259, 0.966);
 vec2 Cst = params . frequency *(vTexCoord * c_matrix);
 vec2 Cuv = 2.0 * fract(Cst)- 1.0;
 float c = step(0.0, sqrt(cmyk . x)- length(Cuv));
 mat2 m_matrix = mat2(0.966, - 0.259, 0.259, 0.966);
 vec2 Mst = params . frequency *(vTexCoord * m_matrix);
 vec2 Muv = 2.0 * fract(Mst)- 1.0;
 float m = step(0.0, sqrt(cmyk . y)- length(Muv));
 vec2 Yst = params . frequency * vTexCoord;
 vec2 Yuv = 2.0 * fract(Yst)- 1.0;
 float y = step(0.0, sqrt(cmyk . z)- length(Yuv));

 vec3 rgbscreen = 1.0 - vec3(c, m, y);
 rgbscreen = mix(rgbscreen, black, k);

 float afwidth = 2.0 * params . frequency * length(params . OutputSize . zw);
 float blend = smoothstep(0.0, 1.0, afwidth);

 vec4 color = vec4(mix(rgbscreen, texcolor, blend), 1.0);
 color =(max(texcolor . r, max(texcolor . g, texcolor . b))< 0.01)? vec4(0., 0., 0., 0.): color;

 FragColor = color;
}
