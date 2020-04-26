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
   uint FrameCount;
}global;
























mat3 mix_mat = mat3(
          1.0, 1.0, 1.0,
           1.0, 2.0 * 1.0, 0.0,
           1.0, 0.0, 2.0 * 1.0
);


mat3 yiq2rgb_mat = mat3(
   1.0, 0.956, 0.6210,
   1.0, - 0.2720, - 0.6474,
   1.0, - 1.1060, 1.7046);

vec3 yiq2rgb(vec3 yiq)
{
   return yiq * yiq2rgb_mat;
}

mat3 yiq_mat = mat3(
      0.2989, 0.5870, 0.1140,
      0.5959, - 0.2744, - 0.3216,
      0.2115, - 0.5229, 0.3114
);

vec3 rgb2yiq(vec3 col)
{
   return col * yiq_mat;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 pix_no;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
   pix_no = TexCoord * global . SourceSize . xy *(global . OutputSize . xy / global . SourceSize . xy);
}

