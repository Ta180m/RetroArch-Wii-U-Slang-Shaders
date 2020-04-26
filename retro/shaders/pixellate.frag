#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

















layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float INTERPOLATE_IN_LINEAR_GAMMA;
}global;

#pragma parameterINTERPOLATE_IN_LINEAR_GAMMA�1.00.01.01.0

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec2 texelSize = global . SourceSize . zw;

   vec2 range = vec2(abs(global . SourceSize . x /(global . OutputSize . x * global . SourceSize . x)), abs(global . SourceSize . y /(global . OutputSize . y * global . SourceSize . y)));
   range = range / 2.0 * 0.999;

   float left = vTexCoord . x - range . x;
   float top = vTexCoord . y + range . y;
   float right = vTexCoord . x + range . x;
   float bottom = vTexCoord . y - range . y;

   vec3 topLeftColor;
   vec3 bottomRightColor;
   vec3 bottomLeftColor;
   vec3 topRightColor;

   if(global . INTERPOLATE_IN_LINEAR_GAMMA > 0.5){
   topLeftColor = pow(texture(Source,(floor(vec2(left, top)/ texelSize)+ 0.5)* texelSize). rgb, vec3(2.2));
   bottomRightColor = pow(texture(Source,(floor(vec2(right, bottom)/ texelSize)+ 0.5)* texelSize). rgb, vec3(2.2));
   bottomLeftColor = pow(texture(Source,(floor(vec2(left, bottom)/ texelSize)+ 0.5)* texelSize). rgb, vec3(2.2));
   topRightColor = pow(texture(Source,(floor(vec2(right, top)/ texelSize)+ 0.5)* texelSize). rgb, vec3(2.2));
   } else {
   topLeftColor = texture(Source,(floor(vec2(left, top)/ texelSize)+ 0.5)* texelSize). rgb;
   bottomRightColor = texture(Source,(floor(vec2(right, bottom)/ texelSize)+ 0.5)* texelSize). rgb;
   bottomLeftColor = texture(Source,(floor(vec2(left, bottom)/ texelSize)+ 0.5)* texelSize). rgb;
   topRightColor = texture(Source,(floor(vec2(right, top)/ texelSize)+ 0.5)* texelSize). rgb;}

   vec2 border = clamp(round(vTexCoord / texelSize)* texelSize, vec2(left, bottom), vec2(right, top));

   float totalArea = 4.0 * range . x * range . y;

   vec3 averageColor;
   averageColor =((border . x - left)*(top - border . y)/ totalArea)* topLeftColor;
   averageColor +=((right - border . x)*(border . y - bottom)/ totalArea)* bottomRightColor;
   averageColor +=((border . x - left)*(border . y - bottom)/ totalArea)* bottomLeftColor;
   averageColor +=((right - border . x)*(top - border . y)/ totalArea)* topRightColor;

   FragColor =(global . INTERPOLATE_IN_LINEAR_GAMMA > 0.5)? vec4(pow(averageColor, vec3(1.0 / 2.2)), 1.0): vec4(averageColor, 1.0);
}
