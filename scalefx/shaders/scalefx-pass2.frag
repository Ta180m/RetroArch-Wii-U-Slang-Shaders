#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4










































uniform Push
{
   vec4 SourceSize;
}params;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D scalefx_pass0;









vec4 dom(vec3 x, vec3 y, vec3 z, vec3 w){
 return 2 * vec4(x . y, y . y, z . y, w . y)-(vec4(x . x, y . x, z . x, w . x)+ vec4(x . z, y . z, z . z, w . z));
}


float clear(vec2 crn, vec2 a, vec2 b){
 return(crn . x >= max(min(a . x, a . y), min(b . x, b . y)))&&(crn . y >= max(min(a . x, b . y), min(b . x, a . y)))? 1. : 0.;
}


void main()
{














 vec4 A = textureOffset(scalefx_pass0, vTexCoord, ivec2(- 1, - 1)), B = textureOffset(scalefx_pass0, vTexCoord, ivec2(0, - 1));
 vec4 D = textureOffset(scalefx_pass0, vTexCoord, ivec2(- 1, 0)), E = textureOffset(scalefx_pass0, vTexCoord, ivec2(0, 0)), F = textureOffset(scalefx_pass0, vTexCoord, ivec2(1, 0));
 vec4 G = textureOffset(scalefx_pass0, vTexCoord, ivec2(- 1, 1)), H = textureOffset(scalefx_pass0, vTexCoord, ivec2(0, 1)), I = textureOffset(scalefx_pass0, vTexCoord, ivec2(1, 1));


 vec4 As = textureOffset(Source, vTexCoord, ivec2(- 1, - 1)), Bs = textureOffset(Source, vTexCoord, ivec2(0, - 1)), Cs = textureOffset(Source, vTexCoord, ivec2(1, - 1));
 vec4 Ds = textureOffset(Source, vTexCoord, ivec2(- 1, 0)), Es = textureOffset(Source, vTexCoord, ivec2(0, 0)), Fs = textureOffset(Source, vTexCoord, ivec2(1, 0));
 vec4 Gs = textureOffset(Source, vTexCoord, ivec2(- 1, 1)), Hs = textureOffset(Source, vTexCoord, ivec2(0, 1)), Is = textureOffset(Source, vTexCoord, ivec2(1, 1));


 vec4 jSx = vec4(As . z, Bs . w, Es . x, Ds . y), jDx = dom(As . yzw, Bs . zwx, Es . wxy, Ds . xyz);
 vec4 jSy = vec4(Bs . z, Cs . w, Fs . x, Es . y), jDy = dom(Bs . yzw, Cs . zwx, Fs . wxy, Es . xyz);
 vec4 jSz = vec4(Es . z, Fs . w, Is . x, Hs . y), jDz = dom(Es . yzw, Fs . zwx, Is . wxy, Hs . xyz);
 vec4 jSw = vec4(Ds . z, Es . w, Hs . x, Gs . y), jDw = dom(Ds . yzw, Es . zwx, Hs . wxy, Gs . xyz);



 vec4 zero4 = vec4(0);
 vec4 jx = min((1 - step(jDx, zero4))*(step(jDx . yzwx, zero4)* step(jDx . wxyz, zero4)+(1 - step(jDx + jDx . zwxy, jDx . yzwx + jDx . wxyz))), 1);
 vec4 jy = min((1 - step(jDy, zero4))*(step(jDy . yzwx, zero4)* step(jDy . wxyz, zero4)+(1 - step(jDy + jDy . zwxy, jDy . yzwx + jDy . wxyz))), 1);
 vec4 jz = min((1 - step(jDz, zero4))*(step(jDz . yzwx, zero4)* step(jDz . wxyz, zero4)+(1 - step(jDz + jDz . zwxy, jDz . yzwx + jDz . wxyz))), 1);
 vec4 jw = min((1 - step(jDw, zero4))*(step(jDw . yzwx, zero4)* step(jDw . wxyz, zero4)+(1 - step(jDw + jDw . zwxy, jDw . yzwx + jDw . wxyz))), 1);



 vec4 res;
 res . x = min(jx . z +(1 -(jx . y))*(1 -(jx . w))*(1 - step(jSx . z, 0))*(jx . x +(1 - step(jSx . x + jSx . z, jSx . y + jSx . w))), 1);
 res . y = min(jy . w +(1 -(jy . z))*(1 -(jy . x))*(1 - step(jSy . w, 0))*(jy . y +(1 - step(jSy . y + jSy . w, jSy . x + jSy . z))), 1);
 res . z = min(jz . x +(1 -(jz . w))*(1 -(jz . y))*(1 - step(jSz . x, 0))*(jz . z +(1 - step(jSz . x + jSz . z, jSz . y + jSz . w))), 1);
 res . w = min(jw . y +(1 -(jw . x))*(1 -(jw . z))*(1 - step(jSw . y, 0))*(jw . w +(1 - step(jSw . y + jSw . w, jSw . x + jSw . z))), 1);



 res = min(res *(vec4(jx . z, jy . w, jz . x, jw . y)+(1 -(res . wxyz * res . yzwx))), 1);




 vec4 clr;
 clr . x = clear(vec2(D . z, E . x), vec2(D . w, E . y), vec2(A . w, D . y));
 clr . y = clear(vec2(F . x, E . z), vec2(E . w, E . y), vec2(B . w, F . y));
 clr . z = clear(vec2(H . z, I . x), vec2(E . w, H . y), vec2(H . w, I . y));
 clr . w = clear(vec2(H . x, G . z), vec2(D . w, H . y), vec2(G . w, G . y));

 vec4 h = vec4(min(D . w, A . w), min(E . w, B . w), min(E . w, H . w), min(D . w, G . w));
 vec4 v = vec4(min(E . y, D . y), min(E . y, F . y), min(H . y, I . y), min(H . y, G . y));

 vec4 orien =(1 - step(h + vec4(D . w, E . w, E . w, D . w), v + vec4(E . y, E . y, H . y, H . y)));
 vec4 hori =(1 - step(v, h))* clr;
 vec4 vert =(1 - step(h, v))* clr;

 FragColor =(res + 2 * hori + 4 * vert + 8 * orien)/ 15;
}
