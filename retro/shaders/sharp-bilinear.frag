#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float SHARP_BILINEAR_PRE_SCALE;
   float AUTO_PRESCALE;
}params;

#pragma parameterSHARP_BILINEAR_PRE_SCALE¡4.01.010.01.0
#pragma parameterAUTO_PRESCALE¡1.00.01.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;










layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec2 texel = vTexCoord * params . SourceSize . xy;
   vec2 texel_floored = floor(texel);
   vec2 s = fract(texel);
   float scale =(params . AUTO_PRESCALE > 0.5)? floor(params . OutputSize . y / params . SourceSize . y + 0.01): params . SHARP_BILINEAR_PRE_SCALE;
   float region_range = 0.5 - 0.5 / scale;




   vec2 center_dist = s - 0.5;
   vec2 f =(center_dist - clamp(center_dist, - region_range, region_range))* scale + 0.5;

   vec2 mod_texel = texel_floored + f;

   FragColor = vec4(texture(Source, mod_texel / params . SourceSize . xy). rgb, 1.0);
}
