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
   float shockMagnitude;
}params;

#pragma parametershockMagnitude¡0.00.04.00.1

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;



vec3 ones = vec3(1.0, 1.0, 1.0);

void main()
{
    vec3 inc = vec3(params . OutputSize . zw, 0.0);

    vec3 curCol = texture(Source, vTexCoord). xyz;
    vec3 upCol = texture(Source, vTexCoord + inc . zy). xyz;
    vec3 downCol = texture(Source, vTexCoord - inc . zy). xyz;
    vec3 rightCol = texture(Source, vTexCoord + inc . xz). xyz;
    vec3 leftCol = texture(Source, vTexCoord - inc . xz). xyz;

    vec3 Convexity = 4.0 * curCol - rightCol - leftCol - upCol - downCol;

    vec2 Diffusion = vec2(dot((rightCol - leftCol)* Convexity, ones),
                             dot((upCol - downCol)* Convexity, ones));

    Diffusion *= params . shockMagnitude /(length(Diffusion)+ 0.00001);

    curCol +=(Diffusion . x > 0 ? Diffusion . x * rightCol :

             - Diffusion . x * leftCol)+

            (Diffusion . y > 0 ? Diffusion . y * upCol :

             - Diffusion . y * downCol);

    FragColor = vec4(curCol /(1 + dot(abs(Diffusion), ones . xy)), 1.0);
}
