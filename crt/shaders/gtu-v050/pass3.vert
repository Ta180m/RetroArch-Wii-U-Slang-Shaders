#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4


uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float noScanlines;
   float tvVerticalResolution;
   float blackLevel;
   float contrast;
   float compositeConnection;
}params;

#pragma parameternoScanlines¡0.00.01.01.0
#pragma parametertvVerticalResolution¡250.020.01000.010.0
#pragma parameterblackLevel¡0.07-0.300.300.01
#pragma parametercontrast¡1.00.02.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;







#pragma parametercompositeConnection¡0.00.01.01.0






float normalGaussIntegral(float x)
{
   float a1 = 0.4361836;
   float a2 = - 0.1201676;
   float a3 = 0.9372980;
   float p = 0.3326700;
   float t = 1.0 /(1.0 + p * abs(x));
   return(0.5 -((exp(-(x)*(x)* 0.5))/ sqrt(2.0 * 3.14159265358))*(t *(a1 + t *(a2 + a3 * t))))* sign(x);
}

vec3 scanlines(float x, vec3 c){
   float temp = sqrt(2 * 3.14159265358)*(params . tvVerticalResolution * params . SourceSize . w);

   float rrr = 0.5 *(params . SourceSize . y * params . OutputSize . w);
   float x1 =(x + rrr)* temp;
   float x2 =(x - rrr)* temp;
   c . r =(c . r *(normalGaussIntegral(x1)- normalGaussIntegral(x2)));
   c . g =(c . g *(normalGaussIntegral(x1)- normalGaussIntegral(x2)));
   c . b =(c . b *(normalGaussIntegral(x1)- normalGaussIntegral(x2)));
   c *=(params . OutputSize . y * params . SourceSize . w);
   return c;
}















layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

