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
}global;









layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

float intsmear_func(float z)
{
  float z2 = z * z;
  float z4 = z2 * z2;
  float z8 = z4 * z4;
  return z - 2.0 / 3.0 * z * z2 - 1.0 / 5.0 * z * z4 + 4.0 / 7.0 * z * z2 * z4 - 1.0 / 9.0 * z * z8
    - 2.0 / 11.0 * z * z2 * z8 + 1.0 / 13.0 * z * z4 * z8;
}

float intsmear(float x, float dx)
{
  float d = 1.5;
  float zl = clamp((x - dx)/ d, - 1.0, 1.0);
  float zh = clamp((x + dx)/ d, - 1.0, 1.0);
  return d *(intsmear_func(zh)- intsmear_func(zl))/(2.0 * dx);
}

void main()
{
  vec2 texelSize = global . SourceSize . zw;
  vec2 subtexelSize = texelSize / vec2(3.0, 1.0);
  vec2 range;
  range = global . SourceSize . xy /(global . OutputSize . xy * global . SourceSize . xy);

  float left = vTexCoord . x - texelSize . x * 0.5;
  float top = vTexCoord . y + range . y;
  float right = vTexCoord . x + texelSize . x * 0.5;
  float bottom = vTexCoord . y - range . y;

  vec4 lcol, rcol;
  float subpix = mod(vTexCoord . x / subtexelSize . x + 1.5, 3.0);
  float rsubpix = range . x / subtexelSize . x;
  lcol = vec4(intsmear(subpix + 1.0, rsubpix), intsmear(subpix, rsubpix),
       intsmear(subpix - 1.0, rsubpix), 0.0);
  rcol = vec4(intsmear(subpix - 2.0, rsubpix), intsmear(subpix - 3.0, rsubpix),
       intsmear(subpix - 4.0, rsubpix), 0.0);

  vec4 topLeftColor = pow(texture(Source,((floor(vec2(left, top)/ texelSize)+ 0.5)* texelSize)), vec4(2.2))* lcol;
  vec4 bottomRightColor = pow(texture(Source,((floor(vec2(right, bottom)/ texelSize)+ 0.5)* texelSize)), vec4(2.2))* rcol;
  vec4 bottomLeftColor = pow(texture(Source,((floor(vec2(left, bottom)/ texelSize)+ 0.5)* texelSize)), vec4(2.2))* lcol;
  vec4 topRightColor = pow(texture(Source,((floor(vec2(right, top)/ texelSize)+ 0.5)* texelSize)), vec4(2.2))* rcol;

  vec2 border = floor((vTexCoord . st / subtexelSize)+ 0.5);
  vec2 bordert = clamp((border + vec2(0.0, + 0.05))* subtexelSize,
         vec2(left, bottom), vec2(right, top));
  vec2 borderb = clamp((border + vec2(0.0, - 0.05))* subtexelSize,
         vec2(left, bottom), vec2(right, top));
  float totalArea = 2.0 * range . y;

   vec4 averageColor;
  averageColor =((top - bordert . y)/ totalArea)* topLeftColor;
  averageColor +=((borderb . y - bottom)/ totalArea)* bottomRightColor;
  averageColor +=((borderb . y - bottom)/ totalArea)* bottomLeftColor;
  averageColor +=((top - bordert . y)/ totalArea)* topRightColor;

   FragColor = pow(averageColor, vec4(1.0 / 2.2));
}
