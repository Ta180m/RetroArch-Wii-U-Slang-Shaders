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
   float STEPS;
   float DEBUG;
   float linear_gamma;
}params;

#pragma parameterSTEPS¡1.00.05.01.0
#pragma parameterDEBUG¡0.00.01.01.0
#pragma parameterlinear_gamma¡0.00.01.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;



layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 t1;

void main()
{
   gl_Position = global . MVP * vec4(Position . xy, 0.0, 1.0);
   vTexCoord = TexCoord;
   t1 = params . SourceSize . zw;
}

