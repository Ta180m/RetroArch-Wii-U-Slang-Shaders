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






















bool eq(vec3 A, vec3 B){
 return(A == B);
}

bool neq(vec3 A, vec3 B){
 return(A != B);
}

layout(location = 0) in vec2 texCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{

      vec2 fp = floor(2.0 * fract(texCoord * params . SourceSize . xy));








      vec3 B = texture(Source, t1 . xy). xyz;
      vec3 D = texture(Source, t1 . zw). xyz;
      vec3 E = texture(Source, texCoord). xyz;
      vec3 F = texture(Source, t2 . xy). xyz;
      vec3 H = texture(Source, t2 . zw). xyz;


      vec3 E0 = eq(B, D)? B : E;
      vec3 E1 = eq(B, F)? B : E;
      vec3 E2 = eq(H, D)? H : E;
      vec3 E3 = eq(H, F)? H : E;


 FragColor = vec4(neq(B, H)&& neq(D, F)?(fp . y == 0 ?(fp . x == 0 ? E0 : E1):(fp . x == 0 ? E2 : E3)): E, 1.0);
}
