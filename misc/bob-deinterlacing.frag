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

void main()
{
 float y = 0.0;

 if(params . SourceSize . y > 400.0)y = params . SourceSize . y * vTexCoord . y + float(params . FrameCount);
 else y = 2.000001 * params . SourceSize . y * vTexCoord . y;

 if(mod(y, 2.0)> 0.99999)FragColor = vec4(texture(Source, vTexCoord + vec2(0.0, params . SourceSize . w)));
 else
 FragColor = vec4(texture(Source, vTexCoord). rgb, 1.0);
}
