#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4























#pragma parameterDEFLICKER_EMPHASIS�0.00.01.00.01

uniform Push
{
   float DEFLICKER_EMPHASIS;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D OriginalHistory1;
uniform sampler2D OriginalHistory2;
uniform sampler2D OriginalHistory3;
uniform sampler2D OriginalHistory4;
uniform sampler2D OriginalHistory5;



float is_equal(vec3 x, vec3 y)
{
 vec3 result = 1.0 - abs(sign(x - y));
 return min(min(result . r, result . g), result . b);
}

float is_approx_equal(vec3 x, vec3 y)
{
 vec3 result = 1.0 - step(0.000001 + registers . DEFLICKER_EMPHASIS, abs(x - y));
 return min(min(result . r, result . g), result . b);
}




void main()
{


 vec3 colour0 = texture(Source, vTexCoord . xy). rgb;
 vec3 colour1 = texture(OriginalHistory1, vTexCoord . xy). rgb;
 vec3 colour2 = texture(OriginalHistory2, vTexCoord . xy). rgb;
 vec3 colour3 = texture(OriginalHistory3, vTexCoord . xy). rgb;
 vec3 colour4 = texture(OriginalHistory4, vTexCoord . xy). rgb;
 vec3 colour5 = texture(OriginalHistory5, vTexCoord . xy). rgb;





 float doMix =(1.0 - is_equal(colour0, colour3))
       *(1.0 - is_equal(colour0, colour5))
       *(1.0 - is_equal(colour1, colour2))
       *(1.0 - is_equal(colour1, colour4))
       *(1.0 - is_equal(colour2, colour3))
       *(1.0 - is_equal(colour2, colour5))
       * min(
            (is_approx_equal(colour0, colour2)* is_approx_equal(colour2, colour4))+
            (is_approx_equal(colour1, colour3)* is_approx_equal(colour3, colour5)),
            1.0
         );


 colour0 . rgb = mix(colour0 . rgb, colour1 . rgb, doMix * 0.5);

 FragColor = vec4(colour0 . rgb, 1.0);
}
