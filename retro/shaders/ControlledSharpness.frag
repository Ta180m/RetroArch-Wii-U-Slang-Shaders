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
   float sharpness;
}params;

#pragma parametersharpness¡0.40.0010.950.05

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

vec2 f(vec2 x, float n){
    float c = 2 /(1 - params . sharpness)- 1;
    return pow(x, vec2(c))/ pow(n, c - 1);
}

void main()
{
    vec2 SStep = vTexCoord * params . SourceSize . xy + 0.5;
 vec2 SStepInt = floor(SStep);
 vec2 SStepFra = SStep - SStepInt;


    vec2 f0 = f(SStepFra, 0.5);
    vec2 f2 = 1 - f(1 - SStepFra, 0.5);

    SStep =((mix(f0, f2, greaterThanEqual(SStepFra, vec2(0.5))))+ SStepInt - 0.5)* params . SourceSize . zw;

    FragColor = texture(Source, SStep);
}
