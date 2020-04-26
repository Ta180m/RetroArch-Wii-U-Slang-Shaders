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
layout(location = 1) out vec2 dot_size;
layout(location = 2) out vec2 one_texel;

void main()
{
 gl_Position = global . MVP * Position;
 vTexCoord = TexCoord;
 vec2 scaled_video_out =(params . SourceSize . xy * vec2(floor(params . OutputSize . y * params . SourceSize . w)));
 dot_size = params . SourceSize . zw;
 one_texel = 1.0 /(params . SourceSize . xy * floor(params . OutputSize . y * params . SourceSize . w));
}

