#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4













layout(std140) uniform UBO
{
   mat4 MVP;
}global;


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D OriginalHistory1;




void main()
{

 vec3 colour = texture(Source, vTexCoord . xy). rgb;


 vec3 colourPrev = texture(OriginalHistory1, vTexCoord . xy). rgb;


 colour . rgb = mix(colour . rgb, colourPrev . rgb, 0.5);

 FragColor = vec4(colour . rgb, 1.0);
}
