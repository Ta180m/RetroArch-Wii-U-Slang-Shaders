#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float display_gamma;
   float target_gamma;
   float sat;
   float lum;
   float cntrst;
   float r;
   float g;
   float b;
   float rg;
   float rb;
   float gr;
   float gb;
   float br;
   float bg;
   float blr;
   float blg;
   float blb;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;






#pragma parameterdisplay_gamma¡2.20.010.00.1
#pragma parametertarget_gamma¡2.20.010.00.1
#pragma parametersat¡1.00.03.00.01
#pragma parameterlum¡1.00.05.00.01
#pragma parametercntrst¡1.00.02.00.01
#pragma parameterr¡1.00.02.00.01
#pragma parameterg¡1.00.02.00.01
#pragma parameterb¡1.00.02.00.01
#pragma parameterrg¡0.00.01.00.005
#pragma parameterrb¡0.00.01.00.005
#pragma parametergr¡0.00.01.00.005
#pragma parametergb¡0.00.01.00.005
#pragma parameterbr¡0.00.01.00.005
#pragma parameterbg¡0.00.01.00.005
#pragma parameterblr¡0.00.01.00.005
#pragma parameterblg¡0.00.01.00.005
#pragma parameterblb¡0.00.01.00.005

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec4 screen = pow(texture(Source, vTexCoord), vec4(params . target_gamma)). rgba;
   vec4 avglum = vec4(0.5);
   screen = mix(screen, avglum,(1.0 - params . cntrst));


mat4 color = mat4(params . r, params . rg, params . rb, 0.0,
      params . gr, params . g, params . gb, 0.0,
      params . br, params . bg, params . b, 0.0,
     params . blr, params . blg, params . blb, 0.0);

mat4 adjust = mat4((1.0 - params . sat)* 0.3086 + params . sat,(1.0 - params . sat)* 0.3086,(1.0 - params . sat)* 0.3086, 1.0,
(1.0 - params . sat)* 0.6094,(1.0 - params . sat)* 0.6094 + params . sat,(1.0 - params . sat)* 0.6094, 1.0,
(1.0 - params . sat)* 0.0820,(1.0 - params . sat)* 0.0820,(1.0 - params . sat)* 0.0820 + params . sat, 1.0,
0.0, 0.0, 0.0, 1.0);
 color *= adjust;
 screen = clamp(screen * params . lum, 0.0, 1.0);
 screen = color * screen;
 FragColor = pow(screen, vec4(1.0 / params . display_gamma));
}
