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
layout(location = 5) in vec4 t5;
layout(location = 6) in vec4 t6;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

float mx = 1.0;
float k = - 1.10;
float max_w = 0.75;
float min_w = 0.03;
float lum_add = 0.33;

void main()
{
   vec3 c = texture(Source, vTexCoord). xyz;
   vec3 i1 = texture(Source, t1 . xy). xyz;
   vec3 i2 = texture(Source, t2 . xy). xyz;
   vec3 i3 = texture(Source, t3 . xy). xyz;
   vec3 i4 = texture(Source, t4 . xy). xyz;
   vec3 o1 = texture(Source, t5 . xy). xyz;
   vec3 o3 = texture(Source, t6 . xy). xyz;
   vec3 o2 = texture(Source, t5 . zw). xyz;
   vec3 o4 = texture(Source, t6 . zw). xyz;
   vec3 s1 = texture(Source, t1 . zw). xyz;
   vec3 s2 = texture(Source, t2 . zw). xyz;
   vec3 s3 = texture(Source, t3 . zw). xyz;
   vec3 s4 = texture(Source, t4 . zw). xyz;

   float ko1 = dot(abs(o1 - c), dt);
   float ko2 = dot(abs(o2 - c), dt);
   float ko3 = dot(abs(o3 - c), dt);
   float ko4 = dot(abs(o4 - c), dt);

   float k1 = min(dot(abs(i1 - i3), dt), max(ko1, ko3));
   float k2 = min(dot(abs(i2 - i4), dt), max(ko2, ko4));

   float w1 = k2;if(ko3 < ko1)w1 *= ko3 / ko1;
   float w2 = k1;if(ko4 < ko2)w2 *= ko4 / ko2;
   float w3 = k2;if(ko1 < ko3)w3 *= ko1 / ko3;
   float w4 = k1;if(ko2 < ko4)w4 *= ko2 / ko4;

   c =(w1 * o1 + w2 * o2 + w3 * o3 + w4 * o4 + 0.001 * c)/(w1 + w2 + w3 + w4 + 0.001);
   w1 = k * dot(abs(i1 - c)+ abs(i3 - c), dt)/(0.125 * dot(i1 + i3, dt)+ lum_add);
   w2 = k * dot(abs(i2 - c)+ abs(i4 - c), dt)/(0.125 * dot(i2 + i4, dt)+ lum_add);
   w3 = k * dot(abs(s1 - c)+ abs(s3 - c), dt)/(0.125 * dot(s1 + s3, dt)+ lum_add);
   w4 = k * dot(abs(s2 - c)+ abs(s4 - c), dt)/(0.125 * dot(s2 + s4, dt)+ lum_add);

   w1 = clamp(w1 + mx, min_w, max_w);
   w2 = clamp(w2 + mx, min_w, max_w);
   w3 = clamp(w3 + mx, min_w, max_w);
   w4 = clamp(w4 + mx, min_w, max_w);

   FragColor = vec4((w1 *(i1 + i3)+ w2 *(i2 + i4)+ w3 *(s1 + s3)+ w4 *(s2 + s4)+ c)/(2.0 *(w1 + w2 + w3 + w4)+ 1.0), 1.0);
}
