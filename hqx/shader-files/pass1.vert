#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 SourceSize;
   float trY;
   float trU;
   float trV;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;























#pragma parametertrY¡48.00.0255.01.0
#pragma parametertrU¡7.00.0255.01.0
#pragma parametertrV¡6.00.0255.01.0

vec3 yuv_threshold = vec3(registers . trY / 255.0, registers . trU / 255.0, registers . trV / 255.0);
mat3 yuv = mat3(0.299, - 0.169, 0.5, 0.587, - 0.331, - 0.419, 0.114, 0.5, - 0.081);
vec3 yuv_offset = vec3(0.0, 0.5, 0.5);

bool diff(vec3 yuv1, vec3 yuv2){
 bvec3 res = greaterThan(abs((yuv1 + yuv_offset)-(yuv2 + yuv_offset)), yuv_threshold);
 return res . x || res . y || res . z;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out vec4 t2;
layout(location = 3) out vec4 t3;

void main()
{
 gl_Position = global . MVP * Position;
 vTexCoord = TexCoord;
 float dx = registers . SourceSize . z;
 float dy = registers . SourceSize . w;










 t1 = vTexCoord . xxxy + vec4(- dx, 0, dx, - dy);
 t2 = vTexCoord . xxxy + vec4(- dx, 0, dx, 0);
 t3 = vTexCoord . xxxy + vec4(- dx, 0, dx, dy);
}

