#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

#pragma nameMMJ_OutlinePass

















uniform Push
{
   vec4 MMJ_BlurPass_VSize;
   float OutlineWeight;
}params;

#pragma parameterOutlineWeight¡1.00.010.00.1




layout(std140) uniform UBO
{
   mat4 MVP;
}global;


layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 TEX0;
layout(location = 2) out vec4 TEX1;
layout(location = 3) out vec4 TEX2;
layout(location = 4) out vec4 TEX3;
layout(location = 5) out vec4 TEX4;
layout(location = 6) out vec4 TEX5;

void main()
{
 gl_Position = global . MVP * Position;
 vTexCoord = TexCoord;

  TEX0 = vTexCoord . xyxy;

  vec4 offset;

  offset . xy = -(offset . zw = vec2(params . MMJ_BlurPass_VSize . z, 0.0));
  TEX1 = TEX0 + offset;
  TEX5 = TEX1 + offset;

  offset . xy = -(offset . zw = vec2(0.0, params . MMJ_BlurPass_VSize . w));
  TEX2 = TEX0 + offset;
  TEX3 = TEX1 + offset;
  TEX4 = TEX2 + offset;
}


