#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float shadow_blur2;
}registers;

#pragma parametershadow_blur2¡2.00.05.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;






















layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 texel;
layout(location = 2) out vec2 lower_bound;
layout(location = 3) out vec2 upper_bound;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;

    texel = registers . SourceSize . zw;
    lower_bound = vec2(0.0);
    upper_bound = vec2(texel *(registers . OutputSize . xy - 1.0));
}

