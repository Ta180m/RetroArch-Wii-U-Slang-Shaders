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
   float iBloomMixmode;
   float fBloomThreshold;
   float fBloomAmount;
   float fBloomSaturation;
   float fBloomTint_r;
   float fBloomTint_g;
   float fBloomTint_b;
   float bLensdirtEnable;
   float iLensdirtMixmode;
   float fLensdirtIntensity;
   float fLensdirtSaturation;
   float fLensdirtTint_r;
   float fLensdirtTint_g;
   float fLensdirtTint_b;
   float bAnamFlareEnable;
   float fAnamFlareThreshold;
   float fAnamFlareWideness;
   float fAnamFlareAmount;
   float fAnamFlareCurve;
   float fAnamFlareColor_r;
   float fAnamFlareColor_g;
   float fAnamFlareColor_b;
   float bLenzEnable;
   float fLenzIntensity;
   float fLenzThreshold;
   float bChapFlareEnable;
   float fChapFlareThreshold;
   float iChapFlareCount;
   float fChapFlareDispersal;
   float fChapFlareSize;
   float fChapFlareCA_r;
   float fChapFlareCA_g;
   float fChapFlareCA_b;
   float fChapFlareIntensity;
   float bGodrayEnable;
   float fGodrayDecay;
   float fGodrayExposure;
   float fGodrayWeight;
   float fGodrayDensity;
   float fGodrayThreshold;
   float iGodraySamples;
   float fFlareLuminance;
   float fFlareBlur;
   float fFlareIntensity;
   float fFlareTint_r;
   float fFlareTint_g;
   float fFlareTint_b;
}global;

#pragma parameteriBloomMixmode¡0.00.02.01.0
#pragma parameterfBloomThreshold¡0.80.11.00.1
#pragma parameterfBloomAmount¡0.80.020.00.1
#pragma parameterfBloomSaturation¡0.80.02.00.1
#pragma parameterfBloomTint_r¡0.70.01.00.05
#pragma parameterfBloomTint_g¡0.80.01.00.05
#pragma parameterfBloomTint_b¡1.00.01.00.05
#pragma parameterbLensdirtEnable¡0.00.01.01.0
#pragma parameteriLensdirtMixmode¡0.00.03.01.0
#pragma parameterfLensdirtIntensity¡0.40.02.00.1
#pragma parameterfLensdirtSaturation¡2.00.02.00.1
#pragma parameterfLensdirtTint_r¡1.00.01.00.05
#pragma parameterfLensdirtTint_g¡1.00.01.00.05
#pragma parameterfLensdirtTint_b¡1.00.01.00.05
#pragma parameterbAnamFlareEnable¡0.00.01.01.0
#pragma parameterfAnamFlareThreshold¡0.90.11.00.1
#pragma parameterfAnamFlareWideness¡2.41.02.50.1
#pragma parameterfAnamFlareAmount¡14.51.020.00.5
#pragma parameterfAnamFlareCurve¡1.21.02.00.1
#pragma parameterfAnamFlareColor_r¡0.0120.01.00.01
#pragma parameterfAnamFlareColor_g¡0.3130.01.00.01
#pragma parameterfAnamFlareColor_b¡0.5880.01.00.01
#pragma parameterbLenzEnable¡0.00.01.01.0
#pragma parameterfLenzIntensity¡1.00.23.00.1
#pragma parameterfLenzThreshold¡0.80.61.00.1
#pragma parameterbChapFlareEnable¡0.00.01.01.0
#pragma parameterfChapFlareThreshold¡0.90.70.990.05
#pragma parameteriChapFlareCount¡15.01.020.01.0
#pragma parameterfChapFlareDispersal¡0.250.251.00.05
#pragma parameterfChapFlareSize¡0.450.20.80.05
#pragma parameterfChapFlareCA_r¡0.00.01.00.01
#pragma parameterfChapFlareCA_g¡0.010.01.00.01
#pragma parameterfChapFlareCA_b¡0.020.01.00.01
#pragma parameterfChapFlareIntensity¡100.05.0200.05.0
#pragma parameterbGodrayEnable¡0.00.01.01.0
#pragma parameterfGodrayDecay¡0.990.50.99990.05
#pragma parameterfGodrayExposure¡1.00.71.50.05
#pragma parameterfGodrayWeight¡1.250.81.70.05
#pragma parameterfGodrayDensity¡1.00.22.00.2
#pragma parameterfGodrayThreshold¡0.90.61.00.05
#pragma parameteriGodraySamples¡128.016.0256.016.0
#pragma parameterfFlareLuminance¡0.0950.01.00.005
#pragma parameterfFlareBlur¡200.01.010000.050.0
#pragma parameterfFlareIntensity¡2.070.25.00.1
#pragma parameterfFlareTint_r¡0.1370.01.00.05
#pragma parameterfFlareTint_g¡0.2160.01.00.05
#pragma parameterfFlareTint_b¡1.00.01.00.05

vec3 fFlareTint = vec3(global . fFlareTint_r, global . fFlareTint_g, global . fFlareTint_b);
vec3 fAnamFlareColor = vec3(global . fAnamFlareColor_r, global . fAnamFlareColor_g, global . fAnamFlareColor_b);
vec3 fLensdirtTint = vec3(global . fLensdirtTint_r, global . fLensdirtTint_g, global . fLensdirtTint_b);
vec3 fBloomTint = vec3(global . fBloomTint_r, global . fBloomTint_g, global . fBloomTint_b);
vec3 fChapFlareCA = vec3(global . fChapFlareCA_r, global . fChapFlareCA_g, global . fChapFlareCA_b);
















layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

