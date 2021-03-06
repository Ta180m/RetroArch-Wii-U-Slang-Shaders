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
   float FIR_SIZE;
   float F_COL;
   float SATURATION;
   float BRIGHTNESS;
   float F_LUMA_LP;
   float HUE;
   float split;
   float split_line;
}params;

#pragma parameterFIR_SIZE¡29.01.050.01.0
#pragma parameterF_COL¡0.250.250.50.25
#pragma parameterSATURATION¡30.00.0100.01.0
#pragma parameterBRIGHTNESS¡1.00.02.00.01
#pragma parameterF_LUMA_LP¡0.166670.00010.3333330.02
#pragma parameterHUE¡0.00.01.00.01
#pragma parametersplit¡0.00.01.01.0
#pragma parametersplit_line¡0.50.01.00.05

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;
uniform sampler2D Pass2;
uniform sampler2D Pass1;






















float pi = 3.141592654;
float tau = 6.283185308;

mat3 yiq2rgb = mat3(1.000, 1.000, 1.000,
                    0.956, - 0.272, - 1.106,
                    0.621, - 0.647, 1.703);


mat2 rotate(float a)
{
    return mat2(cos(a), sin(a),
                - sin(a), cos(a));
}


vec4 sample2D(sampler2D tex, vec2 resolution, vec2 uv)
{
    return texture(tex, uv / resolution);
}

float sinc(float x)
{
 return(x == 0.0)? 1.0 : sin(x * pi)/(x * pi);
}


float WindowBlackman(float a, int N, int i)
{
    float a0 =(1.0 - a)/ 2.0;
    float a1 = 0.5;
    float a2 = a / 2.0;

    float wnd = a0;
    wnd -= a1 * cos(2.0 * pi *(float(i)/ float(N - 1)));
    wnd += a2 * cos(4.0 * pi *(float(i)/ float(N - 1)));

    return wnd;
}



float Lowpass(float Fc, float Fs, int N, int i)
{
    float wc =(Fc / Fs);

    float wnd = WindowBlackman(0.16, N, i);

    return 2.0 * wc * wnd * sinc(2.0 * wc * float(i - N / 2));
}

void main()
{
    float Fs = params . SourceSize . x;
    float Fcol = Fs * params . F_COL;
    float Flumlp = Fs * params . F_LUMA_LP;
    float n = floor(vTexCoord . x * params . OutputSize . x);

 vec2 uv = vTexCoord . xy * params . OutputSize . xy;

    float luma = sample2D(Source, params . SourceSize . xy, uv). r;
    vec2 chroma = vec2(0.);


    for(int i = 0;i < int(params . FIR_SIZE);i ++)
    {
        int tpidx = int(params . FIR_SIZE)- i - 1;
        float lp = Lowpass(Flumlp, Fs, int(params . FIR_SIZE), tpidx);
        chroma += sample2D(Source, params . SourceSize . xy, uv - vec2(float(i)- params . FIR_SIZE / 2., 0.)). yz * lp;
    }

    chroma *= rotate(tau * params . HUE);

    vec3 color = yiq2rgb * vec3(params . BRIGHTNESS * luma, chroma * params . SATURATION);


     FragColor = vec4(color, 0.);














     if(params . split > 0.5)
        {
            FragColor = vec4(texture(Pass1, uv / params . SourceSize . xy). r);
        }
      FragColor =(vTexCoord . x > params . split_line)? vec4(color, 0.): FragColor;

}
