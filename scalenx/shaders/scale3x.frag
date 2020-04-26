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
layout(location = 3) in vec4 t3;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{

      vec2 fp = floor(3.0 * fract(texCoord * params . SourceSize . xy));








      vec3 A = texture(Source, t1 . xw). xyz;
      vec3 B = texture(Source, t1 . yw). xyz;
      vec3 C = texture(Source, t1 . zw). xyz;
      vec3 D = texture(Source, t2 . xw). xyz;
      vec3 E = texture(Source, t2 . yw). xyz;
      vec3 F = texture(Source, t2 . zw). xyz;
      vec3 G = texture(Source, t3 . xw). xyz;
      vec3 H = texture(Source, t3 . yw). xyz;
      vec3 I = texture(Source, t3 . zw). xyz;


 bool eqBD = eq(B, D), eqBF = eq(B, F), eqHD = eq(H, D), eqHF = eq(H, F), neqEA = neq(E, A), neqEC = neq(E, C), neqEG = neq(E, G), neqEI = neq(E, I);


      vec3 E0 = eqBD ? B : E;
      vec3 E1 = eqBD && neqEC || eqBF && neqEA ? B : E;
      vec3 E2 = eqBF ? B : E;
      vec3 E3 = eqBD && neqEG || eqHD && neqEA ? D : E;
      vec3 E5 = eqBF && neqEI || eqHF && neqEC ? F : E;
      vec3 E6 = eqHD ? H : E;
      vec3 E7 = eqHD && neqEI || eqHF && neqEG ? H : E;
      vec3 E8 = eqHF ? H : E;


 FragColor = vec4(neq(B, H)&& neq(D, F)?(fp . y == 0 ?(fp . x == 0 ? E0 : fp . x == 1 ? E1 : E2):(fp . y == 1 ?(fp . x == 0 ? E3 : fp . x == 1 ? E : E5):(fp . x == 0 ? E6 : fp . x == 1 ? E7 : E8))): E, 1.0);
}
