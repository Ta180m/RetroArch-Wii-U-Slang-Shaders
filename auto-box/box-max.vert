#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4








layout(std140) uniform UBO
{
   vec4 SourceSize;
   vec4 OriginalSize;
   vec4 OutputSize;
   uint FrameCount;
   mat4 MVP;
}global;

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;


float min(vec2 x)
{
   if(x . x > x . y)
      return x . y;
   else
      return x . x;
}

void main()
{
   gl_Position = global . MVP * Position;

   vec2 box_scale = floor(global . OutputSize . xy / global . SourceSize . xy);
   box_scale = vec2(min(box_scale), min(box_scale));

   vec2 scale =(global . OutputSize . xy / global . SourceSize . xy)/ box_scale;
   vec2 middle = vec2(0.5);
   vec2 diff = TexCoord - middle;
   vTexCoord = middle + diff * scale;
}

