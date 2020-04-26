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
   float GAMMA_LEVEL;
}params;

#pragma parameterGAMMA_LEVEL¡1.30.002.000.01



layout(std140) uniform UBO
{
   mat4 MVP;
}global;




















float mod2(float x, float y)
{
 return x - y * floor(x / y);
}



layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
      vec3 outcolor = texture(Source, vTexCoord). rgb;

      vec2 res;
 res . x = params . SourceSize . x;
 res . y = params . SourceSize . y;





 outcolor . r = pow(outcolor . r, 1.0 / params . GAMMA_LEVEL);
 outcolor . g = pow(outcolor . g, 1.0 / params . GAMMA_LEVEL);
 outcolor . b = pow(outcolor . b, 1.0 / params . GAMMA_LEVEL);

   FragColor = vec4(outcolor, 1.0);
}
