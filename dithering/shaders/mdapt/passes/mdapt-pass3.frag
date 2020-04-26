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




bool eq(vec3 A, vec3 B){
 return(A == B);
}

float and_(float a, float b){
 return min(a, b);
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

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;

void main()
{






 vec4 C = texture(Source, vTexCoord + vec2((0.),(0.))* params . SourceSize . zw);vec3 c = texture(Original, vTexCoord + vec2((0.),(0.))* params . SourceSize . zw). xyz;
 vec2 L = texture(Source, vTexCoord + vec2((- 1.),(0.))* params . SourceSize . zw). xy;vec3 l = texture(Original, vTexCoord + vec2((- 1.),(0.))* params . SourceSize . zw). xyz;
 vec2 R = texture(Source, vTexCoord + vec2((1.),(0.))* params . SourceSize . zw). xy;vec3 r = texture(Original, vTexCoord + vec2((1.),(0.))* params . SourceSize . zw). xyz;
 vec2 U = texture(Source, vTexCoord + vec2((0.),(- 1.))* params . SourceSize . zw). xy;vec3 u = texture(Original, vTexCoord + vec2((0.),(- 1.))* params . SourceSize . zw). xyz;
 vec2 D = texture(Source, vTexCoord + vec2((0.),(1.))* params . SourceSize . zw). xy;vec3 d = texture(Original, vTexCoord + vec2((0.),(1.))* params . SourceSize . zw). xyz;
 float UL = texture(Source, vTexCoord + vec2((- 1.),(- 1.))* params . SourceSize . zw). y;vec3 ul = texture(Original, vTexCoord + vec2((- 1.),(- 1.))* params . SourceSize . zw). xyz;
 float UR = texture(Source, vTexCoord + vec2((1.),(- 1.))* params . SourceSize . zw). y;vec3 ur = texture(Original, vTexCoord + vec2((1.),(- 1.))* params . SourceSize . zw). xyz;
 float DL = texture(Source, vTexCoord + vec2((- 1.),(1.))* params . SourceSize . zw). y;vec3 dl = texture(Original, vTexCoord + vec2((- 1.),(1.))* params . SourceSize . zw). xyz;
 float DR = texture(Source, vTexCoord + vec2((1.),(1.))* params . SourceSize . zw). y;vec3 dr = texture(Original, vTexCoord + vec2((1.),(1.))* params . SourceSize . zw). xyz;


 C . xy = or_(C . xy, and_(C . zw, or_(L, R, U, D)));


 C . y = or_(C . y, min(U . y, float(eq(c, u))), min(D . y, float(eq(c, d))), min(L . y, float(eq(c, l))), min(R . y, float(eq(c, r))), min(UL, float(eq(c, ul))), min(UR, float(eq(c, ur))), min(DL, float(eq(c, dl))), min(DR, float(eq(c, dr))));

   FragColor = vec4(C);
}
