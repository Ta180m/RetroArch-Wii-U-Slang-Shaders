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

layout(location = 0) in vec2 texCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 3) in vec4 t3;
layout(location = 4) in vec4 t4;
layout(location = 5) in vec4 t5;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{

      vec2 fp = floor(2.0 * fract(texCoord * params . SourceSize . xy));










      vec3 b = texture(Source, t1 . yw). xyz;
      vec3 d = texture(Source, t2 . xw). xyz;
      vec3 e = texture(Source, t2 . yw). xyz;
      vec3 f = texture(Source, t2 . zw). xyz;
      vec3 h = texture(Source, t3 . yw). xyz;

        mat4x3 tmp =(YUV * mat4x3(b, d, e, f));
      vec3 B = tmp[0], D = tmp[1], E = tmp[2], F = tmp[3], H =(YUV * h);

      vec3 A = texture(Source, t1 . xw). xyz;
      vec3 C = texture(Source, t1 . zw). xyz;
      vec3 G = texture(Source, t3 . xw). xyz;
      vec3 I = texture(Source, t3 . zw). xyz;

 tmp =(YUV * mat4x3(A, C, G, I));
 A = tmp[0], C = tmp[1], G = tmp[2], I = tmp[3];

      vec3 J = texture(Source, t4 . xy). xyz;
      vec3 K = texture(Source, t4 . zw). xyz;
      vec3 L = texture(Source, t5 . xy). xyz;
      vec3 M = texture(Source, t5 . zw). xyz;

 tmp =(YUV * mat4x3(J, K, L, M));
 J = tmp[0], K = tmp[1], L = tmp[2], M = tmp[3];


 bool par0 = neq(B, F)== bvec3(true)&& neq(D, H)== bvec3(true);
 bool par1 = neq(B, D)== bvec3(true)&& neq(F, H)== bvec3(true);


 bool AE = eq(A, E)== bvec3(true);
 bool CE = eq(C, E)== bvec3(true);
 bool EG = eq(E, G)== bvec3(true);
 bool EI = eq(E, I)== bvec3(true);


 bool art0 = CE || EG;
 bool art1 = AE || EI;


      vec3 E0 = eq(B, D)== bvec3(true)&& par0 == true &&(AE == false || art0 == true || eq(A, J)== bvec3(true)|| eq(A, K)== bvec3(true))? 0.5 *(b + d): e;
      vec3 E1 = eq(B, F)== bvec3(true)&& par1 == true &&(CE == false || art1 == true || eq(C, J)== bvec3(true)|| eq(C, L)== bvec3(true))? 0.5 *(b + f): e;
      vec3 E2 = eq(D, H)== bvec3(true)&& par1 == true &&(EG == false || art1 == true || eq(G, K)== bvec3(true)|| eq(G, M)== bvec3(true))? 0.5 *(h + d): e;
      vec3 E3 = eq(F, H)== bvec3(true)&& par0 == true &&(EI == false || art0 == true || eq(I, L)== bvec3(true)|| eq(I, M)== bvec3(true))? 0.5 *(h + f): e;


 FragColor = vec4(fp . y == 0 ?(fp . x == 0 ? E0 : E1):(fp . x == 0 ? E2 : E3), 1.0);
}
