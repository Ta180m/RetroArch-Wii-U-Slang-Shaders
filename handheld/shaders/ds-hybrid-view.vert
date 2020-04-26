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

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
 vec2 video_scale = floor(params . SourceSize . zw * params . OutputSize . xy);
 vec2 integer_scale = video_scale * params . SourceSize . xy;
 gl_Position =(global . MVP * Position);
 vTexCoord = TexCoord * 1.00001;
 vTexCoord *= vec2(1.333, 0.5);
}

