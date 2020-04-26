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
   float screen_combine;
   float haze_strength;
}params;

#pragma parameterscreen_combine¡0.00.01.01.0
#pragma parameterhaze_strength¡0.50.01.00.05

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D PASS1;

void main()
{
vec4 blurred = pow(texture(Source, vTexCoord), vec4(2.2));
vec4 unblurred = pow(texture(PASS1, vTexCoord), vec4(2.2));
vec4 dark = vec4(pow(mix(unblurred, blurred, params . haze_strength), vec4(1.0 / 2.2)));
vec4 bright = vec4(pow(vec4(1.0)-(vec4(1.0)- unblurred)*(vec4(1.0)- blurred), vec4(1.0 / 2.2)));
   FragColor =(params . screen_combine < 0.5)? dark : bright;
}
