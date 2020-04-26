#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4











float erroredtable[16] = float[16](float(16), float(4), float(13), float(1), float(8), float(12), float(5), float(9), float(14), float(2), float(15), float(3), float(6), float(10), float(7), float(11
));

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




layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

