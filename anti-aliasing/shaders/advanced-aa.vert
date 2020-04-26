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
   float AA_RESOLUTION_X;
   float AA_RESOLUTION_Y;
}params;

#pragma parameterAA_RESOLUTION_X¡0.00.01920.01.0
#pragma parameterAA_RESOLUTION_Y¡0.00.01920.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;




























vec3 dt = vec3(1, 1, 1);

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out vec4 t2;
layout(location = 3) out vec4 t3;
layout(location = 4) out vec4 t4;

void main()
{
 gl_Position = global . MVP * Position;
 vTexCoord = TexCoord;
    vec2 ps = vec2(1.0 /((params . AA_RESOLUTION_X == 0)? params . SourceSize . x : params . AA_RESOLUTION_X), 1.0 /((params . AA_RESOLUTION_Y == 0)? params . SourceSize . y : params . AA_RESOLUTION_Y));
 float dx = ps . x * 0.5;
 float dy = ps . y * 0.5;

 t1 . xy = vTexCoord + vec2(- dx, 0);
 t2 . xy = vTexCoord + vec2(dx, 0);
 t3 . xy = vTexCoord + vec2(0, - dy);
 t4 . xy = vTexCoord + vec2(0, dy);
 t1 . zw = vTexCoord + vec2(- dx, - dy);
 t2 . zw = vTexCoord + vec2(- dx, dy);
 t3 . zw = vTexCoord + vec2(dx, - dy);
 t4 . zw = vTexCoord + vec2(dx, dy);
}

