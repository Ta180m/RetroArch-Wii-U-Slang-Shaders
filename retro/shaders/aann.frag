#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4





uniform Push
{
   float NOGAMMA;
   float MASKING;
   float BILINEAR;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;


#pragma parameterNOGAMMA¡0.00.01.01.0



#pragma parameterMASKING¡0.00.01.01.0


#pragma parameterBILINEAR¡0.00.01.01.0






layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;





vec3 srgb2linear(vec3 srgb){
    return vec3(
        srgb . r > 0.0404482362771082 ? pow(srgb . r * 0.947867298578199 + 0.052132701421801, 2.4): srgb . r * 0.0773993808049536,
        srgb . g > 0.0404482362771082 ? pow(srgb . g * 0.947867298578199 + 0.052132701421801, 2.4): srgb . g * 0.0773993808049536,
        srgb . b > 0.0404482362771082 ? pow(srgb . b * 0.947867298578199 + 0.052132701421801, 2.4): srgb . b * 0.0773993808049536
    );
}

vec3 linear2srgb(vec3 linear){
    return vec3(
        linear . x > 0.00313066844250063 ? pow(linear . x, 0.416666666666667)* 1.055 - 0.055 : linear . x * 12.92,
        linear . y > 0.00313066844250063 ? pow(linear . y, 0.416666666666667)* 1.055 - 0.055 : linear . y * 12.92,
        linear . z > 0.00313066844250063 ? pow(linear . z, 0.416666666666667)* 1.055 - 0.055 : linear . z * 12.92
    );
}






vec3 rgb2vry(vec3 rgb){
    if(params . NOGAMMA == 1.0)
        return rgb;


    vec3 linear = srgb2linear(rgb);




    vec3 vry = vec3(
        pow(linear . x * 0.2126 + linear . y * 0.7152 + linear . z * 0.0722, 0.333333333333333),
        linear . x - linear . y,
        (linear . x + linear . y)* 0.5 - linear . z
    );

    return vry;
}
vec3 vry2rgb(vec3 vry){
    if(params . NOGAMMA == 1.0)
        return vry;


    float t = pow(vry . x, 3);

    vec3 rgb = vec3(
        t + vry . y *(0.7152 + 0.0722 * 0.5)+ vry . z * 0.0722,
        t - vry . y *(0.2126 + 0.0722 * 0.5)+ vry . z * 0.0722,
        t + vry . y *(0.7152 * 0.5 - 0.2126 * 0.5)- vry . z *(0.2126 + 0.7152)
    );

    return linear2srgb(rgb);
}

vec3 vry_interp(vec3 first, vec3 second, float frac){
    if(params . NOGAMMA == 1.0)
        return first *(1 - frac)+ second * frac;




    float new_luma = first . x *(1 - frac)+ second . x * frac;
    float linear_span = pow(second . x, 3)- pow(first . x, 3);

    if(linear_span == 0)
        linear_span = 1;

    float luma_fraction =(pow(new_luma, 3)- pow(first . x, 3))/ linear_span;

    return vec3(new_luma,
                first . y *(1 - luma_fraction)+ second . y * luma_fraction,
                first . z *(1 - luma_fraction)+ second . z * luma_fraction
            );
}

vec3 percent(float ssize, float tsize, float coord){
    if(params . BILINEAR == 1.0)
        tsize = ssize;

    float minfull =(coord * tsize - 0.5)/ tsize * ssize;
    float maxfull =(coord * tsize + 0.5)/ tsize * ssize;

    float realfull = floor(maxfull);

    if(minfull > realfull){
        return vec3(1,(realfull + 0.5)/ ssize,(realfull + 0.5)/ ssize);
    }

    return vec3(
                (maxfull - realfull)/(maxfull - minfull),
                (realfull - 0.5)/ ssize,
                (realfull + 0.5)/ ssize
            );
}

void main(){
    vec2 viewportSize = global . OutputSize . xy;
    vec2 gameCoord = vTexCoord;
    if(params . MASKING == 1.0){
        float hscale = viewportSize . x / global . SourceSize . x;
        float vscale = viewportSize . y / global . SourceSize . y;

        viewportSize . x += hscale * 16;
        viewportSize . y += vscale * 16;

        gameCoord . x =(8 + gameCoord . x * global . SourceSize . x)/(global . SourceSize . x + 16);
        gameCoord . y =(8 + gameCoord . y * global . SourceSize . y)/(global . SourceSize . y + 16);
    }

    vec3 xstuff = percent(global . SourceSize . x, viewportSize . x, gameCoord . x);
    vec3 ystuff = percent(global . SourceSize . y, viewportSize . y, gameCoord . y);

    float xkeep = xstuff[0];
    float ykeep = ystuff[0];


    vec3 a = rgb2vry(texture(Source, vec2(xstuff[1], ystuff[1])). rgb);
    vec3 b = rgb2vry(texture(Source, vec2(xstuff[2], ystuff[1])). rgb);
    vec3 c = rgb2vry(texture(Source, vec2(xstuff[1], ystuff[2])). rgb);
    vec3 d = rgb2vry(texture(Source, vec2(xstuff[2], ystuff[2])). rgb);


    vec3 x1 = vry_interp(a, b, xkeep);
    vec3 x2 = vry_interp(c, d, xkeep);
    vec3 result = vry_interp(x1, x2, ykeep);


    FragColor = vec4(vry2rgb(result), 1);
}
