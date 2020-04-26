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
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

vec4 frag_op(sampler2D Source, vec2 coord, float px, float py)
{






 vec3 c[13] = vec3[13](vec3((clamp(texture(Source, coord + vec2(0 *(px), 0 *(py))). rgb, 0.0, 1.0))), vec3((clamp(texture(Source, coord + vec2(- 1 *(px), - 1 *(py))). rgb, 0.0, 1.0))), vec3((clamp(texture(Source, coord + vec2(0 *(px), - 1 *(py))). rgb, 0.0, 1.0))), vec3((clamp(texture(Source, coord + vec2(1 *(px), - 1 *(py))). rgb, 0.0, 1.0))), vec3((clamp(texture(Source, coord + vec2(- 1 *(px), 0 *(py))). rgb, 0.0, 1.0))), vec3((clamp(texture(Source, coord + vec2(1 *(px), 0 *(py))). rgb, 0.0, 1.0))), vec3((clamp(texture(Source, coord + vec2(- 1 *(px), 1 *(py))). rgb, 0.0, 1.0))), vec3((clamp(texture(Source, coord + vec2(0 *(px), 1 *(py))). rgb, 0.0, 1.0))), vec3((clamp(texture(Source, coord + vec2(1 *(px), 1 *(py))). rgb, 0.0, 1.0))), vec3((clamp(texture(Source, coord + vec2(0 *(px), - 2 *(py))). rgb, 0.0, 1.0))), vec3((clamp(texture(Source, coord + vec2(- 2 *(px), 0 *(py))). rgb, 0.0, 1.0))), vec3((clamp(texture(Source, coord + vec2(2 *(px), 0 *(py))). rgb, 0.0, 1.0))), vec3((clamp(texture(Source, coord + vec2(0 *(px), 2 *(py))). rgb, 0.0, 1.0))));


 vec3 blur =(2. *(c[2]+ c[4]+ c[5]+ c[7])+(c[1]+ c[3]+ c[6]+ c[8])+ 4. * c[0])/ 16.;
 float blur_Y =(blur . r / 3. + blur . g / 3. + blur . b / 3.);


 float c_comp = clamp(0.266666681 + 0.9 * exp2(- 7.4 * blur_Y), 0.0, 1.0);








 float edge = length(1.38 *((abs(blur - c[0])))
                    + 1.15 *((abs(blur - c[2]))+(abs(blur - c[4]))+(abs(blur - c[5]))+(abs(blur - c[7])))
                    + 0.92 *((abs(blur - c[1]))+(abs(blur - c[3]))+(abs(blur - c[6]))+(abs(blur - c[8])))
                    + 0.23 *((abs(blur - c[9]))+(abs(blur - c[10]))+(abs(blur - c[11]))+(abs(blur - c[12]))));

 return vec4((texture(Source, coord). rgb),(edge * c_comp + 1.0));
}

void main()
{
 vec2 tex = vTexCoord;

 float px = 1.0 / params . SourceSize . x;
 float py = 1.0 / params . SourceSize . y;

 FragColor = vec4(frag_op(Source, tex, px, py));
}
