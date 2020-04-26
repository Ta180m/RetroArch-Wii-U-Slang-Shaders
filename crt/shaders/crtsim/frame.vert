#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

























layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 SourceSize;
   vec4 OriginalSize;
   vec4 OutputSize;
   uint FrameCount;
   float FrameColor_R;
   float FrameColor_G;
   float FrameColor_B;
}global;

#pragma parameterFrameColor_R¡1.00.01.00.05
#pragma parameterFrameColor_G¡1.00.01.00.05
#pragma parameterFrameColor_B¡1.00.01.00.05

uniform Push
{
   float CRTMask_Scale;
   float Tuning_Satur;
   float Tuning_Mask_Brightness;
   float Tuning_Mask_Opacity;
}params;

#pragma parameterCRTMask_Scale¡1.00.010.00.5




#pragma parameterTuning_Satur¡1.00.01.00.05


#pragma parameterTuning_Mask_Brightness¡0.50.01.00.05
#pragma parameterTuning_Mask_Opacity¡0.30.01.00.05









    vec4 SampleCRT(sampler2D shadowMaskSampler, sampler2D compFrameSampler, vec2 uv)
{
     vec2 ScaledUV = uv;



     vec2 scanuv = vec2(fract(uv * global . SourceSize . xy / params . CRTMask_Scale));
 vec4 phosphor_grid;
     vec3 scantex = texture(shadowMaskSampler, scanuv). rgb;

 scantex += params . Tuning_Mask_Brightness;
 scantex = mix(ivec3(1, 1, 1), scantex, params . Tuning_Mask_Opacity);









     vec2 overscanuv = uv;
     vec3 comptex = texture(compFrameSampler, overscanuv). rgb;

     vec4 emissive = vec4(comptex * scantex, 1);
    float desat = dot(vec4(0.299, 0.587, 0.114, 0.0), emissive);
 emissive = mix(vec4(desat, desat, desat, 1), emissive, params . Tuning_Satur);

 return emissive;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;








void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;








}

