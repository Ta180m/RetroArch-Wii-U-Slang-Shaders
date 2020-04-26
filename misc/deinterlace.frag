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

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in float interlaced;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
        vec2 v_step = vec2(0.0, registers . SourceSize . w);
        vec3 curr_line = tex2D_linearize(
            Source, vTexCoord). rgb;
        vec3 last_line = tex2D_linearize(
            Source, vTexCoord - v_step). rgb;
        vec3 next_line = tex2D_linearize(
            Source, vTexCoord + v_step). rgb;
        vec3 interpolated_line = 0.5 *(last_line + next_line);

        float modulus = interlaced + 1.0;
        float field_offset =
            mod(registers . FrameCount + registers . interlace_bff, modulus);
        float curr_line_texel = vTexCoord . y * registers . SourceSize . y;

        float line_num_last = floor(curr_line_texel - 0.4995);
        float wrong_field = mod(line_num_last + field_offset, modulus);

        vec3 color = mix(curr_line, interpolated_line, wrong_field);
   FragColor = vec4(pow(color, vec3(1.0 / 2.2)), 1.0);
}
