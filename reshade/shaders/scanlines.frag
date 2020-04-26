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
   float opacity;
}params;

#pragma parameteropacity¡50.00.0100.01.0


layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec4 frame = texture(Source, vTexCoord);
   vec2 fragpos = floor(vTexCoord . xy * params . OutputSize . xy);
   vec4 background;
   if(mod(fragpos . y, 2.0)== 0.0)background = vec4(0.0, 0.0, 0.0, 1.0);else background = vec4(1.0, 1.0, 1.0, 0.0);
   if(params . OutputSize . y > 1600){ if(mod(fragpos . y, 4.0)< 2.0)background = vec4(0.0, 0.0, 0.0, 1.0);else background = vec4(1.0, 1.0, 1.0, 0.0);}
   background . a *= params . opacity / 100.0;
   FragColor = mix(frame, background, background . a);
}
