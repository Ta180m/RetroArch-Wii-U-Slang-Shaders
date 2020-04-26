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
   float TVOUT_RESOLUTION;
   float TVOUT_COMPOSITE_CONNECTION;
   float TVOUT_TV_COLOR_LEVELS;
   float TVOUT_RESOLUTION_Y;
   float TVOUT_RESOLUTION_I;
   float TVOUT_RESOLUTION_Q;
}params;





#pragma parameterTVOUT_RESOLUTION�256.00.01024.032.0


#pragma parameterTVOUT_COMPOSITE_CONNECTION�0.00.01.01.0



#pragma parameterTVOUT_TV_COLOR_LEVELS�0.00.01.01.0













#pragma parameterTVOUT_RESOLUTION_Y�256.00.01024.032.0
#pragma parameterTVOUT_RESOLUTION_I�83.20.0256.08.0
#pragma parameterTVOUT_RESOLUTION_Q�25.60.0256.08.0






layout(std140) uniform UBO
{
   mat4 MVP;
}global;

mat3x3 RGB_to_YIQ = mat3x3(
         0.299, 0.587, 0.114,
   0.595716, - 0.274453, - 0.321263,
   0.211456, - 0.522591, 0.311135);
mat3x3 YIQ_to_RGB = mat3x3(
         1.0, 0.9563, 0.6210,
   1.0, - 0.2721, - 0.6474,
   1.0, - 1.1070, 1.7046);












vec3 LEVELS(vec3 c0)
{
   if(params . TVOUT_TV_COLOR_LEVELS > 0.5)
   {
      if(params . TVOUT_COMPOSITE_CONNECTION > 0.5)
         return vec3(clamp((c0 . x - 16.5 / 256.0)* 256.0 /(236.0 - 16.0), 0.0, 1.0), clamp((c0 . y - 16.5 / 256.0)* 256.0 /(240.0 - 16.0), 0.0, 1.0), clamp((c0 . z - 16.5 / 256.0)* 256.0 /(240.0 - 16.0), 0.0, 1.0));
      else
         return clamp((c0 - 16.5 / 256.0)* 256.0 /(236.0 - 16.0), 0.0, 1.0);
   }
   else
      return c0;
}













layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
}
