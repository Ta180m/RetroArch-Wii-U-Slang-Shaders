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
   float diffusion;
   float out_gamma;
}params;

#pragma parameterdiffusion¡0.50.01.00.01
#pragma parameterout_gamma¡2.21.53.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D firstPass;
uniform sampler2D blurPass;
uniform sampler2D phosphorPass;


void main()
{
 vec3 scanlines = texture(firstPass, vTexCoord). rgb;

 vec3 blurH = texture(blurPass, vTexCoord). rgb;
 vec3 blurLines =(scanlines + blurH)/ 2.0;
 vec3 phosphors = texture(phosphorPass, vTexCoord). rgb;
 vec3 glow =(phosphors + blurH)/ 2.0;
 vec3 halation = mix(blurLines, phosphors, params . diffusion);

 halation = 1.0 -(1.0 - halation)*(1.0 - scanlines);
   FragColor = vec4(pow(halation, vec3(1.0 / params . out_gamma)), 1.0);
}
