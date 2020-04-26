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

#pragma formatR8G8B8A8_SRGB
layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in float data_pix_no;
layout(location = 2) in float data_one;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;





void main()
{
    float texel = floor(data_pix_no);
    float phase = data_pix_no - texel;
    float base_phase = phase - 0.5;
    vec2 tex = vec2((texel + 0.5)* global . SourceSize . z, vTexCoord . y);

    vec3 col = vec3(0.0);
    for(int i = - 2;i <= 2;i ++)
    {
        float phase = base_phase - float(i);
        float g = 0.38 * exp(- 0.5 * phase * phase /(0.5 * 0.5))/ 0.5;
        col += texture(Source, tex + vec2(float(i)* data_one, 0.0)). rgb * g;
    }

    FragColor = vec4(col, 1.0);
}
