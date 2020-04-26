#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4











uniform Push
{
   float darken_screen;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;

#pragma parameterdarken_screen¡0.0-0.252.00.05
















layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec4 screen = pow(texture(Source, vTexCoord), vec4(2.2 + params . darken_screen)). rgba;


   mat4 color = mat4(0.78824, 0.025, 0.12039, 0.0,
                      0.12157, 0.72941, 0.12157, 0.0,
                      0.0, 0.275000, 0.82, 0.0,
                       0.0, 0.0, 0.0, 0.0);

   screen = color * screen;
   FragColor = pow(screen, vec4(1.0 / 2.2));
}
