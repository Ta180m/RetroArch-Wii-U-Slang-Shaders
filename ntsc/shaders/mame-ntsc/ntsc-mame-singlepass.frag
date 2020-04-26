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


vec4 Zero = vec4(0.0);
vec4 Half = vec4(0.5);
vec4 One = vec4(1.0);
vec4 Two = vec4(2.0);
float Pi = 3.1415926535;
float Pi2 = 6.283185307;


vec4 A = vec4(0.5);
vec4 B = vec4(0.5);
float P = 1.0;
float CCFrequency = 3.59754545;
float YFrequency = 6.0;
float IFrequency = 1.2;
float QFrequency = 0.6;
float NotchHalfWidth = 2.0;
float ScanTime = 52.6;
float MaxC = 2.1183;
vec4 MinC = vec4(- 1.1183);
vec4 CRange = vec4(3.2366);

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

vec4 CompositeSample(vec2 UV){
 vec2 InverseRes = params . SourceSize . zw;
 vec2 InverseP = vec2(P, 0.0)* InverseRes;


 vec2 C0 = UV;
 vec2 C1 = UV + InverseP * 0.25;
 vec2 C2 = UV + InverseP * 0.50;
 vec2 C3 = UV + InverseP * 0.75;
 vec4 Cx = vec4(C0 . x, C1 . x, C2 . x, C3 . x);
 vec4 Cy = vec4(C0 . y, C1 . y, C2 . y, C3 . y);

 vec3 Texel0 = texture(Source, C0). rgb;
 vec3 Texel1 = texture(Source, C1). rgb;
 vec3 Texel2 = texture(Source, C2). rgb;
 vec3 Texel3 = texture(Source, C3). rgb;


 vec4 T = A * Cy * vec4(params . SourceSize . x)* Two + B + Cx;

 vec3 YTransform = vec3(0.299, 0.587, 0.114);
 vec3 ITransform = vec3(0.595716, - 0.274453, - 0.321263);
 vec3 QTransform = vec3(0.211456, - 0.522591, 0.311135);

 float Y0 = dot(Texel0, YTransform);
 float Y1 = dot(Texel1, YTransform);
 float Y2 = dot(Texel2, YTransform);
 float Y3 = dot(Texel3, YTransform);
 vec4 Y = vec4(Y0, Y1, Y2, Y3);

 float I0 = dot(Texel0, ITransform);
 float I1 = dot(Texel1, ITransform);
 float I2 = dot(Texel2, ITransform);
 float I3 = dot(Texel3, ITransform);
 vec4 I = vec4(I0, I1, I2, I3);

 float Q0 = dot(Texel0, QTransform);
 float Q1 = dot(Texel1, QTransform);
 float Q2 = dot(Texel2, QTransform);
 float Q3 = dot(Texel3, QTransform);
 vec4 Q = vec4(Q0, Q1, Q2, Q3);

 vec4 W = vec4(Pi2 * CCFrequency * ScanTime);
 vec4 Encoded = Y + I * cos(T * W)+ Q * sin(T * W);
 return(Encoded - MinC)/ CRange;
}

