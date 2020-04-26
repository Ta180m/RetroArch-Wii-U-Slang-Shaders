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




float and_(float a, float b){
 return min(a, b);
}

float and_(float a, float b, float c){
 return min(a, min(b, c));
}

float or_(float a, float b){
 return max(a, b);
}

float or_(float a, float b, float c, float d, float e){
 return max(a, max(b, max(c, max(d, e))));
}

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

