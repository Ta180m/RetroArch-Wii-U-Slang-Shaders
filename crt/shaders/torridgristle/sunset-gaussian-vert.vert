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

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 blurCoordinates[5];

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;

 blurCoordinates[0]= vTexCoord . xy;
 blurCoordinates[1]= vTexCoord . xy + params . OutputSize . zw * vec2(0., 1.407333);
 blurCoordinates[2]= vTexCoord . xy - params . OutputSize . zw * vec2(0., 1.407333);
 blurCoordinates[3]= vTexCoord . xy + params . OutputSize . zw * vec2(0., 3.294215);
 blurCoordinates[4]= vTexCoord . xy - params . OutputSize . zw * vec2(0., 3.294215);
}

