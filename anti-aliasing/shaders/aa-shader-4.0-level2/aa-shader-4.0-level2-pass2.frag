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
   float AAOFFSET2;
}params;

#pragma parameterAAOFFSET2¡0.50.252.00.05

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec2 texsize = params . SourceSize . xy;
   float dx = pow(texsize . x, - 1.0)* params . AAOFFSET2;
   float dy = pow(texsize . y, - 1.0)* params . AAOFFSET2;
   vec3 dt = vec3(1.0, 1.0, 1.0);

   vec2 UL = vTexCoord . xy + vec2(- dx, - dy);
   vec2 UR = vTexCoord . xy + vec2(dx, - dy);
   vec2 DL = vTexCoord . xy + vec2(- dx, dy);
   vec2 DR = vTexCoord . xy + vec2(dx, dy);

   vec3 c00 = texture(Source, UL). xyz;
   vec3 c20 = texture(Source, UR). xyz;
   vec3 c02 = texture(Source, DL). xyz;
   vec3 c22 = texture(Source, DR). xyz;

   float m1 = dot(abs(c00 - c22), dt)+ 0.001;
   float m2 = dot(abs(c02 - c20), dt)+ 0.001;

   FragColor = vec4((m1 *(c02 + c20)+ m2 *(c22 + c00))/(2.0 *(m1 + m2)), 1.0);
}
