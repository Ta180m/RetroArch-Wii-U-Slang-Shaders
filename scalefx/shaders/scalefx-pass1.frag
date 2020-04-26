#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4










































uniform Push
{
   vec4 SourceSize;
   float SFX_CLR;
   float SFX_SAA;
}params;


#pragma parameterSFX_CLR¡0.500.011.000.01
#pragma parameterSFX_SAA¡1.000.001.001.00


layout(std140) uniform UBO
{
   mat4 MVP;
}global;


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;



float str(float d, vec2 a, vec2 b){
 float diff = a . x - a . y;
 float wght1 = max(params . SFX_CLR - d, 0)/ params . SFX_CLR;
 float wght2 = clamp((1 - d)+(min(a . x, b . x)+ a . x > min(a . y, b . y)+ a . y ? diff : - diff), 0., 1.);
 return(params . SFX_SAA == 1. || 2. * d < a . x + a . y)?(wght1 * wght2)*(a . x * a . y): 0.;
}


void main()
{












 vec4 A = textureOffset(Source, vTexCoord, ivec2(- 1, - 1)), B = textureOffset(Source, vTexCoord, ivec2(0, - 1));
 vec4 D = textureOffset(Source, vTexCoord, ivec2(- 1, 0)), E = textureOffset(Source, vTexCoord, ivec2(0, 0)), F = textureOffset(Source, vTexCoord, ivec2(1, 0));
 vec4 G = textureOffset(Source, vTexCoord, ivec2(- 1, 1)), H = textureOffset(Source, vTexCoord, ivec2(0, 1)), I = textureOffset(Source, vTexCoord, ivec2(1, 1));


 vec4 res;
 res . x = str(D . z, vec2(D . w, E . y), vec2(A . w, D . y));
 res . y = str(F . x, vec2(E . w, E . y), vec2(B . w, F . y));
 res . z = str(H . z, vec2(E . w, H . y), vec2(H . w, I . y));
 res . w = str(H . x, vec2(D . w, H . y), vec2(G . w, G . y));

 FragColor = res;
}
