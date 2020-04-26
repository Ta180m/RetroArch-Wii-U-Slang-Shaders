#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4
























uniform Push
{
   vec4 SourceSize;
   vec4 OutputSize;
   float TATE;
   float IOS;
   float OS;
   float BLOOM;
   float brightboost;
   float saturation;
   float gsl;
   float scanline;
   float beam_min;
   float beam_max;
   float h_sharp;
   float s_sharp;
   float csize;
   float warpX;
   float warpY;
   float glow;
   float shadowMask;
   float maskDark;
   float maskLight;
   float CGWG;
   float GTW;
   float gamma_out;
}params;

#pragma parameterTATE¡0.00.01.01.0

#pragma parameterIOS¡0.00.01.01.0

#pragma parameterOS¡2.00.02.01.0

#pragma parameterBLOOM¡0.00.020.01.0

#pragma parameterbrightboost¡1.100.502.000.01

#pragma parametersaturation¡1.00.12.00.05

#pragma parametergsl¡0.00.01.01.0

#pragma parameterscanline¡8.01.012.01.0

#pragma parameterbeam_min¡1.300.52.00.05

#pragma parameterbeam_max¡1.00.52.00.05

#pragma parameterh_sharp¡5.01.520.00.25

#pragma parameters_sharp¡0.00.00.200.01

#pragma parametercsize¡0.00.00.050.01

#pragma parameterwarpX¡0.00.00.1250.01

#pragma parameterwarpY¡0.00.00.1250.01

#pragma parameterglow¡0.040.00.50.01

#pragma parametershadowMask¡0.0-1.05.01.0

#pragma parametermaskDark¡0.50.02.00.1

#pragma parametermaskLight¡1.50.02.00.1

#pragma parameterCGWG¡0.40.01.00.05

#pragma parameterGTW¡1.100.51.50.01

#pragma parametergamma_out¡2.41.03.00.05


layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D lum_pass;
uniform sampler2D linearize_pass;



float b_min = 1.0 + 7.0 *(params . beam_min - 0.5)* 0.666666666;
float b_max = 1.0 + 7.0 *(params . beam_max - 0.5)* 0.666666666;
float scn_s = 0.3 + 0.7 *(params . scanline - 1.0)* 0.090909090;

vec3 sw(float x, vec3 color)
{
 vec3 tmp = mix(vec3(params . beam_min), vec3(params . beam_max), color);
 vec3 ex = vec3(x)* tmp;
 return exp2(- params . scanline * ex * ex);
}

vec3 sw2(float x, vec3 c)
{
 vec3 s = mix(vec3(b_min), vec3(b_max), c);
 return clamp(smoothstep(vec3(0.0), vec3(scn_s), pow(vec3(x), s)), 0.0001, 1.0);
}


vec3 Mask(vec2 pos)
{
 vec3 mask = vec3(params . maskDark, params . maskDark, params . maskDark);
 float mf = floor(mod(pos . x, 2.0));
 float mf2 = floor(mod(pos . x + pos . y, 2.0));
 float mc = 1.0 - params . CGWG;
 float mc2 = mc * 0.7;


 if(params . shadowMask == - 1.0)
 {
  mask = vec3(1.0);
 }


 else if(params . shadowMask == 5.0)
 {
  if(mf2 == 0.0){ mask = vec3(1.0);}
  else { mask = vec3(mc2);}
 }


 else if(params . shadowMask == 0.0)
 {
  if(mf == 0.0){ mask . r = 1.0;mask . g = mc;mask . b = 1.0;}
  else { mask . r = mc;mask . g = 1.0;mask . b = mc;}
 }


 else if(params . shadowMask == 1.0)
 {
  float line = params . maskLight;
  float odd = 0.0;

  if(fract(pos . x / 6.0)< 0.5)
   odd = 1.0;
  if(fract((pos . y + odd)/ 2.0)< 0.5)
   line = params . maskDark;

  pos . x = fract(pos . x / 3.0);

  if(pos . x < 0.333)mask . r = params . maskLight;
  else if(pos . x < 0.666)mask . g = params . maskLight;
  else mask . b = params . maskLight;
  mask *= line;
 }


 else if(params . shadowMask == 2.0)
 {
  pos . x = fract(pos . x / 3.0);

  if(pos . x < 0.333)mask . r = params . maskLight;
  else if(pos . x < 0.666)mask . g = params . maskLight;
  else mask . b = params . maskLight;
 }


 else if(params . shadowMask == 3.0)
 {
  pos . x += pos . y * 3.0;
  pos . x = fract(pos . x / 6.0);

  if(pos . x < 0.333)mask . r = params . maskLight;
  else if(pos . x < 0.666)mask . g = params . maskLight;
  else mask . b = params . maskLight;
 }


 else if(params . shadowMask == 4.0)
 {
  pos . xy = floor(pos . xy * vec2(1.0, 0.5));
  pos . x += pos . y * 3.0;
  pos . x = fract(pos . x / 6.0);

  if(pos . x < 0.333)mask . r = params . maskLight;
  else if(pos . x < 0.666)mask . g = params . maskLight;
  else mask . b = params . maskLight;
 }

 return mask;
}


