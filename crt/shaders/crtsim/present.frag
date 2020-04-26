#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4


















#pragma parameterBloomPower¡1.00.010.00.1
#pragma parameterBloomScalar¡0.10.01.00.05

#pragma parameterTuning_Overscan¡0.950.01.00.05
#pragma parameterTuning_Barrel¡0.250.01.00.05
#pragma parametermask_toggle¡1.00.01.01.0


layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 SourceSize;
   vec4 OriginalSize;
   vec4 OutputSize;
   uint FrameCount;
   float BloomPower;
   float BloomScalar;
   float Tuning_Overscan;
   float Tuning_Barrel;
   float mask_toggle;
}global;










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



    vec4 ColorPow(vec4 InColor, float InPower)
{

     vec4 RefLuma = vec4(0.299, 0.587, 0.114, 0.0);
    float ActLuma = dot(InColor, RefLuma);
     vec4 ActColor = InColor / ActLuma;
    float PowLuma = pow(ActLuma, InPower);
     vec4 PowColor = ActColor * PowLuma;
 return PowColor;
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D CRTPASS;
uniform sampler2D shadowMaskSampler;

void main()
{

     vec2 overscanuv =(vTexCoord * global . Tuning_Overscan)-((global . Tuning_Overscan - 1.0)* 0.5);


 overscanuv = overscanuv - vec2(0.5, 0.5);
    float rsq =(overscanuv . x * overscanuv . x)+(overscanuv . y * overscanuv . y);
 overscanuv = overscanuv +(overscanuv *(global . Tuning_Barrel * rsq))+ vec2(0.5, 0.5);
 vec4 PreBloom = vec4(0.0);

 overscanuv =(global . mask_toggle > 0.5)? vTexCoord : overscanuv;
 PreBloom =(global . mask_toggle > 0.5)? SampleCRT(shadowMaskSampler, CRTPASS, overscanuv): texture(CRTPASS, overscanuv);

 vec4 Blurred = texture(Source, overscanuv);
   FragColor = vec4(PreBloom +(ColorPow(Blurred, global . BloomPower)* global . BloomScalar));
}
