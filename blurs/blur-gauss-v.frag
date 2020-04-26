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
 vec2 texcoord = vTexCoord;
 vec2 PIXEL_SIZE = params . SourceSize . zw;

 float sampleOffsets[5] = float[5](float(0.0), float(1.4347826), float(3.3478260), float(5.2608695), float(7.1739130 ));
 float sampleWeights[5] = float[5](float(0.16818994), float(0.27276957), float(0.11690125), float(0.024067905), float(0.0021112196 ));

 vec4 color = texture(Source, texcoord)* sampleWeights[0];
 for(int i = 1;i < 5;++ i){
  color += texture(Source, texcoord + vec2(0.0, sampleOffsets[i]* 1.00 * PIXEL_SIZE . y))* sampleWeights[i];
  color += texture(Source, texcoord - vec2(0.0, sampleOffsets[i]* 1.00 * PIXEL_SIZE . y))* sampleWeights[i];
 }
   FragColor = vec4(color);
}
