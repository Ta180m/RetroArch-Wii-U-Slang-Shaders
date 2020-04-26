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


layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
 gl_Position = global . MVP * Position;
 vTexCoord = TexCoord;
}


