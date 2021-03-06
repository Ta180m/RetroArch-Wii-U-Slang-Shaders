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









float AValue = 0.5f;
float BValue = 0.5f;
float CCValue = 3.5795454f;
float OValue = 0.0f;
float PValue = 1.0f;
float ScanTime = 52.6f;

float NotchHalfWidth = 1.0f;
float YFreqResponse = 6.0f;
float IFreqResponse = 1.2f;
float QFreqResponse = 0.6f;

float SignalOffset = 0.0f;





 float PI = 3.1415927f;
 float PI2 = 6.2830854f;

 vec4 YDot = vec4(0.299f, 0.587f, 0.114f, 0.0f);
 vec4 IDot = vec4(0.595716f, - 0.274453f, - 0.321263f, 0.0f);
 vec4 QDot = vec4(0.211456f, - 0.522591f, 0.311135f, 0.0f);

 vec3 RDot = vec3(1.0f, 0.956f, 0.621f);
 vec3 GDot = vec3(1.0f, - 0.272f, - 0.647f);
 vec3 BDot = vec3(1.0f, - 1.106f, 1.703f);

 vec4 OffsetX = vec4(0.0f, 0.25f, 0.50f, 0.75f);
 vec4 NotchOffset = vec4(0.0f, 1.0f, 2.0f, 3.0f);

 const int SampleCount = 64;
 const int HalfSampleCount = 32;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

