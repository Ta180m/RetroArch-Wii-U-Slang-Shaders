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
   float RAA_SHR1;
   float RAA_SMT1;
   float RAA_DVT1;
}params;

#pragma parameterRAA_SHR1¡2.00.0010.00.05
#pragma parameterRAA_SMT1¡0.50.0510.00.05
#pragma parameterRAA_DVT1¡1.00.0510.00.05

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

const int scl = 3;
const int rad = 7;


vec3 res2x(vec3 pre2, vec3 pre1, vec3 px, vec3 pos1, vec3 pos2)
{
    float d1, d2, w;
 vec3 a, m, t, t1, t2;
    mat4x3 pre = mat4x3(pre2, pre1, px, pos1);
    mat4x3 pos = mat4x3(pre1, px, pos1, pos2);
    mat4x3 df = pos - pre;

    m . x =(px . x < 0.5)? px . x :(1.0 - px . x);
    m . y =(px . y < 0.5)? px . y :(1.0 - px . y);
    m . z =(px . z < 0.5)? px . z :(1.0 - px . z);
 m = params . RAA_SHR1 * min(m, min(abs(df[1]), abs(df[2])));
 t =(7 *(df[1]+ df[2])- 3 *(df[0]+ df[3]))/ 16;

 a . x = t . x == 0.0 ? 1.0 : m . x / abs(t . x);
 a . y = t . y == 0.0 ? 1.0 : m . y / abs(t . y);
 a . z = t . z == 0.0 ? 1.0 : m . z / abs(t . z);
 t1 = clamp(t, - m, m);
 t2 = min(1.0, min(min(a . x, a . y), a . z))* t;

 d1 = length(df[1]);d2 = length(df[2]);
 d1 = d1 == 0.0 ? 0.0 : length(cross(df[1], t1))/ d1;
 d2 = d2 == 0.0 ? 0.0 : length(cross(df[2], t1))/ d2;

 w = min(1.0, max(d1, d2)/ 0.8125);

 return mix(t1, t2, pow(w, params . RAA_DVT1));
}

void main()
{


 vec3 tx[2 * rad + 1];



     tx[(0)+ rad]= texture(Source, vTexCoord). rgb;

 for(int i = 1;i <= rad;i ++){
       tx[(- i)+ rad]= texture(Source, vTexCoord + vec2(0, - i)* params . SourceSize . zw). rgb;
       tx[(i)+ rad]= texture(Source, vTexCoord + vec2(0, i)* params . SourceSize . zw). rgb;
 }




 ivec2 i1 = ivec2(0), i2 = ivec2(0);
 vec3 df1, df2;
 vec2 d1, d2, d3;
 bvec2 cn;

 df1 = tx[(1)+ rad]- tx[(0)+ rad];df2 = tx[(0)+ rad]- tx[(- 1)+ rad];

 d2 = vec2(length(df1), length(df2));
 d3 = d2 . yx;



 float sw = d2 . x + d2 . y;
 sw = sw == 0.0 ? 1.0 : pow(length(df1 - df2)/ sw, params . RAA_SMT1);



 for(int i = 1;i < rad;i ++){
  d1 = d2;
  d2 = d3;
  d3 = vec2(distance(tx[(- i - 1)+ rad], tx[(- i)+ rad]), distance(tx[(i)+ rad], tx[(i + 1)+ rad]));
  cn . x = max(d1 . x, d3 . x)< d2 . x;
  cn . y = max(d1 . y, d3 . y)< d2 . y;
  i2 . x = cn . x && i2 . x == 0 && i1 . x != 0 ? i : i2 . x;
  i2 . y = cn . y && i2 . y == 0 && i1 . y != 0 ? i : i2 . y;
  i1 . x = cn . x && i1 . x == 0 ? i : i1 . x;
  i1 . y = cn . y && i1 . y == 0 ? i : i1 . y;
 }

 i2 . x = i2 . x == 0 ? i1 . x + 1 : i2 . x;
 i2 . y = i2 . y == 0 ? i1 . y + 1 : i2 . y;



 vec3 t = res2x(tx[(- i2 . x)+ rad], tx[(- i1 . x)+ rad], tx[(0)+ rad], tx[(i1 . y)+ rad], tx[(i2 . y)+ rad]);


 float dw =(i1 . x == 0 || i1 . y == 0)? 0.0 : 2.0 *((i1 . x - 1.0)/(i1 . x + i1 . y - 2.0))- 1.0;


 vec3 res = tx[(0)+ rad]+(scl - 1.0)/ scl * sw * dw * t;



 vec3 lo = min(min(tx[(- 1)+ rad], tx[(0)+ rad]), tx[(1)+ rad]);
    vec3 hi = max(max(tx[(- 1)+ rad], tx[(0)+ rad]), tx[(1)+ rad]);

    FragColor = vec4(clamp(res, lo, hi), 1.0);
}
