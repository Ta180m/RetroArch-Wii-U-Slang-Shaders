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
   float YTR;
   float UTR;
   float VTR;
}params;

#pragma parameterYTR¡48.00.0255.01.0
#pragma parameterUTR¡7.00.0255.01.0
#pragma parameterVTR¡6.00.0255.01.0





layout(std140) uniform UBO
{
   mat4 MVP;
}global;























mat3x3 YUV = mat3x3(0.299, - 0.168736, 0.5, 0.587, - 0.331264, - 0.418688, 0.114, 0.5, - 0.081312);
     vec3 thresh = vec3(params . YTR, params . UTR, params . VTR)/ 255.0;

    bvec3 eq(vec3 A, vec3 B){
 return lessThanEqual(abs(A - B), thresh);
}

    bvec3 neq(vec3 A, vec3 B){
 return greaterThan(abs(A - B), thresh);
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 texCoord;
layout(location = 1) out vec4 t1;
layout(location = 2) out vec4 t2;
layout(location = 3) out vec4 t3;
layout(location = 4) out vec4 t4;
layout(location = 5) out vec4 t5;

void main()
{
   gl_Position = global . MVP * Position;
   texCoord = TexCoord;

         vec2 ps = vec2(params . SourceSize . z, params . SourceSize . w);
 float dx = ps . x;
 float dy = ps . y;

 t1 = texCoord . xxxy + vec4(- dx, 0, dx, - dy);
 t2 = texCoord . xxxy + vec4(- dx, 0, dx, 0);
 t3 = texCoord . xxxy + vec4(- dx, 0, dx, dy);
 t4 = texCoord . xyxy + vec4(0, - 2 * dy, - 2 * dx, 0);
 t5 = texCoord . xyxy + vec4(2 * dx, 0, 0, 2 * dy);
}

