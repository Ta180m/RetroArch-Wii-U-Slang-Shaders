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
layout(location = 1) in vec2 FragCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;


vec3 grayscale(vec3 col)
{


    return vec3(dot(col, vec3(0.2126, 0.7152, 0.0722)));
}

void main()
{

    float saturation = 1.0;
    float Display_gamma = 1.02;
    float CRT_gamma = 2.4;
    float luminance = 1.0;

    vec3 gamma = vec3(CRT_gamma / Display_gamma);
    vec3 res = texture(Source, vTexCoord). xyz;
    res = mix(grayscale(res), res, saturation);
    res = pow(res, gamma . rgb);
    vec4 c = vec4(clamp(res * luminance, 0.0, 1.0), 1.0);


    float r = c . x;
    float g = c . y;
    float b = c . z;
    float a = c . w;
    float w = r * 0.714 + g * 0.251 + b * 0.000;
    float q = r * 0.071 + g * 0.643 + b * 0.216;
    float e = r * 0.071 + g * 0.216 + b * 0.643;


    saturation = 1.0;
    Display_gamma = 3.6;
    CRT_gamma = 2.4;
    luminance = 1.01;

    res = vec3(w, q, e);
    gamma = gamma = vec3(CRT_gamma / Display_gamma);
    res = mix(grayscale(res), res, saturation);
    res = pow(res, gamma . rgb);

    FragColor = vec4(clamp(res * luminance, 0.0, 1.0), 1.0);
}
