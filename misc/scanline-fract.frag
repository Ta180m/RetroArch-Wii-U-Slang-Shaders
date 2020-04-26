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
   float THICKNESS;
   float DARKNESS;
   float BRIGHTBOOST;
}params;

#pragma parameterTHICKNESS¡2.01.012.01.0
#pragma parameterDARKNESS¡0.500.01.00.05
#pragma parameterBRIGHTBOOST¡1.11.01.20.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

vec3 RGBtoYIQ(vec3 RGB){
 mat3 yiqmat = mat3(
  0.2989, 0.5870, 0.1140,
  0.5959, - 0.2744, - 0.3216,
  0.2115, - 0.5229, 0.3114);
 return RGB * yiqmat;
}

vec3 YIQtoRGB(vec3 YIQ){
 mat3 rgbmat = mat3(
  1.0, 0.956, 0.6210,
  1.0, - 0.2720, - 0.6474,
  1.0, - 1.1060, 1.7046);
 return YIQ * rgbmat;
}

void main()
{
 float lines = fract(vTexCoord . y * params . SourceSize . y);
 float scale_factor = floor((params . OutputSize . y / params . SourceSize . y)+ 0.4999);
 vec4 screen = texture(Source, vTexCoord);
 screen . rgb = RGBtoYIQ(screen . rgb);
 screen . r *= params . BRIGHTBOOST;
 screen . rgb = YIQtoRGB(screen . rgb);

 FragColor =(lines >(1.0 / scale_factor * params . THICKNESS))? screen : screen * vec4(1.0 - params . DARKNESS);
}
