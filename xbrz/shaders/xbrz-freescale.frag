#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4





















































float DistYCbCr(vec3 pixA, vec3 pixB)
{
  vec3 w = vec3(0.2627, 0.6780, 0.0593);
  float scaleB = 0.5 /(1.0 - w . b);
  float scaleR = 0.5 /(1.0 - w . r);
  vec3 diff = pixA - pixB;
  float Y = dot(diff . rgb, w);
  float Cb = scaleB *(diff . b - Y);
  float Cr = scaleR *(diff . r - Y);

  return sqrt(((1.0 * Y)*(1.0 * Y))+(Cb * Cb)+(Cr * Cr));
}

bool IsPixEqual(const vec3 pixA, const vec3 pixB)
{
  return(DistYCbCr(pixA, pixB)< 30.0 / 255.0);
}

float get_left_ratio(vec2 center, vec2 origin, vec2 direction, vec2 scale)
{
  vec2 P0 = center - origin;
  vec2 proj = direction *(dot(P0, direction)/ dot(direction, direction));
  vec2 distv = P0 - proj;
  vec2 orth = vec2(- direction . y, direction . x);
  float side = sign(dot(P0, orth));
  float v = side * length(distv * scale);


  return smoothstep(- sqrt(2.0)/ 2.0, sqrt(2.0)/ 2.0, v);
}

