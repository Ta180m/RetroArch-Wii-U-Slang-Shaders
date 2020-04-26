#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

#pragma nameMainPass

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 SourceSize;
   vec4 MainPassFeedbackSize;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D MainPassFeedback;

void main()
{
   vec2 tex = floor(global . MainPassFeedbackSize . xy * vTexCoord);
   tex =(tex + 0.5)* global . MainPassFeedbackSize . zw;

   vec3 current = texture(Source, tex). rgb;
   vec3 prev = texture(MainPassFeedback, tex). rgb;
   FragColor = vec4(0.5 * mix(current, prev, 0.8), 1.0);
}
