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
   float combFilter;
   float phaseOffset;
}params;

#pragma parametercombFilter¡0.00.01.01.0
#pragma parameterphaseOffset¡0.0-0.50.50.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;









#pragma formatR16G16B16A16_SFLOAT
layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in float colorPhase;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    float current = texture(Source, vTexCoord . xy). r;

    float signal, I, Q;

    if(params . combFilter > 0.0)
    {
        float prev6 = texture(Source, vTexCoord . xy - vec2(6.0 /(params . OutputSize . x * params . SourceSize . x * params . SourceSize . z), 0.0)). r;
        signal =(current + prev6)* 0.5;
        float chromaSignal = current - signal;
        I = chromaSignal * cos(colorPhase *(2.0 * 3.14159265358 / 12.0))* 2.0;
        Q = chromaSignal * sin(colorPhase *(2.0 * 3.14159265358 / 12.0))* 2.0;
    }
    else
    {
        signal = current;
        I = signal * cos(colorPhase *(2.0 * 3.14159265358 / 12.0))* 2.0;
        Q = signal * sin(colorPhase *(2.0 * 3.14159265358 / 12.0))* 2.0;
    }

    FragColor = vec4(signal, I, Q, 1.0);
}
