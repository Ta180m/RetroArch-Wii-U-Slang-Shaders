#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 SourceSize;
   vec4 OriginalHistorySize1;
   vec4 OriginalHistorySize3;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D OriginalHistory1;
uniform sampler2D OriginalHistory3;

void main()
{
   vec2 tex = floor(global . OriginalHistorySize1 . xy * vTexCoord);
   tex =(tex + 0.5)* global . OriginalHistorySize1 . zw;

   vec3 current = texture(Source, tex). rgb;
   vec3 prev = texture(OriginalHistory1, tex). rgb;
   vec3 prev2 = texture(OriginalHistory3, tex). rgb;
   FragColor = vec4(abs(current - prev + prev2), 1.0);
}
