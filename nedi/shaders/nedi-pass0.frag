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
















































     vec2 solve(mat2x2 A, vec2 b){ return vec2(determinant(mat2x2(b, A[1])), determinant(mat2x2(A[0], b)))/ determinant(A);}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
     vec2 tex = vTexCoord + vec2(0.0, 0.25 * params . SourceSize . w);

      vec4 c0 = texture(Source, tex);























   vec2 dir[4]= vec2[4](vec2(- 1, - 1), vec2(1, 1), vec2(- 1, 1), vec2(1, - 1));
   mat4x2 wind1 = mat4x2(vec2(- 1, - 1), vec2(1, 1), vec2(- 1, 1), vec2(1, - 1));
   mat4x2 wind2 = mat4x2(vec2(- 3, - 1), vec2(3, 1), vec2(- 1, 3), vec2(1, - 3));
   mat4x2 wind3 = mat4x2(vec2(- 3, 1), vec2(3, - 1), vec2(1, 3), vec2(- 1, - 3));
   mat4x2 wind4 = mat4x2(vec2(- 3, - 3), vec2(3, 3), vec2(- 3, 3), vec2(3, - 3));
 mat4x2 wind[4]= mat4x2[4](wind1, wind2, wind3, wind4);


        mat2x2 R = mat2x2(0., 0., 0., 0.);
      vec2 r = vec2(0., 0.);

        float m[4]= float[4](4.0, 1.0, 1.0, 1.0);


 for(int k = 0;k < 3;k += 1){
       vec4 y = vec4((dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][0])). rgb), vec3(.2126, .7152, .0722))+ 0.0),(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][1])). rgb), vec3(.2126, .7152, .0722))+ 0.0),(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][2])). rgb), vec3(.2126, .7152, .0722))+ 0.0),(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][3])). rgb), vec3(.2126, .7152, .0722))+ 0.0));
         mat4x2 C = mat4x2((vec2((dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][0]+ 2 * dir[0])). rgb), vec3(.2126, .7152, .0722))+ 0.0)+(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][0]+ 2 * dir[1])). rgb), vec3(.2126, .7152, .0722))+ 0.0),(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][0]+ 2 * dir[2])). rgb), vec3(.2126, .7152, .0722))+ 0.0)+(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][0]+ 2 * dir[3])). rgb), vec3(.2126, .7152, .0722))+ 0.0))),(vec2((dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][1]+ 2 * dir[0])). rgb), vec3(.2126, .7152, .0722))+ 0.0)+(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][1]+ 2 * dir[1])). rgb), vec3(.2126, .7152, .0722))+ 0.0),(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][1]+ 2 * dir[2])). rgb), vec3(.2126, .7152, .0722))+ 0.0)+(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][1]+ 2 * dir[3])). rgb), vec3(.2126, .7152, .0722))+ 0.0))),(vec2((dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][2]+ 2 * dir[0])). rgb), vec3(.2126, .7152, .0722))+ 0.0)+(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][2]+ 2 * dir[1])). rgb), vec3(.2126, .7152, .0722))+ 0.0),(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][2]+ 2 * dir[2])). rgb), vec3(.2126, .7152, .0722))+ 0.0)+(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][2]+ 2 * dir[3])). rgb), vec3(.2126, .7152, .0722))+ 0.0))),(vec2((dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][3]+ 2 * dir[0])). rgb), vec3(.2126, .7152, .0722))+ 0.0)+(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][3]+ 2 * dir[1])). rgb), vec3(.2126, .7152, .0722))+ 0.0),(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][3]+ 2 * dir[2])). rgb), vec3(.2126, .7152, .0722))+ 0.0)+(dot((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(wind[k][3]+ 2 * dir[3])). rgb), vec3(.2126, .7152, .0722))+ 0.0))));
  R +=(m[k]* C * transpose(C));
  r +=(m[k]* C * y);
 }


 float n = 24.0;
 R /= n;r /= n;


 float e = 0.0;
      vec2 a = solve(R + e * e *(mat2x2(1, 0, 0, 1)), r + e * e / 2.0);


 a = .25 + vec2(.4999, - .4999)* clamp(a[0]- a[1], - 1.0, 1.0);


        mat2x3 x = mat2x3((texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(dir[0])). rgb)+(texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(dir[1])). rgb),(texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(dir[2])). rgb)+(texture(Source, tex + vec2((0.49999 /(params . SourceSize . x)),(0.49999 /(params . SourceSize . y)))*(dir[3])). rgb))* mat2x2(a, a);
      vec3 c = vec3(x[0]. xyz);

  if(fract(tex . x *(params . SourceSize . x))< 0.499999)FragColor = c0;
 else FragColor = vec4(c, 1.0);
}
