#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float RSUBPIX_R;
   float RSUBPIX_G;
   float RSUBPIX_B;
   float GSUBPIX_R;
   float GSUBPIX_G;
   float GSUBPIX_B;
   float BSUBPIX_R;
   float BSUBPIX_G;
   float BSUBPIX_B;
   float gain;
   float gamma;
   float blacklevel;
   float ambient;
   float BGR;
}param;

#pragma parameterRSUBPIX_R�1.00.01.00.01
#pragma parameterRSUBPIX_G�0.00.01.00.01
#pragma parameterRSUBPIX_B�0.00.01.00.01
#pragma parameterGSUBPIX_R�0.00.01.00.01
#pragma parameterGSUBPIX_G�1.00.01.00.01
#pragma parameterGSUBPIX_B�0.00.01.00.01
#pragma parameterBSUBPIX_R�0.00.01.00.01
#pragma parameterBSUBPIX_G�0.00.01.00.01
#pragma parameterBSUBPIX_B�1.00.01.00.01
#pragma parametergain�1.00.52.00.05
#pragma parametergamma�3.00.55.00.1
#pragma parameterblacklevel�0.050.00.50.01
#pragma parameterambient�0.00.00.50.01
#pragma parameterBGR�0011

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;





layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;


float coeffs_x[7]= float[](1.0, - 2.0 / 3.0, - 1.0 / 5.0, 4.0 / 7.0, - 1.0 / 9.0, - 2.0 / 11.0, 1.0 / 13.0);

float coeffs_y[7]= float[](1.0, 0.0, - 4.0 / 5.0, 2.0 / 7.0, 4.0 / 9.0, - 4.0 / 11.0, 1.0 / 13.0);

float intsmear_func(float z, float coeffs[7])
{
    float z2 = z * z;
    float zn = z;
    float ret = 0.0;
    for(int i = 0;i < 7;i ++){
        ret += zn * coeffs[i];
        zn *= z2;
    }
    return ret;
}

float intsmear(float x, float dx, float d, float coeffs[7])
{
    float zl = clamp((x - dx * 0.5)/ d, - 1.0, 1.0);
    float zh = clamp((x + dx * 0.5)/ d, - 1.0, 1.0);
    return d *(intsmear_func(zh, coeffs)- intsmear_func(zl, coeffs))/ dx;
}

void main()
{
    vec2 texelSize = global . SourceSize . zw;

    vec2 range = global . OutputSize . zw;

    vec3 cred = pow(vec3(param . RSUBPIX_R, param . RSUBPIX_G, param . RSUBPIX_B), vec3(2.2));
    vec3 cgreen = pow(vec3(param . GSUBPIX_R, param . GSUBPIX_G, param . GSUBPIX_B), vec3(2.2));
    vec3 cblue = pow(vec3(param . BSUBPIX_R, param . BSUBPIX_G, param . BSUBPIX_B), vec3(2.2));

    ivec2 tli = ivec2(floor(vTexCoord / texelSize - vec2(0.4999)));

    vec3 lcol, rcol;
    float subpix =(vTexCoord . x / texelSize . x - 0.4999 - float(tli . x))* 3.0;
    float rsubpix = range . x / texelSize . x * 3.0;

    lcol = vec3(intsmear(subpix + 1.0, rsubpix, 1.5, coeffs_x),
                intsmear(subpix, rsubpix, 1.5, coeffs_x),
                intsmear(subpix - 1.0, rsubpix, 1.5, coeffs_x));
    rcol = vec3(intsmear(subpix - 2.0, rsubpix, 1.5, coeffs_x),
                intsmear(subpix - 3.0, rsubpix, 1.5, coeffs_x),
                intsmear(subpix - 4.0, rsubpix, 1.5, coeffs_x));

    if(param . BGR > 0.5){
        lcol . rgb = lcol . bgr;
        rcol . rgb = rcol . bgr;
    }

    float tcol, bcol;
    subpix = vTexCoord . y / texelSize . y - 0.4999 - float(tli . y);
    rsubpix = range . y / texelSize . y;
    tcol = intsmear(subpix, rsubpix, 0.63, coeffs_y);
    bcol = intsmear(subpix - 1.0, rsubpix, 0.63, coeffs_y);

    vec3 topLeftColor =(pow(vec3(param . gain)* texelFetchOffset(Source,(tli), 0,(ivec2(0, 0))). rgb + vec3(param . blacklevel), vec3(param . gamma))+ vec3(param . ambient))* lcol * vec3(tcol);
    vec3 bottomRightColor =(pow(vec3(param . gain)* texelFetchOffset(Source,(tli), 0,(ivec2(1, 1))). rgb + vec3(param . blacklevel), vec3(param . gamma))+ vec3(param . ambient))* rcol * vec3(bcol);
    vec3 bottomLeftColor =(pow(vec3(param . gain)* texelFetchOffset(Source,(tli), 0,(ivec2(0, 1))). rgb + vec3(param . blacklevel), vec3(param . gamma))+ vec3(param . ambient))* lcol * vec3(bcol);
    vec3 topRightColor =(pow(vec3(param . gain)* texelFetchOffset(Source,(tli), 0,(ivec2(1, 0))). rgb + vec3(param . blacklevel), vec3(param . gamma))+ vec3(param . ambient))* rcol * vec3(tcol);

    vec3 averageColor = topLeftColor + bottomRightColor + bottomLeftColor + topRightColor;

    averageColor = mat3(cred, cgreen, cblue)* averageColor;

    FragColor = vec4(pow(averageColor, vec3(1.0 / 2.2)), 0.0);
}
