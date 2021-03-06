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
   float CURVATURE;
   float SCANLINES;
   float CURVED_SCANLINES;
   float LIGHT;
   float light;
   float blur;
}params;

#pragma parameterCURVATURE¡1.00.01.01.0
#pragma parameterSCANLINES¡1.00.01.01.0
#pragma parameterCURVED_SCANLINES¡1.00.01.01.0
#pragma parameterLIGHT¡1.00.01.01.0
#pragma parameterlight¡9.00.020.01.0'
#pragma parameterblur¡1.00.08.00.05

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;







float gamma = 1.;
float contrast = 1.;
float saturation = 1.;
float brightness = 1.;





vec3 gaussian(in vec2 uv, in sampler2D tex, in vec2 iResolution){
    float b = params . blur /(iResolution . x / iResolution . y);

    vec3 col = texture(tex, vec2(uv . x - b / iResolution . x, uv . y - b / iResolution . y)). rgb * 0.077847;
    col += texture(tex, vec2(uv . x - b / iResolution . x, uv . y)). rgb * 0.123317;
    col += texture(tex, vec2(uv . x - b / iResolution . x, uv . y + b / iResolution . y)). rgb * 0.077847;

    col += texture(tex, vec2(uv . x, uv . y - b / iResolution . y)). rgb * 0.123317;
    col += texture(tex, vec2(uv . x, uv . y)). rgb * 0.195346;
    col += texture(tex, vec2(uv . x, uv . y + b / iResolution . y)). rgb * 0.123317;

    col += texture(tex, vec2(uv . x + b / iResolution . x, uv . y - b / iResolution . y)). rgb * 0.077847;
    col += texture(tex, vec2(uv . x + b / iResolution . x, uv . y)). rgb * 0.123317;
    col += texture(tex, vec2(uv . x + b / iResolution . x, uv . y + b / iResolution . y)). rgb * 0.077847;

    return col;
}

void main()
{
    vec2 st = vTexCoord - vec2(0.5);


    float d = length(st * .5 * st * .5);
 vec2 uv;
if(params . CURVATURE > 0.5){
    uv = st * d + st * .935;
} else {
    uv = st;
}



    vec3 color = gaussian(uv + .5, Source, params . SourceSize . xy * 2.0);





if(params . LIGHT > 0.5){
    float l = 1. - min(1., d * params . light);
    color *= l;
}


 float y;
if(params . CURVED_SCANLINES > 0.5){
    y = uv . y;
} else {
    y = st . y;
}

    float showScanlines = 1.;


if(params . SCANLINES > 0.5){
    float s = 2.5 + params . OutputSize . y * params . SourceSize . w;
    float j = cos(y * params . SourceSize . y * s)* .25;
    color = abs(showScanlines - 1.)* color + showScanlines *(color - color * j);

}


if(params . CURVATURE > 0.5){
        float m = max(0.0, 1. - 2. * max(abs(uv . x), abs(uv . y)));
        m = min(m * 200., 1.);
        color *= m;
}

 FragColor = vec4(color, 1.0);
}
