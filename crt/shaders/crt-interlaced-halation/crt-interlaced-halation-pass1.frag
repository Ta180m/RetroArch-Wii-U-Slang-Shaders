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
layout(location = 2) in vec4 t2;
layout(location = 3) in vec4 t3;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
                float wid = 2.0;

                float c1 = exp(- 1.0 / wid / wid);
                float c2 = exp(- 4.0 / wid / wid);
                float c3 = exp(- 9.0 / wid / wid);
                float c4 = exp(- 16.0 / wid / wid);
                float norm = 1.0 /(1.0 + 2.0 *(c1 + c2 + c3 + c4));

                vec4 sum = vec4(0.0, 0.0, 0.0, 0.0);

                sum += pow(texture(Source,(t1 . xw)), vec4(2.2))* vec4(c4);
                sum += pow(texture(Source,(t1 . yw)), vec4(2.2))* vec4(c3);
                sum += pow(texture(Source,(t1 . zw)), vec4(2.2))* vec4(c2);
                sum += pow(texture(Source,(t2 . xw)), vec4(2.2))* vec4(c1);
                sum += pow(texture(Source,(vTexCoord)), vec4(2.2));
                sum += pow(texture(Source,(t2 . zw)), vec4(2.2))* vec4(c1);
                sum += pow(texture(Source,(t3 . xw)), vec4(2.2))* vec4(c2);
                sum += pow(texture(Source,(t3 . yw)), vec4(2.2))* vec4(c3);
                sum += pow(texture(Source,(t3 . zw)), vec4(2.2))* vec4(c4);

                FragColor = vec4(pow(sum * vec4(norm), vec4(1.0 / 2.2)));
}
