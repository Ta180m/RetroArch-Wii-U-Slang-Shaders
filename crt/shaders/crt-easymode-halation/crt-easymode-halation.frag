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

#pragma parameterGAMMA_OUTPUT�2.20.15.00.01
#pragma parameterSHARPNESS_H�0.60.01.00.05
#pragma parameterSHARPNESS_V�1.00.01.00.05
#pragma parameterMASK_TYPE�4.00.07.01.0
#pragma parameterMASK_STRENGTH_MIN�0.20.00.50.01
#pragma parameterMASK_STRENGTH_MAX�0.20.00.50.01
#pragma parameterMASK_SIZE�1.01.0100.01.0
#pragma parameterSCANLINE_STRENGTH_MIN�0.20.01.00.05
#pragma parameterSCANLINE_STRENGTH_MAX�0.40.01.00.05
#pragma parameterSCANLINE_BEAM_MIN�1.00.255.00.05
#pragma parameterSCANLINE_BEAM_MAX�1.00.255.00.05
#pragma parameterGEOM_CURVATURE�0.00.00.10.01
#pragma parameterGEOM_WARP�0.00.00.10.01
#pragma parameterGEOM_CORNER_SIZE�0.00.00.10.01
#pragma parameterGEOM_CORNER_SMOOTH�150.050.01000.025.0
#pragma parameterINTERLACING_TOGGLE�1.00.01.01.0
#pragma parameterHALATION�0.030.01.00.01
#pragma parameterDIFFUSION�0.00.01.00.01
#pragma parameterBRIGHTNESS�1.00.02.00.05

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

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D ORIG_LINEARIZED;

