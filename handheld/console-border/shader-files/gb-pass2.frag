#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float shadow_blur1;
}registers;

#pragma parametershadow_blur1¡2.00.05.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;






















layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 texel;
layout(location = 2) in vec2 lower_bound;
layout(location = 3) in vec2 upper_bound;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

























void main()
{

    float offsets[5]= float[](0.0, 1.0, 2.0, 3.0, 4.0);









    float weights[5]= float[](0.13,
                                0.13,
                                0.13 -(registers . shadow_blur1 / 100.0),
                                0.13 -(3.0 * registers . shadow_blur1 / 100.0),
                                0.13 -(5.0 * registers . shadow_blur1 / 100.0));


    vec4 out_color = texture(Source, clamp(vTexCoord, lower_bound, upper_bound))* weights[0];



    for(int i = 1;i < 5;i ++)
    {
        out_color . a += texture(Source, clamp(vTexCoord + vec2(offsets[i]* texel . x, 0.0), lower_bound, upper_bound)). a * weights[i];
        out_color . a += texture(Source, clamp(vTexCoord - vec2(offsets[i]* texel . x, 0.0), lower_bound, upper_bound)). a * weights[i];
    }

    FragColor = out_color;
}
