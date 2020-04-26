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
   float amp;
   float phase;
   float lines_black;
   float lines_white;
}params;

#pragma parameteramp¡1.25000.0002.0000.05
#pragma parameterphase¡0.50000.0002.0000.05
#pragma parameterlines_black¡0.00000.0001.0000.05
#pragma parameterlines_white¡1.00000.0002.0000.05

layout(std140) uniform UBO
{
   mat4 MVP;
}global;





layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in float angle;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    vec3 color = texture(Source, vTexCoord). xyz;
    float grid;

    float lines;

    lines = sin(angle);
    lines *= params . amp;
    lines += 0.000000;
    lines = abs(lines);
    lines *= params . lines_white - params . lines_black;
    lines += params . lines_black;
    color *= lines;

    FragColor = vec4(color . xyz, 1.0);
}
