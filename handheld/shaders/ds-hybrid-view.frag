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
   float screen_toggle;
   float aspect_correction;
   float filter_small;
}params;

#pragma parameterscreen_toggle¡0.00.00.50.5
#pragma parameteraspect_correction¡1.00.55.00.01
#pragma parameterfilter_small¡1.00.01.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in float video_scale;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Original;
uniform sampler2D Source;

void main()
{
 vec2 bigCoord = vTexCoord + vec2(0., 0. + params . screen_toggle);
 vec2 smallCoord = vTexCoord * vec2(3.)+ vec2(- 3., 0.);
 FragColor = texture(Source, bigCoord);
 FragColor +=(params . filter_small > 0.5)? texture(Source, smallCoord): texture(Original, smallCoord);
}
