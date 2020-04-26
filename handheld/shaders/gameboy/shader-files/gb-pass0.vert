#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   vec4 OriginalHistorySize1;
   float baseline_alpha;
   float grey_balance;
   float response_time;
   float video_scale;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;







#pragma parameterbaseline_alpha¡0.100.01.00.01


#pragma parametergrey_balance¡3.02.04.00.1



#pragma parameterresponse_time¡0.3330.00.7770.111


#pragma parametervideo_scale¡3.03.05.01.0


























layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 2) out vec2 dot_size;
layout(location = 3) out vec2 one_texel;















void main()
{
 float video_scale_factor = floor(registers . OutputSize . y * registers . SourceSize . w);
 vec2 scaled_video_out =(registers . SourceSize . xy * vec2(video_scale_factor));

    gl_Position = global . MVP * Position / vec4(vec2(registers . OutputSize . xy / scaled_video_out), 1.0, 1.0);
    vTexCoord = TexCoord * 1.0001;
    dot_size = registers . SourceSize . zw;
    one_texel = 1.0 /(registers . SourceSize . xy * video_scale_factor);
}





