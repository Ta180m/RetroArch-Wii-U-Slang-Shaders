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
    vec4 color = texture(OriginalHistory7, vTexCoord);
    color =(color + texture(OriginalHistory6, vTexCoord))* 0.5;
    color =(color + texture(OriginalHistory5, vTexCoord))* 0.5;
    color =(color + texture(OriginalHistory4, vTexCoord))* 0.5;
    color =(color + texture(OriginalHistory3, vTexCoord))* 0.5;
    color =(color + texture(OriginalHistory2, vTexCoord))* 0.5;
    color =(color + texture(OriginalHistory1, vTexCoord))* 0.5;
    color =(color + texture(Source, vTexCoord))* 0.5;

    FragColor = color;
}
