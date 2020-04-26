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
 vec3 arrayX[4];
 arrayX[0]= vec3(1.0, 0.2, 0.2);
 arrayX[1]= vec3(0.2, 1.0, 0.2);
 arrayX[2]= vec3(0.2, 0.2, 1.0);
 arrayX[3]= vec3(0.4, 0.4, 0.4);
 vec3 arrayY[4];
 arrayY[0]= vec3(1.0, 1.0, 1.0);
 arrayY[1]= vec3(1.0, 1.0, 1.0);
 arrayY[2]= vec3(1.0, 1.0, 1.0);
 arrayY[3]= vec3(0.8, 0.8, 0.8);
 color . rgb = pow(color . rgb * vec3(0.8, 0.8, 0.8), vec3(1.8, 1.8, 1.8))+ vec3(0.16, 0.16, 0.16);
 color . rgb *= arrayX[int(mod(vTexCoord . s * global . SourceSize . x * 4.0, 4.0))];
 color . rgb *= arrayY[int(mod(vTexCoord . t * global . SourceSize . y * 4.0, 4.0))];
 color . a = 0.5;
 FragColor = color;

}
