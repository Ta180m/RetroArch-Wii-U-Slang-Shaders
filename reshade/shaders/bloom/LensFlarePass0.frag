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
















layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;

vec4 GaussBlur22(vec2 coord, sampler2D tex, float mult, float lodlevel, bool isBlurVert)
{
   vec4 sum = vec4(0.);
   vec2 axis = isBlurVert ? vec2(0, 1): vec2(1, 0);

   float weight[11] = float[11](float(0.082607), float(0.080977), float(0.076276), float(0.069041), float(0.060049), float(0.050187), float(0.040306), float(0.031105), float(0.023066), float(0.016436), float(0.011254
   ));

   for(int i = - 10;i < 11;i ++)
   {
      float currweight = weight[abs(i)];
      sum += textureLod(tex, vec2(coord . xy + axis . xy * float(i)*(vTexCoord . xy * params . SourceSize . zw)* mult), lodlevel)* currweight;
   }

   return sum;
}

vec3 GetDnB(sampler2D tex, vec2 coords)
{
   vec3 color = vec3(max(0, dot(textureLod(tex, vec2(coords . xy), 4.). rgb, vec3(0.333))- global . fChapFlareThreshold)* global . fChapFlareIntensity);






   return color;
}
vec3 GetDistortedTex(sampler2D tex, vec2 sample_center, vec2 sample_vector, vec3 distortion)
{
   vec2 final_vector = sample_center + sample_vector * min(min(distortion . r, distortion . g), distortion . b);

   if(final_vector . x > 1.0 || final_vector . y > 1.0 || final_vector . x < - 1.0 || final_vector . y < - 1.0)
      return vec3(0, 0, 0);
   else
      return vec3(
         GetDnB(tex, sample_center + sample_vector * distortion . r). r,
         GetDnB(tex, sample_center + sample_vector * distortion . g). g,
         GetDnB(tex, sample_center + sample_vector * distortion . b). b);
}

vec3 GetBrightPass(vec2 coords)
{
   vec3 c = texture(Original, coords). rgb;
   vec3 bC = max(c - global . fFlareLuminance . xxx, 0.0);
   float bright = dot(bC, vec3(1.0));
   bright = smoothstep(0.0f, 0.5, bright);
   vec3 result = mix(vec3(0.0), c, vec3(bright));







   return result;
}
vec3 GetAnamorphicSample(int axis, vec2 coords, float blur)
{
   coords = 2.0 * coords - 1.0;
   coords . x /= - blur;
   coords = 0.5 * coords + 0.5;
   return GetBrightPass(coords);
}

