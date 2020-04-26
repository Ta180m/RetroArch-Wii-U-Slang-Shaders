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
   vec4 REFSize;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;




















float coef = 2.0;
float cf = 4.0;
float eq_threshold = 15.0;
float y_weight = 48.0;
float u_weight = 7.0;
float v_weight = 6.0;
mat3x3 yuv = mat3x3(0.299, 0.587, 0.114, - 0.169, - 0.331, 0.499, 0.499, - 0.418, - 0.0813);
mat3x3 yuv_weighted = mat3x3(y_weight * yuv[0], u_weight * yuv[1], v_weight * yuv[2]);
vec4 maximo = vec4(255.0, 255.0, 255.0, 255.0);
vec4 low = vec4(- 64.0, - 64.0, - 64.0, - 64.0);
vec4 high = vec4(64.0, 64.0, 64.0, 64.0);


mat2x4 sym_vectors = mat2x4(1., 1., - 1., - 1., 1., - 1., - 1., 1.);


vec3 lines[13]= vec3[](
        vec3(4.0, 4.0, 4.0),
        vec3(4.0, 4.0, 3.0),
        vec3(4.0, 4.0, 2.0),
        vec3(8.0, 4.0, 2.0),
        vec3(4.0, 8.0, 2.0),
       vec3(12.0, 4.0, 2.0),
        vec3(4.0, 12.0, 2.0),
       vec3(16.0, 4.0, 2.0),
        vec3(4.0, 16.0, 2.0),

       vec3(12.0, 4.0, 6.0),
        vec3(4.0, 12.0, 6.0),
       vec3(16.0, 4.0, 6.0),
        vec3(4.0, 16.0, 6.0)
);

     vec4 remapTo01(vec4 v, vec4 low, vec4 high)
{
 return clamp((v - low)/(high - low), 0.0, 1.0);
}

float remapFrom01(float v, float high)
{
 return floor((high * v)+ 0.5);
}

float df(float A, float B)
{
 return abs(A - B);
}

bool eq(float A, float B)
{
 return(df(A, B)< eq_threshold);
}

float weighted_distance(float a, float b, float c, float d, float e, float f, float g, float h)
{
 return(df(a, b)+ df(a, c)+ df(d, e)+ df(d, f)+ 4.0 * df(g, h));
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec4 t1;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord * 1.0004;
      vec2 ps = vec2(1.0 / params . REFSize . x, 1.0 / params . REFSize . y);
 float dx = ps . x;
 float dy = ps . y;









 t1 = vec4(dx, 0., 0., dy);
}

