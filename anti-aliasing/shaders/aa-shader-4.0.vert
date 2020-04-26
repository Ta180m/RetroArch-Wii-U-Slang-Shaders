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
   float INTERNAL_RES;
}params;

#pragma parameterINTERNAL_RES¡1.01.08.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

vec3 dt = vec3(1.0, 1.0, 1.0);

vec3 texture2d_(sampler2D tex, vec2 coord, vec4 yx){

 vec3 s00 = texture(tex, coord + yx . zw). xyz;
 vec3 s20 = texture(tex, coord + yx . xw). xyz;
 vec3 s22 = texture(tex, coord + yx . xy). xyz;
 vec3 s02 = texture(tex, coord + yx . zy). xyz;

 float m1 = dot(abs(s00 - s22), dt)+ 0.001;
 float m2 = dot(abs(s02 - s20), dt)+ 0.001;

 return 0.5 *(m2 *(s00 + s22)+ m1 *(s02 + s20))/(m1 + m2);
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

