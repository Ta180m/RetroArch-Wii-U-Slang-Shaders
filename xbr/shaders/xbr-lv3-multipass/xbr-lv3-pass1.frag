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

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec2 delta;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;

mat2x4 sym_vectors = mat2x4(1., 1., - 1., - 1., 1., - 1., - 1., 1.);

vec3 lines[12] = vec3[12](vec3(vec3(1.0, 1.0, 0.75)), vec3(vec3(1.0, 1.0, 0.5)), vec3(vec3(2.0, 1.0, 0.5)), vec3(vec3(1.0, 2.0, 0.5)), vec3(vec3(3.0, 1.0, 0.5)), vec3(vec3(1.0, 3.0, 0.5)), vec3(vec3(- 1.0, 2.0, 0.5)), vec3(vec3(2.0, - 1.0, 0.5)), vec3(vec3(- 1.0, 3.0, 0.5)), vec3(vec3(3.0, - 1.0, 0.5)), vec3(vec3(3.0, 1.0, 1.5)), vec3(vec3(1.0, 3.0, 1.5)
));


float remapFrom01(float v, float high)
{
 return(high * v + 0.5);
}


vec3 remapFrom01(vec3 v, vec3 low, vec3 high)
{
 return floor((mix(low, high, v))+ 0.5);
}

vec4 unpack_info(float i)
{
 vec4 info;
 info . x = floor((modf(i / 2.0, i))+ 0.5);
 info . y = floor((modf(i / 2.0, i))+ 0.5);
 info . z = floor((modf(i / 2.0, i))+ 0.5);
 info . w = i;

 return info;
}

void main()
{
 vec2 px;
 float pxr, pxd, line, edr3_nrl, edr3_ndu;

 vec2 pos = fract(vTexCoord * params . SourceSize . xy)- vec2(0.5, 0.5);
 vec2 dir = sign(pos);

 vec2 g1 = dir *(clamp(- dir . y * dir . x, 0.0, 1.0)* t1 . zw + clamp(dir . y * dir . x, 0.0, 1.0)* t1 . xy);
 vec2 g2 = dir *(clamp(dir . y * dir . x, 0.0, 1.0)* t1 . zw + clamp(- dir . y * dir . x, 0.0, 1.0)* t1 . xy);

 vec3 F = texture(Original, vTexCoord + g1). xyz;
 vec3 B = texture(Original, vTexCoord - g2). xyz;
 vec3 D = texture(Original, vTexCoord - g1). xyz;
 vec3 H = texture(Original, vTexCoord + g2). xyz;
 vec3 E = texture(Original, vTexCoord). xyz;

 vec3 F4 = texture(Original, vTexCoord + 2.0 * g1). xyz;
 vec3 I = texture(Original, vTexCoord + g1 + g2). xyz;
 vec3 H5 = texture(Original, vTexCoord + 2.0 * g2). xyz;

 vec4 icomp = floor((clamp((sym_vectors * dir), 0.0, 1.0))+ 0.5);
 float info = remapFrom01(dot(texture(Source, vTexCoord), icomp), 255.0);
 float info_nr = remapFrom01(dot(texture(Source, vTexCoord + g1), icomp), 255.0);
 float info_nd = remapFrom01(dot(texture(Source, vTexCoord + g2), icomp), 255.0);

 modf(info / 2.0f, info);
 modf(info / 2.0f, info);
 px . x = floor((modf(info / 2.0, info))+ 0.5);
 px . y = floor((modf(info / 2.0, info))+ 0.5);

 vec4 flags = unpack_info(info);

 edr3_nrl = floor((modf(info_nr / 2.0, info_nr))+ 0.5);
 modf(info_nr / 2.0, info_nr);
 modf(info_nr / 2.0, info_nr);
 pxr = floor((modf(info_nr / 2.0, info_nr))+ 0.5);

 modf(info_nd / 2.0, info_nd);
 edr3_ndu = floor((modf(info_nd / 2.0, info_nd))+ 0.5);
 modf(info_nd / 2.0, info_nd);
 pxd = floor((modf(info_nd / 2.0, info_nd))+ 0.5);

 float aux = floor((dot(vec4(8.0, 4.0, 2.0, 1.0), flags))+ 0.5);
 vec3 slep;


 if(aux >= 6.0)
 {
  slep =(aux == 6.0 ? lines[6]:(aux == 7.0 ? lines[7]:(aux == 8.0 ? lines[8]:(aux == 9.0 ? lines[9]:(aux == 10.0 ? lines[10]: lines[11])))));
 }
 else
 {
  slep =(aux == 0.0 ? lines[0]:(aux == 1.0 ? lines[1]:(aux == 2.0 ? lines[2]:(aux == 3.0 ? lines[3]:(aux == 4.0 ? lines[4]: lines[5])))));
 }


 vec2 fp =(dir . x * dir . y)> 0.0 ? abs(pos): abs(pos . yx);

 vec3 fp1 = vec3(fp . yx, - 1);

 vec3 color = E;
 float fx;

 if(aux < 10.0)
 {
  fx = clamp(dot(fp1, slep)/(2. * delta . x)+ 0.5, 0.0, 1.0);
  color = mix(E, mix(mix(H, F, px . y), mix(D, B, px . y), px . x), fx);
 }
 else if(edr3_nrl == 1.0)
 {
  fx = clamp(dot(fp1, lines[10])/(2. * delta . x)+ 0.5, 0.0, 1.0);
  color = mix(E, mix(I, F4, pxr), fx);
 }
 else if(edr3_ndu == 1.0)
 {
  fx = clamp(dot(fp1, lines[11])/(2. * delta . x)+ 0.5, 0.0, 1.0);
  color = mix(E, mix(H5, I, pxd), fx);
 }

   FragColor = vec4(color, 1.0);
}
