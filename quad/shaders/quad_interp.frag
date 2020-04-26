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
   float QUAD_INTERP_RESOLUTION_X;
   float QUAD_INTERP_RESOLUTION_Y;
   float QUAD_INTERP_SHARPNESS;
}params;

#pragma parameterQUAD_INTERP_RESOLUTION_X¡0.00.01920.01.0
#pragma parameterQUAD_INTERP_RESOLUTION_Y¡0.00.01920.01.0
#pragma parameterQUAD_INTERP_SHARPNESS¡2.010.010.00.01





layout(std140) uniform UBO
{
   mat4 MVP;
}global;


























     vec3 quad_inter(vec3 x0, vec3 x1, vec3 x2, float x)
{
        vec3 poly[3];
   poly[2]= 0.5 * x0 - x1 + 0.5 * x2;
   poly[1]= - 1.5 * x0 + 2.0 * x1 - 0.5 * x2;
   poly[0]= x0;
   return poly[2]* x * x + poly[1]* x + poly[0];
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{

      vec2 texsize = vec2(1.0 /((params . QUAD_INTERP_RESOLUTION_X == 0)? params . SourceSize . x : params . QUAD_INTERP_RESOLUTION_X), 1.0 /((params . QUAD_INTERP_RESOLUTION_Y == 0)? params . SourceSize . y : params . QUAD_INTERP_RESOLUTION_Y));
   float dx = float(pow(params . QUAD_INTERP_SHARPNESS * texsize . x, - 1.0));
   float dy = float(pow(params . QUAD_INTERP_SHARPNESS * texsize . y, - 1.0));

        vec3 c00 = texture(Source, vTexCoord + vec2(- dx, - dy)). xyz;
        vec3 c01 = texture(Source, vTexCoord + vec2(- dx, 0)). xyz;
        vec3 c02 = texture(Source, vTexCoord + vec2(- dx, dy)). xyz;
        vec3 c10 = texture(Source, vTexCoord + vec2(0, - dy)). xyz;
        vec3 c11 = texture(Source, vTexCoord + vec2(0, 0)). xyz;
        vec3 c12 = texture(Source, vTexCoord + vec2(0, dy)). xyz;
        vec3 c20 = texture(Source, vTexCoord + vec2(dx, - dy)). xyz;
        vec3 c21 = texture(Source, vTexCoord + vec2(dx, 0)). xyz;
        vec3 c22 = texture(Source, vTexCoord + vec2(dx, dy)). xyz;

   float frac_amt_x = fract(vTexCoord . x * texsize . x);
   float frac_amt_y = fract(vTexCoord . y * texsize . y);
        vec3 loval = quad_inter(c00, c10, c20, frac_amt_x + 0.5);
        vec3 midval = quad_inter(c01, c11, c21, frac_amt_x + 0.5);
        vec3 hival = quad_inter(c02, c12, c22, frac_amt_x + 0.5);
        vec3 res = quad_inter(loval, midval, hival, frac_amt_y + 0.5);







   FragColor = vec4(res, 1.0);
}
