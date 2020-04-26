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




bool eq(vec3 A, vec3 B){
 return(A == B);
}

float and_(float a, float b){
 return min(a, b);
}

float or_(float a, float b, float c, float d, float e, float f, float g, float h, float i){
 return max(a, max(b, max(c, max(d, max(e, max(f, max(g, max(h, i))))))));
}

vec2 and_(vec2 a, vec2 b){
 return min(a, b);
}

vec2 or_(vec2 a, vec2 b){
 return max(a, b);
}

vec2 or_(vec2 a, vec2 b, vec2 c, vec2 d){
 return max(a, max(b, max(c, d)));
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

