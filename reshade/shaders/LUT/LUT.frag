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
   float LUT_Size;
}params;

#pragma parameterLUT_Size¡16.01.064.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D SamplerLUT;




vec4 mixfix(vec4 a, vec4 b, float c)
{
 return(a . z < 1.0)? mix(a, b, c): a;
}

void main()
{
 vec4 imgColor = texture(Source, vTexCoord . xy);
 float red =(imgColor . r *(params . LUT_Size - 1.0)+ 0.4999)/(params . LUT_Size * params . LUT_Size);
 float green =(imgColor . g *(params . LUT_Size - 1.0)+ 0.4999)/ params . LUT_Size;
 float blue1 =(floor(imgColor . b *(params . LUT_Size - 1.0))/ params . LUT_Size)+ red;
 float blue2 =(ceil(imgColor . b *(params . LUT_Size - 1.0))/ params . LUT_Size)+ red;
 float mixer = clamp(max((imgColor . b - blue1)/(blue2 - blue1), 0.0), 0.0, 32.0);
 vec4 color1 = texture(SamplerLUT, vec2(blue1, green));
 vec4 color2 = texture(SamplerLUT, vec2(blue2, green));
 FragColor = mixfix(color1, color2, mixer);
}
