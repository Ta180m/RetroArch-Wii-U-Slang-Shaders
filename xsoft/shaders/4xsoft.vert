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
   float RESOLUTION_X;
   float RESOLUTION_Y;
   float CONTRAST;
}params;

#pragma parameterRESOLUTION_X¡0.00.01920.01.0

#pragma parameterRESOLUTION_Y¡0.00.01920.01.0

#pragma parameterCONTRAST¡3.00.010.00.1


layout(std140) uniform UBO
{
   mat4 MVP;
}global;

vec3 dt = vec3(1.0, 1.0, 1.0);




layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out vec4 t2;
layout(location = 3) out vec4 t3;
layout(location = 4) out vec4 t4;
layout(location = 5) out vec4 t5;
layout(location = 6) out vec4 t6;

void main()
{

 vec2 ps = vec2(1.0 /((params . RESOLUTION_X == 0)? params . SourceSize . x : params . RESOLUTION_X), 1.0 /((params . RESOLUTION_Y == 0)? params . SourceSize . y : params . RESOLUTION_Y));

 float dx = ps . x;
 float dy = ps . y;
 float sx = ps . x * 0.5;
 float sy = ps . y * 0.5;
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
    t1 = vec4(vTexCoord, vTexCoord)+ vec4(- dx, - dy, dx, - dy);
 t2 = vec4(vTexCoord, vTexCoord)+ vec4(dx, dy, - dx, dy);
 t3 = vec4(vTexCoord, vTexCoord)+ vec4(- sx, - sy, sx, - sy);
 t4 = vec4(vTexCoord, vTexCoord)+ vec4(sx, sy, - sx, sy);
 t5 = vec4(vTexCoord, vTexCoord)+ vec4(- dx, 0, dx, 0);
 t6 = vec4(vTexCoord, vTexCoord)+ vec4(0, - dy, 0, dy);
}

