#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4






















uniform Push
{
   vec4 SourceSize;
   vec4 OriginalSize;
   vec4 OutputSize;
   uint FrameCount;
   float BEVEL_LEVEL;
}params;

#pragma parameterBEVEL_LEVEL¡0.20.00.50.01


layout(std140) uniform UBO
{
   mat4 MVP;
}global;








vec3 bevel(vec2 pos, vec3 color)
{
    vec3 weight;

    float r = sqrt(dot(pos, vec2(1.0)));

    vec3 delta = mix(vec3(params . BEVEL_LEVEL), vec3(1.0 - params . BEVEL_LEVEL), color);

    weight = delta *(1 - r);

    return color + weight;
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    vec2 position = fract(vTexCoord * params . SourceSize . xy);

    vec3 color = pow(texture(Source, vTexCoord). rgb, vec3(2.4, 2.4, 2.4));

    color = clamp(bevel(position, color), 0.0, 1.0);

   FragColor = vec4(pow(color, vec3(1.0 / 2.2, 1.0 / 2.2, 1.0 / 2.2)), 1.0);
}
