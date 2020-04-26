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
   float F_COL;
}params;

#pragma parameterF_COL¡0.250.250.50.25

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;





float tau = atan(1.0)* 8.0;

mat3 rgb2yiq = mat3(0.299, 0.596, 0.211,
                    0.587, - 0.274, - 0.523,
                    0.114, - 0.322, 0.312);


vec2 Oscillator(float Fo, float Fs, float n)
{
    float phase =(tau * Fo * floor(n))/ Fs;
    return vec2(cos(phase), sin(phase));
}

void main()
{
    float Fs = params . SourceSize . x;
    float Fcol = Fs * params . F_COL;
    float n = floor(vTexCoord . x * params . OutputSize . x);

    vec3 cRGB = texture(Source, vTexCoord . xy). rgb;
    vec3 cYIQ = rgb2yiq * cRGB;

    vec2 cOsc = Oscillator(Fcol, Fs, n);

    float sig = cYIQ . x + dot(cOsc, cYIQ . yz);

   FragColor = vec4(sig, 0., 0., 0.);
}
