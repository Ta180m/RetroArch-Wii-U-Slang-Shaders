#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 SourceSize;
   vec4 OutputSize;
   float GAMMA_OUTPUT;
   float SHARPNESS_H;
   float SHARPNESS_V;
   float MASK_TYPE;
   float MASK_STRENGTH_MIN;
   float MASK_STRENGTH_MAX;
   float MASK_SIZE;
   float SCANLINE_STRENGTH_MIN;
   float SCANLINE_STRENGTH_MAX;
   float SCANLINE_BEAM_MIN;
   float SCANLINE_BEAM_MAX;
   float GEOM_CURVATURE;
   float GEOM_WARP;
   float GEOM_CORNER_SIZE;
   float GEOM_CORNER_SMOOTH;
   float INTERLACING_TOGGLE;
   float HALATION;
   float DIFFUSION;
   float BRIGHTNESS;
}params;

#pragma parameterGAMMA_OUTPUT¡2.20.15.00.01
#pragma parameterSHARPNESS_H¡0.60.01.00.05
#pragma parameterSHARPNESS_V¡1.00.01.00.05
#pragma parameterMASK_TYPE¡4.00.07.01.0
#pragma parameterMASK_STRENGTH_MIN¡0.20.00.50.01
#pragma parameterMASK_STRENGTH_MAX¡0.20.00.50.01
#pragma parameterMASK_SIZE¡1.01.0100.01.0
#pragma parameterSCANLINE_STRENGTH_MIN¡0.20.01.00.05
#pragma parameterSCANLINE_STRENGTH_MAX¡0.40.01.00.05
#pragma parameterSCANLINE_BEAM_MIN¡1.00.255.00.05
#pragma parameterSCANLINE_BEAM_MAX¡1.00.255.00.05
#pragma parameterGEOM_CURVATURE¡0.00.00.10.01
#pragma parameterGEOM_WARP¡0.00.00.10.01
#pragma parameterGEOM_CORNER_SIZE¡0.00.00.10.01
#pragma parameterGEOM_CORNER_SMOOTH¡150.050.01000.025.0
#pragma parameterINTERLACING_TOGGLE¡1.00.01.01.0
#pragma parameterHALATION¡0.030.01.00.01
#pragma parameterDIFFUSION¡0.00.01.00.01
#pragma parameterBRIGHTNESS¡1.00.02.00.05

layout(std140) uniform UBO
{
   mat4 MVP;
   uint FrameCount;
   vec4 OriginalSize;
   vec4 ORIG_LINEARIZEDSize;
}global;










float curve_distance(float x, float sharp)
{
    float x_step = step(0.5, x);
    float curve = 0.5 - sqrt(0.25 -(x - x_step)*(x - x_step))* sign(0.5 - x);

    return mix(x, curve, sharp);
}

mat4x4 get_color_matrix(sampler2D tex, vec2 co, vec2 dx)
{
    return mat4x4(texture(tex, co - dx), texture(tex, co), texture(tex, co + dx), texture(tex, co + 2.0 * dx));
}

vec4 filter_lanczos(vec4 coeffs, mat4x4 color_matrix)
{
    vec4 col = color_matrix * coeffs;
    vec4 sample_min = min(color_matrix[1], color_matrix[2]);
    vec4 sample_max = max(color_matrix[1], color_matrix[2]);

    col = clamp(col, sample_min, sample_max);

    return col;
}

vec3 get_scanline_weight(float pos, float beam, float strength)
{
    float weight = 1.0 - pow(cos(pos * 2.0 * 3.141592653589)* 0.5 + 0.5, beam);

    weight = weight * strength * 2.0 +(1.0 - strength);

    return vec3(weight);
}

vec2 curve_coordinate(vec2 co, float curvature)
{
    vec2 curve = vec2(curvature, curvature * 0.75);
    vec2 co2 = co + co * curve - curve / 2.0;
    vec2 co_weight = vec2(co . y, co . x)* 2.0 - 1.0;

    co = mix(co, co2, co_weight * co_weight);

    return co;
}

float get_corner_weight(vec2 co, vec2 corner, float smoothfunc)
{
    float corner_weight;

    co = min(co, vec2(1.0)- co)* vec2(1.0, 0.75);
    co =(corner - min(co, corner));
    corner_weight = clamp((corner . x - sqrt(dot(co, co)))* smoothfunc, 0.0, 1.0);
    corner_weight = mix(1.0, corner_weight, ceil(corner . x));

    return corner_weight;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

