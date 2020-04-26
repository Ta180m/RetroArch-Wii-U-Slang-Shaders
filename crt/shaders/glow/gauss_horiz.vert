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

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out float data_pix_no;
layout(location = 2) out float data_one;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;

    data_pix_no = vTexCoord . x * global . SourceSize . x;
    data_one = global . SourceSize . z;
}

