#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float CURVATURE_X;
   float CURVATURE_Y;
   float MASK_BRIGHTNESS;
   float SCANLINE_WEIGHT;
   float SCANLINE_GAP_BRIGHTNESS;
   float BLOOM_FACTOR;
   float INPUT_GAMMA;
   float OUTPUT_GAMMA;
}param;

#pragma parameterCURVATURE_X�0.100.01.00.01
#pragma parameterCURVATURE_Y�0.150.01.00.01
#pragma parameterMASK_BRIGHTNESS�0.700.01.00.01
#pragma parameterSCANLINE_WEIGHT�6.00.015.00.1
#pragma parameterSCANLINE_GAP_BRIGHTNESS�0.120.01.00.01
#pragma parameterBLOOM_FACTOR�1.50.05.00.01
#pragma parameterINPUT_GAMMA�2.40.05.00.01
#pragma parameterOUTPUT_GAMMA�2.20.05.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in float filterWidth;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;




















































vec2 CURVATURE_DISTORTION = vec2(param . CURVATURE_X, param . CURVATURE_Y);

vec2 barrelScale = 1.0 -(0.23 * CURVATURE_DISTORTION);

vec2 Distort(vec2 coord)
{

    coord -= vec2(0.5);
    float rsq = coord . x * coord . x + coord . y * coord . y;
    coord += coord *(CURVATURE_DISTORTION * rsq);
    coord *= barrelScale;
    if(abs(coord . x)>= 0.5 || abs(coord . y)>= 0.5)
        coord = vec2(- 1.0);
    else
    {
        coord += vec2(0.5);

    }

    return coord;
}


float CalcScanLineWeight(float dist)
{
    return max(1.0 - dist * dist * param . SCANLINE_WEIGHT, param . SCANLINE_GAP_BRIGHTNESS);
}

float CalcScanLine(float dy)
{
    float scanLineWeight = CalcScanLineWeight(dy);

    scanLineWeight += CalcScanLineWeight(dy - filterWidth);
    scanLineWeight += CalcScanLineWeight(dy + filterWidth);
    scanLineWeight *= 0.3333333;

    return scanLineWeight;
}

void main()
{
    vec2 texcoord = vTexCoord;


    texcoord = Distort(texcoord);
    if(texcoord . x < 0.0)
    {
        FragColor = vec4(0.0);
        return;
    }


    vec2 texcoordInPixels = texcoord * global . SourceSize . xy;
















    float tempCoord = floor(texcoordInPixels . y)+ 0.5;
    float coord = tempCoord * global . SourceSize . w;
    float deltas = texcoordInPixels . y - tempCoord;
    float scanLineWeight = CalcScanLine(deltas);

    float signs = sign(deltas);

    deltas = abs(deltas)* 2.0;
    deltas = deltas * deltas * deltas;
    deltas *= 0.5 * global . SourceSize . w * signs;

    vec2 tc = vec2(texcoord . x, coord + deltas);


    vec3 colour = texture(Source, tc). rgb;











    scanLineWeight *= param . BLOOM_FACTOR;
    colour *= scanLineWeight;



















    float whichMask = fract((vTexCoord . x * global . OutputSize . x)* 0.3333333);
    vec3 mask = vec3(param . MASK_BRIGHTNESS);

    if(whichMask < 0.3333333)mask . r = 1.0;
    else if(whichMask < 0.6666666)mask . g = 1.0;
    else mask . b = 1.0;

    colour *= mask;


    FragColor = vec4(colour, 1.0);
}