void main()
{
   vec4 lens = vec4(0.);


   if(global . bLenzEnable > 0.5)
   {
      vec3 lfoffset[19] = vec3[19](vec3(vec3(0.9, 0.01, 4)), vec3(vec3(0.7, 0.25, 25)), vec3(vec3(0.3, 0.25, 15)), vec3(vec3(1, 1.0, 5)), vec3(vec3(- 0.15, 20, 1)), vec3(vec3(- 0.3, 20, 1)), vec3(vec3(6, 6, 6)), vec3(vec3(7, 7, 7)), vec3(vec3(8, 8, 8)), vec3(vec3(9, 9, 9)), vec3(vec3(0.24, 1, 10)), vec3(vec3(0.32, 1, 10)), vec3(vec3(0.4, 1, 10)), vec3(vec3(0.5, - 0.5, 2)), vec3(vec3(2, 2, - 5)), vec3(vec3(- 5, 0.2, 0.2)), vec3(vec3(20, 0.5, 0)), vec3(vec3(0.4, 1, 10)), vec3(vec3(0.00001, 10, 20)
      ));
      vec3 lffactors[19] = vec3[19](vec3(vec3(1.5, 1.5, 0)), vec3(vec3(0, 1.5, 0)), vec3(vec3(0, 0, 1.5)), vec3(vec3(0.2, 0.25, 0)), vec3(vec3(0.15, 0, 0)), vec3(vec3(0, 0, 0.15)), vec3(vec3(1.4, 0, 0)), vec3(vec3(1, 1, 0)), vec3(vec3(0, 1, 0)), vec3(vec3(0, 0, 1.4)), vec3(vec3(1, 0.3, 0)), vec3(vec3(1, 1, 0)), vec3(vec3(0, 2, 4)), vec3(vec3(0.2, 0.1, 0)), vec3(vec3(0, 0, 1)), vec3(vec3(1, 1, 0)), vec3(vec3(1, 1, 0)), vec3(vec3(0, 0, 0.2)), vec3(vec3(0.012, 0.313, 0.588)
      ));

      vec2 lfcoord = vec2(0.);
      vec3 lenstemp = vec3(0.);
      vec2 distfact = vTexCoord . xy - 0.5;
      distfact . x *= params . SourceSize . x / params . SourceSize . y;

      for(int i = 0;i < 19;i ++)
      {
         lfcoord . xy = lfoffset[i]. x * distfact;
         lfcoord . xy *= pow(2.0 * length(distfact), lfoffset[i]. y * 3.5);
         lfcoord . xy *= lfoffset[i]. z;
         lfcoord . xy = 0.5 - lfcoord . xy;
         vec2 tempfact =(lfcoord . xy - 0.5)* 2.;
         float templensmult = clamp(1.0 - dot(tempfact, tempfact), 0., 1.);
         vec3 lenstemp1 = vec3(dot(textureLod(Original, vec2(lfcoord . xy), 1.0). rgb, vec3(0.333)));







         lenstemp1 = max(vec3(0.), lenstemp1 . xyz - vec3(global . fLenzThreshold));
         lenstemp1 *= lffactors[i]* templensmult;

         lenstemp += lenstemp1;
      }

      lens . rgb += lenstemp * global . fLenzIntensity;
   }


   if(global . bChapFlareEnable > 0.5)
   {
      vec2 sample_vector =(vec2(0.5, 0.5)- vTexCoord . xy)* global . fChapFlareDispersal;
      vec2 halo_vector = normalize(sample_vector)* global . fChapFlareSize;

      vec3 chaplens = GetDistortedTex(Original, vTexCoord . xy + halo_vector, halo_vector, fChapFlareCA * 2.5). rgb;

      for(int j = 0;j < int(global . iChapFlareCount);++ j)
      {
         vec2 foffset = sample_vector * float(j);
         chaplens += GetDistortedTex(Original, vTexCoord . xy + foffset, foffset, fChapFlareCA). rgb;
      }

      chaplens *= 1.0 / global . iChapFlareCount;
      lens . xyz += chaplens;
   }


   if(global . bGodrayEnable > 0.5)
   {
      vec2 ScreenLightPos = vec2(0.5, 0.5);
      vec2 texcoord2 = vTexCoord;
      vec2 deltaTexCoord =(texcoord2 - ScreenLightPos);
      deltaTexCoord *= 1.0 / global . iGodraySamples * global . fGodrayDensity;

      float illuminationDecay = 1.0;

      for(int g = 0;g < int(global . iGodraySamples);g ++)
      {
         texcoord2 -= deltaTexCoord;;
         vec4 sample2 = textureLod(Original, vec2(texcoord2), 0.);
         float sampledepth = textureLod(Original, vec2(texcoord2), 0.). x;
         sample2 . w = clamp(dot(sample2 . xyz, vec3(0.3333))- global . fGodrayThreshold, 0., 1.);
         sample2 . r *= 1.00;
         sample2 . g *= 0.95;
         sample2 . b *= 0.85;
         sample2 *= illuminationDecay * global . fGodrayWeight;




         lens . rgb += sample2 . xyz * sample2 . w;

         illuminationDecay *= global . fGodrayDecay;
      }
   }


   if(global . bAnamFlareEnable > 0.5)
   {
      vec3 anamFlare = vec3(0.);
      float gaussweight[5] = float[5](float(0.2270270270), float(0.1945945946), float(0.1216216216), float(0.0540540541), float(0.0162162162 ));

      for(int z = - 4;z < 5;z ++)
      {
         anamFlare += GetAnamorphicSample(0, vTexCoord . xy + vec2(0, z *(vTexCoord . y * params . SourceSize . w)* 2.), global . fFlareBlur)* fFlareTint * gaussweight[abs(z)];
      }

      lens . xyz += anamFlare * global . fFlareIntensity;
   }
   FragColor = lens;
}
