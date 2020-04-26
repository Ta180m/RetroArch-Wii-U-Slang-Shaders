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
layout(location = 1) in vec2 blurCoordinates[5];
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec4 sum = vec4(0.0);
 sum += texture(Source, blurCoordinates[0])* 0.204164;
 sum += texture(Source, blurCoordinates[1])* 0.304005;
 sum += texture(Source, blurCoordinates[2])* 0.304005;
 sum += texture(Source, blurCoordinates[3])* 0.093913;
 sum += texture(Source, blurCoordinates[4])* 0.093913;
 FragColor = sum;
}
