#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4























































#pragma parameterGRID_INTENSITY¡1.00.01.00.05
#pragma parameterGRID_WIDTH¡1.00.01.00.05
#pragma parameterGRID_BIAS¡0.00.01.00.05
#pragma parameterDARKEN_GRID¡0.00.01.00.05
#pragma parameterDARKEN_COLOUR¡0.00.02.00.05

uniform Push
{
   float GRID_INTENSITY;
   float GRID_WIDTH;
   float GRID_BIAS;
   float DARKEN_GRID;
   float DARKEN_COLOUR;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D BACKGROUND;






float LINE_WEIGHT_A = 48.0;
float LINE_WEIGHT_B = 8.0 / 3.0;












float INV_BG_TEXTURE_SIZE = 1.0 / 2048.0;



float INV_DISPLAY_GAMMA = 1.0 / 2.2;













void main()
{

 vec2 imgPixelCoord = vTexCoord . xy * registers . SourceSize . xy;
 vec2 imgCenterCoord = floor(imgPixelCoord . xy)+ vec2(0.5, 0.5);


 vec3 colour = texture(Source, registers . SourceSize . zw * imgCenterCoord . xy). rgb;


 colour . rgb = pow(colour . rgb, vec3(2.2 + registers . DARKEN_COLOUR));
 colour . rgb = mat3(0.86629, 0.02429, 0.11337,
           0.13361, 0.70857, 0.11448,
           0.0, 0.26714, 0.77215)* colour . rgb;
 colour . rgb = clamp(pow(colour . rgb, vec3(INV_DISPLAY_GAMMA)), 0.0, 1.0);


 vec2 distFromCenter = abs(imgCenterCoord . xy - imgPixelCoord . xy);

 float xSquared = max(distFromCenter . x, distFromCenter . y);
 xSquared = xSquared * xSquared;

 float xQuarted = xSquared * xSquared;



 float lineWeight = LINE_WEIGHT_A *(xQuarted -(LINE_WEIGHT_B * xQuarted * xSquared));











 lineWeight = lineWeight *(lineWeight +((1.0 - lineWeight)* registers . GRID_WIDTH))* registers . GRID_INTENSITY;






 float luma =(0.2126 * colour . r)+(0.7152 * colour . g)+(0.0722 * colour . b);
 lineWeight = lineWeight *(luma +((1.0 - luma)*(1.0 - registers . GRID_BIAS)));



 colour . rgb = mix(colour . rgb, vec3(1.0 - registers . DARKEN_GRID), lineWeight);




 vec2 bgPixelCoord = floor(vTexCoord . xy * registers . OutputSize . xy)+ vec2(0.5, 0.5);



 vec3 bgTexture = texture(BACKGROUND, bgPixelCoord . xy * INV_BG_TEXTURE_SIZE). rgb * colour . rgb;





 luma =(0.2126 * colour . r)+(0.7152 * colour . g)+(0.0722 * colour . b);
 colour . rgb = mix(colour . rgb, bgTexture . rgb, luma);

 FragColor = vec4(colour . rgb, 1.0);
}
