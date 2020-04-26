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
    float red_result =
        texture(OriginalHistory1, vTexCoord). r +
        texture(OriginalHistory2, vTexCoord). r




                                                ;

    float green_result =
        texture(OriginalHistory1, vTexCoord). g +
        texture(OriginalHistory2, vTexCoord). g




                                                ;

    float blue_result =
        texture(OriginalHistory1, vTexCoord). b +
        texture(OriginalHistory2, vTexCoord). b




                                                ;


    blue_result = clamp(blue_result, 0.0, 1.0);

    FragColor =
        clamp(texture(Source, vTexCoord)+ 0.4 *
            vec4(clamp(red_result - 7.0 * texture(Source, vTexCoord). r, 0.0, 1.0),
                 clamp(green_result - 7.0 * texture(Source, vTexCoord). g, 0.0, 1.0),
                 clamp(blue_result - 7.0 * texture(Source, vTexCoord). b, 0.0, 1.0),
                 1.0),
            0.0,
            1.0
        );
}
