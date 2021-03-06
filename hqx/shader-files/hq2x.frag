#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4


uniform Push
{
   vec4 SourceSize;
   vec4 OriginalSize;
   vec4 OutputSize;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;















































layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D LUT;
uniform sampler2D Original;

void main()
{
 vec2 fp = fract(vTexCoord * registers . SourceSize . xy);
 vec2 quad = sign(- 0.5 + fp);

 float dx = registers . SourceSize . z;
 float dy = registers . SourceSize . w;

 vec3 p1 = texture(Original, vTexCoord). rgb;
 vec3 p2 = texture(Original, vTexCoord + vec2(dx, dy)* quad). rgb;
 vec3 p3 = texture(Original, vTexCoord + vec2(dx, 0.0)* quad). rgb;
 vec3 p4 = texture(Original, vTexCoord + vec2(0.0, dy)* quad). rgb;
 vec3 pixels[4];
 pixels[0]= p1 . xyz;
 pixels[1]= p2 . xyz;
 pixels[2]= p3 . xyz;
 pixels[3]= p4 . xyz;

 vec2 index = texture(Source, vTexCoord). xy * vec2(255.0, 15.0 *(2 * 2));
 index . y += dot(floor(fp * 2), vec2(1.0, 2));

 vec2 step = 1.0 / vec2(256.0, 16.0 *(2 * 2));
 vec2 offset = step / 2.0;
 vec4 weights = texture(LUT, index * step + offset);
 float sum = dot(weights, vec4(1.0));
 vec4 tmp = vec4(float((weights / sum). x), float((weights / sum). y), float((weights / sum). z), float((weights / sum). w));
 vec3 res = tmp . x * pixels[0];
 res = res + tmp . y * pixels[1];
 res = res + tmp . z * pixels[2];
 res = res + tmp . w * pixels[3];

 FragColor = vec4(res . xyz, 1.0);
}

