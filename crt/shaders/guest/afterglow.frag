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
   float SW;
   float AR;
   float PR;
   float AG;
   float PG;
   float AB;
   float PB;
   float sat;
   float GTH;
}params;

#pragma parameterSW¡1.00.01.01.0
#pragma parameterAR¡0.070.01.00.01
#pragma parameterPR¡0.050.01.00.01
#pragma parameterAG¡0.070.01.00.01
#pragma parameterPG¡0.050.01.00.01
#pragma parameterAB¡0.070.01.00.01
#pragma parameterPB¡0.050.01.00.01
#pragma parametersat¡0.100.01.00.01
#pragma parameterGTH¡5.00.0255.01.0

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
uniform sampler2D OriginalHistory6;



vec3 afterglow(float number)
{
 return vec3(params . AR, params . AG, params . AB)* exp2(- vec3(params . PR, params . PG, params . PB)* vec3(number * number));
}

void main()
{
 vec3 color = texture(Source, vTexCoord . xy). rgb;
 vec3 color1 = texture(OriginalHistory1, vTexCoord . xy). rgb * afterglow(1.0);
 vec3 color2 = texture(OriginalHistory2, vTexCoord . xy). rgb * afterglow(2.0);
 vec3 color3 = texture(OriginalHistory3, vTexCoord . xy). rgb * afterglow(3.0);
 vec3 color4 = texture(OriginalHistory4, vTexCoord . xy). rgb * afterglow(4.0);
 vec3 color5 = texture(OriginalHistory5, vTexCoord . xy). rgb * afterglow(5.0);
 vec3 color6 = texture(OriginalHistory6, vTexCoord . xy). rgb * afterglow(6.0);

 vec3 glow = color1 + color2 + color3 + color4 + color5 + color6;

 float l = length(glow);
 glow = normalize(pow(glow + vec3(1e-4), vec3(params . sat)))* l;

 float w = 1.0;
 if((color . r + color . g + color . b)> params . GTH / 255.0)w = 0.0;

 FragColor = vec4(color + params . SW * w * glow, 1.0);
}
