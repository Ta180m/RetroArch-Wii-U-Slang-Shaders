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


vec4 Zero = vec4(0.0);
vec4 Half = vec4(0.5);
vec4 One = vec4(1.0);
vec4 Two = vec4(2.0);
float Pi = 3.1415926535;
float Pi2 = 6.283185307;


vec4 A = vec4(0.5);
vec4 B = vec4(0.5);
float P = 1.0;
float CCFrequency = 3.59754545;
float YFrequency = 6.0;
float IFrequency = 1.2;
float QFrequency = 0.6;
float NotchHalfWidth = 2.0;
float ScanTime = 52.6;
float MaxC = 2.1183;
vec4 MinC = vec4(- 1.1183);
vec4 CRange = vec4(3.2366);

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