uniform Push
{
   vec4 SourceSize;
   vec4 OutputSize;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;







void main()
{








  vec2 scale = params . OutputSize . xy * params . SourceSize . zw;
  vec2 pos = fract(vTexCoord * params . SourceSize . xy)- vec2(0.5, 0.5);
  vec2 coord = vTexCoord - pos * params . SourceSize . zw;

  vec3 A = texture(Source, coord + params . SourceSize . zw * vec2(- 1, - 1)). rgb;
  vec3 B = texture(Source, coord + params . SourceSize . zw * vec2(0, - 1)). rgb;
  vec3 C = texture(Source, coord + params . SourceSize . zw * vec2(1, - 1)). rgb;
  vec3 D = texture(Source, coord + params . SourceSize . zw * vec2(- 1, 0)). rgb;
  vec3 E = texture(Source, coord + params . SourceSize . zw * vec2(0, 0)). rgb;
  vec3 F = texture(Source, coord + params . SourceSize . zw * vec2(1, 0)). rgb;
  vec3 G = texture(Source, coord + params . SourceSize . zw * vec2(- 1, 1)). rgb;
  vec3 H = texture(Source, coord + params . SourceSize . zw * vec2(0, 1)). rgb;
  vec3 I = texture(Source, coord + params . SourceSize . zw * vec2(1, 1)). rgb;



  ivec4 blendResult = ivec4(0, 0, 0, 0);







  if(!(((E == F)&&(H == I))||((E == H)&&(F == I))))
  {
    float dist_H_F = DistYCbCr(G, E)+ DistYCbCr(E, C)+ DistYCbCr(texture(Source, coord + params . SourceSize . zw * vec2(0, 2)). rgb, I)+ DistYCbCr(I, texture(Source, coord + params . SourceSize . zw * vec2(2, 0)). rgb)+(4.0 * DistYCbCr(H, F));
    float dist_E_I = DistYCbCr(D, H)+ DistYCbCr(H, texture(Source, coord + params . SourceSize . zw * vec2(1, 2)). rgb)+ DistYCbCr(B, F)+ DistYCbCr(F, texture(Source, coord + params . SourceSize . zw * vec2(2, 1)). rgb)+(4.0 * DistYCbCr(E, I));
    bool dominantGradient =(3.6 * dist_H_F)< dist_E_I;
    blendResult . z =((dist_H_F < dist_E_I)&&(E != F)&&(E != H))?((dominantGradient)? 2 : 1): 0;
  }







  if(!(((D == E)&&(G == H))||((D == G)&&(E == H))))
  {
    float dist_G_E = DistYCbCr(texture(Source, coord + params . SourceSize . zw * vec2(- 2, 1)). rgb, D)+ DistYCbCr(D, B)+ DistYCbCr(texture(Source, coord + params . SourceSize . zw * vec2(- 1, 2)). rgb, H)+ DistYCbCr(H, F)+(4.0 * DistYCbCr(G, E));
    float dist_D_H = DistYCbCr(texture(Source, coord + params . SourceSize . zw * vec2(- 2, 0)). rgb, G)+ DistYCbCr(G, texture(Source, coord + params . SourceSize . zw * vec2(0, 2)). rgb)+ DistYCbCr(A, E)+ DistYCbCr(E, I)+(4.0 * DistYCbCr(D, H));
    bool dominantGradient =(3.6 * dist_D_H)< dist_G_E;
    blendResult . w =((dist_G_E > dist_D_H)&&(E != D)&&(E != H))?((dominantGradient)? 2 : 1): 0;
  }






  if(!(((B == C)&&(E == F))||((B == E)&&(C == F))))
  {
    float dist_E_C = DistYCbCr(D, B)+ DistYCbCr(B, texture(Source, coord + params . SourceSize . zw * vec2(1, - 2)). rgb)+ DistYCbCr(H, F)+ DistYCbCr(F, texture(Source, coord + params . SourceSize . zw * vec2(2, - 1)). rgb)+(4.0 * DistYCbCr(E, C));
    float dist_B_F = DistYCbCr(A, E)+ DistYCbCr(E, I)+ DistYCbCr(texture(Source, coord + params . SourceSize . zw * vec2(0, - 2)). rgb, C)+ DistYCbCr(C, texture(Source, coord + params . SourceSize . zw * vec2(2, 0)). rgb)+(4.0 * DistYCbCr(B, F));
    bool dominantGradient =(3.6 * dist_B_F)< dist_E_C;
    blendResult . y =((dist_E_C > dist_B_F)&&(E != B)&&(E != F))?((dominantGradient)? 2 : 1): 0;
  }






  if(!(((A == B)&&(D == E))||((A == D)&&(B == E))))
  {
    float dist_D_B = DistYCbCr(texture(Source, coord + params . SourceSize . zw * vec2(- 2, 0)). rgb, A)+ DistYCbCr(A, texture(Source, coord + params . SourceSize . zw * vec2(0, - 2)). rgb)+ DistYCbCr(G, E)+ DistYCbCr(E, C)+(4.0 * DistYCbCr(D, B));
    float dist_A_E = DistYCbCr(texture(Source, coord + params . SourceSize . zw * vec2(- 2, - 1)). rgb, D)+ DistYCbCr(D, H)+ DistYCbCr(texture(Source, coord + params . SourceSize . zw * vec2(- 1, - 2)). rgb, B)+ DistYCbCr(B, F)+(4.0 * DistYCbCr(A, E));
    bool dominantGradient =(3.6 * dist_D_B)< dist_A_E;
    blendResult . x =((dist_D_B < dist_A_E)&&(E != D)&&(E != B))?((dominantGradient)? 2 : 1): 0;
  }

  vec3 res = E;






  if(blendResult . z != 0)
  {
    float dist_F_G = DistYCbCr(F, G);
    float dist_H_C = DistYCbCr(H, C);
    bool doLineBlend =(blendResult . z == 2 ||
                !((blendResult . y != 0 && ! IsPixEqual(E, G))||(blendResult . w != 0 && ! IsPixEqual(E, C))||
                  (IsPixEqual(G, H)&& IsPixEqual(H, I)&& IsPixEqual(I, F)&& IsPixEqual(F, C)&& ! IsPixEqual(E, I))));

    vec2 origin = vec2(0.0, 1.0 / sqrt(2.0));
    vec2 direction = vec2(1.0, - 1.0);
    if(doLineBlend)
    {
      bool haveShallowLine =(2.2 * dist_F_G <= dist_H_C)&&(E != G)&&(D != G);
      bool haveSteepLine =(2.2 * dist_H_C <= dist_F_G)&&(E != C)&&(B != C);
      origin = haveShallowLine ? vec2(0.0, 0.25): vec2(0.0, 0.5);
      direction . x += haveShallowLine ? 1.0 : 0.0;
      direction . y -= haveSteepLine ? 1.0 : 0.0;
    }

    vec3 blendPix = mix(H, F, step(DistYCbCr(E, F), DistYCbCr(E, H)));
    res = mix(res, blendPix, get_left_ratio(pos, origin, direction, scale));
  }






  if(blendResult . w != 0)
  {
    float dist_H_A = DistYCbCr(H, A);
    float dist_D_I = DistYCbCr(D, I);
    bool doLineBlend =(blendResult . w == 2 ||
                !((blendResult . z != 0 && ! IsPixEqual(E, A))||(blendResult . x != 0 && ! IsPixEqual(E, I))||
                  (IsPixEqual(A, D)&& IsPixEqual(D, G)&& IsPixEqual(G, H)&& IsPixEqual(H, I)&& ! IsPixEqual(E, G))));

    vec2 origin = vec2(- 1.0 / sqrt(2.0), 0.0);
    vec2 direction = vec2(1.0, 1.0);
    if(doLineBlend)
    {
      bool haveShallowLine =(2.2 * dist_H_A <= dist_D_I)&&(E != A)&&(B != A);
      bool haveSteepLine =(2.2 * dist_D_I <= dist_H_A)&&(E != I)&&(F != I);
      origin = haveShallowLine ? vec2(- 0.25, 0.0): vec2(- 0.5, 0.0);
      direction . y += haveShallowLine ? 1.0 : 0.0;
      direction . x += haveSteepLine ? 1.0 : 0.0;
    }
    origin = origin;
    direction = direction;

    vec3 blendPix = mix(H, D, step(DistYCbCr(E, D), DistYCbCr(E, H)));
    res = mix(res, blendPix, get_left_ratio(pos, origin, direction, scale));
  }






  if(blendResult . y != 0)
  {
    float dist_B_I = DistYCbCr(B, I);
    float dist_F_A = DistYCbCr(F, A);
    bool doLineBlend =(blendResult . y == 2 ||
                !((blendResult . x != 0 && ! IsPixEqual(E, I))||(blendResult . z != 0 && ! IsPixEqual(E, A))||
                  (IsPixEqual(I, F)&& IsPixEqual(F, C)&& IsPixEqual(C, B)&& IsPixEqual(B, A)&& ! IsPixEqual(E, C))));

    vec2 origin = vec2(1.0 / sqrt(2.0), 0.0);
    vec2 direction = vec2(- 1.0, - 1.0);

    if(doLineBlend)
    {
      bool haveShallowLine =(2.2 * dist_B_I <= dist_F_A)&&(E != I)&&(H != I);
      bool haveSteepLine =(2.2 * dist_F_A <= dist_B_I)&&(E != A)&&(D != A);
      origin = haveShallowLine ? vec2(0.25, 0.0): vec2(0.5, 0.0);
      direction . y -= haveShallowLine ? 1.0 : 0.0;
      direction . x -= haveSteepLine ? 1.0 : 0.0;
    }

    vec3 blendPix = mix(F, B, step(DistYCbCr(E, B), DistYCbCr(E, F)));
    res = mix(res, blendPix, get_left_ratio(pos, origin, direction, scale));
  }






  if(blendResult . x != 0)
  {
    float dist_D_C = DistYCbCr(D, C);
    float dist_B_G = DistYCbCr(B, G);
    bool doLineBlend =(blendResult . x == 2 ||
                !((blendResult . w != 0 && ! IsPixEqual(E, C))||(blendResult . y != 0 && ! IsPixEqual(E, G))||
                  (IsPixEqual(C, B)&& IsPixEqual(B, A)&& IsPixEqual(A, D)&& IsPixEqual(D, G)&& ! IsPixEqual(E, A))));

    vec2 origin = vec2(0.0, - 1.0 / sqrt(2.0));
    vec2 direction = vec2(- 1.0, 1.0);
    if(doLineBlend)
    {
      bool haveShallowLine =(2.2 * dist_D_C <= dist_B_G)&&(E != C)&&(F != C);
      bool haveSteepLine =(2.2 * dist_B_G <= dist_D_C)&&(E != G)&&(H != G);
      origin = haveShallowLine ? vec2(0.0, - 0.25): vec2(0.0, - 0.5);
      direction . x -= haveShallowLine ? 1.0 : 0.0;
      direction . y += haveSteepLine ? 1.0 : 0.0;
    }

    vec3 blendPix = mix(D, B, step(DistYCbCr(E, B), DistYCbCr(E, D)));
    res = mix(res, blendPix, get_left_ratio(pos, origin, direction, scale));
  }

  FragColor = vec4(res, 1.0);
}
