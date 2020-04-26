#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   vec4 OriginalHistorySize1;
   float baseline_alpha;
   float grey_balance;
   float response_time;
   float video_scale;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;







#pragma parameterbaseline_alpha¡0.050.01.00.01


#pragma parametergrey_balance¡2.62.04.00.1



#pragma parameterresponse_time¡0.200.00.7770.111


#pragma parametervideo_scale¡3.03.05.01.0


























layout(location = 0) in vec2 vTexCoord;
layout(location = 2) in vec2 dot_size;
layout(location = 3) in vec2 one_texel;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D OriginalHistory1;
uniform sampler2D OriginalHistory2;
uniform sampler2D OriginalHistory3;
uniform sampler2D OriginalHistory4;
uniform sampler2D OriginalHistory5;
uniform sampler2D OriginalHistory6;
uniform sampler2D OriginalHistory7;
uniform sampler2D COLOR_PALETTE;



















void main()
{

    float is_on_dot = 0.0;
    if(mod(vTexCoord . x, dot_size . x)> one_texel . x && mod(vTexCoord . y, dot_size . y * 1.0001)> one_texel . y)
        is_on_dot = 1.0;



    vec3 input_rgb = abs(1.0 - texture(Source, vTexCoord). rgb);
    input_rgb +=(abs(1.0 - texture(OriginalHistory1, vTexCoord). rgb)- input_rgb)* registers . response_time;
    input_rgb +=(abs(1.0 - texture(OriginalHistory2, vTexCoord). rgb)- input_rgb)* pow(registers . response_time, 2.0);
    input_rgb +=(abs(1.0 - texture(OriginalHistory3, vTexCoord). rgb)- input_rgb)* pow(registers . response_time, 3.0);
    input_rgb +=(abs(1.0 - texture(OriginalHistory4, vTexCoord). rgb)- input_rgb)* pow(registers . response_time, 4.0);
    input_rgb +=(abs(1.0 - texture(OriginalHistory5, vTexCoord). rgb)- input_rgb)* pow(registers . response_time, 5.0);
    input_rgb +=(abs(1.0 - texture(OriginalHistory6, vTexCoord). rgb)- input_rgb)* pow(registers . response_time, 6.0);
    input_rgb +=(abs(1.0 - texture(OriginalHistory7, vTexCoord). rgb)- input_rgb)* pow(registers . response_time, 7.0);

    float rgb_to_alpha =(input_rgb . r + input_rgb . g + input_rgb . b)/ registers . grey_balance
                        +(is_on_dot * registers . baseline_alpha);




    vec4 out_color = vec4(texture(COLOR_PALETTE, vec2(0.75, 0.5)). rgb, rgb_to_alpha);



    out_color . a *= is_on_dot;

    FragColor = out_color;
}
