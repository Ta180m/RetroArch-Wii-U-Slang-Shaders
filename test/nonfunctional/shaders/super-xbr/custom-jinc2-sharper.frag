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

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;





















vec3 Y = vec3(0.299, 0.587, 0.114);


float d(vec2 pt1, vec2 pt2)
{
  vec2 v = pt2 - pt1;
  return sqrt(dot(v, v));
}

vec3 min4(vec3 a, vec3 b, vec3 c, vec3 d)
{
    return min(a, min(b, min(c, d)));
}
vec3 max4(vec3 a, vec3 b, vec3 c, vec3 d)
{
    return max(a, max(b, max(c, d)));
}

vec4 resampler(vec4 x)
{
    return(x == vec4(0.0))? vec4((0.42 * 3.1415926535897932384626433832795)*(0.92 * 3.1415926535897932384626433832795)): sin(x *(0.42 * 3.1415926535897932384626433832795))* sin(x *(0.92 * 3.1415926535897932384626433832795))/(x * x);
}

void main()
{
    vec2 dx = vec2(1.0, 0.0);
    vec2 dy = vec2(0.0, 1.0);

    vec2 pc = vTexCoord * global . SourceSize . xy;

    vec2 tc =(floor(pc - vec2(0.5, 0.5))+ vec2(0.5, 0.5));

    mat4x4 weights = mat4x4(
        resampler(vec4(d(pc, tc - dx - dy), d(pc, tc - dy), d(pc, tc + dx - dy), d(pc, tc + 2.0 * dx - dy))),
        resampler(vec4(d(pc, tc - dx), d(pc, tc), d(pc, tc + dx), d(pc, tc + 2.0 * dx))),
        resampler(vec4(d(pc, tc - dx + dy), d(pc, tc + dy), d(pc, tc + dx + dy), d(pc, tc + 2.0 * dx + dy))),
        resampler(vec4(d(pc, tc - dx + 2.0 * dy), d(pc, tc + 2.0 * dy), d(pc, tc + dx + 2.0 * dy), d(pc, tc + 2.0 * dx + 2.0 * dy)))
    );


    dx = dx * global . SourceSize . zw;
    dy = dy * global . SourceSize . zw;
    tc = tc * global . SourceSize . zw;


    vec3 c00 = texture(Source, tc - dx - dy). xyz;
    vec3 c10 = texture(Source, tc - dy). xyz;
    vec3 c20 = texture(Source, tc + dx - dy). xyz;
    vec3 c30 = texture(Source, tc + 2.0 * dx - dy). xyz;
    vec3 c01 = texture(Source, tc - dx). xyz;
    vec3 c11 = texture(Source, tc). xyz;
    vec3 c21 = texture(Source, tc + dx). xyz;
    vec3 c31 = texture(Source, tc + 2.0 * dx). xyz;
    vec3 c02 = texture(Source, tc - dx + dy). xyz;
    vec3 c12 = texture(Source, tc + dy). xyz;
    vec3 c22 = texture(Source, tc + dx + dy). xyz;
    vec3 c32 = texture(Source, tc + 2.0 * dx + dy). xyz;
    vec3 c03 = texture(Source, tc - dx + 2.0 * dy). xyz;
    vec3 c13 = texture(Source, tc + 2.0 * dy). xyz;
    vec3 c23 = texture(Source, tc + dx + 2.0 * dy). xyz;
    vec3 c33 = texture(Source, tc + 2.0 * dx + 2.0 * dy). xyz;

    vec3 color;
    color = mat4x3(c00, c10, c20, c30)* weights[0];
    color += mat4x3(c01, c11, c21, c31)* weights[1];
    color += mat4x3(c02, c12, c22, c32)* weights[2];
    color += mat4x3(c03, c13, c23, c33)* weights[3];
    color = color / dot(vec4(1.0)* weights, vec4(1.0));



    pc = vTexCoord;
    c00 = texture(Source, pc). xyz;
    c11 = texture(Source, pc + dx). xyz;
    c21 = texture(Source, pc - dx). xyz;
    c12 = texture(Source, pc + dy). xyz;
    c22 = texture(Source, pc - dy). xyz;


    vec3 min_sample = min4(c11, c21, c12, c22);
    vec3 max_sample = max4(c11, c21, c12, c22);
    min_sample = min(min_sample, c00);
    max_sample = max(max_sample, c00);

    vec3 aux = color;

    color = clamp(color, min_sample, max_sample);
    color = mix(aux, color, 0.0);


    FragColor = vec4(color, 1.0);
}
