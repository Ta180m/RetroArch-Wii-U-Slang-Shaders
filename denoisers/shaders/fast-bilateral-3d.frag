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
   float FB_RES;
   float SIGMA_R;
   float SIGMA_D;
}params;

#pragma parameterFB_RES¡2.01.08.01.0
#pragma parameterSIGMA_R¡0.40.02.00.1
#pragma parameterSIGMA_D¡3.00.010.00.2

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;











void main()
{
      float ds, sd2, si2;
      float sigma_d = params . SIGMA_D;
      float sigma_r = params . SIGMA_R * 0.04;

      vec3 color = vec3(0.0, 0.0, 0.0);
      vec3 wsum = vec3(0.0, 0.0, 0.0);
      vec3 weight;

      vec2 dx = vec2(params . FB_RES, 0.0)* params . SourceSize . zw;
      vec2 dy = vec2(0.0, params . FB_RES)* params . SourceSize . zw;

      sd2 = 2.0 * sigma_d * sigma_d;
      si2 = 2.0 * sigma_r * sigma_r;

      vec2 tc = vTexCoord;

      vec3 col;
      vec3 center =(texture(Source, tc + 0 * dx + 0 * dy). xyz);


               { col =(texture(Source, tc + - 2 * dx + - 2 * dy). xyz);ds = - 2 * - 2 + - 2 * - 2;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + - 1 * dx + - 2 * dy). xyz);ds = - 1 * - 1 + - 2 * - 2;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 0 * dx + - 2 * dy). xyz);ds = 0 * 0 + - 2 * - 2;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 1 * dx + - 2 * dy). xyz);ds = 1 * 1 + - 2 * - 2;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 2 * dx + - 2 * dy). xyz);ds = 2 * 2 + - 2 * - 2;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + - 2 * dx + - 1 * dy). xyz);ds = - 2 * - 2 + - 1 * - 1;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + - 1 * dx + - 1 * dy). xyz);ds = - 1 * - 1 + - 1 * - 1;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 0 * dx + - 1 * dy). xyz);ds = 0 * 0 + - 1 * - 1;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 1 * dx + - 1 * dy). xyz);ds = 1 * 1 + - 1 * - 1;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 2 * dx + - 1 * dy). xyz);ds = 2 * 2 + - 1 * - 1;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + - 2 * dx + 0 * dy). xyz);ds = - 2 * - 2 + 0 * 0;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + - 1 * dx + 0 * dy). xyz);ds = - 1 * - 1 + 0 * 0;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 0 * dx + 0 * dy). xyz);ds = 0 * 0 + 0 * 0;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 1 * dx + 0 * dy). xyz);ds = 1 * 1 + 0 * 0;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 2 * dx + 0 * dy). xyz);ds = 2 * 2 + 0 * 0;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + - 2 * dx + 1 * dy). xyz);ds = - 2 * - 2 + 1 * 1;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + - 1 * dx + 1 * dy). xyz);ds = - 1 * - 1 + 1 * 1;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 0 * dx + 1 * dy). xyz);ds = 0 * 0 + 1 * 1;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 1 * dx + 1 * dy). xyz);ds = 1 * 1 + 1 * 1;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 2 * dx + 1 * dy). xyz);ds = 2 * 2 + 1 * 1;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + - 2 * dx + 2 * dy). xyz);ds = - 2 * - 2 + 2 * 2;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + - 1 * dx + 2 * dy). xyz);ds = - 1 * - 1 + 2 * 2;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 0 * dx + 2 * dy). xyz);ds = 0 * 0 + 2 * 2;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 1 * dx + 2 * dy). xyz);ds = 1 * 1 + 2 * 2;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}
               { col =(texture(Source, tc + 2 * dx + 2 * dy). xyz);ds = 2 * 2 + 2 * 2;weight = exp(- ds / sd2)* exp(-(col - center)*(col - center)/ si2);color +=(weight * col);wsum += weight;}


      color /= wsum;

      FragColor = vec4(color, 1.);
}
