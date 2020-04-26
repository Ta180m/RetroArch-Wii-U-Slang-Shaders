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

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 float y = 0.0;
 vec4 c;
 vec4 l;
 vec4 r;

 if(params . SourceSize . y > 400.0)y = params . SourceSize . y * vTexCoord . y + float(params . FrameCount);
 else y = 2.000001 * params . SourceSize . y * vTexCoord . y;

 if(mod(y, 2.0)> 0.99999)
 {
  c = vec4(texture(Source, t1 . yw + vec2(0.0, params . SourceSize . w)));
  l = vec4(texture(Source, t1 . xw + vec2(0.0, params . SourceSize . w)));
  r = vec4(texture(Source, t1 . zw + vec2(0.0, params . SourceSize . w)));
 }
 else
 {
  c = texture(Source, t1 . yw);
  l = texture(Source, t1 . xw);
  r = texture(Source, t1 . zw);
 }

 vec4 final;
 if(params . SourceSize . x < 500.0)final = c;
 else
 {

  float fp = round(fract(0.5 * vTexCoord . x * params . SourceSize . x));


  final =(((l . x == c . x)||(r . x == c . x))&&((l . y == c . y)||(r . y == c . y))&&((l . z == c . z)||(r . z == c . z)))? c :(fp > 0.5 ? mix(c, r, 0.5): mix(c, l, 0.5));
 }
 FragColor = final;
}