vec2 Warp(vec2 pos)
{
 pos = pos * 2.0 - 1.0;
 pos *= vec2(1.0 +(pos . y * pos . y)* params . warpX, 1.0 +(pos . x * pos . x)* params . warpY);
 return pos * 0.5 + 0.5;
}

vec2 Overscan(vec2 pos, float dx, float dy){
 pos = pos * 2.0 - 1.0;
 pos *= vec2(dx, dy);
 return pos * 0.5 + 0.5;
}

float Overscan2(float pos, float dy){
 pos = pos * 2.0 - 1.0;
 pos *= dy;
 return pos * 0.5 + 0.5;
}



float corner(vec2 coord)
{
 coord =(coord - vec2(0.5))* 1.0 + vec2(0.5);
 coord = min(coord, vec2(1.0)- coord)* vec2(1.0, params . OutputSize . y * params . OutputSize . z);
 vec2 cdist = vec2(max(params . csize, 0.002));
 coord =(cdist - min(coord, cdist));
 float dist = sqrt(dot(coord, coord));
 return clamp((cdist . x - dist)* 700.0, 0.0, 1.0);
}

float sqrt3 = 1.732050807568877;

vec3 gamma_correct(vec3 color, vec3 tmp)
{
 return color * mix(params . GTW, 1.0, max(max(tmp . r, tmp . g), tmp . b));
}

