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









#pragma parameterdarken_screen¡0.5-0.252.00.05





















layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec4 screen = pow(texture(Source, vTexCoord), vec4(2.2 + params . darken_screen)). rgba;
   vec4 avglum = vec4(0.5);
   screen = mix(screen, avglum,(1.0 - 1.0));


mat4 color = mat4(0.845, 0.09, 0.16, 0.0,
       0.17, 0.68, 0.085, 0.0,
       - 0.015, 0.23, 0.755, 0.0,
       0.0, 0.0, 0.0, 0.0);

mat4 adjust = mat4((1.0 - 1.0)* 0.3086 + 1.0,(1.0 - 1.0)* 0.3086,(1.0 - 1.0)* 0.3086, 1.0,
(1.0 - 1.0)* 0.6094,(1.0 - 1.0)* 0.6094 + 1.0,(1.0 - 1.0)* 0.6094, 1.0,
(1.0 - 1.0)* 0.0820,(1.0 - 1.0)* 0.0820,(1.0 - 1.0)* 0.0820 + 1.0, 1.0,
0.0, 0.0, 0.0, 1.0);
 color *= adjust;
 screen = clamp(screen * 1.0, 0.0, 1.0);
 screen = color * screen;
 FragColor = pow(screen, vec4(1.0 /(2.2)));
}
