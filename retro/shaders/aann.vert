#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4





uniform Push
{
   float NOGAMMA;
   float MASKING;
   float BILINEAR;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;


#pragma parameterNOGAMMA¡0.00.01.01.0



#pragma parameterMASKING¡0.00.01.01.0


#pragma parameterBILINEAR¡0.00.01.01.0






layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
}

