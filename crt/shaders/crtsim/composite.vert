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


layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}

