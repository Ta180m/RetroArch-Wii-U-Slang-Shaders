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
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D COLOR_PALETTE;

void main()
{


     vec4 out_color = texture(Source, vTexCoord . xy);





     vec2 palette_coordinate = vec2(0.5,(abs(1 - out_color . r)* 0.75)+ 0.125);
     out_color = vec4(texture(COLOR_PALETTE, palette_coordinate). rgb, ceil(abs(1.0 - out_color . r)));

     FragColor = out_color;
}
