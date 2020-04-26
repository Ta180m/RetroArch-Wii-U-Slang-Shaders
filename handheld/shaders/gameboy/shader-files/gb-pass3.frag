#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}registers;

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









    float weights[5]= float[](0.13465834124289953661305802732548,
                                0.13051534237555914090930704141833,
                                0.11883557904592230273554609080014,
                                0.10164546793794160274995705611009,
                                0.08167444001912718529866079800870);


    vec4 out_color = texture(Source, clamp(vTexCoord, lower_bound, upper_bound))* weights[0];



    for(int i = 1;i < 5;i ++)
    {
        out_color . a += texture(Source, clamp(vTexCoord + vec2(0.0, offsets[i]* texel . y), lower_bound, upper_bound)). a * weights[i];
        out_color . a += texture(Source, clamp(vTexCoord - vec2(0.0, offsets[i]* texel . y), lower_bound, upper_bound)). a * weights[i];
    }

    FragColor = out_color;
}
