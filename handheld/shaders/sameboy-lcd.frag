#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4



























layout(std140) uniform UBO
{
   vec4 SourceSize;
   vec4 OriginalSize;
   vec4 OutputSize;
   mat4 MVP;
}global;

uniform Push
{
   float COLOR_LOW;
   float COLOR_HIGH;
   float SCANLINE_DEPTH;
}params;

#pragma parameterCOLOR_LOW¡0.80.01.50.05
#pragma parameterCOLOR_HIGH¡1.00.01.50.05
#pragma parameterSCANLINE_DEPTH¡0.10.02.00.05





layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    vec2 pos = fract(vTexCoord * global . SourceSize . xy);
    vec2 sub_pos = fract(vTexCoord * global . SourceSize . xy * 6);

    vec4 center = texture(Source, vTexCoord);
    vec4 left = texture(Source, vTexCoord - vec2(1.0 / global . SourceSize . x, 0));
    vec4 right = texture(Source, vTexCoord + vec2(1.0 / global . SourceSize . x, 0));

    if(pos . y < 1.0 / 6.0){
        center = mix(center, texture(Source, vTexCoord + vec2(0, - 1.0 / global . SourceSize . y)), 0.5 - sub_pos . y / 2.0);
        left = mix(left, texture(Source, vTexCoord + vec2(- 1.0 / global . SourceSize . x, - 1.0 / global . SourceSize . y)), 0.5 - sub_pos . y / 2.0);
        right = mix(right, texture(Source, vTexCoord + vec2(1.0 / global . SourceSize . x, - 1.0 / global . SourceSize . y)), 0.5 - sub_pos . y / 2.0);
        center *= sub_pos . y * params . SCANLINE_DEPTH +(1 - params . SCANLINE_DEPTH);
        left *= sub_pos . y * params . SCANLINE_DEPTH +(1 - params . SCANLINE_DEPTH);
        right *= sub_pos . y * params . SCANLINE_DEPTH +(1 - params . SCANLINE_DEPTH);
    }
    else if(pos . y > 5.0 / 6.0){
        center = mix(center, texture(Source, vTexCoord + vec2(0, 1.0 / global . SourceSize . y)), sub_pos . y / 2.0);
        left = mix(left, texture(Source, vTexCoord + vec2(- 1.0 / global . SourceSize . x, 1.0 / global . SourceSize . y)), sub_pos . y / 2.0);
        right = mix(right, texture(Source, vTexCoord + vec2(1.0 / global . SourceSize . x, 1.0 / global . SourceSize . y)), sub_pos . y / 2.0);
        center *=(1.0 - sub_pos . y)* params . SCANLINE_DEPTH +(1 - params . SCANLINE_DEPTH);
        left *=(1.0 - sub_pos . y)* params . SCANLINE_DEPTH +(1 - params . SCANLINE_DEPTH);
        right *=(1.0 - sub_pos . y)* params . SCANLINE_DEPTH +(1 - params . SCANLINE_DEPTH);
    }


    vec4 midleft = mix(left, center, 0.5);
    vec4 midright = mix(right, center, 0.5);

    vec4 ret;
    if(pos . x < 1.0 / 6.0){
        ret = mix(vec4(params . COLOR_HIGH * center . r, params . COLOR_LOW * center . g, params . COLOR_HIGH * left . b, 1),
                  vec4(params . COLOR_HIGH * center . r, params . COLOR_LOW * center . g, params . COLOR_LOW * left . b, 1),
                  sub_pos . x);
    }
    else if(pos . x < 2.0 / 6.0){
        ret = mix(vec4(params . COLOR_HIGH * center . r, params . COLOR_LOW * center . g, params . COLOR_LOW * left . b, 1),
                  vec4(params . COLOR_HIGH * center . r, params . COLOR_HIGH * center . g, params . COLOR_LOW * midleft . b, 1),
                  sub_pos . x);
    }
    else if(pos . x < 3.0 / 6.0){
        ret = mix(vec4(params . COLOR_HIGH * center . r, params . COLOR_HIGH * center . g, params . COLOR_LOW * midleft . b, 1),
                  vec4(params . COLOR_LOW * midright . r, params . COLOR_HIGH * center . g, params . COLOR_LOW * center . b, 1),
                  sub_pos . x);
    }
    else if(pos . x < 4.0 / 6.0){
        ret = mix(vec4(params . COLOR_LOW * midright . r, params . COLOR_HIGH * center . g, params . COLOR_LOW * center . b, 1),
                  vec4(params . COLOR_LOW * right . r, params . COLOR_HIGH * center . g, params . COLOR_HIGH * center . b, 1),
                  sub_pos . x);
    }
    else if(pos . x < 5.0 / 6.0){
        ret = mix(vec4(params . COLOR_LOW * right . r, params . COLOR_HIGH * center . g, params . COLOR_HIGH * center . b, 1),
                  vec4(params . COLOR_LOW * right . r, params . COLOR_LOW * midright . g, params . COLOR_HIGH * center . b, 1),
                  sub_pos . x);
    }
    else {
        ret = mix(vec4(params . COLOR_LOW * right . r, params . COLOR_LOW * midright . g, params . COLOR_HIGH * center . b, 1),
                  vec4(params . COLOR_HIGH * right . r, params . COLOR_LOW * right . g, params . COLOR_HIGH * center . b, 1),
                  sub_pos . x);
    }

    FragColor = ret;
}
