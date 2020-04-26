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

#pragma parameterOUT_GAMMA¡2.21.82.4
#pragma parameterBOOST¡1.00.22.00.02
#pragma parameterGAMMA¡2.52.03.00.02

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

vec3 invgamma(vec3 v)
{
   return pow(clamp(v, vec3(0.0), vec3(1.0)), vec3(1.0 / global . OUT_GAMMA));
}

float luma(vec3 col)
{
   return dot(col, vec3(0.29, 0.60, 0.11));
}

void main()
{
   vec2 tex = vTexCoord * global . SourceSize . xy;

   float frac = fract(tex . y)- 0.5;
   tex . y = floor(tex . y)+ 0.5;
   tex = tex * global . SourceSize . zw;


   vec3 l0 = textureLodOffset(Source, tex, 0.0, ivec2(0, - 1)). rgb;
   vec3 l1 = textureLodOffset(Source, tex, 0.0, ivec2(0, 0)). rgb;
   vec3 l2 = textureLodOffset(Source, tex, 0.0, ivec2(0, 1)). rgb;

   vec3 dist =(3.5 - 1.0 * vec3(luma(l0), luma(l1), luma(l2)))*(frac + vec3(+ 1.0, 0.0, - 1.0));
   dist = exp2(- dist * dist);

   vec3 color =
      dist . x * l0 +
      dist . y * l1 +
      dist . z * l2;

   FragColor = vec4(invgamma(global . BOOST * color), 1.0);
}
