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


























layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 texel;
layout(location = 2) in vec2 blur_coords_up;
layout(location = 3) in vec2 blur_coords_down;
layout(location = 4) in vec2 blur_coords_right;
layout(location = 5) in vec2 blur_coords_left;
layout(location = 6) in vec2 blur_coords_lower_bound;
layout(location = 7) in vec2 blur_coords_upper_bound;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;





float blending_modifier(float color){
 float blend_bool =(color == 0.0)? 1 : 0;
 return clamp(blend_bool + registers . blending_mode, 0.0, 1.0);
}

void main()
{





    vec4 out_color = texture(Source, vTexCoord). rgba;


    vec2 blur_coords_up_clamped = clamp(blur_coords_up, blur_coords_lower_bound, blur_coords_upper_bound);
    vec2 blur_coords_down_clamped = clamp(blur_coords_down, blur_coords_lower_bound, blur_coords_upper_bound);
    vec2 blur_coords_right_clamped = clamp(blur_coords_right, blur_coords_lower_bound, blur_coords_upper_bound);
    vec2 blur_coords_left_clamped = clamp(blur_coords_left, blur_coords_lower_bound, blur_coords_upper_bound);


    vec4 adjacent_texel_1 = texture(Source, blur_coords_up_clamped). rgba;
    vec4 adjacent_texel_2 = texture(Source, blur_coords_down_clamped). rgba;
    vec4 adjacent_texel_3 = texture(Source, blur_coords_right_clamped). rgba;
    vec4 adjacent_texel_4 = texture(Source, blur_coords_left_clamped). rgba;


    out_color . a -=
    (
        (out_color . a - adjacent_texel_1 . a)+
        (out_color . a - adjacent_texel_2 . a)+
        (out_color . a - adjacent_texel_3 . a)+
        (out_color . a - adjacent_texel_4 . a)
    )* registers . adjacent_texel_alpha_blending * blending_modifier(out_color . a);

    FragColor = out_color;
}
