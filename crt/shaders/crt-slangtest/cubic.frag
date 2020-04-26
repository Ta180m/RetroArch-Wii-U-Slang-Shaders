#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4


layout(std140) uniform UBO
{
   vec4 SourceSize;
   float OUT_GAMMA;
   float BOOST;
}global;

layout(std140) uniform UBO1
{
   mat4 MVP;
};


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   float u = vTexCoord . x * global . SourceSize . x - 0.5;
   float a = fract(u);
   vec2 tex = vec2((floor(u)+ 0.5)* global . SourceSize . z, vTexCoord . y);



   vec3 i0 = textureLodOffset(Source, tex, 0.0, ivec2(- 1, 0)). rgb;
   vec3 i1 = textureLodOffset(Source, tex, 0.0, ivec2(0, 0)). rgb;
   vec3 i2 = textureLodOffset(Source, tex, 0.0, ivec2(+ 1, 0)). rgb;
   vec3 i3 = textureLodOffset(Source, tex, 0.0, ivec2(+ 2, 0)). rgb;

   float a2 = a * a;
   float a3 = a2 * a;

   vec3 color = i1 +
      (i2 - i0)* 0.5 * a +
      (i0 -(2.5 * i1)+(2.0 * i2)-(0.5 * i3))* a2 +
      ((i3 - i0)+ 3.0 *(i1 - i2))* 0.5 * a3;

   FragColor = vec4(color, 1.0);
}
