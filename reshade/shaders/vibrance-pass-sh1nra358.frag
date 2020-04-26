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

void main()
{






 vec3 col = texture(Source, vTexCoord). rgb;
 vec3 lumCoeff = vec3(0.212656, 0.715158, 0.072186);

 float luma = dot(lumCoeff, col);

 float max_color = max(col . r, max(col . g, col . b));
 float min_color = min(col . r, min(col . g, col . b));

 float color_saturation = max_color - min_color;

    col . r = mix(luma, col . r,(1.0 +(vec3(vec3(1.00, 1.00, 1.00). r * 0.5, vec3(1.00, 1.00, 1.00). g * 0.5, vec3(1.00, 1.00, 1.00). b * 0.5). r *(1.0 -(sign(vec3(vec3(1.00, 1.00, 1.00). r * 0.5, vec3(1.00, 1.00, 1.00). g * 0.5, vec3(1.00, 1.00, 1.00). b * 0.5). r)* color_saturation)))));
    col . g = mix(luma, col . g,(1.0 +(vec3(vec3(1.00, 1.00, 1.00). r * 0.5, vec3(1.00, 1.00, 1.00). g * 0.5, vec3(1.00, 1.00, 1.00). b * 0.5). g *(1.0 -(sign(vec3(vec3(1.00, 1.00, 1.00). r * 0.5, vec3(1.00, 1.00, 1.00). g * 0.5, vec3(1.00, 1.00, 1.00). b * 0.5). g)* color_saturation)))));
    col . b = mix(luma, col . b,(1.0 +(vec3(vec3(1.00, 1.00, 1.00). r * 0.5, vec3(1.00, 1.00, 1.00). g * 0.5, vec3(1.00, 1.00, 1.00). b * 0.5). b *(1.0 -(sign(vec3(vec3(1.00, 1.00, 1.00). r * 0.5, vec3(1.00, 1.00, 1.00). g * 0.5, vec3(1.00, 1.00, 1.00). b * 0.5). b)* color_saturation)))));
   FragColor = vec4(col, 1.0);
}
