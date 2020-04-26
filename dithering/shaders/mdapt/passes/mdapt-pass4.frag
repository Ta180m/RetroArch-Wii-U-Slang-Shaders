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
   float VL;
   float CB;
   float DEBUG;
   float linear_gamma;
}params;

#pragma parameterVL�0.00.01.01.0
#pragma parameterCB�1.00.01.01.0
#pragma parameterDEBUG�0.00.01.01.0
#pragma parameterlinear_gamma�0.00.01.01.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;




vec4 TEX(float dx, float dy){
 if(params . linear_gamma > 0.5)return pow(texture(Source, vTexCoord + vec2((dx),(dy))* params . SourceSize . zw), vec4(2.2));
 else return texture(Source, vTexCoord + vec2((dx),(dy))* params . SourceSize . zw);
}

vec4 TEXt0(float dx, float dy){
 if(params . linear_gamma > 0.5)return pow(texture(Original, vTexCoord + vec2((dx),(dy))* params . SourceSize . zw), vec4(2.2));
 else return texture(Original, vTexCoord + vec2((dx),(dy))* params . SourceSize . zw);
}

bool eq(vec3 A, vec3 B){
 return(A == B);
}

float and_(float a, float b){
 return min(a, b);
}

float or_(float a, float b){
 return max(a, b);
}

float or_(float a, float b, float c, float d, float e, float f, float g, float h, float i){
 return max(a, max(b, max(c, max(d, max(e, max(f, max(g, max(h, i))))))));
}

vec2 and_(vec2 a, vec2 b){
 return min(a, b);
}

vec2 or_(vec2 a, vec2 b){
 return max(a, b);
}

vec2 or_(vec2 a, vec2 b, vec2 c, vec2 d){
 return max(a, max(b, max(c, d)));
}

void main()
{






 vec4 C = TEX(0., 0.);vec3 c = TEXt0(0., 0.). xyz;
 vec2 L = TEX(- 1., 0.). xy;vec3 l = TEXt0(- 1., 0.). xyz;
 vec2 R = TEX(1., 0.). xy;vec3 r = TEXt0(1., 0.). xyz;
 vec2 U = TEX(0., - 1.). xy;
 vec2 D = TEX(0., 1.). xy;

 float prVL = 0.0, prCB = 0.0;
 vec3 fVL = vec3(0.0), fCB = vec3(0.0);



 C . xy = or_(C . xy, and_(C . zw, or_(L . xy, R . xy, U . xy, D . xy)));


 if(params . VL > 0.5){
  float prSum = L . x + R . x;

  prVL = max(L . x, R . x);
  prVL =(prVL == 0.0)? 1.0 : prSum / prVL;

  fVL =(prVL * c + L . x * l + R . x * r)/(prVL + prSum);
  prVL = C . x;
 }


 if(params . CB > 0.5){
  vec3 u = TEXt0(0., - 1.). xyz;
  vec3 d = TEXt0(0., 1.). xyz;

  float eqCL = float(eq(c, l));
  float eqCR = float(eq(c, r));
  float eqCU = float(eq(c, u));
  float eqCD = float(eq(c, d));

  float prU = or_(U . y, eqCU);
  float prD = or_(D . y, eqCD);
  float prL = or_(L . y, eqCL);
  float prR = or_(R . y, eqCR);


  float prSum = prU + prD + prL + prR;

  prCB = max(prL, max(prR, max(prU, prD)));
  prCB =(prCB == 0.0)? 1.0 : prSum / prCB;


  fCB =(prCB * c + prU * u + prD * d + prL * l + prR * r)/(prCB + prSum);


  float UL = TEX(- 1., - 1.). y;vec3 ul = TEXt0(- 1., - 1.). xyz;
  float UR = TEX(1., - 1.). y;vec3 ur = TEXt0(1., - 1.). xyz;
  float DL = TEX(- 1., 1.). y;vec3 dl = TEXt0(- 1., 1.). xyz;
  float DR = TEX(1., 1.). y;vec3 dr = TEXt0(1., 1.). xyz;


  prCB = or_(C . y, and_(L . y, eqCL), and_(R . y, eqCR), and_(U . y, eqCU), and_(D . y, eqCD), and_(UL, float(eq(c, ul))), and_(UR, float(eq(c, ur))), and_(DL, float(eq(c, dl))), and_(DR, float(eq(c, dr))));
 }

 if(params . DEBUG > 0.5)
  FragColor = vec4(prVL, prCB, 0.0, 0.0);

 vec4 final =(prCB >= prVL)? vec4(mix(c, fCB, prCB), 1.0): vec4(mix(c, fVL, prVL), 1.0);
 FragColor =(params . linear_gamma > 0.5)? pow(final, vec4(1.0 / 2.2)): final;
}
