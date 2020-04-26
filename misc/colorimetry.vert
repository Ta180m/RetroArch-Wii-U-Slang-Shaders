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
   float color_mode;
   float white_point_d93;
   float clipping_method;
}params;

#pragma parametercolor_mode�0.00.02.01.0
#pragma parameterwhite_point_d93�1.00.01.01.0
#pragma parameterclipping_method�0.00.02.01.0





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

vec3 ApplyColorimetry(vec3 color)
{




   float R = color . r;
   float G = color . g;
   float B = color . b;

   float Rx = 0.0;
   float Ry = 0.0;
   float Gx = 0.0;
   float Gy = 0.0;
   float Bx = 0.0;
   float By = 0.0;
   float Wx = 0.0;
   float Wy = 0.0;

   if(params . white_point_d93 > 0.5)
   {
      Wx = 0.31;
      Wy = 0.316;
   }
   else
   {
      Wx = 0.3127;
      Wy = 0.329;
   }

   if(params . color_mode < 0.5)
   {


      Rx = 0.67;
      Ry = 0.33;
      Gx = 0.21;
      Gy = 0.71;
      Bx = 0.14;
      By = 0.08;
   }
   else if(params . color_mode == 1.0)
   {


      Rx = 0.63;
      Ry = 0.34;
      Gx = 0.31;
      Gy = 0.595;
      Bx = 0.155;
      By = 0.07;
   }
   else
   {


      Rx = 0.64;
      Ry = 0.33;
      Gx = 0.3;
      Gy = 0.6;
      Bx = 0.15;
      By = 0.06;
   }

   float Xr = Rx / Ry;
   float Xg = Gx / Gy;
   float Xb = Bx / By;
   float Xw = Wx / Wy;
   float Yr = 1.0;
   float Yg = 1.0;
   float Yb = 1.0;
   float Yw = 1.0;
   float Zr =(1.0 - Rx - Ry)/ Ry;
   float Zg =(1.0 - Gx - Gy)/ Gy;
   float Zb =(1.0 - Bx - By)/ By;
   float Zw =(1.0 - Wx - Wy)/ Wy;




   float sDet =(Xr *((Zb * Yg)-(Zg * Yb)))-(Yr *((Zb * Xg)-(Zg * Xb)))+(Zr *((Yb * Xg)-(Yg * Xb)));

   float Sr =((((Zb * Yg)-(Zg * Yb))/ sDet)* Xw)+((-((Zb * Xg)-(Zg * Xb))/ sDet)* Yw)+((((Yb * Xg)-(Yg * Xb))/ sDet)* Zw);
   float Sg =((-((Zb * Yr)-(Zr * Yb))/ sDet)* Xw)+((((Zb * Xr)-(Zr * Xb))/ sDet)* Yw)+((-((Yb * Xr)-(Yr * Xb))/ sDet)* Zw);
   float Sb =((((Zg * Yr)-(Zr * Yg))/ sDet)* Xw)+((-((Zg * Xr)-(Zr * Xg))/ sDet)* Yw)+((((Yg * Xr)-(Yr * Xg))/ sDet)* Zw);



   float convMatrix[9]= float[](0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

   convMatrix[0]= Sr * Xr;
   convMatrix[1]= Sg * Xg;
   convMatrix[2]= Sb * Xb;
   convMatrix[3]= Sr * Yr;
   convMatrix[4]= Sg * Yg;
   convMatrix[5]= Sb * Yb;
   convMatrix[6]= Sr * Zr;
   convMatrix[7]= Sg * Zg;
   convMatrix[8]= Sb * Zb;


   float X =(convMatrix[0]* R)+(convMatrix[1]* G)+(convMatrix[2]* B);
   float Y =(convMatrix[3]* R)+(convMatrix[4]* G)+(convMatrix[5]* B);
   float Z =(convMatrix[6]* R)+(convMatrix[7]* G)+(convMatrix[8]* B);





   float xyztorgb[9]= float[](3.2404, - 1.5371, - 0.4985, - 0.9693, 1.876, 0.0416, 0.0556, - 0.204, 1.0572);


   R =(xyztorgb[0]* X)+(xyztorgb[1]* Y)+(xyztorgb[2]* Z);
   G =(xyztorgb[3]* X)+(xyztorgb[4]* Y)+(xyztorgb[5]* Z);
   B =(xyztorgb[6]* X)+(xyztorgb[7]* Y)+(xyztorgb[8]* Z);

   vec3 corrected_rgb;


   if(params . clipping_method < 0.5)
   {

      R = clamp(R, 0.0, 1.0);
      G = clamp(G, 0.0, 1.0);
      B = clamp(B, 0.0, 1.0);
      corrected_rgb = vec3(R, G, B);
   }
   else if(params . clipping_method == 1.0)
   {

      corrected_rgb = huePreserveClipDarken(R, G, B);
   }
   else if(params . clipping_method == 2.0)
   {

      corrected_rgb = huePreserveClipDesaturate(R, G, B);
   }

   return corrected_rgb;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

