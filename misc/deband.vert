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
   float iterations;
   float threshold;
   float range;
   float grain;
}params;

#pragma parameteriterations¡2.01.010.01.0
#pragma parameterthreshold¡1.01.016.00.5
#pragma parameterrange¡1.50.010.00.5
#pragma parametergrain¡0.00.02.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;





float mod289(float x)
{
 return x - floor(x / 289.0)* 289.0;
}

float permute(float x)
{
 return mod289((34.0 * x + 1.0)* x);
}

float rand(float x)
{
 return fract(x * 0.024390243);
}

vec4 average(sampler2D tex, vec2 coord, float range, inout float h)
{
 float dist = rand(h)* range;h = permute(h);
 float dir = rand(h)* 6.2831853;h = permute(h);
 vec2 o = vec2(cos(dir), sin(dir));
 vec2 pt = dist * params . SourceSize . zw;

 vec4 ref[4];
 ref[0]= texture(tex, coord + pt * vec2(o . x, o . y));
 ref[1]= texture(tex, coord + pt * vec2(- o . y, o . x));
 ref[2]= texture(tex, coord + pt * vec2(- o . x, - o . y));
 ref[3]= texture(tex, coord + pt * vec2(o . y, - o . x));

 return(ref[0]+ ref[1]+ ref[2]+ ref[3])* 0.25;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

