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

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
    gl_Position = global . MVP * Position;

    if(params . cropOverscan_x > 0.0)
        gl_Position . x /=(240.0 / 256.0);

    vTexCoord = TexCoord;
}

