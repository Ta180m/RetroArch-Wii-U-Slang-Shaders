#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4









layout(std140) uniform UBO
{
   mat4 MVP;
}global;

uniform push_constant
{
   vec4 SourceSize;
   vec4 OutputSize;
   float GIN;
   float GOUT;
   float Y;
   float I;
   float Q;
}params;

#pragma parameterGIN¡2.20.010.00.05
#pragma parameterGOUT¡2.20.010.00.05
#pragma parameterY¡1.10.010.00.01
#pragma parameterI¡1.10.010.00.01
#pragma parameterQ¡1.10.010.00.01

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

mat3x3 RGBtoYIQ = mat3x3(0.299, 0.587, 0.114,
                                0.595716, - 0.274453, - 0.321263,
                                0.211456, - 0.522591, 0.311135);

mat3x3 YIQtoRGB = mat3x3(1, 0.95629572, 0.62102442,
                                1, - 0.27212210, - 0.64738060,
                                1, - 1.10698902, 1.70461500);

vec3 YIQ_lo = vec3(0, - 0.595716, - 0.522591);
vec3 YIQ_hi = vec3(1, 0.595716, 0.522591);


void main()
{
    vec3 c = texture(Source, vTexCoord). xyz;

    c = pow(c, vec3(params . GIN));
    c = c * RGBtoYIQ;
    c = vec3(pow(c . x, params . Y), c . y * params . I, c . z * params . Q);
    c = clamp(c, YIQ_lo, YIQ_hi);
    c = c * YIQtoRGB;
    c = pow(c, vec3(1.0 / params . GOUT));

    FragColor = vec4(c, 1.0);
}
