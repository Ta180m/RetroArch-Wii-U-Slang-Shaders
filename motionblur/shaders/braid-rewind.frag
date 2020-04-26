#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4










layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float FrameDirection;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D OriginalHistory1;
uniform sampler2D OriginalHistory2;
uniform sampler2D OriginalHistory3;
uniform sampler2D OriginalHistory4;
uniform sampler2D OriginalHistory5;
uniform sampler2D OriginalHistory6;
uniform sampler2D OriginalHistory7;

void main()
{
    vec4 current = texture(Source, vTexCoord);

    vec4 color =
        texture(OriginalHistory7, vTexCoord)+
        texture(OriginalHistory6, vTexCoord)+
        texture(OriginalHistory5, vTexCoord)+
        texture(OriginalHistory4, vTexCoord)+
        texture(OriginalHistory3, vTexCoord)+
        texture(OriginalHistory2, vTexCoord)+
        texture(OriginalHistory1, vTexCoord)+
        current;

    vec4 sepia = vec4(1.0, 0.8, 0.6, 1.0);

    if(global . FrameDirection < 0.0)
    {
        current =((current +(color * 0.142857142857143))* 0.5)* sepia;
    }

    FragColor = current;
}
