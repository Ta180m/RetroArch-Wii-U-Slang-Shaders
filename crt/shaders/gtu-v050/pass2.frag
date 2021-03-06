#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4


uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   float signalResolution;
   float signalResolutionI;
   float signalResolutionQ;
   float compositeConnection;
}params;

#pragma parametersignalResolution¡256.016.01024.016.0
#pragma parametersignalResolutionI¡83.01.0350.02.0
#pragma parametersignalResolutionQ¡25.01.0350.02.0

layout(std140) uniform UBO
{
   mat4 MVP;
}global;







#pragma parametercompositeConnection¡0.00.01.01.0


















layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 float offset = fract((vTexCoord . x * params . SourceSize . x)- 0.5);
 vec3 tempColor = vec3(0.0);
 float X;
 vec3 c;
 float range;
 if(params . compositeConnection > 0.0)
      range = ceil(0.5 + params . SourceSize . x / min(min(params . signalResolution, params . signalResolutionI), params . signalResolutionQ));
   else
      range = ceil(0.5 + params . SourceSize . x / params . signalResolution);

 float i;
   if(params . compositeConnection > 0.0){
      for(i = - range;i < range + 2.0;i ++){
                                       X =(offset -((offset -(i))));c =(texture(Source, vec2(vTexCoord . x - X * params . SourceSize . z, vTexCoord . y)). rgb);tempColor += vec3((c . x *(((3.14159265358 *(params . signalResolution * params . SourceSize . z)* min(abs(X)+ 0.5, 1.0 /(params . signalResolution * params . SourceSize . z)))+ sin((3.14159265358 *(params . signalResolution * params . SourceSize . z)* min(abs(X)+ 0.5, 1.0 /(params . signalResolution * params . SourceSize . z))))-(3.14159265358 *(params . signalResolution * params . SourceSize . z)* min(max(abs(X)- 0.5, - 1.0 /(params . signalResolution * params . SourceSize . z)), 1.0 /(params . signalResolution * params . SourceSize . z)))- sin((3.14159265358 *(params . signalResolution * params . SourceSize . z)* min(max(abs(X)- 0.5, - 1.0 /(params . signalResolution * params . SourceSize . z)), 1.0 /(params . signalResolution * params . SourceSize . z)))))/(2.0 * 3.14159265358))),(c . y *(((3.14159265358 *(params . signalResolutionI * params . SourceSize . z)* min(abs(X)+ 0.5, 1.0 /(params . signalResolutionI * params . SourceSize . z)))+ sin((3.14159265358 *(params . signalResolutionI * params . SourceSize . z)* min(abs(X)+ 0.5, 1.0 /(params . signalResolutionI * params . SourceSize . z))))-(3.14159265358 *(params . signalResolutionI * params . SourceSize . z)* min(max(abs(X)- 0.5, - 1.0 /(params . signalResolutionI * params . SourceSize . z)), 1.0 /(params . signalResolutionI * params . SourceSize . z)))- sin((3.14159265358 *(params . signalResolutionI * params . SourceSize . z)* min(max(abs(X)- 0.5, - 1.0 /(params . signalResolutionI * params . SourceSize . z)), 1.0 /(params . signalResolutionI * params . SourceSize . z)))))/(2.0 * 3.14159265358))),(c . z *(((3.14159265358 *(params . signalResolutionQ * params . SourceSize . z)* min(abs(X)+ 0.5, 1.0 /(params . signalResolutionQ * params . SourceSize . z)))+ sin((3.14159265358 *(params . signalResolutionQ * params . SourceSize . z)* min(abs(X)+ 0.5, 1.0 /(params . signalResolutionQ * params . SourceSize . z))))-(3.14159265358 *(params . signalResolutionQ * params . SourceSize . z)* min(max(abs(X)- 0.5, - 1.0 /(params . signalResolutionQ * params . SourceSize . z)), 1.0 /(params . signalResolutionQ * params . SourceSize . z)))- sin((3.14159265358 *(params . signalResolutionQ * params . SourceSize . z)* min(max(abs(X)- 0.5, - 1.0 /(params . signalResolutionQ * params . SourceSize . z)), 1.0 /(params . signalResolutionQ * params . SourceSize . z)))))/(2.0 * 3.14159265358))));
      }
   }
   else {
      for(i = - range;i < range + 2.0;i ++){
                             X =(offset -((offset -(i))));c =(texture(Source, vec2(vTexCoord . x - X * params . SourceSize . z, vTexCoord . y)). rgb);tempColor +=(c *(((3.14159265358 *(params . signalResolution * params . SourceSize . z)* min(abs(X)+ 0.5, 1.0 /(params . signalResolution * params . SourceSize . z)))+ sin((3.14159265358 *(params . signalResolution * params . SourceSize . z)* min(abs(X)+ 0.5, 1.0 /(params . signalResolution * params . SourceSize . z))))-(3.14159265358 *(params . signalResolution * params . SourceSize . z)* min(max(abs(X)- 0.5, - 1.0 /(params . signalResolution * params . SourceSize . z)), 1.0 /(params . signalResolution * params . SourceSize . z)))- sin((3.14159265358 *(params . signalResolution * params . SourceSize . z)* min(max(abs(X)- 0.5, - 1.0 /(params . signalResolution * params . SourceSize . z)), 1.0 /(params . signalResolution * params . SourceSize . z)))))/(2.0 * 3.14159265358)));
      }
   }
   if(params . compositeConnection > 0.0)
      tempColor = clamp(tempColor * mat3x3(1.0, 1.0, 1.0, 0.9563, - 0.2721, - 1.1070, 0.6210, - 0.6474, 1.7046), 0.0, 1.0);
   else
      tempColor = clamp(tempColor, 0.0, 1.0);


   FragColor = vec4(tempColor, 1.0);
}
