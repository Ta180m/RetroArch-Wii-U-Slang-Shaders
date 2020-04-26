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









layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in float colorPhase;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D nestable;

void main()
{
    vec4 c = texture(Source, vTexCoord . xy);

    vec2 pixmapCoord;
    pixmapCoord . x = c . x *(15.0 /(16.0 * 4.0))+ c . y *(3.0 / 4.0)+(0.5 /(16.0 * 4.0));
    pixmapCoord . y = 1.0 -(floor(mod(colorPhase + 0.5, 12.0))/(12.0 * 8.0)+ c . z *(7.0 / 8.0)+(0.5 /(12.0 * 8.0)));

    FragColor = vec4(((texture(nestable, pixmapCoord . xy). r)*(255.0f /(128.0f *(1.962f - .518f)))-(.518f /(1.962f - .518f))));
}
