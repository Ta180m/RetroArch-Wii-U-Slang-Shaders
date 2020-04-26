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
   float RAD;
   float CLR;
   float CWGHT;
}params;

#pragma parameterRAD¡2.00.012.00.25

#pragma parameterCLR¡0.150.011.00.01

#pragma parameterCWGHT¡0.250.02.00.05






layout(std140) uniform UBO
{
   mat4 MVP;
}global;

vec4 unit4 = vec4(1.0);

int steps = int(ceil(params . RAD));
float clr = - params . CLR * params . CLR;
float sigma = params . RAD * params . RAD / 2.0;
float cwght = 1.0 + params . CWGHT * max(1.0, 2.87029746 * sigma + 0.43165242 * params . RAD - 0.25219746);

float domain[13]= float[13](1.0, exp(- 1.0 / sigma), exp(- 4.0 / sigma), exp(- 9.0 / sigma), exp(- 16.0 / sigma), exp(- 25.0 / sigma), exp(- 36.0 / sigma),
    exp(- 49.0 / sigma), exp(- 64.0 / sigma), exp(- 81.0 / sigma), exp(- 100.0 / sigma), exp(- 121.0 / sigma), exp(- 144.0 / sigma));

float dist2(vec3 pt1, vec3 pt2)
{
 vec3 v = pt1 - pt2;
 return dot(v, v);
}

vec4 weight(int i, int j, vec3 org, mat4x3 A)
{
 return domain[i]* domain[j]* exp(vec4(dist2(org, A[0]), dist2(org, A[1]), dist2(org, A[2]), dist2(org, A[3]))/ clr);
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 t1;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
   t1 = params . SourceSize . zw;
}

