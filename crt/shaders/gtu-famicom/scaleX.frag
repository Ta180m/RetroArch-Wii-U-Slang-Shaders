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
   float cropOverscan_x;
   float signalResolutionY;
   float signalResolutionI;
   float signalResolutionQ;
}params;

#pragma parametercropOverscan_x¡0.00.01.01.0
#pragma parametersignalResolutionY¡200.020.0500.010.0
#pragma parametersignalResolutionI¡125.020.0350.010.0
#pragma parametersignalResolutionQ¡125.020.0350.010.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;









float d(float x, float b)
{
    return(3.14159265358 * b * min(abs(x)+ 0.5, 1.0 / b));
}

float e(float x, float b)
{
    return(3.14159265358 * b * min(max(abs(x)- 0.5, - 1.0 / b), 1.0 / b));
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    float offset = fract((vTexCoord . x * params . SourceSize . x)- 0.5);
    vec3 YIQ = vec3(0.0);
    vec3 RGB = vec3(0.0);
    float X;
    vec3 c;
    float Y = params . signalResolutionY * params . SourceSize . z;
    float I = params . signalResolutionI * params . SourceSize . z;
    float Q = params . signalResolutionQ * params . SourceSize . z;

    float range = ceil(0.5 + params . SourceSize . x / min(min(params . signalResolutionY, params . signalResolutionI), params . signalResolutionQ));

    float i;

    for(i = 1.0 - range;i < range + 1.0;i ++)
    {
        X = offset - i;
        c = texture(Source, vec2(vTexCoord . x - X * params . SourceSize . z, vTexCoord . y)). rgb;
        c . x *=((d(X, Y)+ sin(d(X, Y))- e(X, Y)- sin(e(X, Y)))/(2.0 * 3.14159265358));
        c . y *=((d(X, I)+ sin(d(X, I))- e(X, I)- sin(e(X, I)))/(2.0 * 3.14159265358));
        c . z *=((d(X, Q)+ sin(d(X, Q))- e(X, Q)- sin(e(X, Q)))/(2.0 * 3.14159265358));
        YIQ += c;
    }

    RGB . r = YIQ . r + 0.956 * YIQ . g + 0.621 * YIQ . b;
    RGB . g = YIQ . r - 0.272 * YIQ . g - 0.647 * YIQ . b;
    RGB . b = YIQ . r - 1.106 * YIQ . g + 1.703 * YIQ . b;

    FragColor = vec4(clamp(RGB, 0.0, 1.0), 1.0);
}
