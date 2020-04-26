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






















vec3 dtt = vec3(65536, 255, 1);

float reduce(vec3 color)
{
 return dot(color, dtt);
}

     vec3 bilinear(float p, float q, vec3 A, vec3 B, vec3 C, vec3 D)
{
 return((1 - p)*(1 - q)* A + p *(1 - q)* B +(1 - p)* q * C + p * q * D);
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out vec2 loc;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord * 1.0001;

        vec2 ps = vec2(params . SourceSize . z, params . SourceSize . w);
 float dx = ps . x;
 float dy = ps . y;

 t1 . xy = vec2(dx, 0);
 t1 . zw = vec2(0, dy);
 loc = vTexCoord * params . SourceSize . xy;
}

