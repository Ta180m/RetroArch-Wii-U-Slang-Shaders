#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

#pragma nameMMJ_ColorPass















uniform Push
{
   vec4 MMJ_OutlineSize;
   vec4 OriginalSize;
   float ColorLevels;
   float ColorSaturation;
   float ColorWeight;
}params;

#pragma parameterColorLevelsĄ12.01.032.01.0
#pragma parameterColorSaturationĄ1.150.002.000.05
#pragma parameterColorWeightĄ0.500.001.000.05







layout(std140) uniform UBO
{
   mat4 MVP;
}global;


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Original;
uniform sampler2D MMJ_OutlinePass;

vec3 RGB2HSL(vec3 cRGB)
{
  float cR = cRGB[0], cG = cRGB[1], cB = cRGB[2];
  float vMin = min(min(cR, cG), cB), vMax = max(max(cR, cG), cB);
  float dMax = vMax - vMin, vS = 0.0, vH = 0.0, vL =(vMax + vMin)/ 2.0;


  if(dMax == 0.0){
    vH = 0.0;vS = vH;


  } else {
    if(vL < 0.5){ vS = dMax /(vMax + vMin);}
    else { vS = dMax /(2.0 - vMax - vMin);}

    float dR =(((vMax - cR)* 0.1667)+(dMax * 0.5))/ dMax;
    float dG =(((vMax - cG)* 0.1667)+(dMax * 0.5))/ dMax;
    float dB =(((vMax - cB)* 0.1667)+(dMax * 0.5))/ dMax;

    if(cR >= vMax){ vH = dB - dG;}
    else if(cG >= vMax){ vH = 0.3333 + dR - dB;}
    else if(cB >= vMax){ vH = 0.6667 + dG - dR;}

    if(vH < 0.0){ vH += 1.0;}
    else if(vH > 1.0){ vH -= 1.0;}
  }
  return vec3(vH, vS, vL);
}

float Hue2RGB(float v1, float v2, float vH)
{
  float v3 = 0.0;

  if(vH < 0.0){ vH += 1.0;}
  else if(vH > 1.0){ vH -= 1.0;}

  if((6.0 * vH)< 1.0){ v3 = v1 +(v2 - v1)* 6.0 * vH;}
  else if((2.0 * vH)< 1.0){ v3 = v2;}
  else if((3.0 * vH)< 2.0){ v3 = v1 +(v2 - v1)*(0.6667 - vH)* 6.0;}
  else { v3 = v1;}

  return v3;
}

vec3 HSL2RGB(vec3 vHSL)
{
    float cR = 0.0, cG = cR, cB = cR;

  if(vHSL[1]== 0.0){
    cR = vHSL[2], cG = cR, cB = cR;

  } else {
    float v1 = 0.0, v2 = v1;

    if(vHSL[2]< 0.5){ v2 = vHSL[2]*(1.0 + vHSL[1]);}
    else { v2 =(vHSL[2]+ vHSL[1])-(vHSL[1]* vHSL[2]);}

    v1 = 2.0 * vHSL[2]- v2;

    cR = Hue2RGB(v1, v2, vHSL[0]+ 0.3333);
    cG = Hue2RGB(v1, v2, vHSL[0]);
    cB = Hue2RGB(v1, v2, vHSL[0]- 0.3333);
  }
  return vec3(cR, cG, cB);
}

vec3 colorAdjust(vec3 cRGB)
{
  vec3 cHSL = RGB2HSL(cRGB);

  float cr = 1.0 / params . ColorLevels;


  float BrtModify = mod(cHSL[2], cr);

  cHSL[1]*= params . ColorSaturation;
  cHSL[2]+=(cHSL[2]* cr - BrtModify);
  cRGB = 1.2 * HSL2RGB(cHSL);

  return cRGB;
}

void main()
{
  vec3 cOriginal = texture(Original, vTexCoord). rgb;
  vec3 cOutline = texture(MMJ_OutlinePass, vTexCoord). rgb;

 vec3 cNew = cOriginal;
 cNew = min(vec3(1.0), min(cNew, cNew + dot(vec3(1.0), cNew)));
 FragColor . rgb = mix(cOriginal * cOutline, colorAdjust(cNew * cOutline), params . ColorWeight);
}
