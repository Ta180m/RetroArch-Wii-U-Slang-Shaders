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
}global;

vec3 dtt = vec3(65536.0, 255.0, 1.0);

float reduce(vec3 color)
{
 return dot(color, dtt);
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 3) in vec4 t3;
layout(location = 4) in vec4 t4;
layout(location = 5) in vec4 t5;
layout(location = 6) in vec4 t6;
layout(location = 7) in vec4 t7;
layout(location = 8) in vec4 t8;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;





int GET_RESULT(float A, float B, float C, float D)
{
   int x = 0;int y = 0;int r = 0;
   if(A == C)x += 1;else if(B == C)y += 1;
   if(A == D)x += 1;else if(B == D)y += 1;
   if(x <= 1)r += 1;
   if(y <= 1)r -= 1;
   return r;
}

void main()
{
   vec2 fp = fract(vTexCoord * global . SourceSize . xy);



   vec3 C0 = texture(Source, t1 . xy). xyz;
   vec3 C1 = texture(Source, t1 . zw). xyz;
   vec3 C2 = texture(Source, t2 . xy). xyz;
   vec3 D3 = texture(Source, t2 . zw). xyz;
   vec3 C3 = texture(Source, t3 . xy). xyz;
   vec3 C4 = texture(Source, vTexCoord). xyz;
   vec3 C5 = texture(Source, t3 . zw). xyz;
   vec3 D4 = texture(Source, t4 . xy). xyz;
   vec3 C6 = texture(Source, t4 . zw). xyz;
   vec3 C7 = texture(Source, t5 . xy). xyz;
   vec3 C8 = texture(Source, t5 . zw). xyz;
   vec3 D5 = texture(Source, t6 . xy). xyz;
   vec3 D0 = texture(Source, t6 . zw). xyz;
   vec3 D1 = texture(Source, t7 . xy). xyz;
   vec3 D2 = texture(Source, t7 . zw). xyz;
   vec3 D6 = texture(Source, t8 . xy). xyz;

   vec3 p00, p10, p01, p11;


   float c0 = reduce(C0);float c1 = reduce(C1);
   float c2 = reduce(C2);float c3 = reduce(C3);
   float c4 = reduce(C4);float c5 = reduce(C5);
   float c6 = reduce(C6);float c7 = reduce(C7);
   float c8 = reduce(C8);float d0 = reduce(D0);
   float d1 = reduce(D1);float d2 = reduce(D2);
   float d3 = reduce(D3);float d4 = reduce(D4);
   float d5 = reduce(D5);float d6 = reduce(D6);







   if(c4 != c8){
      if(c7 == c5){
         p01 = p10 = C7;
         if((c6 == c7)||(c5 == c2)){
            p00 = 0.25 *(3.0 * C7 + C4);
         } else {
            p00 = 0.5 *(C4 + C5);
         }

         if((c5 == d4)||(c7 == d1)){
            p11 = 0.25 *(3.0 * C7 + C8);
         } else {
            p11 = 0.5 *(C7 + C8);
         }
      } else {
         p11 = 0.125 *(6.0 * C8 + C7 + C5);
         p00 = 0.125 *(6.0 * C4 + C7 + C5);

         p10 = 0.125 *(6.0 * C7 + C4 + C8);
         p01 = 0.125 *(6.0 * C5 + C4 + C8);
      }
   } else {
      if(c7 != c5){
         p11 = p00 = C4;

         if((c1 == c4)||(c8 == d5)){
            p01 = 0.25 *(3.0 * C4 + C5);
         } else {
            p01 = 0.5 *(C4 + C5);
         }

         if((c8 == d2)||(c3 == c4)){
            p10 = 0.25 *(3.0 * C4 + C7);
         } else {
            p10 = 0.5 *(C7 + C8);
         }
      } else {
         int r = 0;
         r += GET_RESULT(c5, c4, c6, d1);
         r += GET_RESULT(c5, c4, c3, c1);
         r += GET_RESULT(c5, c4, d2, d5);
         r += GET_RESULT(c5, c4, c2, d4);

         if(r > 0){
            p01 = p10 = C7;
            p00 = p11 = 0.5 *(C4 + C5);
         } else if(r < 0){
            p11 = p00 = C4;
            p01 = p10 = 0.5 *(C4 + C5);
         } else {
            p11 = p00 = C4;
            p01 = p10 = C7;
         }
      }
   }


   p10 =(fp . x < 0.50)?(fp . y < 0.50 ? p00 : p10):(fp . y < 0.50 ? p01 : p11);

   FragColor = vec4(p10, 1.0);
}
