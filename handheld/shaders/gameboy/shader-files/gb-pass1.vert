#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float blending_mode;
   float adjacent_texel_alpha_blending;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;








#pragma parameterblending_mode¡1.00.01.01.0


#pragma parameteradjacent_texel_alpha_blending¡0.17550.01.00.05


























layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 texel;
layout(location = 2) out vec2 blur_coords_up;
layout(location = 3) out vec2 blur_coords_down;
layout(location = 4) out vec2 blur_coords_right;
layout(location = 5) out vec2 blur_coords_left;
layout(location = 6) out vec2 blur_coords_lower_bound;
layout(location = 7) out vec2 blur_coords_upper_bound;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord * 1.0001;

    texel = registers . SourceSize . zw;
    blur_coords_down = vTexCoord + vec2(0.0, texel . y);
    blur_coords_up = vTexCoord + vec2(0.0, - texel . y);
    blur_coords_right = vTexCoord + vec2(texel . x, 0.0);
    blur_coords_left = vTexCoord + vec2(- texel . x, 0.0);
    blur_coords_lower_bound = vec2(0.0);
    blur_coords_upper_bound = texel *(registers . OutputSize . xy - vec2(2.0));
}





