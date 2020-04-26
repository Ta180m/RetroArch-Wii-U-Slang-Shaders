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
   float max_w;
   float min_w;
   float smoot;
   float lumad;
   float mtric;
}params;

#pragma parametermax_w¡0.100.000.200.01
#pragma parametermin_w¡-0.07-0.150.050.01
#pragma parametersmoot¡0.550.001.500.01
#pragma parameterlumad¡0.300.105.000.10
#pragma parametermtric¡0.700.102.000.10

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

vec3 dt = vec3(1.0, 1.0, 1.0);


float wt(vec3 A, vec3 B)
{
 return clamp(params . smoot -((6.0 + params . lumad)/ pow(3.0, params . mtric))* pow(dot(pow(abs(A - B), vec3(1.0 / params . mtric)), dt), params . mtric)/(dot(A + B, dt)+ params . lumad), params . min_w, params . max_w);
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out vec4 t2;
layout(location = 3) out vec4 t3;
layout(location = 4) out vec4 t4;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
   float x = 1.0 *(1.0 / params . SourceSize . x);
   float y = 1.0 *(1.0 / params . SourceSize . y);
   vec2 dg1 = vec2(x, y);
   vec2 dg2 = vec2(- x, y);
   vec2 dx = vec2(x, 0.0);
   vec2 dy = vec2(0.0, y);
   t1 = vec4(vTexCoord . xy - dg1, vTexCoord . xy - dy);
   t2 = vec4(vTexCoord . xy - dg2, vTexCoord . xy + dx);
   t3 = vec4(vTexCoord . xy + dg1, vTexCoord . xy + dy);
   t4 = vec4(vTexCoord . xy + dg2, vTexCoord . xy - dx);
}

