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
   float ScanlinesOpacity;
   float GammaCorrection;
}params;

#pragma parameterScanlinesOpacity¡0.90.01.00.05
#pragma parameterGammaCorrection¡1.20.52.00.1








layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D luminance_LUT;
uniform sampler2D color_LUT;
uniform sampler2D scanlines_LUT;






float luminancelut(vec4 org)
{
 vec4 imgColorLum = org;
 float redLum =(imgColorLum . r *(16.0 - 1.0)+ 0.4999)/(16.0 * 16.0);
 float greenLum =(imgColorLum . g *(16.0 - 1.0)+ 0.4999)/ 16.0;
 float blue1Lum =(floor(imgColorLum . b *(16.0 - 1.0))/ 16.0)+ redLum;
 float blue2Lum =(ceil(imgColorLum . b *(16.0 - 1.0))/ 16.0)+ redLum;
 float mixerLum = clamp(max((imgColorLum . b - blue1Lum)/(blue2Lum - blue1Lum), 0.0), 0.0, 32.0);
 float color1Lum = texture(luminance_LUT, vec2(blue1Lum, greenLum)). x;
 float color2Lum = texture(luminance_LUT, vec2(blue2Lum, greenLum)). x;
 return mix(color1Lum, color2Lum, mixerLum);
}





















void main()
{

 vec4 org = texture(Source, vTexCoord);



 float luminance = luminancelut(org);









 luminance = clamp(luminance, 0.0, 1.0);


 vec2 LUTeffectiveCoord = vec2(luminance, fract(vTexCoord . y * params . SourceSize . y));


 vec4 screen = texture(scanlines_LUT, LUTeffectiveCoord);





 FragColor =((screen * params . ScanlinesOpacity)+(1.0 - params . ScanlinesOpacity))*(org);
}
