#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   float RSUBPIX_R;
   float RSUBPIX_G;
   float RSUBPIX_B;
   float GSUBPIX_R;
   float GSUBPIX_G;
   float GSUBPIX_B;
   float BSUBPIX_R;
   float BSUBPIX_G;
   float BSUBPIX_B;
   float gain;
   float gamma;
   float blacklevel;
   float ambient;
   float BGR;
}param;

#pragma parameterRSUBPIX_R¡1.00.01.00.01
#pragma parameterRSUBPIX_G¡0.00.01.00.01
#pragma parameterRSUBPIX_B¡0.00.01.00.01
#pragma parameterGSUBPIX_R¡0.00.01.00.01
#pragma parameterGSUBPIX_G¡1.00.01.00.01
#pragma parameterGSUBPIX_B¡0.00.01.00.01
#pragma parameterBSUBPIX_R¡0.00.01.00.01
#pragma parameterBSUBPIX_G¡0.00.01.00.01
#pragma parameterBSUBPIX_B¡1.00.01.00.01
#pragma parametergain¡1.00.52.00.05
#pragma parametergamma¡3.00.55.00.1
#pragma parameterblacklevel¡0.050.00.50.01
#pragma parameterambient¡0.00.00.50.01
#pragma parameterBGR¡0011

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}global;





layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
}

