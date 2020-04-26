#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   uint FrameCount;
   float NTSC_CRT_GAMMA;
   float NTSC_DISPLAY_GAMMA;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

#pragma parameterNTSC_CRT_GAMMA¡2.50.010.00.1
#pragma parameterNTSC_DISPLAY_GAMMA¡2.10.010.00.1

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 one;
layout(location = 2) in vec2 pix_no;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;




void main()
{
   vec3 frame0 = pow(texture(Source, vTexCoord + vec2(0.0,(- 2.0)* one . y)). rgb, vec3(registers . NTSC_CRT_GAMMA));
   vec3 frame1 = pow(texture(Source, vTexCoord + vec2(0.0,(- 1.0)* one . y)). rgb, vec3(registers . NTSC_CRT_GAMMA));
   vec3 frame2 = pow(texture(Source, vTexCoord + vec2(0.0,(0.0)* one . y)). rgb, vec3(registers . NTSC_CRT_GAMMA));
   vec3 frame3 = pow(texture(Source, vTexCoord + vec2(0.0,(1.0)* one . y)). rgb, vec3(registers . NTSC_CRT_GAMMA));
   vec3 frame4 = pow(texture(Source, vTexCoord + vec2(0.0,(2.0)* one . y)). rgb, vec3(registers . NTSC_CRT_GAMMA));

   float offset_dist = fract(pix_no . y)- 0.5;
   float dist0 = 2.0 + offset_dist;
   float dist1 = 1.0 + offset_dist;
   float dist2 = 0.0 + offset_dist;
   float dist3 = - 1.0 + offset_dist;
   float dist4 = - 2.0 + offset_dist;

   vec3 scanline = frame0 * exp(- 5.0 * dist0 * dist0);
   scanline += frame1 * exp(- 5.0 * dist1 * dist1);
   scanline += frame2 * exp(- 5.0 * dist2 * dist2);
   scanline += frame3 * exp(- 5.0 * dist3 * dist3);
   scanline += frame4 * exp(- 5.0 * dist4 * dist4);

FragColor = vec4(pow(1.15 * scanline, vec3(1.0 / registers . NTSC_DISPLAY_GAMMA)), 1.0);
}
