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
   float signalResolutionI;
   float signalResolutionQ;
   float compositeConnection;
}params;

#pragma parametersignalResolution¡256.016.01024.016.0
#pragma parametersignalResolutionI¡83.01.0350.02.0
#pragma parametersignalResolutionQ¡25.01.0350.02.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;







#pragma parametercompositeConnection¡0.00.01.01.0


















layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

