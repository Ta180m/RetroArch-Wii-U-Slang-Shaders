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
}params;

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





 float gammaed = 0.15;

 float leifx_linegamma = gammaed;
      vec2 dithet = vTexCoord . xy * res . xy;
 dithet . y = vTexCoord . y * res . y;
 float horzline1 =(mod2(dithet . y, 2.0));
 if(horzline1 < 1)leifx_linegamma = 0;
 float leifx_gamma = 1.3 - gammaed + leifx_linegamma;


 outcolor . r = pow(outcolor . r, 1.0 / leifx_gamma);
 outcolor . g = pow(outcolor . g, 1.0 / leifx_gamma);
 outcolor . b = pow(outcolor . b, 1.0 / leifx_gamma);

   FragColor = vec4(outcolor, 1.0);
}
