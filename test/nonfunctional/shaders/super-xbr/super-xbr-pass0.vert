#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4































layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   uint FrameCount;
}global;

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

    vec2 ps = vec2(global . SourceSize . z, global . SourceSize . w);
    float dx = ps . x;
    float dy = ps . y;

    t1 = vTexCoord . xyxy + vec4(- dx, - dy, 2.0 * dx, 2.0 * dy);
    t2 = vTexCoord . xyxy + vec4(0, - dy, dx, 2.0 * dy);
    t3 = vTexCoord . xyxy + vec4(- dx, 0, 2.0 * dx, dy);
    t4 = vTexCoord . xyxy + vec4(0, 0, dx, dy);
}

