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
   float Tuning_Sharp;
   float Tuning_Persistence_R;
   float Tuning_Persistence_G;
   float Tuning_Persistence_B;
   float Tuning_Bleed;
   float Tuning_Artifacts;
   float NTSCLerp;
   float NTSCArtifactScale;
   float animate_artifacts;
}params;

#pragma parameterTuning_Sharp¡0.20.01.00.05
#pragma parameterTuning_Persistence_R¡0.0650.01.00.01
#pragma parameterTuning_Persistence_G¡0.050.01.00.01
#pragma parameterTuning_Persistence_B¡0.050.01.00.01
#pragma parameterTuning_Bleed¡0.50.01.00.05
#pragma parameterTuning_Artifacts¡0.50.01.00.05
#pragma parameterNTSCLerp¡1.00.01.01.0
#pragma parameterNTSCArtifactScale¡255.00.01000.05.0
#pragma parameteranimate_artifacts¡1.00.01.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;



float SharpWeight[3] = float[3](float(1.0), float(- 0.3162277), float(0.1
));


float Brightness(vec4 InVal)
{
 return dot(InVal, vec4(0.299, 0.587, 0.114, 0.0));
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D PassFeedback0;

uniform sampler2D Source;

uniform sampler2D NTSCArtifactSampler;








void main()
{
     vec2 scanuv = vec2(fract(vTexCoord * 1.0001 * params . SourceSize . xy / params . NTSCArtifactScale));
     vec4 NTSCArtifact1 = texture(NTSCArtifactSampler, scanuv);
     vec4 NTSCArtifact2 = texture(NTSCArtifactSampler, scanuv + vec2(0.0, 1.0 / params . SourceSize . y));
 float lerpfactor =(params . animate_artifacts > 0.5)? mod(params . FrameCount, 2.0): params . NTSCLerp;
     vec4 NTSCArtifact = mix(NTSCArtifact1, NTSCArtifact2, 1.0 - lerpfactor);

     vec2 LeftUV = vTexCoord - vec2(1.0 / params . SourceSize . x, 0.0);
     vec2 RightUV = vTexCoord + vec2(1.0 / params . SourceSize . x, 0.0);

     vec4 Cur_Left = texture(Source, LeftUV);
     vec4 Cur_Local = texture(Source, vTexCoord);
     vec4 Cur_Right = texture(Source, RightUV);

     vec4 TunedNTSC = NTSCArtifact * params . Tuning_Artifacts;





     vec4 Prev_Left = texture(PassFeedback0, LeftUV);
     vec4 Prev_Local = texture(PassFeedback0, vTexCoord);
     vec4 Prev_Right = texture(PassFeedback0, RightUV);


 Cur_Local =

                                                                  clamp(Cur_Local +(((Cur_Left - Cur_Local)+(Cur_Right - Cur_Local))* TunedNTSC), 0.0, 1.0);

    float curBrt = Brightness(Cur_Local);
    float offset = 0.;




 for(int i = 0;i < 3;++ i)
 {
      vec2 StepSize =(vec2(1.0 / 256.0, 0)*(float(i + 1)));
      vec4 neighborleft = texture(Source, vTexCoord - StepSize);
      vec4 neighborright = texture(Source, vTexCoord + StepSize);

     float NBrtL = Brightness(neighborleft);
     float NBrtR = Brightness(neighborright);
  offset +=((((curBrt - NBrtL)+(curBrt - NBrtR)))* SharpWeight[i]);
 }


 Cur_Local = clamp(Cur_Local +(offset * params . Tuning_Sharp * mix(ivec4(1, 1, 1, 1), NTSCArtifact, params . Tuning_Artifacts)), 0.0, 1.0);

 vec4 Tuning_Persistence = vec4(params . Tuning_Persistence_R, params . Tuning_Persistence_G, params . Tuning_Persistence_B, 1.0);

 Cur_Local = clamp(max(Cur_Local, Tuning_Persistence *(10.0 /(1.0 +(2.0 * params . Tuning_Bleed)))*(Prev_Local +((Prev_Left + Prev_Right)* params . Tuning_Bleed))), 0.0, 1.0);

   FragColor = vec4(Cur_Local);
}
