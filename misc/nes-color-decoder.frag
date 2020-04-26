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

uniform Push
{
   float nes_saturation;
   float nes_hue;
   float nes_contrast;
   float nes_brightness;
   float nes_gamma;
   float nes_sony_matrix;
   float nes_clip_method;
}params;

#pragma parameternes_saturation¡1.00.05.00.05
#pragma parameternes_hue¡0.0-360.0360.01.0
#pragma parameternes_contrast¡1.00.02.00.05
#pragma parameternes_brightness¡1.00.02.00.05
#pragma parameternes_gamma¡1.81.02.50.05
#pragma parameternes_sony_matrix¡0.00.01.01.0
#pragma parameternes_clip_method¡0.00.02.01.0












bool wave(int p, int color)
{
   return((color + p + 8)% 12 < 6);
}

float gammafix(float f)
{
   return f < 0.0 ? 0.0 : pow(f, 2.2 / params . nes_gamma);
}

vec3 huePreserveClipDarken(float r, float g, float b)
{
   float ratio = 1.0;
   if((r > 1.0)||(g > 1.0)||(b > 1.0))
   {
      float max = r;
      if(g > max)
         max = g;
      if(b > max)
         max = b;
      ratio = 1.0 / max;
   }

   r *= ratio;
   g *= ratio;
   b *= ratio;

   r = clamp(r, 0.0, 1.0);
   g = clamp(g, 0.0, 1.0);
   b = clamp(b, 0.0, 1.0);

   return vec3(r, g, b);
}

vec3 huePreserveClipDesaturate(float r, float g, float b)
{
   float l =(.299 * r)+(0.587 * g)+(0.114 * b);
   bool ovr = false;
   float ratio = 1.0;

   if((r > 1.0)||(g > 1.0)||(b > 1.0))
   {
      ovr = true;
      float max = r;
      if(g > max)max = g;
      if(b > max)max = b;
      ratio = 1.0 / max;
   }

   if(ovr)
   {
      r -= 1.0;
      g -= 1.0;
      b -= 1.0;
      r *= ratio;
      g *= ratio;
      b *= ratio;
      r += 1.0;
      g += 1.0;
      b += 1.0;
   }

   r = clamp(r, 0.0, 1.0);
   g = clamp(g, 0.0, 1.0);
   b = clamp(b, 0.0, 1.0);

   return vec3(r, g, b);
}

vec3 MakeRGBColor(int emphasis, int level, int color)
{
   float y = 0.0;
   float i = 0.0;
   float q = 0.0;

   float r = 0.0;
   float g = 0.0;
   float b = 0.0;

   float yiq2rgb[6];


   level =(color < 14)? level : 1;


   float black = 0.518;
   float white = 1.962;
   float attenuation = 0.746;
   float levels[8]= float[](0.350, 0.518, 0.962, 1.550,
                                       1.094, 1.506, 1.962, 1.962);

   float low = levels[level + 4 * int(color == 0)];
   float high = levels[level + 4 * int(color < 13)];


   for(int p = 0;p < 12;p ++)
   {

      float spot = wave(p, color)? high : low;


      if((bool(emphasis & 1)&& wave(p, 12))||
          (bool(emphasis & 2)&& wave(p, 4))||
          (bool(emphasis & 4)&& wave(p, 8)))
      {
          spot *= attenuation;
      }


      float v =(spot - black)/(white - black);



      v =(v - 0.5)* params . nes_contrast + 0.5;
      v *=(params . nes_brightness / 12.0);

      float hue_tweak = params . nes_hue * 12.0 / 360.0;

      y += v;
      i += v * cos((3.141592653 / 6.0)*(p + hue_tweak));
      q += v * sin((3.141592653 / 6.0)*(p + hue_tweak));

   }

   i *= params . nes_saturation;
   q *= params . nes_saturation;

   if(params . nes_sony_matrix > 0.5)
   {

      yiq2rgb[0]= 1.630;
      yiq2rgb[1]= 0.317;
      yiq2rgb[2]= - 0.378;
      yiq2rgb[3]= - 0.466;
      yiq2rgb[4]= - 1.089;
      yiq2rgb[5]= 1.677;
   }
   else
   {


      yiq2rgb[0]= 0.946882;
      yiq2rgb[1]= 0.623557;
      yiq2rgb[2]= - 0.274788;
      yiq2rgb[3]= - 0.635691;
      yiq2rgb[4]= - 1.108545;
      yiq2rgb[5]= 1.709007;









   }


   r = gammafix(y + yiq2rgb[0]* i + yiq2rgb[1]* q);
   g = gammafix(y + yiq2rgb[2]* i + yiq2rgb[3]* q);
   b = gammafix(y + yiq2rgb[4]* i + yiq2rgb[5]* q);

   vec3 corrected_rgb;


   if(params . nes_clip_method < 0.5)
   {

      r = clamp(r, 0.0, 1.0);
      g = clamp(g, 0.0, 1.0);
      b = clamp(b, 0.0, 1.0);
      corrected_rgb = vec3(r, g, b);
   }
   else if(params . nes_clip_method == 1.0)
   {

      corrected_rgb = huePreserveClipDarken(r, g, b);
   }
   else if(params . nes_clip_method == 2.0)
   {

      corrected_rgb = huePreserveClipDesaturate(r, g, b);
   }

   return corrected_rgb;
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec4 c = texture(Source, vTexCoord . xy);


   int color = int(floor((c . r * 15.0)+ 0.5));
   int level = int(floor((c . g * 3.0)+ 0.5));
   int emphasis = int(floor((c . b * 7.0)+ 0.5));

   vec3 out_color = MakeRGBColor(emphasis, level, color);
   FragColor = vec4(out_color, 1.0);
}
