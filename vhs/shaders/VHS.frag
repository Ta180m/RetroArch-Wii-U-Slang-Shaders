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
   float wiggle;
   float smear;
}params;

#pragma parameterwiggle¡0.00.010.01.0
#pragma parametersmear¡0.50.01.00.05





layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;





vec3 rgb2yiq(vec3 c){
 return vec3(
  (0.2989 * c . x + 0.5959 * c . y + 0.2115 * c . z),
  (0.5870 * c . x - 0.2744 * c . y - 0.5229 * c . z),
  (0.1140 * c . x - 0.3216 * c . y + 0.3114 * c . z)
 );
}

vec3 yiq2rgb(vec3 c){
 return vec3(
  (1.0 * c . x + 1.0 * c . y + 1.0 * c . z),
  (0.956 * c . x - 0.2720 * c . y - 1.1060 * c . z),
  (0.6210 * c . x - 0.6474 * c . y + 1.7046 * c . z)
 );
}

vec2 Circle(float Start, float Points, float Point)
{
 float Rad =(3.141592 * 2.0 *(1.0 / Points))*(Point + Start);

  return vec2(-(.3 + Rad), cos(Rad));

}

vec3 Blur(vec2 uv, float d){
 float t =(sin(mod(float(params . FrameCount), 7.0)* 5.0 + uv . y * 5.0))/ 10.0;
    float b = 1.0;
    t = 0.0;
    vec2 PixelOffset = vec2(d + .0005 * t, 0);

    float Start = 2.0 / 14.0;
    vec2 Scale = 0.66 * 4.0 * 2.0 * PixelOffset . xy;

    vec3 N0 = texture(Source, uv + Circle(Start, 14.0, 0.0)* Scale). rgb;
    vec3 N1 = texture(Source, uv + Circle(Start, 14.0, 1.0)* Scale). rgb;
    vec3 N2 = texture(Source, uv + Circle(Start, 14.0, 2.0)* Scale). rgb;
    vec3 N3 = texture(Source, uv + Circle(Start, 14.0, 3.0)* Scale). rgb;
    vec3 N4 = texture(Source, uv + Circle(Start, 14.0, 4.0)* Scale). rgb;
    vec3 N5 = texture(Source, uv + Circle(Start, 14.0, 5.0)* Scale). rgb;
    vec3 N6 = texture(Source, uv + Circle(Start, 14.0, 6.0)* Scale). rgb;
    vec3 N7 = texture(Source, uv + Circle(Start, 14.0, 7.0)* Scale). rgb;
    vec3 N8 = texture(Source, uv + Circle(Start, 14.0, 8.0)* Scale). rgb;
    vec3 N9 = texture(Source, uv + Circle(Start, 14.0, 9.0)* Scale). rgb;
    vec3 N10 = texture(Source, uv + Circle(Start, 14.0, 10.0)* Scale). rgb;
    vec3 N11 = texture(Source, uv + Circle(Start, 14.0, 11.0)* Scale). rgb;
    vec3 N12 = texture(Source, uv + Circle(Start, 14.0, 12.0)* Scale). rgb;
    vec3 N13 = texture(Source, uv + Circle(Start, 14.0, 13.0)* Scale). rgb;
    vec3 N14 = texture(Source, uv). rgb;

 vec4 clr = texture(Source, uv);
    float W = 1.0 / 15.0;

    clr . rgb =
  (N0 * W)+
  (N1 * W)+
  (N2 * W)+
  (N3 * W)+
  (N4 * W)+
  (N5 * W)+
  (N6 * W)+
  (N7 * W)+
  (N8 * W)+
  (N9 * W)+
  (N10 * W)+
  (N11 * W)+
  (N12 * W)+
  (N13 * W)+
  (N14 * W);
    return vec3(clr . xyz)* b;
}

float onOff(float a, float b, float c, float framecount)
{
 return step(c, sin((framecount * 0.001)+ a * cos((framecount * 0.001)* b)));
}

vec2 jumpy(vec2 uv, float framecount)
{
 vec2 look = uv;
 float window = 1. /(1. + 80. *(look . y - mod(framecount / 4., 1.))*(look . y - mod(framecount / 4., 1.)));
 look . x += 0.05 * sin(look . y * 10. + framecount)/ 20. * onOff(4., 4., .3, framecount)*(0.5 + cos(framecount * 20.))* window;
 float vShift =(0.1 * params . wiggle)* 0.4 * onOff(2., 3., .9, framecount)*(sin(framecount)* sin(framecount * 20.)+
           (0.5 + 0.1 * sin(framecount * 200.)* cos(framecount)));
 look . y = mod(look . y - 0.01 * vShift, 1.);
 return look;
}

void main()
{
 float d = .1 - round(mod(mod(float(params . FrameCount), 7.0)/ 3.0, 1.0))* .1;
 vec2 uv = jumpy(vTexCoord . xy, mod(float(params . FrameCount), 7.0));
 vec2 uv2 = uv;

 float s = 0.0001 * params . wiggle * - d + 0.0001 * params . wiggle * sin(mod(float(params . FrameCount), 7.0));

 float e = min(.30, pow(max(0.0, cos(uv . y * 4.0 + .3)- .75)*(s + 0.5)* 1.0, 3.0))* 25.0;
 float r =(mod(float(params . FrameCount), 7.0)*(2.0 * s));
 uv . x += abs(r * pow(min(.003,(- uv . y +(.01 * mod(mod(float(params . FrameCount), 7.0), 17.0))))* 3.0, 2.0));

 d = .051 + abs(sin(s / 4.0));
 float c = max(0.0001, .002 * d)* params . smear;
 vec2 uvo = uv;
 vec4 final;
 final . xyz = Blur(uv, c + c *(uv . x));
 float y = rgb2yiq(final . xyz). r;

 uv . x += .01 * d;
 c *= 6.0;
 final . xyz = Blur(uv, c);
 float i = rgb2yiq(final . xyz). g;

 uv . x += .005 * d;

 c *= 2.50;
 final . xyz = Blur(uv, c);
 float q = rgb2yiq(final . xyz). b;
 final = vec4(yiq2rgb(vec3(y, i, q))- pow(s + e * 2.0, 3.0), 1.0);

 FragColor = final;
}
