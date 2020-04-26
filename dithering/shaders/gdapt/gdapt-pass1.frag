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
   float STEPS;
   float DEBUG;
   float linear_gamma;
}params;

#pragma parameterSTEPS¡1.00.05.01.0
#pragma parameterDEBUG¡0.00.01.01.0
#pragma parameterlinear_gamma¡0.00.01.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;



layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 t1;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec4 C = texture(Source, vTexCoord + vec2((0),(0))* t1);
 vec4 L = texture(Source, vTexCoord + vec2((- 1),(0))* t1);
 vec4 R = texture(Source, vTexCoord + vec2((1),(0))* t1);

 if(params . linear_gamma > 0.5)
 {
  C . xyz = pow(C . xyz, vec3(2.2)). xyz;
  L . xyz = pow(L . xyz, vec3(2.2)). xyz;
  R . xyz = pow(R . xyz, vec3(2.2)). xyz;
 }

 float str = 0.0;

 if(params . STEPS == 0.0){
  str = C . w;
 }
 else if(params . STEPS == 1.0){
  str = min(max(L . w, R . w), C . w);
 }
 else if(params . STEPS == 2.0){
  str = min(max(min(max(texture(Source, vTexCoord + vec2((- 2),(0))* t1). w, R . w), L . w), min(R . w, texture(Source, vTexCoord + vec2((2),(0))* t1). w)), C . w);
 }
 else if(params . STEPS == 3.0){
  float tmp = min(R . w, texture(Source, vTexCoord + vec2((2),(0))* t1). w);
  str = min(max(min(max(min(max(texture(Source, vTexCoord + vec2((- 3),(0))* t1). w, R . w), texture(Source, vTexCoord + vec2((- 2),(0))* t1). w), tmp), L . w), min(tmp, texture(Source, vTexCoord + vec2((3),(0))* t1). w)), C . w);
 }
 else if(params . STEPS == 4.0){
  float tmp1 = min(R . w, texture(Source, vTexCoord + vec2((2),(0))* t1). w);
  float tmp2 = min(tmp1, texture(Source, vTexCoord + vec2((3),(0))* t1). w);
  str = min(max(min(max(min(max(min(max(texture(Source, vTexCoord + vec2((- 4),(0))* t1). w, R . w), texture(Source, vTexCoord + vec2((- 3),(0))* t1). w), tmp1), texture(Source, vTexCoord + vec2((- 2),(0))* t1). w), tmp2), L . w), min(tmp2, texture(Source, vTexCoord + vec2((4),(0))* t1). w)), C . w);
 }
 else {
  float tmp1 = min(R . w, texture(Source, vTexCoord + vec2((2),(0))* t1). w);
  float tmp2 = min(tmp1, texture(Source, vTexCoord + vec2((3),(0))* t1). w);
  float tmp3 = min(tmp2, texture(Source, vTexCoord + vec2((4),(0))* t1). w);
  str = min(max(min(max(min(max(min(max(min(max(texture(Source, vTexCoord + vec2((- 5),(0))* t1). w, R . w), texture(Source, vTexCoord + vec2((- 4),(0))* t1). w), tmp1), texture(Source, vTexCoord + vec2((- 3),(0))* t1). w), tmp2), texture(Source, vTexCoord + vec2((- 2),(0))* t1). w), tmp3), L . w), min(tmp3, texture(Source, vTexCoord + vec2((5),(0))* t1). w)), C . w);
 }


 if(params . DEBUG > 0.5)
  FragColor = vec4(str);

 float sum = L . w + R . w;
 float wght = max(L . w, R . w);
       wght =(wght == 0.0)? 1.0 : sum / wght;

   vec4 final = vec4(mix(C . xyz,(wght * C . xyz + L . w * L . xyz + R . w * R . xyz)/(wght + sum), str), 1.0);
   FragColor = final;
   if(params . linear_gamma > 0.5)FragColor = pow(final, vec4(1.0 / 2.2));
}
