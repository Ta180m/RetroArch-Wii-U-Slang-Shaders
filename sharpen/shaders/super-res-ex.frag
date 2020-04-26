#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4























uniform Push
{
   vec4 SourceSize;
   vec4 REFSize;
   vec4 OutputSize;
   uint FrameCount;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;























layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D REF;

vec3 Y = vec3(.2126, .7152, .0722);


float RGBtoYUV(vec3 color)
{
  return dot(color, Y);
}

void main()
{
    vec2 tex = vTexCoord;

    vec4 c0 = texture(REF, tex);


    vec2 pos = tex * params . REFSize . xy - 0.5;
    vec2 offset = pos - round(pos);
    pos -= offset;


    float W = 0.;
    vec3 diff = vec3(0.0);
    vec3 stab = vec3(0.0);
    float var = 0.;

    float c0y = RGBtoYUV(c0 . rgb);



 float dI2 = dot(100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(- 1, - 1)+ 0.5)). a)), 100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(- 1, - 1)+ 0.5)). a)));
        float dXY2 = dot(vec2(- 1, - 1)- offset, vec2(- 1, - 1)- offset);
        float w = exp(- dXY2 /(2. * 1.0 * 1.0))* pow(1. + dI2 / 2.0, - 2.0);
        diff += w *(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(- 1, - 1)+ 0.5)). xyz);
        stab += w *(c0 . rgb -(texture(REF,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(- 1, - 1)+ 0.5)). xyz));
        var += w * dI2;
        W += w;

 dI2 = dot(100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(- 1, 0)+ 0.5)). a)), 100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(- 1, 0)+ 0.5)). a)));
        dXY2 = dot(vec2(- 1, 0)- offset, vec2(- 1, 0)- offset);
        w = exp(- dXY2 /(2. * 1.0 * 1.0))* pow(1. + dI2 / 2.0, - 2.0);
        diff += w *(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(- 1, 0)+ 0.5)). xyz);
        stab += w *(c0 . rgb -(texture(REF,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(- 1, 0)+ 0.5)). xyz));
        var += w * dI2;
        W += w;

 dI2 = dot(100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(- 1, 1)+ 0.5)). a)), 100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(- 1, 1)+ 0.5)). a)));
        dXY2 = dot(vec2(- 1, 1)- offset, vec2(- 1, 1)- offset);
        w = exp(- dXY2 /(2. * 1.0 * 1.0))* pow(1. + dI2 / 2.0, - 2.0);
        diff += w *(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(- 1, 1)+ 0.5)). xyz);
        stab += w *(c0 . rgb -(texture(REF,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(- 1, 1)+ 0.5)). xyz));
        var += w * dI2;
        W += w;

 dI2 = dot(100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(0, - 1)+ 0.5)). a)), 100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(0, - 1)+ 0.5)). a)));
        dXY2 = dot(vec2(0, - 1)- offset, vec2(0, - 1)- offset);
        w = exp(- dXY2 /(2. * 1.0 * 1.0))* pow(1. + dI2 / 2.0, - 2.0);
        diff += w *(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(0, - 1)+ 0.5)). xyz);
        stab += w *(c0 . rgb -(texture(REF,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(0, - 1)+ 0.5)). xyz));
        var += w * dI2;
        W += w;

 dI2 = dot(100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(0, 0)+ 0.5)). a)), 100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(0, 0)+ 0.5)). a)));
        dXY2 = dot(vec2(0, 0)- offset, vec2(0, 0)- offset);
        w = exp(- dXY2 /(2. * 1.0 * 1.0))* pow(1. + dI2 / 2.0, - 2.0);
        diff += w *(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(0, 0)+ 0.5)). xyz);
        stab += w *(c0 . rgb -(texture(REF,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(0, 0)+ 0.5)). xyz));
        var += w * dI2;
        W += w;

 dI2 = dot(100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(0, 1)+ 0.5)). a)), 100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(0, 1)+ 0.5)). a)));
        dXY2 = dot(vec2(0, 1)- offset, vec2(0, 1)- offset);
        w = exp(- dXY2 /(2. * 1.0 * 1.0))* pow(1. + dI2 / 2.0, - 2.0);
        diff += w *(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(0, 1)+ 0.5)). xyz);
        stab += w *(c0 . rgb -(texture(REF,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(0, 1)+ 0.5)). xyz));
        var += w * dI2;
        W += w;

 dI2 = dot(100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(1, - 1)+ 0.5)). a)), 100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(1, - 1)+ 0.5)). a)));
        dXY2 = dot(vec2(1, - 1)- offset, vec2(1, - 1)- offset);
        w = exp(- dXY2 /(2. * 1.0 * 1.0))* pow(1. + dI2 / 2.0, - 2.0);
        diff += w *(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(1, - 1)+ 0.5)). xyz);
        stab += w *(c0 . rgb -(texture(REF,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(1, - 1)+ 0.5)). xyz));
        var += w * dI2;
        W += w;

 dI2 = dot(100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(1, 0)+ 0.5)). a)), 100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(1, 0)+ 0.5)). a)));
        dXY2 = dot(vec2(1, 0)- offset, vec2(1, 0)- offset);
        w = exp(- dXY2 /(2. * 1.0 * 1.0))* pow(1. + dI2 / 2.0, - 2.0);
        diff += w *(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(1, 0)+ 0.5)). xyz);
        stab += w *(c0 . rgb -(texture(REF,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(1, 0)+ 0.5)). xyz));
        var += w * dI2;
        W += w;

 dI2 = dot(100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(1, 1)+ 0.5)). a)), 100.0 *(c0y -(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(1, 1)+ 0.5)). a)));
        dXY2 = dot(vec2(1, 1)- offset, vec2(1, 1)- offset);
        w = exp(- dXY2 /(2. * 1.0 * 1.0))* pow(1. + dI2 / 2.0, - 2.0);
        diff += w *(texture(Source,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(1, 1)+ 0.5)). xyz);
        stab += w *(c0 . rgb -(texture(REF,(1.0 / vec2(params . REFSize . xy))*(pos + ivec2(1, 1)+ 0.5)). xyz));
        var += w * dI2;
        W += w;

    diff /= W;
    stab /= W;
    var =(var / W)- dot(100.0 * stab, 100.0 * stab);


    float varD = 0.3 * dot(100.0 * stab, 100.0 * stab);
    float varS =(1. - 0.3)* var;


    c0 . xyz -= 0.8 * mix(diff, stab, 0.3);

   FragColor = vec4(c0);
}