void main()
{
    vec2 tex_size = params . SourceSize . xy;
    vec2 midpoint = vec2(0.5, 0.5);
    float scan_offset = 0.0;
    float timer = vec2(global . FrameCount, global . FrameCount). x;

    if(params . INTERLACING_TOGGLE > 0.5 && params . SourceSize . y >= 400)
    {
        tex_size . y *= 0.5;

        if(mod(timer, 2.0)> 0.0)
        {
            midpoint . y = 0.75;
            scan_offset = 0.5;
        }
        else midpoint . y = 0.25;
    }

    vec2 co = vTexCoord * tex_size * params . SourceSize . zw;
    vec2 xy = curve_coordinate(co, params . GEOM_WARP);
    float corner_weight = get_corner_weight(curve_coordinate(co, params . GEOM_CURVATURE), vec2(params . GEOM_CORNER_SIZE), params . GEOM_CORNER_SMOOTH);

    xy *= params . SourceSize . xy / tex_size;

    vec2 dx = vec2(1.0 / tex_size . x, 0.0);
    vec2 dy = vec2(0.0, 1.0 / tex_size . y);
    vec2 pix_co = xy * tex_size - midpoint;
    vec2 tex_co =(floor(pix_co)+ midpoint)/ tex_size;
    vec2 dist = fract(pix_co);
    float curve_x, curve_y;
    vec3 col, col2, diff;

    curve_x = curve_distance(dist . x, params . SHARPNESS_H * params . SHARPNESS_H);
    curve_y = curve_distance(dist . y, params . SHARPNESS_V * params . SHARPNESS_V);

    vec4 coeffs_x = 3.141592653589 * vec4(1.0 + curve_x, curve_x, 1.0 - curve_x, 2.0 - curve_x);
    vec4 coeffs_y = 3.141592653589 * vec4(1.0 + curve_y, curve_y, 1.0 - curve_y, 2.0 - curve_y);

    coeffs_x = max(abs(coeffs_x), 1e-5);
    coeffs_x = 2.0 * sin(coeffs_x)* sin(coeffs_x / 2.0)/(coeffs_x * coeffs_x);
    coeffs_x /= dot(coeffs_x, vec4(1.0));

    coeffs_y = max(abs(coeffs_y), 1e-5);
    coeffs_y = 2.0 * sin(coeffs_y)* sin(coeffs_y / 2.0)/(coeffs_y * coeffs_y);
    coeffs_y /= dot(coeffs_y, vec4(1.0));

    mat4x4 color_matrix;


    color_matrix[0]= filter_lanczos(coeffs_x, get_color_matrix(ORIG_LINEARIZED, tex_co - dy, dx));
    color_matrix[1]= filter_lanczos(coeffs_x, get_color_matrix(ORIG_LINEARIZED, tex_co, dx));
    color_matrix[2]= filter_lanczos(coeffs_x, get_color_matrix(ORIG_LINEARIZED, tex_co + dy, dx));
    color_matrix[3]= filter_lanczos(coeffs_x, get_color_matrix(ORIG_LINEARIZED, tex_co + 2.0 * dy, dx));

    col = filter_lanczos(coeffs_y, color_matrix). rgb;
    diff = texture(Source, xy). rgb;

    float rgb_max = max(col . r, max(col . g, col . b));
    float sample_offset =(params . SourceSize . y * params . OutputSize . w)* 0.5;
    float scan_pos = xy . y * tex_size . y + scan_offset;
    float scan_strength = mix(params . SCANLINE_STRENGTH_MAX, params . SCANLINE_STRENGTH_MIN, rgb_max);
    float scan_beam = clamp(rgb_max * params . SCANLINE_BEAM_MAX, params . SCANLINE_BEAM_MIN, params . SCANLINE_BEAM_MAX);
    vec3 scan_weight = vec3(0.0);

    float mask_colors;
    float mask_dot_width;
    float mask_dot_height;
    float mask_stagger;
    float mask_dither;
    vec4 mask_config;

    if(params . MASK_TYPE == 1)mask_config = vec4(2.0, 1.0, 1.0, 0.0);
    else if(params . MASK_TYPE == 2)mask_config = vec4(3.0, 1.0, 1.0, 0.0);
    else if(params . MASK_TYPE == 3)mask_config = vec4(2.1, 1.0, 1.0, 0.0);
    else if(params . MASK_TYPE == 4)mask_config = vec4(3.1, 1.0, 1.0, 0.0);
    else if(params . MASK_TYPE == 5)mask_config = vec4(2.0, 1.0, 1.0, 1.0);
    else if(params . MASK_TYPE == 6)mask_config = vec4(3.0, 2.0, 1.0, 3.0);
    else if(params . MASK_TYPE == 7)mask_config = vec4(3.0, 2.0, 2.0, 3.0);

    mask_colors = floor(mask_config . x);
    mask_dot_width = mask_config . y;
    mask_dot_height = mask_config . z;
    mask_stagger = mask_config . w;
    mask_dither = fract(mask_config . x)* 10.0;

    vec2 mod_fac = floor(vTexCoord * params . OutputSize . xy * params . SourceSize . xy /(params . SourceSize . xy * vec2(params . MASK_SIZE, mask_dot_height * params . MASK_SIZE)));
    int dot_no = int(mod((mod_fac . x + mod(mod_fac . y, 2.0)* mask_stagger)/ mask_dot_width, mask_colors));
    float dither = mod(mod_fac . y + mod(floor(mod_fac . x / mask_colors), 2.0), 2.0);

    float mask_strength = mix(params . MASK_STRENGTH_MAX, params . MASK_STRENGTH_MIN, rgb_max);
    float mask_dark, mask_bright, mask_mul;
    vec3 mask_weight;

    mask_dark = 1.0 - mask_strength;
    mask_bright = 1.0 + mask_strength * 2.0;

    if(dot_no == 0)mask_weight = mix(vec3(mask_bright, mask_bright, mask_bright), vec3(mask_bright, mask_dark, mask_dark), mask_colors - 2.0);
    else if(dot_no == 1)mask_weight = mix(vec3(mask_dark, mask_dark, mask_dark), vec3(mask_dark, mask_bright, mask_dark), mask_colors - 2.0);
    else mask_weight = vec3(mask_dark, mask_dark, mask_bright);

    if(dither > 0.9)mask_mul = mask_dark;
    else mask_mul = mask_bright;

    mask_weight *= mix(1.0, mask_mul, mask_dither);
    mask_weight = mix(vec3(1.0), mask_weight, clamp(params . MASK_TYPE, 0.0, 1.0));

    col2 =(col * mask_weight);
    col2 *= params . BRIGHTNESS;

    scan_weight = get_scanline_weight(scan_pos - sample_offset, scan_beam, scan_strength);
    col = clamp(col2 * scan_weight, 0.0, 1.0);
    scan_weight = get_scanline_weight(scan_pos, scan_beam, scan_strength);
    col += clamp(col2 * scan_weight, 0.0, 1.0);
    scan_weight = get_scanline_weight(scan_pos + sample_offset, scan_beam, scan_strength);
    col += clamp(col2 * scan_weight, 0.0, 1.0);
    col /= 3.0;

    col *= vec3(corner_weight);
    col += diff * mask_weight * params . HALATION * vec3(corner_weight);
    col += diff * params . DIFFUSION * vec3(corner_weight);
    col = pow(col, vec3(1.0 / params . GAMMA_OUTPUT));

   FragColor = vec4(col, 1.0);
}
