#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4






















uniform Push
{
   float CRTCGWG_GAMMA;
}param;

#pragma parameterCRTCGWG_GAMMA¡2.70.010.00.01

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   uint FrameCount;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 c01;
layout(location = 2) in vec2 c11;
layout(location = 3) in vec2 c21;
layout(location = 4) in vec2 c31;
layout(location = 5) in vec2 c02;
layout(location = 6) in vec2 c12;
layout(location = 7) in vec2 c22;
layout(location = 8) in vec2 c32;
layout(location = 9) in float mod_factor;
layout(location = 10) in vec2 ratio_scale;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;




void main()
{
    vec2 uv_ratio = fract(ratio_scale);
    vec3 col, col2;

    mat4x3 texes0 = mat4x3(texture(Source,(c01)). xyz, texture(Source,(c11)). xyz, texture(Source,(c21)). xyz, texture(Source,(c31)). xyz);
    mat4x3 texes1 = mat4x3(texture(Source,(c02)). xyz, texture(Source,(c12)). xyz, texture(Source,(c22)). xyz, texture(Source,(c32)). xyz);

    vec4 coeffs = vec4(1.0 + uv_ratio . x, uv_ratio . x, 1.0 - uv_ratio . x, 2.0 - uv_ratio . x)+ 0.005;
    coeffs = sin(3.141592653589 * coeffs)* sin(0.5 * 3.141592653589 * coeffs)/(coeffs * coeffs);
    coeffs = coeffs / dot(coeffs, vec4(1.0, 1.0, 1.0, 1.0));

    vec3 weights = vec3(3.33 * uv_ratio . y, uv_ratio . y * 3.33, uv_ratio . y * 3.33);
    vec3 weights2 = vec3(- 3.33 * uv_ratio . y + 3.33, uv_ratio . y * - 3.33 + 3.33, uv_ratio . y * - 3.33 + 3.33);

    col = clamp(texes0 * coeffs, 0.0, 1.0);
    col2 = clamp(texes1 * coeffs, 0.0, 1.0);

    vec3 wid = 2.0 * pow(col, vec3(4.0, 4.0, 4.0))+ 2.0;
    vec3 wid2 = 2.0 * pow(col2, vec3(4.0, 4.0, 4.0))+ 2.0;

    col = pow(col, vec3(param . CRTCGWG_GAMMA));
    col2 = pow(col2, vec3(param . CRTCGWG_GAMMA));

    vec3 sqrt1 = inversesqrt(0.5 * wid);
    vec3 sqrt2 = inversesqrt(0.5 * wid2);

    vec3 pow_mul1 = weights * sqrt1;
    vec3 pow_mul2 = weights2 * sqrt2;

    vec3 div1 = 0.1320 * wid + 0.392;
    vec3 div2 = 0.1320 * wid2 + 0.392;

    vec3 pow1 = - pow(pow_mul1, wid);
    vec3 pow2 = - pow(pow_mul2, wid2);

    weights = exp(pow1)/ div1;
    weights2 = exp(pow2)/ div2;

    vec3 multi = col * weights + col2 * weights2;
    vec3 mcol = mix(vec3(1.0, 0.7, 1.0), vec3(0.7, 1.0, 0.7), floor(mod(mod_factor, 2.0)));

    FragColor = vec4(pow(mcol * multi, vec3(0.454545, 0.454545, 0.454545)), 1.0);
}
