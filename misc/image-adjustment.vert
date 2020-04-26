#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4


uniform Push
{
   vec4 SourceSize;
   uint FrameCount;
   float ia_target_gamma;
   float ia_monitor_gamma;
   float ia_overscan_percent_x;
   float ia_overscan_percent_y;
   float ia_saturation;
   float ia_contrast;
   float ia_luminance;
   float ia_black_level;
   float ia_bright_boost;
   float ia_R;
   float ia_G;
   float ia_B;
   float ia_ZOOM;
   float ia_XPOS;
   float ia_YPOS;
   float ia_TOPMASK;
   float ia_BOTMASK;
   float ia_LMASK;
   float ia_RMASK;
   float ia_GRAIN_STR;
   float ia_SHARPEN;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
   float ia_FLIP_HORZ;
   float ia_FLIP_VERT;
}global;

#pragma parameteria_target_gamma¡2.20.15.00.1
#pragma parameteria_monitor_gamma¡2.20.15.00.1
#pragma parameteria_overscan_percent_x¡0.0-25.025.01.0
#pragma parameteria_overscan_percent_y¡0.0-25.025.01.0
#pragma parameteria_saturation¡1.00.05.00.1
#pragma parameteria_contrast¡1.00.010.00.05
#pragma parameteria_luminance¡1.00.02.00.1
#pragma parameteria_black_level¡0.00-0.300.300.01
#pragma parameteria_bright_boost¡0.0-1.01.00.05
#pragma parameteria_R¡1.00.02.00.05
#pragma parameteria_G¡1.00.02.00.05
#pragma parameteria_B¡1.00.02.00.05
#pragma parameteria_ZOOM¡1.00.04.00.01
#pragma parameteria_XPOS¡0.0-2.02.00.005
#pragma parameteria_YPOS¡0.0-2.02.00.005
#pragma parameteria_TOPMASK¡0.00.01.00.0025
#pragma parameteria_BOTMASK¡0.00.01.00.0025
#pragma parameteria_LMASK¡0.00.01.00.0025
#pragma parameteria_RMASK¡0.00.01.00.0025
#pragma parameteria_GRAIN_STR¡0.00.072.06.0
#pragma parameteria_SHARPEN¡0.00.01.00.05
#pragma parameteria_FLIP_HORZ¡0.00.01.01.0
#pragma parameteria_FLIP_VERT¡0.00.01.01.0














vec3 EncodeGamma(vec3 color, float gamma)
{
    color = clamp(color, 0.0, 1.0);
    color . r =(color . r <= 0.0404482362771082)?
    color . r / 12.92 : pow((color . r + 0.055)/ 1.055, gamma);
    color . g =(color . g <= 0.0404482362771082)?
    color . g / 12.92 : pow((color . g + 0.055)/ 1.055, gamma);
    color . b =(color . b <= 0.0404482362771082)?
    color . b / 12.92 : pow((color . b + 0.055)/ 1.055, gamma);

    return color;
}

vec3 DecodeGamma(vec3 color, float gamma)
{
    color = clamp(color, 0.0, 1.0);
    color . r =(color . r <= 0.00313066844250063)?
    color . r * 12.92 : 1.055 * pow(color . r, 1.0 / gamma)- 0.055;
    color . g =(color . g <= 0.00313066844250063)?
    color . g * 12.92 : 1.055 * pow(color . g, 1.0 / gamma)- 0.055;
    color . b =(color . b <= 0.00313066844250063)?
    color . b * 12.92 : 1.055 * pow(color . b, 1.0 / gamma)- 0.055;

    return color;
}













vec3 RGBtoXYZ(vec3 RGB)
  {
      mat3x3 m = mat3x3(
      0.6068909, 0.1735011, 0.2003480,
      0.2989164, 0.5865990, 0.1144845,
      0.0000000, 0.0660957, 1.1162243);

    return RGB * m;
  }

vec3 XYZtoRGB(vec3 XYZ)
  {
      mat3x3 m = mat3x3(
      1.9099961, - 0.5324542, - 0.2882091,
     - 0.9846663, 1.9991710, - 0.0283082,
      0.0583056, - 0.1183781, 0.8975535);

    return XYZ * m;
}

vec3 XYZtoSRGB(vec3 XYZ)
{
    mat3x3 m = mat3x3(
    3.2404542, - 1.5371385, - 0.4985314,
   - 0.9692660, 1.8760108, 0.0415560,
    0.0556434, - 0.2040259, 1.0572252);

    return XYZ * m;
  }

vec3 RGBtoYUV(vec3 RGB)
 {
     mat3x3 m = mat3x3(
     0.2126, 0.7152, 0.0722,
    - 0.09991, - 0.33609, 0.436,
     0.615, - 0.55861, - 0.05639);

     return RGB * m;
 }

vec3 YUVtoRGB(vec3 YUV)
 {
     mat3x3 m = mat3x3(
     1.000, 0.000, 1.28033,
     1.000, - 0.21482, - 0.38059,
     1.000, 2.12798, 0.000);

      return YUV * m;
  }

vec3 RGBtoYIQ(vec3 RGB)
  {
     mat3x3 m = mat3x3(
     0.2989, 0.5870, 0.1140,
     0.5959, - 0.2744, - 0.3216,
     0.2115, - 0.5229, 0.3114);
     return RGB * m;
  }

vec3 YIQtoRGB(vec3 YIQ)
  {
     mat3x3 m = mat3x3(
     1.0, 0.956, 0.6210,
     1.0, - 0.2720, - 0.6474,
     1.0, - 1.1060, 1.7046);
   return YIQ * m;
  }

