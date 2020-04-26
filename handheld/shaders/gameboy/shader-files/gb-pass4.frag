#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   vec4 PassOutputSize1;
   float contrast;
   float screen_light;
   float pixel_opacity;
   float bg_smoothing;
   float shadow_opacity;
   float shadow_offset_x;
   float shadow_offset_y;
   float screen_offset_x;
   float screen_offset_y;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;







#pragma parametercontrast¡0.950.01.00.05



#pragma parameterscreen_light¡1.00.02.00.05



#pragma parameterpixel_opacity¡1.00.011.00.01



#pragma parameterbg_smoothing¡0.750.01.00.05



#pragma parametershadow_opacity¡0.550.011.00.01



#pragma parametershadow_offset_x¡1.0-5.05.00.5



#pragma parametershadow_offset_y¡1.0-5.05.00.5


#pragma parameterscreen_offset_x¡0.0-5.05.00.5


#pragma parameterscreen_offset_y¡0.0-5.05.00.5






















layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 texel;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D PassOutput1;
uniform sampler2D BACKGROUND;
uniform sampler2D COLOR_PALETTE;
















void main()
{
    vec2 tex = floor(registers . PassOutputSize1 . xy * vTexCoord);
    tex =(tex + 0.5)* registers . PassOutputSize1 . zw;


    vec4 foreground = texture(PassOutput1, tex - vec2(registers . screen_offset_x * texel . x, registers . screen_offset_y * texel . y));
    vec4 background = texture(BACKGROUND, vTexCoord);
    vec4 shadows = texture(Source, vTexCoord -(vec2(registers . shadow_offset_x * texel . x, registers . shadow_offset_y * texel . y)+ vec2(registers . screen_offset_x * texel . x, registers . screen_offset_y * texel . y)));
    vec4 background_color = texture(COLOR_PALETTE, vec2(0.25, 0.5));


    foreground *= texture(COLOR_PALETTE, vec2(0.25, 0.5));

    float bg_test = 0.0;
    if(foreground . a > 0.0)
        bg_test = 1.0;

    background -=(background - 0.5)* registers . bg_smoothing * bg_test;



    background . rgb = clamp(
        vec3(
                   texture(COLOR_PALETTE, vec2(0.25, 0.5)). r + mix(- 1.0, 1.0, background . r),
                   texture(COLOR_PALETTE, vec2(0.25, 0.5)). g + mix(- 1.0, 1.0, background . g),
                   texture(COLOR_PALETTE, vec2(0.25, 0.5)). b + mix(- 1.0, 1.0, background . b)
        ),
        0.0, 1.0
    );


    vec4 out_color =(shadows * shadows . a *(registers . contrast * registers . shadow_opacity))+(background *(1 - shadows . a *(registers . contrast * registers . shadow_opacity)));


    out_color =(foreground * foreground . a * registers . contrast)+(out_color *(registers . screen_light - foreground . a * registers . contrast * registers . pixel_opacity));

    FragColor = out_color;
}
