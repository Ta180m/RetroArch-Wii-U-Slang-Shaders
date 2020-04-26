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

float luma_filter[24 + 1]= float[24 + 1](
   - 0.000012020,
   - 0.000022146,
   - 0.000013155,
   - 0.000012020,
   - 0.000049979,
   - 0.000113940,
   - 0.000122150,
   - 0.000005612,
   0.000170516,
   0.000237199,
   0.000169640,
   0.000285688,
   0.000984574,
   0.002018683,
   0.002002275,
   - 0.000909882,
   - 0.007049081,
   - 0.013222860,
   - 0.012606931,
   0.002460860,
   0.035868225,
   0.084016453,
   0.135563500,
   0.175261268,
   0.190176552);

float chroma_filter[24 + 1]= float[24 + 1](
   - 0.000118847,
   - 0.000271306,
   - 0.000502642,
   - 0.000930833,
   - 0.001451013,
   - 0.002064744,
   - 0.002700432,
   - 0.003241276,
   - 0.003524948,
   - 0.003350284,
   - 0.002491729,
   - 0.000721149,
   0.002164659,
   0.006313635,
   0.011789103,
   0.018545660,
   0.026414396,
   0.035100710,
   0.044196567,
   0.053207202,
   0.061590275,
   0.068803602,
   0.074356193,
   0.077856564,
   0.079052396);







layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 float one_x = 1.0 / global . SourceSize . x;
vec3 signal = vec3(0.0);
for(int i = 0;i < 24;i ++)
{
   float offset = float(i);

   vec3 sums = texture(Source, vTexCoord + vec2((offset - float(24))*(one_x), 0.0)). xyz +
                                              texture(Source, vTexCoord + vec2((float(24)- offset)*(one_x), 0.0)). xyz;

   signal += sums * vec3(luma_filter[i], chroma_filter[i], chroma_filter[i]);
}
signal += texture(Source, vTexCoord). xyz *
   vec3(luma_filter[24], chroma_filter[24], chroma_filter[24]);
vec3 rgb = yiq2rgb(signal);
FragColor = vec4(pow(rgb, vec3(2.5 / 2.0)), 1.0);
}
