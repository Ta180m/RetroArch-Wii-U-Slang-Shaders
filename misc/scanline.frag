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
   float SCANLINE_BASE_BRIGHTNESS;
   float SCANLINE_SINE_COMP_A;
   float SCANLINE_SINE_COMP_B;
}params;

#pragma parameterSCANLINE_BASE_BRIGHTNESS¡0.950.01.00.01
#pragma parameterSCANLINE_SINE_COMP_A¡0.00.00.100.01
#pragma parameterSCANLINE_SINE_COMP_B¡0.150.01.00.05





layout(std140) uniform UBO
{
   mat4 MVP;
}global;



layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 omega;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec2 sine_comp = vec2(params . SCANLINE_SINE_COMP_A, params . SCANLINE_SINE_COMP_B);
   vec3 res = texture(Source, vTexCoord). xyz;
   vec3 scanline = res *(params . SCANLINE_BASE_BRIGHTNESS + dot(sine_comp * sin(vTexCoord * omega), vec2(1.0, 1.0)));
   FragColor = vec4(scanline . x, scanline . y, scanline . z, 1.0);
}
