#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

#pragma nameMMJ_BlurPass_H
















uniform Push
{
   vec4 SourceSize;
   float BlurWeightH;
}params;

#pragma parameterBlurWeightH¡0.00.016.01.0




layout(std140) uniform UBO
{
   mat4 MVP;
}global;


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec2 PIXEL_SIZE = params . SourceSize . zw;
  vec4 C = texture(Source, vTexCoord);
  float L = 0.0, J = 0.0;
  for(int i = 1;i <= params . BlurWeightH;++ i){
    L = 1.0 / i;
    J = 0.5 * i * PIXEL_SIZE . x;
    C = mix(C, mix(texture(Source, vTexCoord + vec2(J, 0.0)), texture(Source, vTexCoord - vec2(J, 0.0)), 0.5), L);
  }
  FragColor = C;
}
