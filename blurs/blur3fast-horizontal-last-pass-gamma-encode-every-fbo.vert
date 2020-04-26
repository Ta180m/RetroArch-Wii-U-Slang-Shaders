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
layout(location = 0) out vec2 tex_uv;
layout(location = 1) out vec2 blur_dxdy;

void main()
{
   gl_Position = global . MVP * Position;
   tex_uv = TexCoord;










          vec2 dxdy_scale = params . SourceSize . xy * params . OutputSize . zw;
       vec2 dxdy = dxdy_scale * params . SourceSize . zw;

 blur_dxdy = vec2(dxdy . x, 0.0);
}





