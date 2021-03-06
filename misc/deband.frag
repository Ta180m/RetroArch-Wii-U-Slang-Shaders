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

#pragma parameteriterationsˇ2.01.010.01.0
#pragma parameterthresholdˇ1.01.016.00.5
#pragma parameterrangeˇ1.50.010.00.5
#pragma parametergrainˇ0.00.02.00.1

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

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{

 vec3 m = vec3(vTexCoord, rand(sin(vTexCoord . x / vTexCoord . y)* mod(params . FrameCount, 79)+ 22.759))+ vec3(1.0);
 float h = permute(permute(permute(m . x)+ m . y)+ m . z);

 vec4 avg;
 vec4 diff;


 vec4 color = texture(Source, vTexCoord). rgba;

 for(int i = 1;i <= int(params . iterations);i ++)
  {


   avg = average(Source, vTexCoord, i * params . range, h);
   diff = abs(color - avg);
   color = mix(avg, color, greaterThan(diff, vec4(params . threshold /(i * 10.0))));
  }
 if(params . grain > 0.0)
  {

   vec3 noise;
   noise . x = rand(h);h = permute(h);
   noise . y = rand(h);h = permute(h);
   noise . z = rand(h);h = permute(h);
   color . rgb += params . grain *(noise - vec3(0.5));
  }

   FragColor = vec4(color);
}
