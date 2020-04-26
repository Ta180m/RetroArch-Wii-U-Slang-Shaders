#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;

vec3 dtt = vec3(65536.0, 255.0, 1.0);

float reduce(vec3 color)
{
 return dot(color, dtt);
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out vec4 t2;
layout(location = 3) out vec4 t3;
layout(location = 4) out vec4 t4;
layout(location = 5) out vec4 t5;
layout(location = 6) out vec4 t6;
layout(location = 7) out vec4 t7;
layout(location = 8) out vec4 t8;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;

   float dx = global . SourceSize . z;
   float dy = global . SourceSize . w;
   t1 . xy = vTexCoord + vec2(- dx, - dy);
   t1 . zw = vTexCoord + vec2(- dx, 0);
   t2 . xy = vTexCoord + vec2(+ dx, - dy);
   t2 . zw = vTexCoord + vec2(+ dx + dx, - dy);
   t3 . xy = vTexCoord + vec2(- dx, 0);
   t3 . zw = vTexCoord + vec2(+ dx, 0);
   t4 . xy = vTexCoord + vec2(+ dx + dx, 0);
   t4 . zw = vTexCoord + vec2(- dx, + dy);
   t5 . xy = vTexCoord + vec2(0, + dy);
   t5 . zw = vTexCoord + vec2(+ dx, + dy);
   t6 . xy = vTexCoord + vec2(+ dx + dx, + dy);
   t6 . zw = vTexCoord + vec2(- dx, + dy + dy);
   t7 . xy = vTexCoord + vec2(0, + dy + dy);
   t7 . zw = vTexCoord + vec2(+ dx, + dy + dy);
   t8 . xy = vTexCoord + vec2(+ dx + dx, + dy + dy);
}

