#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4










uniform Push
{
   float response_time;
}params;



#pragma parameterresponse_time¡0.3330.00.7770.111

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


    vec3 input_rgb = texture(Source, vTexCoord). rgb;
    input_rgb +=(texture(OriginalHistory1, vTexCoord). rgb - input_rgb)* params . response_time;
    input_rgb +=(texture(OriginalHistory2, vTexCoord). rgb - input_rgb)* pow(params . response_time, 2.0);
    input_rgb +=(texture(OriginalHistory3, vTexCoord). rgb - input_rgb)* pow(params . response_time, 3.0);
    input_rgb +=(texture(OriginalHistory4, vTexCoord). rgb - input_rgb)* pow(params . response_time, 4.0);
    input_rgb +=(texture(OriginalHistory5, vTexCoord). rgb - input_rgb)* pow(params . response_time, 5.0);
    input_rgb +=(texture(OriginalHistory6, vTexCoord). rgb - input_rgb)* pow(params . response_time, 6.0);
    input_rgb +=(texture(OriginalHistory7, vTexCoord). rgb - input_rgb)* pow(params . response_time, 7.0);

    FragColor = vec4(input_rgb, 0.0);
}
