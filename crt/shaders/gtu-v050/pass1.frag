#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4


uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float compositeConnection;
}params;



layout(std140) uniform UBO
{
   mat4 MVP;
}global;







#pragma parametercompositeConnection¡0.00.01.01.0





layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec4 c = texture(Source, vTexCoord);
 if(params . compositeConnection > 0.0)
  c . rgb = c . rgb * mat3x3(0.299, 0.595716, 0.211456, 0.587, - 0.274453, - 0.522591, 0.114, - 0.321263, 0.311135);
   FragColor = c;
}
