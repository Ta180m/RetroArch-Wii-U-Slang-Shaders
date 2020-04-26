#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

#pragma nameMMJ_BlurPass_V
















uniform Push
{
   vec4 MMJ_BlurPass_HSize;
   vec4 OriginalSize;
   float BlurWeightV;
}params;

#pragma parameterBlurWeightV¡0.00.016.01.0





layout(std140) uniform UBO
{
   mat4 MVP;
}global;


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D MMJ_BlurPass_H;

void main()
{
 vec2 PIXEL_SIZE = params . OriginalSize . zw;
  vec4 C = texture(MMJ_BlurPass_H, vTexCoord);
  float L = 0.0, J = 0.0;
  for(int i = 1;i <= params . BlurWeightV;++ i){
    L = 1.0 / i;
    J = 0.5 * i * PIXEL_SIZE . y;
    C = mix(C, mix(texture(MMJ_BlurPass_H, vTexCoord + vec2(0.0, J)), texture(MMJ_BlurPass_H, vTexCoord - vec2(0.0, J)), 0.5), L);
  }
  FragColor = C;
}
