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

uniform Push
{
   float reflectionBrightness;
   float reflectionDistanceX;
   float reflectionDistanceY;
   float lightBrightness;
}params;

#pragma parameterreflectionBrightness¡0.070.01.00.01
#pragma parameterreflectionDistanceX¡0.0-1.01.00.005
#pragma parameterreflectionDistanceY¡0.025-1.01.00.005
#pragma parameterlightBrightness¡1.00.01.00.01

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

float speed = 2.0;
float decay = 2.0;
float coeff = 2.5;

void main()
{
 vec2 reflectionDistance = vec2(params . reflectionDistanceX, params . reflectionDistanceY);
 float sp = pow(speed, params . lightBrightness);
 float dc = pow(decay, - params . lightBrightness);
 float s =(sp - dc)/(sp + dc);
 vec2 radius =(vTexCoord . st - vec2(0.5, 0.5))* vec2(coeff * s);
 radius = pow(abs(radius), vec2(4.0));
 vec3 bleed = vec3(0.12, 0.14, 0.19);
 bleed +=(dot(radius, radius)+ vec3(0.02, 0.03, 0.05))* vec3(0.14, 0.18, 0.2);

 vec4 color = texture(Source, vTexCoord);
 color . rgb += pow(bleed, pow(vec3(params . lightBrightness), vec3(- 0.5)));

 vec4 reflection = texture(Source, vTexCoord - reflectionDistance);
 color . rgb += reflection . rgb * params . reflectionBrightness;
 color . a = 1.0;
 FragColor = color;

}
