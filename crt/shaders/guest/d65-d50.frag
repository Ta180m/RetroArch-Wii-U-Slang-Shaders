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
   float WP;
}params;

#pragma parameterWP¡0.0-100.0100.05.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

mat3 D65 = mat3(
           0.5767309, 0.2973769, 0.0270343,
           0.1855540, 0.6273491, 0.0706872,
           0.1881852, 0.0752741, 0.9911085);

mat3 D50 = mat3(
           1.7552599, - 0.5441336, 0.0063467,
          - 0.4836786, 1.5068789, - 0.0175761,
          - 0.2530000, 0.0215528, 1.2256959);

void main()
{
 vec3 color = texture(Source, vTexCoord . xy). rgb;

 vec3 c65 = D65 * color;
 vec3 c50 = D50 * c65;

 float m = params . WP / 100.0;

 color =(1.0 - m)* color + m * c50;

 FragColor = vec4(color, 1.0);
}
