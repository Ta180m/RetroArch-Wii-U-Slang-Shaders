#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4






















uniform Push
{
   float RETRO_PIXEL_SIZE;
}param;


#pragma parameterRETRO_PIXEL_SIZE¡0.840.01.00.01

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




void main()
{

    vec3 E = pow(texture(Source, vTexCoord). xyz, vec3(2.4));

    vec2 fp = fract(vTexCoord * global . SourceSize . xy);
    vec2 ps = global . SourceSize . xy * global . OutputSize . zw;

    vec2 f = clamp(clamp(fp + 0.5 * ps, 0.0, 1.0)- param . RETRO_PIXEL_SIZE, vec2(0.0), ps)/ ps;

    float max_coord = max(f . x, f . y);

    vec3 res = mix(E *(1.04 + fp . x * fp . y), E * 0.36, max_coord);


    FragColor = vec4(clamp(pow(res, vec3(1.0 / 2.2)), 0.0, 1.0), 1.0);
}
