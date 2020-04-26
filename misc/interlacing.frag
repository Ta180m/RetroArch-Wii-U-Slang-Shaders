#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   uint FrameCount;
   float percent;
   float enable_480i;
   float top_field_first;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

#pragma parameterpercent¡0.00.01.00.05
#pragma parameterenable_480i¡1.00.01.01.0
#pragma parametertop_field_first¡0.00.01.01.0










layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec4 res = texture(Source, vTexCoord). rgba;
   float y = 0.0;
   float tick = registers . FrameCount;


   if(registers . SourceSize . y > 400.0)
   { y = registers . SourceSize . y * vTexCoord . y +(tick * registers . enable_480i)+ registers . top_field_first;}
   else
   { y = 2.000001 * registers . SourceSize . y * vTexCoord . y + registers . top_field_first;}

   if(mod(y, 1.99999)> 0.99999)
   { res = res;}
   else
   { res = vec4(registers . percent)* res;}
   FragColor = res;
}
