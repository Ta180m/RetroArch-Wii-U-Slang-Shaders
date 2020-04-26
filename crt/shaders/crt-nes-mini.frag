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
   float BRIGHTBOOST;
   float INTENSITY;
   float SCANTHICK;
}params;

#pragma parameterSCANTHICK¡2.02.04.02.0
#pragma parameterINTENSITY¡0.150.01.00.01
#pragma parameterBRIGHTBOOST¡0.150.01.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    vec3 texel = texture(Source, vTexCoord . xy). rgb;
    vec3 pixelHigh =((1.0 + params . BRIGHTBOOST)-(0.2 * texel))* texel;
    vec3 pixelLow =((1.0 - params . INTENSITY)+(0.1 * texel))* texel;
    float selectY = mod(vTexCoord . y * params . SCANTHICK * params . SourceSize . y, 2.0);
    float selectHigh = step(1.0, selectY);
    float selectLow = 1.0 - selectHigh;
    vec3 pixelColor =(selectLow * pixelLow)+(selectHigh * pixelHigh);

    FragColor = vec4(pixelColor, 1.0);
}
