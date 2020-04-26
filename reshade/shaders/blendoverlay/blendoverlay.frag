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
   float OverlayMix;
   float LUTWidth;
   float LUTHeight;
}params;

#pragma parameterOverlayMix¡1.00.01.00.05
#pragma parameterLUTWidth¡6.01.01920.01.0
#pragma parameterLUTHeight¡4.01.01920.01.0





layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D overlay;

float blendOverlay(float base, float blend){
 return base < 0.5 ?(2.0 * base * blend):(1.0 - 2.0 *(1.0 - base)*(1.0 - blend));
}

void main()
{
    vec3 Picture = texture(Source, vTexCoord). xyz;

    float Luminance = 0.299 * Picture . x + 0.587 * Picture . y + 0.114 * Picture . z;

    vec2 LutCoord = vec2(fract(vTexCoord . x * params . OutputSize . x / params . LUTWidth), fract(vTexCoord . y * params . OutputSize . y / params . LUTHeight));

    vec3 ShadowMask = texture(overlay, LutCoord). xyz;

    vec3 ImageFinal = Picture;

    ImageFinal . r = blendOverlay(ImageFinal . r, ShadowMask . r);
    ImageFinal . g = blendOverlay(ImageFinal . g, ShadowMask . g);
    ImageFinal . b = blendOverlay(ImageFinal . b, ShadowMask . b);

    ImageFinal = mix(Picture, clamp(ImageFinal, 0.0, 1.0), params . OverlayMix);

    FragColor = vec4(ImageFinal, 1.0);
}
