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
   float GaussStrength;
   float BloomStrength;
   float SW;
   float BRIGHT;
}params;





#pragma parameterGaussStrength¡0.300.01.00.01

#pragma parameterBloomStrength¡0.330.0001.0000.005

#pragma parameterSW¡2.01.04.00.25

#pragma parameterBRIGHT¡0.50.30.60.01


layout(std140) uniform UBO
{
   mat4 MVP;
}global;




































layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D scanpass;

void main()
{
 vec2 texp = vTexCoord;
 vec2 texcoord = vTexCoord;
 vec2 PIXEL_SIZE = params . SourceSize . zw;

 float sampleOffsets[5] = float[5](float(0.0), float(1.4347826), float(3.3478260), float(5.2608695), float(7.1739130 ));
 float sampleWeights[5] = float[5](float(0.16818994), float(0.27276957), float(0.11690125), float(0.024067905), float(0.0021112196 ));

 vec4 color = texture(Source, texcoord)* sampleWeights[0];
 for(int i = 1;i < 5;++ i){
  color += texture(Source, texcoord + vec2(sampleOffsets[i]* params . SW * PIXEL_SIZE . x, sampleOffsets[i]* PIXEL_SIZE . y))* sampleWeights[i];
  color += texture(Source, texcoord - vec2(sampleOffsets[i]* params . SW * PIXEL_SIZE . x, sampleOffsets[i]* PIXEL_SIZE . y))* sampleWeights[i];
  color += texture(Source, texcoord + vec2(- sampleOffsets[i]* params . SW * PIXEL_SIZE . x, sampleOffsets[i]* PIXEL_SIZE . y))* sampleWeights[i];
  color += texture(Source, texcoord + vec2(sampleOffsets[i]* params . SW * PIXEL_SIZE . x, - sampleOffsets[i]* PIXEL_SIZE . y))* sampleWeights[i];
 }
 vec4 blur = params . BRIGHT * color;

 vec4 orig = texture(scanpass, texp);

 vec3 sharp;




  orig = mix(orig, blur, params . GaussStrength);



























   orig += mix(orig, blur * 4, params . BloomStrength);
   orig = orig * 0.5;















   FragColor = orig;
}
