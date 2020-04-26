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
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;





vec2 size = params . SourceSize . xy;
float pi = 3.141592654;

vec3 monitor(vec2 p)
{
 vec2 pos = floor(p * size);
 vec2 uv = vTexCoord;
    vec4 res = texture(Source, uv);
    vec3 yuv = res . xyz * mat3(
        0.2126, 0.7152, 0.0722,
  - 0.09991, - 0.33609, 0.436,
  0.615, - 0.55861, - 0.05639);
    float alpha =(floor(p . x * size . x * 4.)/ 2.0)* pi;
    vec2 sincv = vec2(cos(alpha), sin(alpha));
    if(mod(pos . y + 5., 4.)< 2.)
     sincv . x = - sincv . x;
    if(mod(pos . y, 4.)>= 2.)
     sincv . y = - sincv . y;
    float mc = 1. + dot(sincv, yuv . zy)/ yuv . x;





    return res . xyz * mc;
}


vec4 monitor_sample(vec2 p, vec2 tex_sample)
{




    vec2 next = vec2(.25, 1.)/ size;
    vec2 f = fract(vec2(4., 1.)* size * p);
    tex_sample *= vec2(4., 1.)* size;
    vec2 l;
    vec2 r;
    if(f . x + tex_sample . x < 1.)
    {
        l . x = f . x + tex_sample . x;
        r . x = 0.;
    }
    else
    {
        l . x = 1. - f . x;
        r . x = min(1., f . x + tex_sample . x - 1.);
    }
    if(f . y + tex_sample . y < 1.)
    {
        l . y = f . y + tex_sample . y;
        r . y = 0.;
    }
    else
    {
        l . y = 1. - f . y;
        r . y = min(1., f . y + tex_sample . y - 1.);
    }
    vec3 top = mix(monitor(p), monitor(p + vec2(next . x, 0.)), r . x /(l . x + r . x));
    vec3 bottom = mix(monitor(p + vec2(0., next . y)), monitor(p + next), r . x /(l . x + r . x));
    return vec4(mix(top, bottom, r . y /(l . y + r . y)), 1.0);


}

void main()
{
 float zoom = 1.;
 FragColor = monitor_sample(vTexCoord, vec2(1.0));
}
