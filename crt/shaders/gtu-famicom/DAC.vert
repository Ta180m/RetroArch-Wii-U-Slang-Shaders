#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   uint FrameCount;
}global;











bool InColorp(int p, int color)
{
    return((color + p)% 12 < 6);
}

float NTSCsignal(int emphasis, int level, int color, int p)
{
    float black = .518;
    float white = 1.962;

    float attenuation = 0.746;
    float levels[8]= float[](0.350, 0.518, 0.962, 1.550,
                                        1.094f, 1.506, 1.962, 1.962);
    if(color > 13)
        level = 1;

    float low = levels[0 + level];
    float high = levels[4 + level];

    if(color == 0)
        low = high;

    if(color > 12)
        high = low;

    float signal = InColorp(p, color)? high : low;

    if((bool(emphasis & 1)&& InColorp(p, 0))||
        (bool(emphasis & 2)&& InColorp(p, 4))||
        (bool(emphasis & 4)&& InColorp(p, 8)))
    {
        signal = signal * attenuation;
    }


    signal =(signal - black)/(white - black);

    return signal;
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out float colorPhase;

void main()
{
    gl_Position = global . MVP * Position;
    vTexCoord = TexCoord;
    vec2 pos =(vTexCoord . xy * global . OutputSize . xy)- 0.5;
    colorPhase = 8.0001 + pos . x + pos . y * 4.0001 + global . FrameCount * 4.0001;
}

