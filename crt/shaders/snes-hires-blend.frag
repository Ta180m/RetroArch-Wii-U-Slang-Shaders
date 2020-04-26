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
 vec3 c = texture(Source, t1 . yw). xyz;
 vec3 final;
 if(params . SourceSize . x < 500.0)final = c;
 else
 {

  float fp = round(fract(0.5 * vTexCoord . x * params . SourceSize . x));


  vec3 l = texture(Source, t1 . xw). xyz;
  vec3 r = texture(Source, t1 . zw). xyz;


  final =(((l . x == c . x)||(r . x == c . x))&&((l . y == c . y)||(r . y == c . y))&&((l . z == c . z)||(r . z == c . z)))? c :(fp > 0.5 ? mix(c, r, 0.5): mix(c, l, 0.5));
 }
 FragColor = vec4(final, 1.0);
}
