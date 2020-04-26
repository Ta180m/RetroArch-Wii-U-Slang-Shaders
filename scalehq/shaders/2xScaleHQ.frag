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

vec3 dt = vec3(1.0);

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec4 t1;
layout(location = 2) in vec4 t2;
layout(location = 3) in vec4 t3;
layout(location = 4) in vec4 t4;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

float mx = 0.325;
float k = - 0.250;
float max_w = 0.25;
float min_w = - 0.05;
float lum_add = 0.25;

void main()
{
   vec3 c00 = texture(Source, t1 . xy). xyz;
   vec3 c10 = texture(Source, t1 . zw). xyz;
   vec3 c20 = texture(Source, t2 . xy). xyz;
   vec3 c01 = texture(Source, t4 . zw). xyz;
   vec3 c11 = texture(Source, vTexCoord). xyz;
   vec3 c21 = texture(Source, t2 . zw). xyz;
   vec3 c02 = texture(Source, t4 . xy). xyz;
   vec3 c12 = texture(Source, t3 . zw). xyz;
   vec3 c22 = texture(Source, t3 . xy). xyz;

   float md1 = dot(abs(c00 - c22), dt);
   float md2 = dot(abs(c02 - c20), dt);

   float w1 = dot(abs(c22 - c11), dt)* md2;
   float w2 = dot(abs(c02 - c11), dt)* md1;
   float w3 = dot(abs(c00 - c11), dt)* md2;
   float w4 = dot(abs(c20 - c11), dt)* md1;

   float t1 = w1 + w3;
   float t2 = w2 + w4;
   float ww = max(t1, t2)+ 0.0001;

   c11 =(w1 * c00 + w2 * c20 + w3 * c22 + w4 * c02 + ww * c11)/(t1 + t2 + ww);

   float lc1 = k /(0.12 * dot(c10 + c12 + c11, dt)+ lum_add);
   float lc2 = k /(0.12 * dot(c01 + c21 + c11, dt)+ lum_add);

   w1 = clamp(lc1 * dot(abs(c11 - c10), dt)+ mx, min_w, max_w);
   w2 = clamp(lc2 * dot(abs(c11 - c21), dt)+ mx, min_w, max_w);
   w3 = clamp(lc1 * dot(abs(c11 - c12), dt)+ mx, min_w, max_w);
   w4 = clamp(lc2 * dot(abs(c11 - c01), dt)+ mx, min_w, max_w);
   FragColor = vec4(w1 * c10 + w2 * c21 + w3 * c12 + w4 * c01 +(1.0 - w1 - w2 - w3 - w4)* c11, 1.0);
}
