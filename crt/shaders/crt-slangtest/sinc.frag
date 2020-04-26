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



float sinc(float x)
{
   return sin(x)/ x;
}

float kernel_(float x)
{
   x = max(abs(x)* 3.1415926535, 0.0001);
   return sinc(x)* sinc(0.5 * x);
}

void main()
{
   float u = vTexCoord . x * global . SourceSize . x - 0.5;
   float a = fract(u);
   vec2 tex = vec2((floor(u)+ 0.5)* global . SourceSize . z, vTexCoord . y);



   vec3 color =
      kernel_(a + 1.0)* textureLodOffset(Source, tex, 0.0, ivec2(- 1, 0)). rgb +
      kernel_(a)* textureLodOffset(Source, tex, 0.0, ivec2(0, 0)). rgb +
      kernel_(a - 1.0)* textureLodOffset(Source, tex, 0.0, ivec2(1, 0)). rgb +
      kernel_(a - 2.0)* textureLodOffset(Source, tex, 0.0, ivec2(2, 0)). rgb;

   FragColor = vec4(color, 1.0);
}
