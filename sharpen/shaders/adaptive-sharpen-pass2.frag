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
   float CURVE_HEIGHT;
   float VIDEO_LEVEL_OUT;
}params;

#pragma parameterCURVE_HEIGHT�1.00.32.00.1
#pragma parameterVIDEO_LEVEL_OUT�0.00.01.01.0




layout(std140) uniform UBO
{
   mat4 MVP;
}global;































































layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

vec4 frag_op(vec4 orig, vec2 coord, float c_edge, float px, float py)
{
 if(true == true)
 {
  if(c_edge > 24. || c_edge < - 0.5){ return vec4(0., 1.0, 0., 1.0);}
 }









 vec4 c[25] = vec4[25](vec4((vec4(clamp((orig). xyz, 0.0, 1.0),(orig). w))), vec4((texture(Source, coord + vec2(- 1 *(px), - 1 *(py))))), vec4((texture(Source, coord + vec2(0 *(px), - 1 *(py))))), vec4((texture(Source, coord + vec2(1 *(px), - 1 *(py))))), vec4((texture(Source, coord + vec2(- 1 *(px), 0 *(py))))), vec4((texture(Source, coord + vec2(1 *(px), 0 *(py))))), vec4((texture(Source, coord + vec2(- 1 *(px), 1 *(py))))), vec4((texture(Source, coord + vec2(0 *(px), 1 *(py))))), vec4((texture(Source, coord + vec2(1 *(px), 1 *(py))))), vec4((texture(Source, coord + vec2(0 *(px), - 2 *(py))))), vec4((texture(Source, coord + vec2(- 2 *(px), 0 *(py))))), vec4((texture(Source, coord + vec2(2 *(px), 0 *(py))))), vec4((texture(Source, coord + vec2(0 *(px), 2 *(py))))), vec4((texture(Source, coord + vec2(0 *(px), 3 *(py))))), vec4((texture(Source, coord + vec2(1 *(px), 2 *(py))))), vec4((texture(Source, coord + vec2(- 1 *(px), 2 *(py))))), vec4((texture(Source, coord + vec2(3 *(px), 0 *(py))))), vec4((texture(Source, coord + vec2(2 *(px), 1 *(py))))), vec4((texture(Source, coord + vec2(2 *(px), - 1 *(py))))), vec4((texture(Source, coord + vec2(- 3 *(px), 0 *(py))))), vec4((texture(Source, coord + vec2(- 2 *(px), 1 *(py))))), vec4((texture(Source, coord + vec2(- 2 *(px), - 1 *(py))))), vec4((texture(Source, coord + vec2(0 *(px), - 3 *(py))))), vec4((texture(Source, coord + vec2(1 *(px), - 2 *(py))))), vec4((texture(Source, coord + vec2(- 1 *(px), - 2 *(py))))));


 float maxedge =
                                                                    (max(max((max(max(c[1]. w, c[2]. w), max(c[3]. w, c[4]. w))),(max(max(c[5]. w, c[6]. w), max(c[7]. w, c[8]. w)))), max((max(max(c[9]. w, c[10]. w), max(c[11]. w, c[12]. w))), c[0]. w)))- 1.0;








 float sbe =(clamp((c[2]. w + c[9]. w + c[22]. w - 3 * 1.0 + 0.06)/(abs(maxedge)+ 0.03)- 0.85, 0.0, 1.0))*(clamp((c[7]. w + c[12]. w + c[13]. w - 3 * 1.0 + 0.06)/(abs(maxedge)+ 0.03)- 0.85, 0.0, 1.0))
           +(clamp((c[4]. w + c[10]. w + c[19]. w - 3 * 1.0 + 0.06)/(abs(maxedge)+ 0.03)- 0.85, 0.0, 1.0))*(clamp((c[5]. w + c[11]. w + c[16]. w - 3 * 1.0 + 0.06)/(abs(maxedge)+ 0.03)- 0.85, 0.0, 1.0))
           +(clamp((c[1]. w + c[24]. w + c[21]. w - 3 * 1.0 + 0.06)/(abs(maxedge)+ 0.03)- 0.85, 0.0, 1.0))*(clamp((c[8]. w + c[14]. w + c[17]. w - 3 * 1.0 + 0.06)/(abs(maxedge)+ 0.03)- 0.85, 0.0, 1.0))
           +(clamp((c[3]. w + c[23]. w + c[18]. w - 3 * 1.0 + 0.06)/(abs(maxedge)+ 0.03)- 0.85, 0.0, 1.0))*(clamp((c[6]. w + c[20]. w + c[15]. w - 3 * 1.0 + 0.06)/(abs(maxedge)+ 0.03)- 0.85, 0.0, 1.0));

 vec2 cs = mix(vec2(0.169, 0.253),
                   vec2(0.337, 0.504), smoothstep(2, 3.1, sbe));


 float c0_Y =(sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[0])* abs(c[0]), 0.0, 1.0). rgb)));

 float luma[25] = float[25](float(c0_Y), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[1])* abs(c[1]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[2])* abs(c[2]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[3])* abs(c[3]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[4])* abs(c[4]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[5])* abs(c[5]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[6])* abs(c[6]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[7])* abs(c[7]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[8])* abs(c[8]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[9])* abs(c[9]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[10])* abs(c[10]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[11])* abs(c[11]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[12])* abs(c[12]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[13])* abs(c[13]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[14])* abs(c[14]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[15])* abs(c[15]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[16])* abs(c[16]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[17])* abs(c[17]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[18])* abs(c[18]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[19])* abs(c[19]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[20])* abs(c[20]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[21])* abs(c[21]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[22])* abs(c[22]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[23])* abs(c[23]), 0.0, 1.0). rgb)))), float((sqrt(dot(vec3(0.2558, 0.6511, 0.0931), clamp((c[24])* abs(c[24]), 0.0, 1.0). rgb)))));


 vec3 W1 = vec3(0.5, 1.0, 1.41421356237);
 vec3 W2 = vec3(0.86602540378, 1.0, 0.5477225575);


 vec3 dW = pow(mix(W1, W2, smoothstep(0.3, 0.8, c_edge)), vec3(2.0));

 float mdiff_c0 = 0.02 + 3 *(abs(luma[0]- luma[2])+ abs(luma[0]- luma[4])
                           + abs(luma[0]- luma[5])+ abs(luma[0]- luma[7])
                           + 0.25 *(abs(luma[0]- luma[1])+ abs(luma[0]- luma[3])
                                  + abs(luma[0]- luma[6])+ abs(luma[0]- luma[8])));



 float weights[12] = float[12](float((min(mdiff_c0 /(abs(luma[1]- luma[24])+ abs(luma[1]- luma[21])+ abs(luma[1]- luma[2])+ abs(luma[1]- luma[4])+ 0.5 *(abs(luma[1]- luma[9])+ abs(luma[1]- luma[10]))), dW . y))), float((dW . x)), float((min(mdiff_c0 /(abs(luma[3]- luma[23])+ abs(luma[3]- luma[18])+ abs(luma[3]- luma[5])+ abs(luma[3]- luma[2])+ 0.5 *(abs(luma[3]- luma[9])+ abs(luma[3]- luma[11]))), dW . y))), float((dW . x)), float((dW . x)), float((min(mdiff_c0 /(abs(luma[6]- luma[4])+ abs(luma[6]- luma[20])+ abs(luma[6]- luma[15])+ abs(luma[6]- luma[7])+ 0.5 *(abs(luma[6]- luma[10])+ abs(luma[6]- luma[12]))), dW . y))), float((dW . x)), float((min(mdiff_c0 /(abs(luma[8]- luma[5])+ abs(luma[8]- luma[7])+ abs(luma[8]- luma[17])+ abs(luma[8]- luma[14])+ 0.5 *(abs(luma[8]- luma[12])+ abs(luma[8]- luma[11]))), dW . y))), float((min(mdiff_c0 /(abs(luma[9]- luma[2])+ abs(luma[9]- luma[24])+ abs(luma[9]- luma[23])+ abs(luma[9]- luma[22])+ 0.5 *(abs(luma[9]- luma[1])+ abs(luma[9]- luma[3]))), dW . z))), float((min(mdiff_c0 /(abs(luma[10]- luma[20])+ abs(luma[10]- luma[19])+ abs(luma[10]- luma[21])+ abs(luma[10]- luma[4])+ 0.5 *(abs(luma[10]- luma[1])+ abs(luma[10]- luma[6]))), dW . z))), float((min(mdiff_c0 /(abs(luma[11]- luma[17])+ abs(luma[11]- luma[5])+ abs(luma[11]- luma[18])+ abs(luma[11]- luma[16])+ 0.5 *(abs(luma[11]- luma[3])+ abs(luma[11]- luma[8]))), dW . z))), float((min(mdiff_c0 /(abs(luma[12]- luma[13])+ abs(luma[12]- luma[15])+ abs(luma[12]- luma[7])+ abs(luma[12]- luma[14])+ 0.5 *(abs(luma[12]- luma[6])+ abs(luma[12]- luma[8]))), dW . z))));

 weights[0]=(max(max((weights[8]+ weights[9])/ 4, weights[0]), 0.25)+ weights[0])/ 2;
 weights[2]=(max(max((weights[8]+ weights[10])/ 4, weights[2]), 0.25)+ weights[2])/ 2;
 weights[5]=(max(max((weights[9]+ weights[11])/ 4, weights[5]), 0.25)+ weights[5])/ 2;
 weights[7]=(max(max((weights[10]+ weights[11])/ 4, weights[7]), 0.25)+ weights[7])/ 2;


 float lowthrsum = 0.;
 float weightsum = 0.;
 float neg_laplace = 0.;


 for(int pix = 0;pix < 12;++ pix)
 {
  float x = clamp((c[pix + 1]. w - 1.0 - 0.01)/(0.11 - 0.01), 0.0, 1.0);
  float lowthr = x * x *(2.97 - 1.98 * x)+ 0.01;

  neg_laplace += pow(luma[pix + 1]+ 0.06, 2.4)*(weights[pix]* lowthr);
  weightsum += weights[pix]* lowthr;
  lowthrsum += lowthr / 12.;
 }

 neg_laplace = pow(abs(neg_laplace / weightsum),(1.0 / 2.4))- 0.06;


 float sharpen_val = params . CURVE_HEIGHT /(params . CURVE_HEIGHT * 0.4 * pow(abs(c_edge), 3.5)+ 0.5);


 float sharpdiff =(c0_Y - neg_laplace)*(lowthrsum * sharpen_val * 0.8 + 0.01);



 for(int i = 0;i < 3;++ i)
 {
  float temp;

  for(int i1 = i;i1 < 24 - i;i1 += 2)
  {
   temp = luma[i1];
   luma[i1]= min(luma[i1], luma[i1 + 1]);
   luma[i1 + 1]= max(temp, luma[i1 + 1]);
  }

  for(int i2 = 24 - i;i2 > i;i2 -= 2)
  {
   temp = luma[i];
   luma[i]= min(luma[i], luma[i2]);
   luma[i2]= max(temp, luma[i2]);

   temp = luma[24 - i];
   luma[24 - i]= max(luma[24 - i], luma[i2 - 1]);
   luma[i2 - 1]= min(temp, luma[i2 - 1]);
  }
 }

 float nmax =(max(luma[22]+ luma[23]* 2., c0_Y * 3.)+ luma[24])/ 4.;
 float nmin =(min(luma[2]+ luma[1]* 2., c0_Y * 3.)+ luma[0])/ 4.;


 float nmax_scale = nmax - c0_Y + min(0.003, 1.0001 - nmax);
 float nmin_scale = c0_Y - nmin + min(0.009, 0.0001 + nmin);

 nmax_scale = min(nmax_scale, 0.1 *(1. - 0.056)+ nmax_scale * 0.056);
 nmin_scale = min(nmin_scale, 0.1 *(1. - 0.056)+ nmin_scale * 0.056);


 sharpdiff =(pow((cs . x * pow(abs(max(sharpdiff, 0.)), 0.75)+ abs(1 - cs . x)* pow(abs((((exp(2. * min(abs(max(sharpdiff, 0.)), nmax_scale * 24.)/ nmax_scale)- 1.)/(exp(2 * min(abs(max(sharpdiff, 0.)), nmax_scale * 24.)/ nmax_scale)+ 1.))* nmax_scale)), 0.75)),(1.0 / 0.75)))
           -(pow((cs . y * pow(abs(min(sharpdiff, 0.)), 0.75)+ abs(1 - cs . y)* pow(abs((((exp(2. * min(abs(min(sharpdiff, 0.)), nmin_scale * 24.)/ nmin_scale)- 1.)/(exp(2 * min(abs(min(sharpdiff, 0.)), nmin_scale * 24.)/ nmin_scale)+ 1.))* nmin_scale)), 0.75)),(1.0 / 0.75)));


 float sharpdiff_lim = clamp(c0_Y + sharpdiff, 0.0, 1.0)- c0_Y;
 float satmul =(c0_Y + sharpdiff_lim + 0.03)/(c0_Y + 0.03);
 vec3 res = c0_Y +(sharpdiff_lim * 3 + sharpdiff)/ 4 +(c[0]. rgb - c0_Y)* satmul;

 return vec4((params . VIDEO_LEVEL_OUT == 1.0 ? orig . rgb +(res - c[0]. rgb): res), 1.0);
}

void main()
{
 vec2 tex = vTexCoord;

 float px = 1.0 / params . SourceSize . x;
 float py = 1.0 / params . SourceSize . y;

 vec4 orig = texture(Source, tex);
 float c_edge = orig . w - 1.0;

 FragColor = vec4(frag_op(orig, tex, c_edge, px, py));
}
