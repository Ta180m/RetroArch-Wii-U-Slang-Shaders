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






















layout(location = 0) in vec2 texCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
        vec2 fp = fract(texCoord * params . SourceSize . xy);



        vec3 B = texture(Source, t1 . xy). xyz;
        vec3 D = texture(Source, t1 . zw). xyz;
        vec3 E = texture(Source, texCoord). xyz;
        vec3 F = texture(Source, t2 . xy). xyz;
        vec3 H = texture(Source, t2 . zw). xyz;

        vec3 E0 = D == B && B != H && D != F ? D : E;
        vec3 E1 = B == F && B != H && D != F ? F : E;
        vec3 E2 = D == H && B != H && D != F ? D : E;
        vec3 E3 = H == F && B != H && D != F ? F : E;


   FragColor = vec4((E3 * fp . x + E2 *(1 - fp . x))* fp . y +(E1 * fp . x + E0 *(1 - fp . x))*(1 - fp . y), 1);
}
