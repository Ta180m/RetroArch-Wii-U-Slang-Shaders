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
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
     vec4 color = texture(Source, vTexCoord);



















     mat3 color_correction = mat3(
          13.0, 2.0, 1.0,
           0.0, 3.0, 1.0,
           3.0, 2.0, 11.0
     );

     mat3 scale = mat3(
          1.0 / 16.0, 0.0, 0.0,
               0.0, 1.0 / 4.0, 0.0,
               0.0, 0.0, 1.0 / 16.0
     );

     color_correction *= scale;











     color . rgb *= color_correction;
     FragColor = color;
     return;




}
