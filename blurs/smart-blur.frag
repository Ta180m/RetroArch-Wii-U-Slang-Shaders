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
   float SB_RED_THRESHOLD;
   float SB_GREEN_THRESHOLD;
   float SB_BLUE_THRESHOLD;
}params;

#pragma parameterSB_RED_THRESHOLDĄ0.20.00.60.01
#pragma parameterSB_GREEN_THRESHOLDĄ0.20.00.60.01
#pragma parameterSB_BLUE_THRESHOLDĄ0.20.00.60.01

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 3) in vec4 t3;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;




bool eq(vec3 c1, vec3 c2){
    vec3 df = abs(c1 - c2);
    return(df . r < params . SB_RED_THRESHOLD)&&(df . g < params . SB_GREEN_THRESHOLD)&&(df . b < params . SB_BLUE_THRESHOLD);
}







void main()
{
 vec3 A = texture(Source, t1 . xw). xyz;
 vec3 B = texture(Source, t1 . yw). xyz;
 vec3 C = texture(Source, t1 . zw). xyz;
 vec3 D = texture(Source, t2 . xw). xyz;
 vec3 E = texture(Source, t2 . yw). xyz;
 vec3 F = texture(Source, t2 . zw). xyz;
 vec3 G = texture(Source, t3 . xw). xyz;
 vec3 H = texture(Source, t3 . yw). xyz;
 vec3 I = texture(Source, t3 . zw). xyz;

 vec3 sum = vec3(0., 0., 0.);

 if(eq(E, F)&& eq(E, H)&& eq(E, I)&& eq(E, B)&& eq(E, C)&& eq(E, A)&& eq(E, D)&& eq(E, G))
 {
  sum =(E + A + C + D + F + G + I + B + H)/ 9.0;
  E = sum;
 }

 FragColor = vec4(E, 1.0);
}
