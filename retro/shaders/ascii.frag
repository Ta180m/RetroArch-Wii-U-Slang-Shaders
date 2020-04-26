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

float character(float n, vec2 p)
{
 p = floor(p * vec2(4.0, - 4.0)+ 2.5);
 if(clamp(p . x, 0.0, 4.0)== p . x && clamp(p . y, 0.0, 4.0)== p . y)
 {
  if(int(mod(n / exp2(p . x + 5.0 * p . y), 2.0))== 1)return 1.0;
 }
 return 0.0;
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec2 uv = vTexCoord * params . OutputSize . xy;
 vec3 col = texture(Source, floor(uv / 8.0)* 8.0 / params . OutputSize . xy). rgb;

 float gray = dot(col . rgb, vec3(0.299, 0.587, 0.114));

 float n = 65536.0;
 if(gray > 0.2)n = 65600.0;
 if(gray > 0.3)n = 332772.0;
 if(gray > 0.4)n = 15255086.0;
 if(gray > 0.5)n = 23385164.0;
 if(gray > 0.6)n = 15252014.0;
 if(gray > 0.7)n = 13199452.0;
 if(gray > 0.8)n = 11512810.0;

 vec2 p = mod(uv / 4.0, 2.0)- vec2(1.0);
 col = col * character(n, p);

   FragColor = vec4(col, 1.0);
}