void main()
{
 vec3 lum = texture(lum_pass, vec2(0.33, 0.33)). xyz;



 vec2 texcoord = vTexCoord . xy;
 if(params . IOS == 1.0){
  vec2 ofactor = params . OutputSize . xy * params . SourceSize . zw;
  vec2 intfactor = round(ofactor);
  vec2 diff = ofactor / intfactor;
  vec2 smartcoord;
  smartcoord . x = Overscan2(vTexCoord . x, diff . x);
  smartcoord . y = Overscan2(vTexCoord . y, diff . y);
  texcoord =(params . TATE > 0.5)? vec2(smartcoord . x, texcoord . y):
   vec2(texcoord . x, smartcoord . y);
 }

 float factor = 1.00 +(1.0 - 0.5 * params . OS)* params . BLOOM / 100.0 - lum . x * params . BLOOM / 100.0;
 texcoord = Overscan(texcoord, factor, factor);
 vec2 pos = Warp(texcoord);
 vec2 pos0 = Warp(vTexCoord . xy);

 vec2 ps = params . SourceSize . zw;
 vec2 OGL2Pos = pos * params . SourceSize . xy -((params . TATE < 0.5)?
  vec2(0.0, 0.5): vec2(0.5, 0.0));
 vec2 fp = fract(OGL2Pos);
 vec2 dx = vec2(ps . x, 0.0);
 vec2 dy = vec2(0.0, ps . y);

 vec2 pC4 = floor(OGL2Pos)* ps + 0.5 * ps;


 vec2 x2 = 2.0 * dx;
 vec2 y2 = 2.0 * dy;

 vec2 offx = dx;
 vec2 off2 = x2;
 vec2 offy = dy;
 float fpx = fp . x;
 if(params . TATE > 0.5)
 {
  offx = dy;
  off2 = y2;
  offy = dx;
  fpx = fp . y;
 }

 bool sharp =(params . s_sharp > 0.0);

 float wl2 = 1.5 + fpx;wl2 *= wl2;wl2 = exp2(- params . h_sharp * wl2);wl2 = max(wl2 - params . s_sharp, - wl2);
 float wl1 = 0.5 + fpx;wl1 *= wl1;wl1 = exp2(- params . h_sharp * wl1);wl1 = max(wl1 - params . s_sharp, - 0.4 * params . s_sharp);
 float wct = 0.5 - fpx;wct *= wct;wct = exp2(- params . h_sharp * wct);wct = max(wct - params . s_sharp, params . s_sharp);
 float wr1 = 1.5 - fpx;wr1 *= wr1;wr1 = exp2(- params . h_sharp * wr1);wr1 = max(wr1 - params . s_sharp, - 0.4 * params . s_sharp);
 float wr2 = 2.5 - fpx;wr2 *= wr2;wr2 = exp2(- params . h_sharp * wr2);wr2 = max(wr2 - params . s_sharp, - wr2);

 float wt = 1.0 /(wl2 + wl1 + wct + wr1 + wr2);

 vec3 l2 = texture(linearize_pass, pC4 - off2). xyz;
 vec3 l1 = texture(linearize_pass, pC4 - offx). xyz;
 vec3 ct = texture(linearize_pass, pC4). xyz;
 vec3 r1 = texture(linearize_pass, pC4 + offx). xyz;
 vec3 r2 = texture(linearize_pass, pC4 + off2). xyz;

 vec3 color1 =(l2 * wl2 + l1 * wl1 + ct * wct + r1 * wr1 + r2 * wr2)* wt;
 if(sharp)color1 = clamp(color1, min(min(l1, r1), ct), max(max(l1, r1), ct));

 l2 = texture(linearize_pass, pC4 - off2 + offy). xyz;
 l1 = texture(linearize_pass, pC4 - offx + offy). xyz;
 ct = texture(linearize_pass, pC4 + offy). xyz;
 r1 = texture(linearize_pass, pC4 + offx + offy). xyz;
 r2 = texture(linearize_pass, pC4 + off2 + offy). xyz;

 vec3 color2 =(l2 * wl2 + l1 * wl1 + ct * wct + r1 * wr1 + r2 * wr2)* wt;
 if(sharp)color2 = clamp(color2, min(min(l1, r1), ct), max(max(l1, r1), ct));



 float f =(params . TATE < 0.5)? fp . y : fp . x;

 vec3 w1 = sw(f, color1);
 vec3 w2 = sw(1.0 - f, color2);

 if(params . gsl == 1.0){ w1 = sw2(1.0 - f, color1);w2 = sw2(f, color2);}

 vec3 color = color1 * w1 + color2 * w2;
 vec3 ctmp = color /(w1 + w2);

 color = pow(color, vec3(1.0 / params . gamma_out));
 float l = length(color);
 color = normalize(pow(color + vec3(1e-10), vec3(params . saturation, params . saturation, params . saturation)))* l;
 color *= params . brightboost;
 color = gamma_correct(color, ctmp);
 color = pow(color, vec3(params . gamma_out));
 color = min(color, 1.0);



 color *=(params . TATE < 0.5)? Mask(gl_FragCoord . xy * 1.000001):
  Mask(gl_FragCoord . yx * 1.000001);

 vec3 Bloom = texture(Source, pos). xyz;

 color += params . glow * Bloom;
 color = min(color, 1.0);

 color = pow(color, vec3(1.0 / params . gamma_out));
   FragColor = vec4(color * corner(pos0), 1.0);
}
