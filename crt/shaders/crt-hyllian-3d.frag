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
   float CRT_MULRES_X;
   float CRT_MULRES_Y;
   float PHOSPHOR;
   float InputGamma;
   float OutputGamma;
   float SHARPNESS;
   float COLOR_BOOST;
   float RED_BOOST;
   float GREEN_BOOST;
   float BLUE_BOOST;
   float SCANLINES_STRENGTH;
   float BEAM_MIN_WIDTH;
   float BEAM_MAX_WIDTH;
   float CRT_ANTI_RINGING;
}params;

#pragma parameterCRT_MULRES_X¡2.01.08.01.0
#pragma parameterCRT_MULRES_Y¡2.01.08.01.0
#pragma parameterPHOSPHOR¡1.00.01.01.0
#pragma parameterInputGamma¡2.40.05.00.1
#pragma parameterOutputGamma¡2.20.05.00.1
#pragma parameterSHARPNESS¡1.01.05.01.0
#pragma parameterCOLOR_BOOST¡1.51.02.00.05
#pragma parameterRED_BOOST¡1.01.02.00.01
#pragma parameterGREEN_BOOST¡1.01.02.00.01
#pragma parameterBLUE_BOOST¡1.01.02.00.01
#pragma parameterSCANLINES_STRENGTH¡0.720.01.00.02
#pragma parameterBEAM_MIN_WIDTH¡0.860.01.00.02
#pragma parameterBEAM_MAX_WIDTH¡1.00.01.00.02
#pragma parameterCRT_ANTI_RINGING¡0.80.01.00.1
















layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;





















float B = 0.0;
float C = 0.5;

mat4 invX = mat4((- B - 6.0 * C)/ 6.0,(3.0 * B + 12.0 * C)/ 6.0,(- 3.0 * B - 6.0 * C)/ 6.0, B / 6.0,
                                        (12.0 - 9.0 * B - 6.0 * C)/ 6.0,(- 18.0 + 12.0 * B + 6.0 * C)/ 6.0, 0.0,(6.0 - 2.0 * B)/ 6.0,
                                       -(12.0 - 9.0 * B - 6.0 * C)/ 6.0,(18.0 - 15.0 * B - 12.0 * C)/ 6.0,(3.0 * B + 6.0 * C)/ 6.0, B / 6.0,
                                                   (B + 6.0 * C)/ 6.0, - C, 0.0, 0.0);

vec3 dtt = vec3(65536.0, 255.0, 1.0);

float reduce(vec3 A)
{
  return dot(A, dtt);
}

vec4 crt_hyllian_3d(vec2 texture_size, vec2 video_size, vec2 output_size, vec2 texCoord, sampler2D s_p)
{
    vec2 TexSize = vec2(params . SHARPNESS * texture_size . x, texture_size . y)/ vec2(params . CRT_MULRES_X, params . CRT_MULRES_Y);

    vec3 color;
    vec2 dx = vec2(1.0 / TexSize . x, 0.0);
    vec2 dy = vec2(0.0, 1.0 / TexSize . y);
    vec2 pix_coord = texCoord * TexSize + vec2(- 0.5, 0.5);

    vec2 tc =(floor(pix_coord)+ vec2(0.5, 0.5))/ TexSize;

    vec2 fp = fract(pix_coord);

    vec4 c00 = pow(texture(s_p, tc - dx - dy), vec4(params . InputGamma, params . InputGamma, params . InputGamma, params . InputGamma));
    vec4 c01 = pow(texture(s_p, tc - dy), vec4(params . InputGamma, params . InputGamma, params . InputGamma, params . InputGamma));
    vec4 c02 = pow(texture(s_p, tc + dx - dy), vec4(params . InputGamma, params . InputGamma, params . InputGamma, params . InputGamma));
    vec4 c03 = pow(texture(s_p, tc + 2.0 * dx - dy), vec4(params . InputGamma, params . InputGamma, params . InputGamma, params . InputGamma));
    vec4 c10 = pow(texture(s_p, tc - dx), vec4(params . InputGamma, params . InputGamma, params . InputGamma, params . InputGamma));
    vec4 c11 = pow(texture(s_p, tc), vec4(params . InputGamma, params . InputGamma, params . InputGamma, params . InputGamma));
    vec4 c12 = pow(texture(s_p, tc + dx), vec4(params . InputGamma, params . InputGamma, params . InputGamma, params . InputGamma));
    vec4 c13 = pow(texture(s_p, tc + 2.0 * dx), vec4(params . InputGamma, params . InputGamma, params . InputGamma, params . InputGamma));


    vec4 min_sample = min(min(c01, c11), min(c02, c12));
    vec4 max_sample = max(max(c01, c11), max(c02, c12));

    mat4 color_matrix0 = mat4(c00, c01, c02, c03);
    mat4 color_matrix1 = mat4(c10, c11, c12, c13);

    vec4 invX_Px =(vec4(fp . x * fp . x * fp . x, fp . x * fp . x, fp . x, 1.0)* invX);
    vec4 color0 =(color_matrix0 * invX_Px);
    vec4 color1 =(color_matrix1 * invX_Px);


    vec4 aux = color0;
    color0 = clamp(color0, min_sample, max_sample);
    color0 = mix(aux, color0, params . CRT_ANTI_RINGING);
    aux = color1;
    color1 = clamp(color1, min_sample, max_sample);
    color1 = mix(aux, color1, params . CRT_ANTI_RINGING);

    float pos0 = fp . y;
    float pos1 = 1.0 - fp . y;

    vec3 lum0 = mix(vec3(params . BEAM_MIN_WIDTH, params . BEAM_MIN_WIDTH, params . BEAM_MIN_WIDTH), vec3(params . BEAM_MAX_WIDTH, params . BEAM_MAX_WIDTH, params . BEAM_MAX_WIDTH), color0 . xyz);
    vec3 lum1 = mix(vec3(params . BEAM_MIN_WIDTH, params . BEAM_MIN_WIDTH, params . BEAM_MIN_WIDTH), vec3(params . BEAM_MAX_WIDTH, params . BEAM_MAX_WIDTH, params . BEAM_MAX_WIDTH), color1 . xyz);

    vec3 d0 = clamp(pos0 /(lum0 + 0.0000001), 0.0, 1.0);
    vec3 d1 = clamp(pos1 /(lum1 + 0.0000001), 0.0, 1.0);

    d0 = exp(- 10.0 * params . SCANLINES_STRENGTH * d0 * d0);
    d1 = exp(- 10.0 * params . SCANLINES_STRENGTH * d1 * d1);

    color = clamp(color0 . xyz * d0 + color1 . xyz * d1, 0.0, 1.0);

    color *= params . COLOR_BOOST * vec3(params . RED_BOOST, params . GREEN_BOOST, params . BLUE_BOOST);

    float mod_factor = texCoord . x * output_size . x * texture_size . x / video_size . x;

    vec3 dotMaskWeights = mix(
                                 vec3(1.0, 0.7, 1.0),
                                 vec3(0.7, 1.0, 0.7),
                                 floor(mod(mod_factor, 2.0))
                                  );

    color . rgb *= mix(vec3(1.0, 1.0, 1.0), dotMaskWeights, params . PHOSPHOR);

    color = pow(color, vec3(1.0 / params . OutputGamma, 1.0 / params . OutputGamma, 1.0 / params . OutputGamma));

    return vec4(color, 1.0);
}

void main()
{
   FragColor = crt_hyllian_3d(params . SourceSize . xy, params . SourceSize . xy, params . OutputSize . xy, vTexCoord . xy, Source);
}
