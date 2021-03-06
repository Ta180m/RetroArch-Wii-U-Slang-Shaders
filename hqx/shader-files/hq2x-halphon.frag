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






vec3 rgb_to_hq_colospace(vec4 rgb)
{
    return vec3(0.250 * rgb . r + 0.250 * rgb . g + 0.250 * rgb . b,
                 0.250 * rgb . r - 0.000 * rgb . g - 0.250 * rgb . b,
                - 0.125 * rgb . r + 0.250 * rgb . g - 0.125 * rgb . b);
}

bool is_different(vec4 a, vec4 b)
{
    vec3 diff = abs(rgb_to_hq_colospace(a)- rgb_to_hq_colospace(b));
    return diff . x > 0.188 || diff . y > 0.027 || diff . z > 0.031;
}



vec4 interp_2px(vec4 c1, float w1, vec4 c2, float w2)
{
    return(c1 * w1 + c2 * w2)/(w1 + w2);
}

vec4 interp_3px(vec4 c1, float w1, vec4 c2, float w2, vec4 c3, float w3)
{
    return(c1 * w1 + c2 * w2 + c3 * w3)/(w1 + w2 + w3);
}

vec4 scale(sampler2D image, vec2 coord)
{

    vec2 o = 1.0 / params . SourceSize . xy;
    vec2 texCoord = coord;




    vec2 p = fract(texCoord * params . SourceSize . xy);

    if(p . x > 0.5)o . x = - o . x;
    if(p . y > 0.5)o . y = - o . y;



    vec4 w0 = texture(image, texCoord + vec2(- o . x, - o . y));
    vec4 w1 = texture(image, texCoord + vec2(0, - o . y));
    vec4 w2 = texture(image, texCoord + vec2(o . x, - o . y));
    vec4 w3 = texture(image, texCoord + vec2(- o . x, 0));
    vec4 w4 = texture(image, texCoord + vec2(0, 0));
    vec4 w5 = texture(image, texCoord + vec2(o . x, 0));
    vec4 w6 = texture(image, texCoord + vec2(- o . x, o . y));
    vec4 w7 = texture(image, texCoord + vec2(0, o . y));
    vec4 w8 = texture(image, texCoord + vec2(o . x, o . y));

    int pattern = 0;
    if(is_different(w0, w4))pattern |= 1;
    if(is_different(w1, w4))pattern |= 2;
    if(is_different(w2, w4))pattern |= 4;
    if(is_different(w3, w4))pattern |= 8;
    if(is_different(w5, w4))pattern |= 16;
    if(is_different(w6, w4))pattern |= 32;
    if(is_different(w7, w4))pattern |= 64;
    if(is_different(w8, w4))pattern |= 128;

    if((((pattern &(0xbf))==(0x37))||((pattern &(0xdb))==(0x13)))&& is_different(w1, w5))
        return interp_2px(w4, 3.0, w3, 1.0);
    if((((pattern &(0xdb))==(0x49))||((pattern &(0xef))==(0x6d)))&& is_different(w7, w3))
        return interp_2px(w4, 3.0, w1, 1.0);
    if((((pattern &(0x0b))==(0x0b))||((pattern &(0xfe))==(0x4a))||((pattern &(0xfe))==(0x1a)))&& is_different(w3, w1))
        return w4;
    if((((pattern &(0x6f))==(0x2a))||((pattern &(0x5b))==(0x0a))||((pattern &(0xbf))==(0x3a))||((pattern &(0xdf))==(0x5a))||
                    ((pattern &(0x9f))==(0x8a))||((pattern &(0xcf))==(0x8a))||((pattern &(0xef))==(0x4e))||((pattern &(0x3f))==(0x0e))||
                    ((pattern &(0xfb))==(0x5a))||((pattern &(0xbb))==(0x8a))||((pattern &(0x7f))==(0x5a))||((pattern &(0xaf))==(0x8a))||
                    ((pattern &(0xeb))==(0x8a)))&& is_different(w3, w1))
        return interp_2px(w4, 3.0, w0, 1.0);
    if(((pattern &(0x0b))==(0x08)))
        return interp_3px(w4, 2.0, w0, 1.0, w1, 1.0);
    if(((pattern &(0x0b))==(0x02)))
        return interp_3px(w4, 2.0, w0, 1.0, w3, 1.0);
    if(((pattern &(0x2f))==(0x2f)))
        return interp_3px(w4, 1.04, w3, 1.0, w1, 1.0);
    if(((pattern &(0xbf))==(0x37))||((pattern &(0xdb))==(0x13)))
        return interp_3px(w4, 5.0, w1, 2.0, w3, 1.0);
    if(((pattern &(0xdb))==(0x49))||((pattern &(0xef))==(0x6d)))
        return interp_3px(w4, 5.0, w3, 2.0, w1, 1.0);
    if(((pattern &(0x1b))==(0x03))||((pattern &(0x4f))==(0x43))||((pattern &(0x8b))==(0x83))||((pattern &(0x6b))==(0x43)))
        return interp_2px(w4, 3.0, w3, 1.0);
    if(((pattern &(0x4b))==(0x09))||((pattern &(0x8b))==(0x89))||((pattern &(0x1f))==(0x19))||((pattern &(0x3b))==(0x19)))
        return interp_2px(w4, 3.0, w1, 1.0);
    if(((pattern &(0x7e))==(0x2a))||((pattern &(0xef))==(0xab))||((pattern &(0xbf))==(0x8f))||((pattern &(0x7e))==(0x0e)))
        return interp_3px(w4, 2.0, w3, 3.0, w1, 3.0);
    if(((pattern &(0xfb))==(0x6a))||((pattern &(0x6f))==(0x6e))||((pattern &(0x3f))==(0x3e))||((pattern &(0xfb))==(0xfa))||
                   ((pattern &(0xdf))==(0xde))||((pattern &(0xdf))==(0x1e)))
        return interp_2px(w4, 3.0, w0, 1.0);
    if(((pattern &(0x0a))==(0x00))||((pattern &(0x4f))==(0x4b))||((pattern &(0x9f))==(0x1b))||((pattern &(0x2f))==(0x0b))||
                   ((pattern &(0xbe))==(0x0a))||((pattern &(0xee))==(0x0a))||((pattern &(0x7e))==(0x0a))||((pattern &(0xeb))==(0x4b))||
                   ((pattern &(0x3b))==(0x1b)))
        return interp_3px(w4, 2.0, w3, 1.0, w1, 1.0);

    return interp_3px(w4, 6.0, w3, 1.0, w1, 1.0);
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
FragColor = scale(Source, vTexCoord);
}
