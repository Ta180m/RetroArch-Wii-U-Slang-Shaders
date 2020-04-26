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
   float brighten_scanlines;
   float brighten_lcd;
}params;

#pragma parameterbrighten_scanlines¡16.01.032.00.5

#pragma parameterbrighten_lcd¡4.01.012.00.1


layout(std140) uniform UBO
{
   mat4 MVP;
}global;

vec2 omega = vec2(3.141592654)* vec2(2.0)* params . SourceSize . xy;
vec3 offsets = vec3(3.141592654)* vec3(1.0 / 2, 1.0 / 2 - 2.0 / 3, 1.0 / 2 - 4.0 / 3);

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    vec3 res = texture(Source, vTexCoord). xyz;

    vec2 angle = vTexCoord * omega;

    float yfactor =(params . brighten_scanlines + sin(angle . y))/(params . brighten_scanlines + 1);
    vec3 xfactors =(params . brighten_lcd + sin(angle . x + offsets))/(params . brighten_lcd + 1);

    vec3 color = yfactor * xfactors * res;

   FragColor = vec4(color . x, color . y, color . z, 1.0);
}
