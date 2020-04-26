#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4



















uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 FragCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

struct deltas
{
    vec2 UL, UR, DL, DR;
};

void main()
{
    vec2 texsize = params . SourceSize . xy;
    float dx = pow(texsize . x, - 1.0)* 0.5;
    float dy = pow(texsize . y, - 1.0)* 0.5;
    vec3 dt = vec3(1.0, 1.0, 1.0);

    deltas VAR = deltas(vTexCoord + vec2(- dx, - dy), vTexCoord + vec2(dx, - dy), vTexCoord + vec2(- dx, dy), vTexCoord + vec2(dx, dy)
    );

    vec3 c00 = texture(Source, VAR . UL). xyz;
    vec3 c20 = texture(Source, VAR . UR). xyz;
    vec3 c02 = texture(Source, VAR . DL). xyz;
    vec3 c22 = texture(Source, VAR . DR). xyz;

    float m1 = dot(abs(c00 - c22), dt)+ 0.001;
    float m2 = dot(abs(c02 - c20), dt)+ 0.001;

    FragColor = vec4((m1 *(c02 + c20)+ m2 *(c22 + c00))/(2.0 *(m1 + m2)), 1.0);
}
