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

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

