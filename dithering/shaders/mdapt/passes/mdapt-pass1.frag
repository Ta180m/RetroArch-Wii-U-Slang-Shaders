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




float and_(float a, float b){
 return min(a, b);
}

float and_(float a, float b, float c){
 return min(a, min(b, c));
}

float or_(float a, float b){
 return max(a, b);
}

float or_(float a, float b, float c, float d, float e){
 return max(a, max(b, max(c, max(d, e))));
}

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{






 vec3 C = texture(Source, vTexCoord + vec2((0.),(0.))* params . SourceSize . zw). xyz;
 vec3 L = texture(Source, vTexCoord + vec2((- 1.),(0.))* params . SourceSize . zw). xyz;
 vec3 R = texture(Source, vTexCoord + vec2((1.),(0.))* params . SourceSize . zw). xyz;
 vec3 D = texture(Source, vTexCoord + vec2((0.),(1.))* params . SourceSize . zw). xyz;
 vec3 U = texture(Source, vTexCoord + vec2((0.),(- 1.))* params . SourceSize . zw). xyz;

 float UL = texture(Source, vTexCoord + vec2((- 1.),(- 1.))* params . SourceSize . zw). z;
 float UR = texture(Source, vTexCoord + vec2((1.),(- 1.))* params . SourceSize . zw). z;
 float DL = texture(Source, vTexCoord + vec2((- 1.),(1.))* params . SourceSize . zw). z;
 float DR = texture(Source, vTexCoord + vec2((1.),(1.))* params . SourceSize . zw). z;


 float prCB = or_(C . z,
  and_(L . z, R . z, or_(U . x, D . x)),
  and_(U . z, D . z, or_(L . y, R . y)),
  and_(C . x, or_(and_(UL, UR), and_(DL, DR))),
  and_(C . y, or_(and_(UL, DL), and_(UR, DR))));
   FragColor = vec4(C . x, prCB, 0.0, 0.0);
}
