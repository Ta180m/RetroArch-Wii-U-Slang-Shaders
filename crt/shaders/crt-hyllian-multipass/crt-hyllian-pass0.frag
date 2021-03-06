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
   float SHARPNESS;
   float CRT_ANTI_RINGING;
   float InputGamma;
}params;

#pragma parameterSHARPNESS¡1.01.05.01.0
#pragma parameterCRT_ANTI_RINGING¡0.80.01.00.1
#pragma parameterInputGamma¡2.50.05.00.1





layout(std140) uniform UBO
{
   mat4 MVP;
}global;



















float B = 0.0;
float C = 0.5;

mat4 invX = mat4((- B - 6.0 * C)/ 6.0,(12.0 - 9.0 * B - 6.0 * C)/ 6.0, -(12.0 - 9.0 * B - 6.0 * C)/ 6.0,(B + 6.0 * C)/ 6.0,
                                   (3.0 * B + 12.0 * C)/ 6.0,(- 18.0 + 12.0 * B + 6.0 * C)/ 6.0,(18.0 - 15.0 * B - 12.0 * C)/ 6.0, - C,
                                   (- 3.0 * B - 6.0 * C)/ 6.0, 0.0,(3.0 * B + 6.0 * C)/ 6.0, 0.0,
                                              B / 6.0,(6.0 - 2.0 * B)/ 6.0, B / 6.0, 0.0);


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   vec2 texture_size = vec2(params . SHARPNESS * params . SourceSize . x, params . SourceSize . y);

   vec3 color;
   vec2 dx = vec2(1.0 / texture_size . x, 0.0);
   vec2 dy = vec2(0.0, 1.0 / texture_size . y);
   vec2 pix_coord = vTexCoord * texture_size + vec2(- 0.5, 0.0);

   vec2 tc =(floor(pix_coord)+ vec2(0.5, 0.001))/ texture_size;

   vec2 fp = fract(pix_coord);

   vec3 c10 = pow(texture(Source, tc - dx). xyz, vec3(params . InputGamma, params . InputGamma, params . InputGamma));
   vec3 c11 = pow(texture(Source, tc). xyz, vec3(params . InputGamma, params . InputGamma, params . InputGamma));
   vec3 c12 = pow(texture(Source, tc + dx). xyz, vec3(params . InputGamma, params . InputGamma, params . InputGamma));
   vec3 c13 = pow(texture(Source, tc + 2.0 * dx). xyz, vec3(params . InputGamma, params . InputGamma, params . InputGamma));


   vec3 min_sample = min(c11, c12);
   vec3 max_sample = max(c11, c12);

   mat4x3 color_matrix = mat4x3(c10, c11, c12, c13);

   vec4 lobes = vec4(fp . x * fp . x * fp . x, fp . x * fp . x, fp . x, 1.0);

   vec4 invX_Px = invX * lobes;
   color = color_matrix * invX_Px;


   vec3 aux = color;
   color = clamp(color, min_sample, max_sample);
   color = mix(aux, color, params . CRT_ANTI_RINGING);
   FragColor = vec4(color, 1.0);
}
