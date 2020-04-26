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

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    vec2 SStep = vTexCoord * params . SourceSize . xy + 0.5;
 vec2 SStepInt = floor(SStep);
 vec2 SStepFra = SStep - SStepInt;

    SStep =((924 * pow(SStepFra, vec2(13))- 6006 * pow(SStepFra, vec2(12))+ 16380 * pow(SStepFra, vec2(11))- 24024 * pow(SStepFra, vec2(10))+ 20020 * pow(SStepFra, vec2(9))- 9009 * pow(SStepFra, vec2(8))+ 1716 * pow(SStepFra, vec2(7)))+ SStepInt - 0.5)* params . SourceSize . zw;

    FragColor = texture(Source, SStep);
}