vec4 NTSCCodec(vec2 UV)
{
 vec2 InverseRes = params . SourceSize . zw;
 vec4 YAccum = Zero;
 vec4 IAccum = Zero;
 vec4 QAccum = Zero;
 float QuadXSize = params . SourceSize . x * 4.0;
 float TimePerSample = ScanTime / QuadXSize;




 float Fc_y1 =(CCFrequency - NotchHalfWidth)* TimePerSample;
 float Fc_y2 =(CCFrequency + NotchHalfWidth)* TimePerSample;
 float Fc_y3 = YFrequency * TimePerSample;
 float Fc_i = IFrequency * TimePerSample;
 float Fc_q = QFrequency * TimePerSample;
 float Pi2Length = Pi2 / 82.0;
 vec4 NotchOffset = vec4(0.0, 1.0, 2.0, 3.0);
 vec4 W = vec4(Pi2 * CCFrequency * ScanTime);
 for(float n = - 41.0;n < 42.0;n += 4.0)
 {
  vec4 n4 = n + NotchOffset;
  vec4 CoordX = UV . x + InverseRes . x * n4 * 0.25;
  vec4 CoordY = vec4(UV . y);
  vec2 TexCoord = vec2(CoordX . r, CoordY . r);
  vec4 C = CompositeSample(TexCoord)* CRange + MinC;
  vec4 WT = W *(CoordX + A * CoordY * Two * params . SourceSize . x + B);

  vec4 SincYIn1 = Pi2 * Fc_y1 * n4;
  vec4 SincYIn2 = Pi2 * Fc_y2 * n4;
  vec4 SincYIn3 = Pi2 * Fc_y3 * n4;
  bvec4 notEqual = notEqual(SincYIn1, Zero);
  vec4 SincY1 = sin(SincYIn1)/ SincYIn1;
  vec4 SincY2 = sin(SincYIn2)/ SincYIn2;
  vec4 SincY3 = sin(SincYIn3)/ SincYIn3;
  if(SincYIn1 . x == 0.0)SincY1 . x = 1.0;
  if(SincYIn1 . y == 0.0)SincY1 . y = 1.0;
  if(SincYIn1 . z == 0.0)SincY1 . z = 1.0;
  if(SincYIn1 . w == 0.0)SincY1 . w = 1.0;
  if(SincYIn2 . x == 0.0)SincY2 . x = 1.0;
  if(SincYIn2 . y == 0.0)SincY2 . y = 1.0;
  if(SincYIn2 . z == 0.0)SincY2 . z = 1.0;
  if(SincYIn2 . w == 0.0)SincY2 . w = 1.0;
  if(SincYIn3 . x == 0.0)SincY3 . x = 1.0;
  if(SincYIn3 . y == 0.0)SincY3 . y = 1.0;
  if(SincYIn3 . z == 0.0)SincY3 . z = 1.0;
  if(SincYIn3 . w == 0.0)SincY3 . w = 1.0;

  vec4 IdealY =(2.0 * Fc_y1 * SincY1 - 2.0 * Fc_y2 * SincY2)+ 2.0 * Fc_y3 * SincY3;
  vec4 FilterY =(0.54 + 0.46 * cos(Pi2Length * n4))* IdealY;

  vec4 SincIIn = Pi2 * Fc_i * n4;
  vec4 SincI = sin(SincIIn)/ SincIIn;
  if(SincIIn . x == 0.0)SincI . x = 1.0;
  if(SincIIn . y == 0.0)SincI . y = 1.0;
  if(SincIIn . z == 0.0)SincI . z = 1.0;
  if(SincIIn . w == 0.0)SincI . w = 1.0;
  vec4 IdealI = 2.0 * Fc_i * SincI;
  vec4 FilterI =(0.54 + 0.46 * cos(Pi2Length * n4))* IdealI;

  vec4 SincQIn = Pi2 * Fc_q * n4;
  vec4 SincQ = sin(SincQIn)/ SincQIn;
  if(SincQIn . x == 0.0)SincQ . x = 1.0;
  if(SincQIn . y == 0.0)SincQ . y = 1.0;
  if(SincQIn . z == 0.0)SincQ . z = 1.0;
  if(SincQIn . w == 0.0)SincQ . w = 1.0;
  vec4 IdealQ = 2.0 * Fc_q * SincQ;
  vec4 FilterQ =(0.54 + 0.46 * cos(Pi2Length * n4))* IdealQ;

  YAccum = YAccum + C * FilterY;
  IAccum = IAccum + C * cos(WT)* FilterI;
  QAccum = QAccum + C * sin(WT)* FilterQ;
 }

 float Y = YAccum . r + YAccum . g + YAccum . b + YAccum . a;
 float I =(IAccum . r + IAccum . g + IAccum . b + IAccum . a)* 2.0;
 float Q =(QAccum . r + QAccum . g + QAccum . b + QAccum . a)* 2.0;

 vec3 YIQ = vec3(Y, I, Q);

 vec3 OutRGB = vec3(dot(YIQ, vec3(1.0, 0.956, 0.621)), dot(YIQ, vec3(1.0, - 0.272, - 0.647)), dot(YIQ, vec3(1.0, - 1.106, 1.703)));

 return vec4(OutRGB, 1.0);
}

void main()
{
 vec4 OutPixel = NTSCCodec(vTexCoord);
   FragColor = vec4(OutPixel);
}