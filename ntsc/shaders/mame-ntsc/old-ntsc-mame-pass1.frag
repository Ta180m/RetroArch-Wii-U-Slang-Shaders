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
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;









float AValue = 0.5f;
float BValue = 0.5f;
float CCValue = 3.5795454f;
float OValue = 0.0f;
float PValue = 1.0f;
float ScanTime = 52.6f;

float NotchHalfWidth = 1.0f;
float YFreqResponse = 6.0f;
float IFreqResponse = 1.2f;
float QFreqResponse = 0.6f;

float SignalOffset = 0.0f;





 float PI = 3.1415927f;
 float PI2 = 6.2830854f;

 vec4 YDot = vec4(0.299f, 0.587f, 0.114f, 0.0f);
 vec4 IDot = vec4(0.595716f, - 0.274453f, - 0.321263f, 0.0f);
 vec4 QDot = vec4(0.211456f, - 0.522591f, 0.311135f, 0.0f);

 vec3 RDot = vec3(1.0f, 0.956f, 0.621f);
 vec3 GDot = vec3(1.0f, - 0.272f, - 0.647f);
 vec3 BDot = vec3(1.0f, - 1.106f, 1.703f);

 vec4 OffsetX = vec4(0.0f, 0.25f, 0.50f, 0.75f);
 vec4 NotchOffset = vec4(0.0f, 1.0f, 2.0f, 3.0f);

 const int SampleCount = 64;
 const int HalfSampleCount = 32;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;

void main()
{
      vec4 BaseTexel = texture(Original, vTexCoord);

 vec2 size = params . SourceSize . xy;

 float TimePerSample = ScanTime /(size . x * 4.0f);

 float Fc_y1 =(CCValue - NotchHalfWidth)* TimePerSample;
 float Fc_y2 =(CCValue + NotchHalfWidth)* TimePerSample;
 float Fc_y3 = YFreqResponse * TimePerSample;
 float Fc_i = IFreqResponse * TimePerSample;
 float Fc_q = QFreqResponse * TimePerSample;
 float Fc_i_2 = Fc_i * 2.0f;
 float Fc_q_2 = Fc_q * 2.0f;
 float Fc_y1_2 = Fc_y1 * 2.0f;
 float Fc_y2_2 = Fc_y2 * 2.0f;
 float Fc_y3_2 = Fc_y3 * 2.0f;
 float Fc_i_pi2 = Fc_i * PI2;
 float Fc_q_pi2 = Fc_q * PI2;
 float Fc_y1_pi2 = Fc_y1 * PI2;
 float Fc_y2_pi2 = Fc_y2 * PI2;
 float Fc_y3_pi2 = Fc_y3 * PI2;
 float PI2Length = PI2 / SampleCount;

 float W = PI2 * CCValue * ScanTime;
 float WoPI = W / PI;

 float HOffset =(BValue + SignalOffset)/ WoPI;
 float VScale =(AValue * size . y)/ WoPI;

      vec4 YAccum = vec4(0.0);
      vec4 IAccum = vec4(0.0);
      vec4 QAccum = vec4(0.0);

      vec4 Cy = vec4(vTexCoord . y);
      vec4 VPosition = Cy;

 for(float i = 0;i < SampleCount;i += 4.0f)
 {
  float n = i - HalfSampleCount;
       vec4 n4 = n + NotchOffset;

       vec4 Cx = vTexCoord . x +(n4 * 0.25f)/ size . x;
       vec4 HPosition = Cx;

       vec4 C = texture(Source, vec2(Cx . r, Cy . r));

       vec4 T = HPosition + HOffset + VPosition * VScale;
       vec4 WT = W * T + OValue;

       vec4 SincKernel = 0.54f + 0.46f * cos(PI2Length * n4);

       vec4 SincYIn1 = Fc_y1_pi2 * n4;
       vec4 SincYIn2 = Fc_y2_pi2 * n4;
       vec4 SincYIn3 = Fc_y3_pi2 * n4;
       vec4 SincIIn = Fc_i_pi2 * n4;
       vec4 SincQIn = Fc_q_pi2 * n4;

       vec4 SincY1 =(notEqual(SincYIn1, vec4(0.0))== bvec4(true))? sin(SincYIn1)/ SincYIn1 : vec4(0.5);
       vec4 SincY2 =(notEqual(SincYIn2, vec4(0.0))== bvec4(true))? sin(SincYIn2)/ SincYIn2 : vec4(0.5);
       vec4 SincY3 =(notEqual(SincYIn3, vec4(0.0))== bvec4(true))? sin(SincYIn3)/ SincYIn3 : vec4(0.5);

       vec4 IdealY =(Fc_y1_2 * SincY1 - Fc_y2_2 * SincY2)+ Fc_y3_2 * SincY3;
       vec4 IdealI = Fc_i_2 *((notEqual(SincIIn, vec4(0.0))== bvec4(true))? sin(SincIIn)/ SincIIn : vec4(0.5));
       vec4 IdealQ = Fc_q_2 *((notEqual(SincQIn, vec4(0.0))== bvec4(true))? sin(SincQIn)/ SincQIn : vec4(0.5));

       vec4 FilterY = SincKernel * IdealY;
       vec4 FilterI = SincKernel * IdealI;
       vec4 FilterQ = SincKernel * IdealQ;

  YAccum = YAccum + C * FilterY;
  IAccum = IAccum + C * cos(WT)* FilterI;
  QAccum = QAccum + C * sin(WT)* FilterQ;
 }

      vec3 YIQ = vec3(
  (YAccum . r + YAccum . g + YAccum . b + YAccum . a),
  (IAccum . r + IAccum . g + IAccum . b + IAccum . a)* 2.0f,
  (QAccum . r + QAccum . g + QAccum . b + QAccum . a)* 2.0f);

      vec3 RGB = vec3(
  dot(YIQ, RDot),
  dot(YIQ, GDot),
  dot(YIQ, BDot));
   FragColor = vec4(RGB, BaseTexel . a);
}
