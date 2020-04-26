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
   float GlowLevel;
   float GlowTightness;
}params;

#pragma parameterGlowLevel¡1.00.01.00.1
#pragma parameterGlowTightness¡0.50.01.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D candy_ref;

void main()
{
 vec3 Picture = texture(Source, vTexCoord). xyz;

    float MaxRGB = max(Picture . x, max(Picture . y, Picture . z));
    float MinRGB = min(Picture . x, min(Picture . y, Picture . z));

    float YIQLuminance =((0.299 * Picture . x)+(0.587 * Picture . y)+(0.114 * Picture . z));


    Picture /= MaxRGB;
    Picture = clamp(Picture, 0.0, 1.0);


    FragColor = vec4(mix(texture(candy_ref, vTexCoord). xyz, Picture, mix(1. - pow(1. - YIQLuminance, 2.0), YIQLuminance * YIQLuminance, params . GlowTightness)* params . GlowLevel), 1.0);
}
