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







#pragma parametercontrast¡0.700.01.00.05



#pragma parameterscreen_light¡0.850.02.00.05



#pragma parameterpixel_opacity¡0.90.011.00.01



#pragma parameterbg_smoothing¡0.00.01.00.05



#pragma parametershadow_opacity¡0.900.011.00.01



#pragma parametershadow_offset_x¡-1.5-5.05.00.5



#pragma parametershadow_offset_y¡1.5-5.05.00.5


#pragma parameterscreen_offset_x¡0.0-5.05.00.5


#pragma parameterscreen_offset_y¡0.0-5.05.00.5






















layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 texel;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;

    texel = registers . SourceSize . zw;
}





