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
          1.0, 0.0, 0.0,
           0.0, 2.0 * 1.0, 0.0,
           0.0, 0.0, 2.0 * 1.0
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
layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 pix_no;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec3 col = texture(Source, vTexCoord). rgb;
vec3 yiq = rgb2yiq(col);


float chroma_phase = 3.14159265 *(mod(pix_no . y, 2.0)+ global . FrameCount);




float mod_phase = chroma_phase + pix_no . x *(4.0 * 3.14159265 / 15.0);

float i_mod = cos(mod_phase);
float q_mod = sin(mod_phase);

yiq . yz *= vec2(i_mod, q_mod);
yiq *= mix_mat;
yiq . yz *= vec2(i_mod, q_mod);
FragColor = vec4(yiq, 1.0);

}
