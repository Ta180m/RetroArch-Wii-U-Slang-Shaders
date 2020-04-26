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
   float QUAD_INTERP_RESOLUTION_X;
   float QUAD_INTERP_RESOLUTION_Y;
   float QUAD_INTERP_SHARPNESS;
}params;

#pragma parameterQUAD_INTERP_RESOLUTION_X¡0.00.01920.01.0
#pragma parameterQUAD_INTERP_RESOLUTION_Y¡0.00.01920.01.0
#pragma parameterQUAD_INTERP_SHARPNESS¡2.010.010.00.01





layout(std140) uniform UBO
{
   mat4 MVP;
}global;


























     vec3 quad_inter(vec3 x0, vec3 x1, vec3 x2, float x)
{
        vec3 poly[3];
   poly[2]= 0.5 * x0 - x1 + 0.5 * x2;
   poly[1]= - 1.5 * x0 + 2.0 * x1 - 0.5 * x2;
   poly[0]= x0;
   return poly[2]* x * x + poly[1]* x + poly[0];
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

