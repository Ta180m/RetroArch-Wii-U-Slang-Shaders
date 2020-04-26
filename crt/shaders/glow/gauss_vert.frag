#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float BOOST;
}params;

#pragma parameterBOOST¡1.00.51.50.02

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;

#pragma formatR8G8B8A8_SRGB
layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 data_pix_no;
layout(location = 2) in float data_one;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;



vec3 beam(vec3 color, float dist)
{

    vec3 wid = 2.0 + 2.0 * pow(color, vec3(4.0));
    vec3 weights = vec3(abs(dist)* 3.333333333);

    return 2.0 * color * exp(- pow(weights * inversesqrt(0.5 * wid), wid))/(0.6 + 0.2 * wid);






}

void main()
{
    vec2 texel = floor(data_pix_no);
    float phase = data_pix_no . y - texel . y;
    vec2 tex = vec2(texel + 0.5)* global . SourceSize . zw;

    vec3 top = texture(Source, tex + vec2(0.0, 0 * data_one)). rgb;
    vec3 bottom = texture(Source, tex + vec2(0.0, 1 * data_one)). rgb;

    float dist0 = phase;
    float dist1 = 1.0 - phase;

    vec3 scanline = vec3(0.0);

    scanline += beam(top, dist0);
    scanline += beam(bottom, dist1);

    FragColor = vec4(params . BOOST * scanline * 0.869565217391304, 1.0);
}
