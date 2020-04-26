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
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
  vec2 uv = vTexCoord -(params . SourceSize . zw)* 0.25;
  vec2 uv_shift =(params . SourceSize . zw);
 vec3 src = texture(Source, uv). rgb;


 vec3 dither_h_zone = vec3(texture(Source, uv + vec2(0., uv_shift . y)). rgb == texture(Source, uv - vec2(0., uv_shift . y)). rgb);
  dither_h_zone = vec3(smoothstep(0.2, 1.0, dot(dither_h_zone, vec3(0.33333))));


  vec3 safe_zone = vec3(abs(dot(texture(Source, uv). rgb - texture(Source, uv - vec2(0., uv_shift . y)). rgb, vec3(0.3333))));
  safe_zone = vec3(lessThan(safe_zone, vec3(0.45)));


  vec3 blur_v =(texture(Source, uv). rgb + texture(Source, uv - vec2(0., uv_shift . y)). rgb)* 0.5;


  vec3 finalcolor = mix(src, blur_v, dither_h_zone * safe_zone);

   FragColor = vec4(finalcolor, 1.0);
}
