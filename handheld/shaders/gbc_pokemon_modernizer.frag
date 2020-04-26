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

precision lowp float;

mat3 GBCMatrix = mat3(0.924, 0.021, 0.013, 0.048, 0.787, 0.249, 0.104, 0.09, 0.733);

void main()
{
    vec3 Picture = texture(Source, vTexCoord). xyz;

    Picture *= Picture;
    Picture *= GBCMatrix;
    Picture = sqrt(Picture);

    FragColor = vec4(Picture, 1.0);
}
