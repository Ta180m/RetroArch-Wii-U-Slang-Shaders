#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4






uniform Push
{
   vec4 SourceSize;
   vec4 OutputSize;
   uint FrameCount;
   float SHARPNESS_IMAGE;
   float SHARPNESS_EDGES;
   float GLOW_WIDTH;
   float GLOW_HEIGHT;
   float GLOW_HALATION;
   float GLOW_DIFFUSION;
   float MASK_COLORS;
   float MASK_STRENGTH;
   float MASK_SIZE;
   float SCANLINE_SIZE_MIN;
   float SCANLINE_SIZE_MAX;
   float GAMMA_INPUT;
   float GAMMA_OUTPUT;
   float BRIGHTNESS;
}params;

#pragma parameterSHARPNESS_IMAGE¡1.01.05.01.0
#pragma parameterSHARPNESS_EDGES¡3.01.05.01.0
#pragma parameterGLOW_WIDTH¡0.50.050.650.05
#pragma parameterGLOW_HEIGHT¡0.50.050.650.05
#pragma parameterGLOW_HALATION¡0.10.01.00.01
#pragma parameterGLOW_DIFFUSION¡0.050.01.00.01
#pragma parameterMASK_COLORS¡2.02.03.01.0
#pragma parameterMASK_STRENGTH¡0.30.01.00.05
#pragma parameterMASK_SIZE¡1.01.09.01.0
#pragma parameterSCANLINE_SIZE_MIN¡0.50.51.50.05
#pragma parameterSCANLINE_SIZE_MAX¡1.50.51.50.05
#pragma parameterGAMMA_INPUT¡2.41.05.00.1
#pragma parameterGAMMA_OUTPUT¡2.41.05.00.1
#pragma parameterBRIGHTNESS¡1.50.02.00.05

layout(std140) uniform UBO
{
   mat4 MVP;
}global;






mat3x3 get_color_matrix(sampler2D tex, vec2 co, vec2 dx)
{
    return mat3x3(pow(texture(tex, co - dx). rgb, vec3(params . GAMMA_INPUT)), pow(texture(tex, co). rgb, vec3(params . GAMMA_INPUT)), pow(texture(tex, co + dx). rgb, vec3(params . GAMMA_INPUT)));
}

vec3 blur(mat3x3 m, float dist, float rad)
{
    vec3 x = vec3(dist - 1.0, dist, dist + 1.0)/ rad;
    vec3 w = exp2(x * x * - 1.0);

    return(m[0]* w . x + m[1]* w . y + m[2]* w . z)/(w . x + w . y + w . z);
}

vec3 filter_gaussian(sampler2D tex, vec2 co, vec2 tex_size)
{
    vec2 dx = vec2(1.0 / tex_size . x, 0.0);
    vec2 dy = vec2(0.0, 1.0 / tex_size . y);
    vec2 pix_co = co * tex_size;
    vec2 tex_co =(floor(pix_co)+ 0.5)/ tex_size;
    vec2 dist =(fract(pix_co)- 0.5)* - 1.0;

    mat3x3 line0 = get_color_matrix(tex, tex_co - dy, dx);
    mat3x3 line1 = get_color_matrix(tex, tex_co, dx);
    mat3x3 line2 = get_color_matrix(tex, tex_co + dy, dx);
    mat3x3 column = mat3x3(blur(line0, dist . x, params . GLOW_WIDTH),
                               blur(line1, dist . x, params . GLOW_WIDTH),
                               blur(line2, dist . x, params . GLOW_WIDTH));

    return blur(column, dist . y, params . GLOW_HEIGHT);
}

vec3 filter_lanczos(sampler2D tex, vec2 co, vec2 tex_size, float sharp)
{
    tex_size . x *= sharp;

    vec2 dx = vec2(1.0 / tex_size . x, 0.0);
    vec2 pix_co = co * tex_size - vec2(0.5, 0.0);
    vec2 tex_co =(floor(pix_co)+ vec2(0.5, 0.001))/ tex_size;
    vec2 dist = fract(pix_co);
    vec4 coef = 3.141592653589 * vec4(dist . x + 1.0, dist . x, dist . x - 1.0, dist . x - 2.0);

    coef = max(abs(coef), 1e-5);
    coef = 2.0 * sin(coef)* sin(coef / 2.0)/(coef * coef);
    coef /= dot(coef, vec4(1.0));

    vec4 col1 = vec4(pow(texture(tex, tex_co). rgb, vec3(params . GAMMA_INPUT)), 1.0);
    vec4 col2 = vec4(pow(texture(tex, tex_co + dx). rgb, vec3(params . GAMMA_INPUT)), 1.0);

    return(mat4x4(col1, col1, col2, col2)* coef). rgb;
}

vec3 get_scanline_weight(float x, vec3 col)
{
    vec3 beam = mix(vec3(params . SCANLINE_SIZE_MIN), vec3(params . SCANLINE_SIZE_MAX), col);
    vec3 x_mul = 2.0 / beam;
    vec3 x_offset = x_mul * 0.5;

    return smoothstep(0.0, 1.0, 1.0 - abs(x * x_mul - x_offset))* x_offset;
}

vec3 get_mask_weight(float x)
{
    float i = mod(floor(x * params . OutputSize . x * params . SourceSize . x /(params . SourceSize . x * params . MASK_SIZE)), params . MASK_COLORS);

    if(i == 0.0)return mix(vec3(1.0, 0.0, 1.0), vec3(1.0, 0.0, 0.0), params . MASK_COLORS - 2.0);
    else if(i == 1.0)return vec3(0.0, 1.0, 0.0);
    else return vec3(0.0, 0.0, 1.0);
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

