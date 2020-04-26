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
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

vec4 reSample(float d, vec2 uv, sampler2D decal)
{

    vec2 step1 =(vec2(d)+ 0.5)* params . SourceSize . zw;
    vec4 color = vec4(0.);
    color += texture(decal, uv + step1)/ 4.;
    color += texture(decal, uv - step1)/ 4.;
   vec2 step2 = step1;
    step2 . x = - step2 . x;
    color += texture(decal, uv + step2)/ 4.;
    color += texture(decal, uv - step2)/ 4.;
    return color;
}

void main()
{
   FragColor = reSample(2., vTexCoord, Source);
}
