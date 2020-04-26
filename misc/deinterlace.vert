#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4

uniform Push
{
   vec4 OutputSize;
   vec4 OriginalSize;
   vec4 SourceSize;
   uint FrameCount;
   float interlace_bff;
   float force_noninterlaced;
   float interlace_1080;
}registers;

layout(std140) uniform UBO
{
   mat4 MVP;
}global;

#pragma parameterinterlace_bff¡0.00.01.01.0
#pragma parameterforce_noninterlaced¡0.00.01.01.0
#pragma parameterinterlace_1080¡0.00.01.01.0







bool is_interlaced(float num_lines)
{













        bool sd_interlace =((num_lines > 288.5)&&(num_lines < 576.5)&&(registers . force_noninterlaced < 0.5));
        bool hd_interlace =(registers . interlace_1080 > 0.5);
        return(sd_interlace || hd_interlace);
}

vec3 tex2D_linearize(sampler2D tex, vec2 uv){
 return pow(texture(tex, uv). rgb, vec3(2.2));
}

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out float interlaced;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;
   interlaced = is_interlaced(registers . SourceSize . y)? 1.0 : 0.0;
}

