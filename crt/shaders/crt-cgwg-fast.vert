#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4






















uniform Push
{
   float CRTCGWG_GAMMA;
}param;

#pragma parameterCRTCGWG_GAMMA¡2.70.010.00.01

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



layout(location = 1) out vec2 c01;
layout(location = 2) out vec2 c11;
layout(location = 3) out vec2 c21;
layout(location = 4) out vec2 c31;
layout(location = 5) out vec2 c02;
layout(location = 6) out vec2 c12;
layout(location = 7) out vec2 c22;
layout(location = 8) out vec2 c32;
layout(location = 9) out float mod_factor;
layout(location = 10) out vec2 ratio_scale;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;

    vec2 delta = global . SourceSize . zw;
    float dx = delta . x;
    float dy = delta . y;

    c01 = vTexCoord + vec2(- dx, 0.0);
    c11 = vTexCoord + vec2(0.0, 0.0);
    c21 = vTexCoord + vec2(dx, 0.0);
    c31 = vTexCoord + vec2(2.0 * dx, 0.0);
    c02 = vTexCoord + vec2(- dx, dy);
    c12 = vTexCoord + vec2(0.0, dy);
    c22 = vTexCoord + vec2(dx, dy);
    c32 = vTexCoord + vec2(2.0 * dx, dy);
    mod_factor = vTexCoord . x * global . OutputSize . x;
    ratio_scale = vTexCoord * global . SourceSize . xy;
}

