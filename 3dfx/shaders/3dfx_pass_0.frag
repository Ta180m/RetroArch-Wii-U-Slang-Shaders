#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4











float erroredtable[16] = float[16](float(16), float(4), float(13), float(1), float(8), float(12), float(5), float(9), float(14), float(2), float(15), float(3), float(6), float(10), float(7), float(11
));

uniform Push
{
   vec4 SourceSize;
   vec4 OriginalSize;
   vec4 OutputSize;
   uint FrameCount;
   float LEIFX_LINES;
}params;

#pragma parameterLEIFX_LINES¡0.050.001.000.01






















layout(std140) uniform UBO
{
   mat4 MVP;
}global;




layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
      vec2 res;
      vec3 outcolor = texture(Source, vTexCoord). rgb;
 res . x = params . SourceSize . x;
 res . y = params . SourceSize . y;

      vec2 ditheu = vTexCoord . xy * res . xy;

 ditheu . x = vTexCoord . x * res . x;
 ditheu . y = vTexCoord . y * res . y;




 int ditdex = int(mod(ditheu . x, 4.0))* 4 + int(mod(ditheu . y, 4.0));
 vec3 color;
 vec3 colord;
 color . r = outcolor . r * 255;
 color . g = outcolor . g * 255;
 color . b = outcolor . b * 255;
 float yeh = 0.0;
 float ohyes = 0.0;


 if(yeh ++ == ditdex)ohyes = erroredtable[0];
 else if(yeh ++ == ditdex)ohyes = erroredtable[1];
 else if(yeh ++ == ditdex)ohyes = erroredtable[2];
 else if(yeh ++ == ditdex)ohyes = erroredtable[3];
 else if(yeh ++ == ditdex)ohyes = erroredtable[4];
 else if(yeh ++ == ditdex)ohyes = erroredtable[5];
 else if(yeh ++ == ditdex)ohyes = erroredtable[6];
 else if(yeh ++ == ditdex)ohyes = erroredtable[7];
 else if(yeh ++ == ditdex)ohyes = erroredtable[8];
 else if(yeh ++ == ditdex)ohyes = erroredtable[9];
 else if(yeh ++ == ditdex)ohyes = erroredtable[10];
 else if(yeh ++ == ditdex)ohyes = erroredtable[11];
 else if(yeh ++ == ditdex)ohyes = erroredtable[12];
 else if(yeh ++ == ditdex)ohyes = erroredtable[13];
 else if(yeh ++ == ditdex)ohyes = erroredtable[14];
 else if(yeh ++ == ditdex)ohyes = erroredtable[15];


 ohyes = 17 -(ohyes - 1);
 ohyes *= 0.5f;
 ohyes += - 1;

 colord . r = color . r + ohyes;
 colord . g = color . g +(ohyes / 2);
 colord . b = color . b + ohyes;
 outcolor . rgb = colord . rgb * 0.003921568627451;





      vec3 why = vec3(1.0);
      vec3 reduceme = vec3(1.0);
 float radooct = 32;

 reduceme . r = pow(outcolor . r, why . r);
 reduceme . r *= radooct;
 reduceme . r = int(floor(reduceme . r));
 reduceme . r /= radooct;
 reduceme . r = pow(reduceme . r, why . r);

 reduceme . g = pow(outcolor . g, why . g);
 reduceme . g *= radooct * 2;
 reduceme . g = int(floor(reduceme . g));
 reduceme . g /= radooct * 2;
 reduceme . g = pow(reduceme . g, why . g);

 reduceme . b = pow(outcolor . b, why . b);
 reduceme . b *= radooct;
 reduceme . b = int(floor(reduceme . b));
 reduceme . b /= radooct;
 reduceme . b = pow(reduceme . b, why . b);

 outcolor . rgb = reduceme . rgb;


 {
  float leifx_linegamma =(params . LEIFX_LINES / 10);
  float horzline1 =(mod(ditheu . y, 2.0));
  if(horzline1 < 1)leifx_linegamma = 0;

  outcolor . r += leifx_linegamma;
  outcolor . b += leifx_linegamma;
 }

   FragColor = vec4(outcolor, 1.0);
}
