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
   float height;
   float width;
   float location;
}params;

#pragma parameterheight¡1.0-3.03.00.01
#pragma parameterwidth¡1.0-3.03.00.05
#pragma parameterlocation¡0.0001-2.02.00.001

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 vTexCoord1;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   FragColor = vec4(texture(Source, vTexCoord). rgb, 1.0)+ vec4(texture(Source, vTexCoord1). rgb, 1.0);
}
