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
   float PHOSPHOR_SCALE_X;
   float PHOSPHOR_SCALE_Y;
   float phosphor_layout;
}params;

#pragma parameterPHOSPHOR_SCALE_X¡2.01.012.01.0
#pragma parameterPHOSPHOR_SCALE_Y¡4.01.012.01.0
#pragma parameterphosphor_layout¡1.01.03.01.0





layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D shadow;
uniform sampler2D aperture;
uniform sampler2D slot;
uniform sampler2D firstPass;

void main()
{
 vec4 screen = vec4(texture(firstPass, vTexCoord). rgb, 1.0);
 vec2 LUTeffectiveCoord = vec2(fract(vTexCoord . x * params . SourceSize . x / params . PHOSPHOR_SCALE_X), fract(vTexCoord . y * params . SourceSize . y / params . PHOSPHOR_SCALE_Y));
 vec4 phosphor_grid;
 if(params . phosphor_layout == 1.0)phosphor_grid = vec4(texture(shadow, LUTeffectiveCoord). rgb, 1.0);
 if(params . phosphor_layout == 2.0)phosphor_grid = vec4(texture(aperture, LUTeffectiveCoord). rgb, 1.0);
 if(params . phosphor_layout == 3.0)phosphor_grid = vec4(texture(slot, LUTeffectiveCoord). rgb, 1.0);
   FragColor = screen * phosphor_grid;
}
