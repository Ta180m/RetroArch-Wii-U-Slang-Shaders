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

void main()
{
   vec4 screen = pow(texture(Source, vTexCoord), vec4(2.2)). rgba;
   vec4 avglum = vec4(0.5);
   screen = mix(screen, avglum,(1.0 - 1.0));


mat4 color = mat4(0.83, 0.105, 0.105, 0.0,
       0.20, 0.65, 0.13, 0.0,
       - 0.03, 0.245, 0.765, 0.0,
       0.0, 0.0, 0.0, 0.0);

mat4 adjust = mat4((1.0 - 1.0)* 0.3086 + 1.0,(1.0 - 1.0)* 0.3086,(1.0 - 1.0)* 0.3086, 1.0,
(1.0 - 1.0)* 0.6094,(1.0 - 1.0)* 0.6094 + 1.0,(1.0 - 1.0)* 0.6094, 1.0,
(1.0 - 1.0)* 0.0820,(1.0 - 1.0)* 0.0820,(1.0 - 1.0)* 0.0820 + 1.0, 1.0,
0.0, 0.0, 0.0, 1.0);
 color *= adjust;
 screen = clamp(screen * 1.0, 0.0, 1.0);
 screen = color * screen;
 FragColor = pow(screen, vec4(1.0 / 2.2));
}
