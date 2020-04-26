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
   float Displacement;
}params;

#pragma parameterDisplacement¡20.00.060.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D displacementMap;

vec2 DisplacementLevel()
{
 return(params . OutputSize . zw * params . Displacement);
}

vec2 CoordDisplacement(vec2 coord)
{
 return(coord -((texture(displacementMap, coord). xy - 0.5)* DisplacementLevel()))* 1.1 - 0.05;




}

void main()
{
   FragColor = vec4(texture(Source, CoordDisplacement(vTexCoord)). rgb, 1.0);
}
