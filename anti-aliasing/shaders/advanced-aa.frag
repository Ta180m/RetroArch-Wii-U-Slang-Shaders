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
   float AA_RESOLUTION_X;
   float AA_RESOLUTION_Y;
}params;

#pragma parameterAA_RESOLUTION_X¡0.00.01920.01.0
#pragma parameterAA_RESOLUTION_Y¡0.00.01920.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;




























vec3 dt = vec3(1, 1, 1);

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 3) in vec4 t3;
layout(location = 4) in vec4 t4;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec3 c00 = texture(Source, t1 . zw). xyz;
   vec3 c10 = texture(Source, t3 . xy). xyz;
   vec3 c20 = texture(Source, t3 . zw). xyz;
   vec3 c01 = texture(Source, t1 . xy). xyz;
   vec3 c11 = texture(Source, vTexCoord). xyz;
   vec3 c21 = texture(Source, t2 . xy). xyz;
   vec3 c02 = texture(Source, t2 . zw). xyz;
   vec3 c12 = texture(Source, t4 . xy). xyz;
   vec3 c22 = texture(Source, t4 . zw). xyz;

   float d1 = dot(abs(c00 - c22), dt)+ 0.0001;
   float d2 = dot(abs(c20 - c02), dt)+ 0.0001;
   float hl = dot(abs(c01 - c21), dt)+ 0.0001;
   float vl = dot(abs(c10 - c12), dt)+ 0.0001;

   float k1 = 0.5 *(hl + vl);
   float k2 = 0.5 *(d1 + d2);

   vec3 t1 =(hl *(c10 + c12)+ vl *(c01 + c21)+ k1 * c11)/(2.5 *(hl + vl));
   vec3 t2 =(d1 *(c20 + c02)+ d2 *(c00 + c22)+ k2 * c11)/(2.5 *(d1 + d2));

   k1 = dot(abs(t1 - c11), dt)+ 0.0001;
   k2 = dot(abs(t2 - c11), dt)+ 0.0001;

   FragColor = vec4((k1 * t2 + k2 * t1)/(k1 + k2), 1);
}