vec3 XYZtoYxy(vec3 XYZ)
  {
    float w =(XYZ . r + XYZ . g + XYZ . b);
      vec3 Yxy;
    Yxy . r = XYZ . g;
    Yxy . g = XYZ . r / w;
    Yxy . b = XYZ . g / w;

      return Yxy;
  }

vec3 YxytoXYZ(vec3 Yxy)
  {
    vec3 XYZ;
    XYZ . g = Yxy . r;
    XYZ . r = Yxy . r * Yxy . g / Yxy . b;
    XYZ . b = Yxy . r *(1.0 - Yxy . g - Yxy . b)/ Yxy . b;

    return XYZ;
  }


vec4 RGBtoCMYK(vec3 RGB){
 float Red = RGB . r;
 float Green = RGB . g;
 float Blue = RGB . b;
 float Black = min(1.0 - Red, min(1.0 - Green, 1.0 - Blue));
 float Cyan =(1.0 - Red - Black)/(1.0 - Black);
 float Magenta =(1.0 - Green - Black)/(1.0 - Black);
 float Yellow =(1.0 - Blue - Black)/(1.0 - Black);
 return vec4(Cyan, Magenta, Yellow, Black);
}

vec3 CMYKtoRGB(vec4 CMYK){
 float Cyan = CMYK . x;
 float Magenta = CMYK . y;
 float Yellow = CMYK . z;
 float Black = CMYK . w;
 float Red = 1.0 - min(1.0, Cyan *(1.0 - Black)+ Black);
 float Green = 1.0 - min(1.0, Magenta *(1.0 - Black)+ Black);
 float Blue = 1.0 - min(1.0, Yellow *(1.0 - Black)+ Black);
 return vec3(Red, Green, Blue);
}


vec3 HUEtoRGB(float H)
{
    float R = abs(H * 6.0 - 3.0)- 1.0;
    float G = 2.0 - abs(H * 6.0 - 2.0);
    float B = 2.0 - abs(H * 6.0 - 4.0);

    return clamp(vec3(R, G, B), 0.0, 1.0);
}


vec3 RGBtoHCV(vec3 RGB)
{
    vec4 BG = vec4(RGB . bg, - 1.0, 2.0 / 3.0);
    vec4 GB = vec4(RGB . gb, 0.0, - 1.0 / 3.0);

    vec4 P =(RGB . g < RGB . b)? BG : GB;

    vec4 XY = vec4(P . xyw, RGB . r);
    vec4 YZ = vec4(RGB . r, P . yzx);

    vec4 Q =(RGB . r < P . x)? XY : YZ;

    float C = Q . x - min(Q . w, Q . y);
    float H = abs((Q . w - Q . y)/(6.0 * C + 1e-10)+ Q . z);

    return vec3(H, C, Q . x);
}

vec3 RGBtoHSV(vec3 c)
{
    vec4 K = vec4(0.0, - 1.0 / 3.0, 2.0 / 3.0, - 1.0);
    vec4 p = c . g < c . b ? vec4(c . bg, K . wz): vec4(c . gb, K . xy);
    vec4 q = c . r < p . x ? vec4(p . xyw, c . r): vec4(c . r, p . yzx);

    float d = q . x - min(q . w, q . y);
    float e = 1.0e-10;
    return vec3(abs(q . z +(q . w - q . y)/(6.0 * d + e)), d /(q . x + e), q . x);
}

vec3 HSVtoRGB(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c . xxx + K . xyz)* 6.0 - K . www);
    return c . z * mix(K . xxx, clamp(p - K . xxx, 0.0, 1.0), c . y);
}


vec3 NTSC(vec3 c)
 {
     vec3 v = vec3(pow(c . r, 2.2), pow(c . g, 2.2), pow(c . b, 2.2));
     return RGBtoXYZ(v);
 }


vec3 sRGB(vec3 c)
 {
     vec3 v = XYZtoSRGB(c);
     v = DecodeGamma(v, 2.4);

     return v;
 }


vec3 NTSCtoSRGB(vec3 c)
 {
     return sRGB(NTSC(c));
 }


vec3 filmGrain(vec2 uv, float strength){
    float x =(uv . x + 4.0)*(uv . y + 4.0)*((mod(vec2(registers . FrameCount, registers . FrameCount). x, 800.0)+ 10.0)* 10.0);
 return vec3(mod((mod(x, 13.0)+ 1.0)*(mod(x, 123.0)+ 1.0), 0.01)- 0.005)* strength;
}



vec3 sharp(sampler2D tex, vec2 texCoord){
 vec2 p = texCoord . xy;
 p = p * registers . SourceSize . xy + vec2(0.5, 0.5);
 vec2 i = floor(p);
 vec2 f = p - i;
 f = f * f * f *(f *(f * 6.0 - vec2(15.0, 15.0))+ vec2(10.0, 10.0));
 p = i + f;
 p =(p - vec2(0.5, 0.5))* registers . SourceSize . zw;
 return texture(tex, p). rgb;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   vec4 flip_pos = Position;
   if(global . ia_FLIP_HORZ > 0.5)flip_pos . x = 1.0 - flip_pos . x;
   if(global . ia_FLIP_VERT > 0.5)flip_pos . y = 1.0 - flip_pos . y;
   gl_Position = global . MVP * flip_pos;
   vec2 shift = vec2(0.5);
   vec2 overscan_coord =((TexCoord - shift)/ registers . ia_ZOOM)*(1.0 - vec2(registers . ia_overscan_percent_x / 100.0, registers . ia_overscan_percent_y / 100.0))+ shift;
   vTexCoord = overscan_coord + vec2(registers . ia_XPOS, registers . ia_YPOS);
}

