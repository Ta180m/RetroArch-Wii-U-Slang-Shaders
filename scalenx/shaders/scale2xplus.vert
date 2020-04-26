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
layout(location = 0) out vec2 texCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out vec4 t2;

void main()
{
   gl_Position = global . MVP * Position;
   texCoord = TexCoord;

         vec2 ps = vec2(params . SourceSize . z, params . SourceSize . w);
 float dx = ps . x;
 float dy = ps . y;

 t1 = TexCoord . xyxy + vec4(0, - dy, - dx, 0);
 t2 = TexCoord . xyxy + vec4(dx, 0, 0, dy);
}

