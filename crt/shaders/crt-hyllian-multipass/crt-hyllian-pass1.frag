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
   float OutputGamma;
   float PHOSPHOR;
   float COLOR_BOOST;
   float RED_BOOST;
   float GREEN_BOOST;
   float BLUE_BOOST;
   float SCANLINES_STRENGTH;
   float BEAM_MIN_WIDTH;
   float BEAM_MAX_WIDTH;
}params;

#pragma parameterOutputGamma�2.20.05.00.1
#pragma parameterPHOSPHOR�1.00.01.01.0
#pragma parameterCOLOR_BOOST�1.51.02.00.05
#pragma parameterRED_BOOST�1.01.02.00.01
#pragma parameterGREEN_BOOST�1.01.02.00.01
#pragma parameterBLUE_BOOST�1.01.02.00.01
#pragma parameterSCANLINES_STRENGTH�0.720.01.00.02
#pragma parameterBEAM_MIN_WIDTH�0.860.01.00.02
#pragma parameterBEAM_MAX_WIDTH�1.00.01.00.02











layout(std140) uniform UBO
{
   mat4 MVP;
}global;



layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec2 texture_size = params . SourceSize . xy;

   vec3 color;
   vec2 dx = vec2(1.0 / texture_size . x, 0.0);
   vec2 dy = vec2(0.0, 1.0 / texture_size . y);
   vec2 pix_coord = vTexCoord * texture_size + vec2(0.0, 0.5);

   vec2 tc =(floor(pix_coord)+ vec2(0.0, 0.5))/ texture_size;

   vec2 fp = fract(pix_coord);

   vec3 color0 = texture(Source, tc - dy). xyz;
   vec3 color1 = texture(Source, tc). xyz;

   float pos0 = fp . y;
   float pos1 = 1 - fp . y;

   vec3 lum0 = mix(vec3(params . BEAM_MIN_WIDTH), vec3(params . BEAM_MAX_WIDTH), color0);
   vec3 lum1 = mix(vec3(params . BEAM_MIN_WIDTH), vec3(params . BEAM_MAX_WIDTH), color1);

   vec3 d0 = clamp(pos0 /(lum0 + 0.0000001), 0.0, 1.0);
   vec3 d1 = clamp(pos1 /(lum1 + 0.0000001), 0.0, 1.0);

   d0 = exp(- 10.0 * params . SCANLINES_STRENGTH * d0 * d0);
   d1 = exp(- 10.0 * params . SCANLINES_STRENGTH * d1 * d1);

   color = clamp(color0 * d0 + color1 * d1, 0.0, 1.0);

   color *= params . COLOR_BOOST * vec3(params . RED_BOOST, params . GREEN_BOOST, params . BLUE_BOOST);
   float mod_factor = vTexCoord . x * params . OutputSize . x;

   vec3 dotMaskWeights = mix(
                         vec3(1.0, 0.7, 1.0),
                         vec3(0.7, 1.0, 0.7),
                         floor(mod(mod_factor, 2.0))
                          );

   color . rgb *= mix(vec3(1.0, 1.0, 1.0), dotMaskWeights, params . PHOSPHOR);

   color = pow(color, vec3(1.0 / params . OutputGamma, 1.0 / params . OutputGamma, 1.0 / params . OutputGamma));
   FragColor = vec4(color, 1.0);
}
