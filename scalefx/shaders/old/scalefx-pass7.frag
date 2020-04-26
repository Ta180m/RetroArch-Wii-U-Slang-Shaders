#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4










































#pragma namesfxp7


layout(std140) uniform UBO
{
   mat4 MVP;
   vec4 SourceSize;
};


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D sfxp3;




vec4 loadCrn(vec4 x){
 return floor(mod(x * 80.0 + 0.5, 9.0));
}


vec4 loadMid(vec4 x){
 return floor(mod(x * 8.888888 + 0.055555, 9.0));
}



void main()
{










 vec4 E = texture(Source, vTexCoord);


 vec4 crn = loadCrn(E);
 vec4 mid = loadMid(E);


 vec2 fp = floor(3.0 * fract(vTexCoord * SourceSize . xy));
 float sp = fp . y == 0. ?(fp . x == 0. ? crn . x : fp . x == 1. ? mid . x : crn . y):(fp . y == 1. ?(fp . x == 0. ? mid . w : fp . x == 1. ? 0. : mid . y):(fp . x == 0. ? crn . w : fp . x == 1. ? mid . z : crn . z));


 vec2 res = sp == 0 ? vec2(0, 0): sp == 1 ? vec2(- 1, 0): sp == 2 ? vec2(- 2, 0): sp == 3 ? vec2(1, 0): sp == 4 ? vec2(2, 0): sp == 5 ? vec2(0, - 1): sp == 6 ? vec2(0, - 2): sp == 7 ? vec2(0, 1): vec2(0, 2);


 FragColor = texture(sfxp3, vTexCoord + 1 / SourceSize . xy * res);

}
