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
   float MODE;
   float PWR;
}params;

#pragma parameterMODE¡0.00.01.01.0
#pragma parameterPWR¡2.00.010.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;





float eq(vec3 A, vec3 B)
{
 vec3 diff = A - B;
 float ravg =(A . x + B . x)* 0.5;

 diff *= diff * vec3(2.0 + ravg, 4.0, 3.0 - ravg);

 return pow(smoothstep(3.0, 0.0, sqrt(diff . x + diff . y + diff . z)), params . PWR);
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 t1;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec3 C = texture(Source, vTexCoord + vec2((0),(0))* t1). xyz;
 vec3 L = texture(Source, vTexCoord + vec2((- 1),(0))* t1). xyz;
 vec3 R = texture(Source, vTexCoord + vec2((1),(0))* t1). xyz;

 float tag = 0.0;

 if(params . MODE > 0.5){
  tag =((L == R)&&(C != L))? 1.0 : 0.0;
 }
 else {
  tag = clamp(dot(normalize(C - L), normalize(C - R)), 0.0, 1.0)* eq(L, R);
 }

   FragColor = vec4(C, tag);
}
