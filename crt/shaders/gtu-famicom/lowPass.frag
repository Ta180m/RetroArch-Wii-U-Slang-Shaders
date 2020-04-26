#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float signalResolution;
   float addNoise;
   float noiseStrength;
   uint FrameCount;
}params;

#pragma parametersignalResolution¡700.020.02000.010.0
#pragma parameteraddNoise¡0.00.01.01.0
#pragma parameternoiseStrength¡0.00.01.00.05



layout(std140) uniform UBO
{
   mat4 MVP;
}global;
















float rand2(vec2 co)
{
    float c = 43758.5453;
    float dt = dot(co . xy, vec2(12.9898, 78.233));
    float sn = mod(dt, 3.14);

    return fract(sin(sn)* c);
}

float rand(vec2 co)
{
    return fract(sin(dot(co . xy, vec2(12.9898, 78.233)))* 43758.5453);
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    float offset = fract((vTexCoord . x * params . SourceSize . x)- 0.50001);
    float signal = 0.0;
    float range = ceil(0.50001 + params . SourceSize . x / params . signalResolution);
    range = min(range, 255.0);

    float i;
    for(i = 1 - range;i < 1 + range;i ++)
        signal +=((texture(Source, vec2(vTexCoord . x -(offset -(i))/ params . SourceSize . x, vTexCoord . y)). x)*(((3.14159265358 *(params . signalResolution * params . SourceSize . z)* min(abs((offset -(i)))+ 0.5, 1.0 /(params . signalResolution * params . SourceSize . z)))+ sin((3.14159265358 *(params . signalResolution * params . SourceSize . z)* min(abs((offset -(i)))+ 0.5, 1.0 /(params . signalResolution * params . SourceSize . z))))-(3.14159265358 *(params . signalResolution * params . SourceSize . z)* min(max(abs((offset -(i)))- 0.5, - 1.0 /(params . signalResolution * params . SourceSize . z)), 1.0 /(params . signalResolution * params . SourceSize . z)))- sin((3.14159265358 *(params . signalResolution * params . SourceSize . z)* min(max(abs((offset -(i)))- 0.5, - 1.0 /(params . signalResolution * params . SourceSize . z)), 1.0 /(params . signalResolution * params . SourceSize . z)))))/(2.0 * 3.14159265358)));

    if(params . addNoise > 0.0)
    {
        vec2 pos =(vTexCoord . xy * params . SourceSize . xy);
        signal -= 0.5;
        signal +=(rand(vec2(pos . x * pos . y, params . FrameCount))- 0.50001)* params . noiseStrength;
        signal += 0.5;
    }

    FragColor = vec4(signal);
}
