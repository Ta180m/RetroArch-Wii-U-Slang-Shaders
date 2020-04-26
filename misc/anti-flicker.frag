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
   float THRESH;
}params;

#pragma parameterTHRESH¡0.250.01.00.05

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D OriginalHistory1;
uniform sampler2D OriginalHistory2;
uniform sampler2D OriginalHistory3;

void main()
{

 vec4 current = texture(Source, vTexCoord);
 vec4 prev1 = texture(OriginalHistory1, vTexCoord);
 vec4 prev2 = texture(OriginalHistory2, vTexCoord);
 vec4 prev3 = texture(OriginalHistory3, vTexCoord);


 float cur_lum = dot(current . rgb, vec3(0.2125, 0.7154, 0.0721));
 float prev1_lum = dot(prev1 . rgb, vec3(0.2125, 0.7154, 0.0721));
 float prev2_lum = dot(prev2 . rgb, vec3(0.2125, 0.7154, 0.0721));
 float prev3_lum = dot(prev3 . rgb, vec3(0.2125, 0.7154, 0.0721));





 bool flicker =(abs(cur_lum - prev1_lum)> params . THRESH && abs(cur_lum - prev2_lum)< params . THRESH)&&
  (abs(prev1_lum - prev2_lum)> params . THRESH && abs(prev1_lum - prev3_lum)< params . THRESH);


 vec4 blended =(pow(current, vec4(2.2))+ pow(prev1, vec4(2.2)))/ 2.0;


 blended = pow(blended, vec4(1.0 / 2.2));

 FragColor =(! flicker)? current : blended;
}
