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







#pragma parameterbaseline_alpha¡0.050.01.00.01


#pragma parametergrey_balance¡2.62.04.00.1



#pragma parameterresponse_time¡0.200.00.7770.111


#pragma parametervideo_scale¡3.03.05.01.0


























layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 2) out vec2 dot_size;
layout(location = 3) out vec2 one_texel;















void main()
{
 vec2 scaled_video_out =(registers . SourceSize . xy * vec2(registers . video_scale));

    gl_Position = global . MVP * Position / vec4(vec2(registers . OutputSize . xy / scaled_video_out), 1.0, 1.0);
    vTexCoord = TexCoord +(vec2(0.5)* registers . OutputSize . zw);
    dot_size = registers . SourceSize . zw;
    one_texel = 1.0 /(registers . SourceSize . xy * registers . video_scale);
}





