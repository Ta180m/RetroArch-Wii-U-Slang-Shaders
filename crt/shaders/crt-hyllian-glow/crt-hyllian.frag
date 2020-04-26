#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float PHOSPHOR;
   float VSCANLINES;
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
}param;

#pragma parameterPHOSPHOR¡0.00.01.01.0
#pragma parameterVSCANLINES¡0.00.01.01.0
#pragma parameterInputGamma¡2.20.05.00.1
#pragma parameterOutputGamma¡2.20.05.00.1
#pragma parameterSHARPNESS¡2.01.05.01.0
#pragma parameterCOLOR_BOOST¡1.31.02.00.05
#pragma parameterRED_BOOST¡1.01.02.00.01
#pragma parameterGREEN_BOOST¡1.01.02.00.01
#pragma parameterBLUE_BOOST¡1.01.02.00.01
#pragma parameterSCANLINES_STRENGTH¡1.00.01.00.02
#pragma parameterBEAM_MIN_WIDTH¡0.600.01.00.02
#pragma parameterBEAM_MAX_WIDTH¡0.800.01.00.02
#pragma parameterCRT_ANTI_RINGING¡0.80.01.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 FragCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;











































float B = 0.0;
float C = 0.5;

mat4x4 invX = mat4x4(
              (- B - 6.0 * C)/ 6.0,(3.0 * B + 12.0 * C)/ 6.0,(- 3.0 * B - 6.0 * C)/ 6.0, B / 6.0,
    (12.0 - 9.0 * B - 6.0 * C)/ 6.0,(- 18.0 + 12.0 * B + 6.0 * C)/ 6.0, 0.0,(6.0 - 2.0 * B)/ 6.0,
   -(12.0 - 9.0 * B - 6.0 * C)/ 6.0,(18.0 - 15.0 * B - 12.0 * C)/ 6.0,(3.0 * B + 6.0 * C)/ 6.0, B / 6.0,
               (B + 6.0 * C)/ 6.0, - C, 0.0, 0.0
);



void main()
{
    vec3 color;

    vec2 TextureSize = vec2(param . SHARPNESS * global . SourceSize . x, global . SourceSize . y);

    vec2 dx = mix(vec2(1.0 / TextureSize . x, 0.0), vec2(0.0, 1.0 / TextureSize . y), param . VSCANLINES);
    vec2 dy = mix(vec2(0.0, 1.0 / TextureSize . y), vec2(1.0 / TextureSize . x, 0.0), param . VSCANLINES);

    vec2 pix_coord = vTexCoord * TextureSize + vec2(- 0.5, 0.5);

    vec2 tc = mix((floor(pix_coord)+ vec2(0.5, 0.5))/ TextureSize,(floor(pix_coord)+ vec2(1.0, - 0.5))/ TextureSize, param . VSCANLINES);

    vec2 fp = mix(fract(pix_coord), fract(pix_coord . yx), param . VSCANLINES);

    vec3 c00 = pow(texture(Source, tc - dx - dy). xyz, vec3(param . InputGamma, param . InputGamma, param . InputGamma));
    vec3 c01 = pow(texture(Source, tc - dy). xyz, vec3(param . InputGamma, param . InputGamma, param . InputGamma));
    vec3 c02 = pow(texture(Source, tc + dx - dy). xyz, vec3(param . InputGamma, param . InputGamma, param . InputGamma));
    vec3 c03 = pow(texture(Source, tc + 2.0 * dx - dy). xyz, vec3(param . InputGamma, param . InputGamma, param . InputGamma));
    vec3 c10 = pow(texture(Source, tc - dx). xyz, vec3(param . InputGamma, param . InputGamma, param . InputGamma));
    vec3 c11 = pow(texture(Source, tc). xyz, vec3(param . InputGamma, param . InputGamma, param . InputGamma));
    vec3 c12 = pow(texture(Source, tc + dx). xyz, vec3(param . InputGamma, param . InputGamma, param . InputGamma));
    vec3 c13 = pow(texture(Source, tc + 2.0 * dx). xyz, vec3(param . InputGamma, param . InputGamma, param . InputGamma));


    vec3 min_sample = min(min(c01, c11), min(c02, c12));
    vec3 max_sample = max(max(c01, c11), max(c02, c12));

    mat4x3 color_matrix0 = mat4x3(c00, c01, c02, c03);
    mat4x3 color_matrix1 = mat4x3(c10, c11, c12, c13);

    vec4 invX_Px = vec4(fp . x * fp . x * fp . x, fp . x * fp . x, fp . x, 1.0)* invX;
    vec3 color0 = color_matrix0 * invX_Px;
    vec3 color1 = color_matrix1 * invX_Px;


    vec3 aux = color0;
    color0 = clamp(color0, min_sample, max_sample);
    color0 = mix(aux, color0, param . CRT_ANTI_RINGING);
    aux = color1;
    color1 = clamp(color1, min_sample, max_sample);
    color1 = mix(aux, color1, param . CRT_ANTI_RINGING);

    float pos0 = fp . y;
    float pos1 = 1 - fp . y;

    vec3 lum0 = mix(vec3(param . BEAM_MIN_WIDTH), vec3(param . BEAM_MAX_WIDTH), color0);
    vec3 lum1 = mix(vec3(param . BEAM_MIN_WIDTH), vec3(param . BEAM_MAX_WIDTH), color1);

    vec3 d0 = clamp(pos0 /(lum0 + 0.0000001), 0.0, 1.0);
    vec3 d1 = clamp(pos1 /(lum1 + 0.0000001), 0.0, 1.0);

    d0 = exp(- 10.0 * param . SCANLINES_STRENGTH * d0 * d0);
    d1 = exp(- 10.0 * param . SCANLINES_STRENGTH * d1 * d1);

    color = clamp(color0 * d0 + color1 * d1, 0.0, 1.0);

    color *= param . COLOR_BOOST * vec3(param . RED_BOOST, param . GREEN_BOOST, param . BLUE_BOOST);

    float mod_factor = mix(vTexCoord . x * global . OutputSize . x, vTexCoord . y * global . OutputSize . y, param . VSCANLINES);

    vec3 dotMaskWeights = mix(
        vec3(1.0, 0.7, 1.0),
        vec3(0.7, 1.0, 0.7),
        floor(mod(mod_factor, 2.0))
    );

    color . rgb *= mix(vec3(1.0), dotMaskWeights, param . PHOSPHOR);

    color = pow(color, vec3(1.0 / param . OutputGamma, 1.0 / param . OutputGamma, 1.0 / param . OutputGamma));

    FragColor = vec4(color, 1.0);
}
