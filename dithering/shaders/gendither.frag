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


int erroredtable[16] = int[16](int(0), int(1), int(0), int(1), int(16), int(15), int(16), int(15), int(0), int(1), int(0), int(1), int(16), int(15), int(16), int(15
));

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec3 final = texture(Source, vTexCoord). rgb;
 vec2 ditheu = vTexCoord . xy * params . SourceSize . xy;


 int ditdex = int(mod(ditheu . x, 4.0))* 4 + int(mod(ditheu . y, 4.0));
 ivec3 color;
 ivec3 colord;
 color . r = int(final . r)* 224;
 color . g = int(final . g)* 224;
 color . b = int(final . b)* 224;
 int yeh = 0;
 int ohyes = 0;



 for(yeh = ditdex;yeh <(ditdex + 16);yeh ++)ohyes = erroredtable[yeh - 15];

 colord . r = color . r + ohyes;
 colord . g = color . g + ohyes;
 colord . b = color . b + ohyes;
 final . rgb += colord . rgb * 0.003921568627451;


 float why = 1.0;
 vec3 reduceme = vec3(1.0);
 float radooct = 4.4;

 reduceme . r = pow(final . r, why);
 reduceme . r *= radooct;
 reduceme . r = int(floor(reduceme . r));
 reduceme . r /= radooct;
 reduceme . r = pow(reduceme . r, why);

 reduceme . g = pow(final . g, why);
 reduceme . g *= radooct;
 reduceme . g = int(floor(reduceme . g));
 reduceme . g /= radooct;
 reduceme . g = pow(reduceme . g, why);

 reduceme . b = pow(final . b, why);
 reduceme . b *= radooct;
 reduceme . b = int(floor(reduceme . b));
 reduceme . b /= radooct;
 reduceme . b = pow(reduceme . b, why);


 reduceme . rgb = clamp(reduceme . rgb, vec3(0.0), vec3(0.875));

   FragColor = vec4(reduceme . rgb, 1.0);
}
