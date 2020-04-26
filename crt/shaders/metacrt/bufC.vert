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
   float cam_index;
   float showSphere;
   float snow;
   float Fov;
   float PosX;
   float PosY;
   float PosZ;
   float TargetX;
   float TargetY;
}params;


#pragma parametershowSphere¡0.00.01.01.0
#pragma parametersnow¡0.00.01.01.0
#pragma parameterFov¡-9.0-20.020.00.1
#pragma parameterPosX¡-0.30-10.010.00.12
#pragma parameterPosY¡0.25-10.010.00.12
#pragma parameterPosZ¡-3.25-10.010.00.12
#pragma parameterTargetX¡-0.25-10.010.00.05
#pragma parameterTargetY¡0.25-10.010.00.05


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

