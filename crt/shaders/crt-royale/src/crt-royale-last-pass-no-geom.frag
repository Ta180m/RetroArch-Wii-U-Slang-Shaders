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
   float crt_gamma;
   float lcd_gamma;
   float levels_contrast;
   float halation_weight;
   float diffusion_weight;
   float bloom_underestimate_levels;
   float bloom_excess;
   float beam_min_sigma;
   float beam_max_sigma;
   float beam_spot_power;
   float beam_min_shape;
   float beam_max_shape;
   float beam_shape_power;
   float beam_horiz_filter;
   float beam_horiz_sigma;
   float beam_horiz_linear_rgb_weight;
   float convergence_offset_x_r;
   float convergence_offset_x_g;
   float convergence_offset_x_b;
   float convergence_offset_y_r;
   float convergence_offset_y_g;
   float convergence_offset_y_b;
   float mask_type;
   float mask_sample_mode_desired;
   float mask_num_triads_desired;
   float mask_triad_size_desired;
   float mask_specify_num_triads;
   float aa_subpixel_r_offset_x_runtime;
   float aa_subpixel_r_offset_y_runtime;
   float aa_cubic_c;
   float aa_gauss_sigma;
   float geom_mode_runtime;
   float geom_radius;
   float geom_view_dist;
   float geom_tilt_angle_x;
   float geom_tilt_angle_y;
   float geom_aspect_ratio_x;
   float geom_aspect_ratio_y;
   float geom_overscan_x;
   float geom_overscan_y;
   float border_size;
   float border_darkness;
   float border_compress;
   float interlace_bff;
   float interlace_1080i;
   vec4 MASKED_SCANLINESSize;
   vec4 HALATION_BLURSize;
   vec4 BRIGHTPASSSize;
}global;
































































































































































                 float crt_gamma_static = 2.5;
                 float lcd_gamma_static = 2.2;



                 float levels_contrast_static = 1.0;



                 float levels_autodim_temp = 0.5;




                 float halation_weight_static = 0.0;


                 float diffusion_weight_static = 0.075;



                 float bloom_underestimate_levels_static = 0.8;

                 float bloom_excess_static = 0.0;












                 float bloom_approx_filter_static = 2.0;















                 float beam_num_scanlines = 3.0;


                 bool beam_generalized_gaussian = true;




                 float beam_antialias_level = 1.0;


                 float beam_min_sigma_static = 0.02;
                 float beam_max_sigma_static = 0.3;



                 float beam_spot_shape_function = 0.0;


                 float beam_spot_power_static = 1.0 / 3.0;




                 float beam_min_shape_static = 2.0;
                 float beam_max_shape_static = 4.0;




                 float beam_shape_power_static = 1.0 / 4.0;


                 float beam_horiz_filter_static = 0.0;

                 float beam_horiz_sigma_static = 0.35;



                 float beam_horiz_linear_rgb_weight_static = 1.0;



                 bool beam_misconvergence = true;


                      vec2 convergence_offsets_r_static = vec2(0.1, 0.2);
                      vec2 convergence_offsets_g_static = vec2(0.3, 0.4);
                      vec2 convergence_offsets_b_static = vec2(0.5, 0.6);

                 bool interlace_detect = true;

                 bool interlace_1080i_static = false;


                 bool interlace_bff_static = false;





                 float aa_level = 12.0;







                 float aa_filter = 6.0;

                 bool aa_temporal = false;


                      vec2 aa_subpixel_r_offset_static = vec2(- 1.0 / 3.0, 0.0);





                 float aa_cubic_c_static = 0.5;

                 float aa_gauss_sigma_static = 0.5;



                 float mask_type_static = 1.0;









                 float mask_sample_mode_static = 0.0;



                 float mask_specify_num_triads_static = 0.0;







                 float mask_triad_size_desired_static = 24.0 / 8.0;


                 float mask_num_triads_desired_static = 480.0;



                 float mask_sinc_lobes = 3.0;







                 float mask_min_allowed_triad_size = 2.0;





                 float geom_mode_static = 0.0;

                 float geom_radius_static = 2.0;


                 float geom_view_dist_static = 2.0;

                      vec2 geom_tilt_angle_static = vec2(0.0, 0.0);






                 float geom_aspect_ratio_static = 1.313069909;






















                      vec2 geom_overscan_static = vec2(1.0, 1.0);



                 bool geom_force_correct_tangent_matrix = true;



                 float border_size_static = 0.015;


                 float border_darkness_static = 2.0;


                 float border_compress_static = 2.5;


























































































































































































































































































































































































































             float bloom_approx_size_x = 320.0;
             float bloom_approx_size_x_for_fake = 400.0;


                  vec2 mask_resize_viewport_scale = vec2(0.0625, 0.0625);

             float geom_max_aspect_ratio = 4.0 / 3.0;







                  vec2 mask_texture_small_size = vec2(64.0, 64.0);
                  vec2 mask_texture_large_size = vec2(512.0, 512.0);
             float mask_triads_per_tile = 8.0;






             float mask_grille14_avg_color = 50.6666666 / 255.0;


             float mask_grille15_avg_color = 53.0 / 255.0;


             float mask_slot_avg_color = 46.0 / 255.0;


             float mask_shadow_avg_color = 41.0 / 255.0;






                 float mask_grille_avg_color = mask_grille15_avg_color;



























































                 float bloom_approx_filter = bloom_approx_filter_static;























































































































                      vec2 mask_resize_src_lut_size = mask_texture_small_size;





































                 float max_aa_base_pixel_border = 0.0;



                 float max_aniso_pixel_border = max_aa_base_pixel_border + 0.5;







                 float max_tiled_pixel_border = max_aniso_pixel_border;







                 float max_mask_texel_border = ceil(max_tiled_pixel_border);


             float max_mask_tile_border = max_mask_texel_border /
    (mask_min_allowed_triad_size * mask_triads_per_tile);







                     float mask_resize_num_tiles = 1.0 + 1.0;
                     float mask_start_texels = 0.0;














             float mask_resize_num_triads =
    mask_resize_num_tiles * mask_triads_per_tile;
                  vec2 min_allowed_viewport_triads =
         vec2(mask_resize_num_triads)/ mask_resize_viewport_scale;




             float pi = 3.141592653589;









             float under_half = 0.4995;





































































































































































































































































































































































































































































































































































































































































































































             float gba_gamma = 3.5;







































































#pragma parametercrt_gamma�2.51.05.00.025

#pragma parameterlcd_gamma�2.21.05.00.025

#pragma parameterlevels_contrast�1.00.04.00.015625

#pragma parameterhalation_weight�0.00.01.00.005
#pragma parameterdiffusion_weight�0.0750.01.00.005
#pragma parameterbloom_underestimate_levels�0.80.05.00.01

#pragma parameterbloom_excess�0.00.01.00.005
#pragma parameterbeam_min_sigma�0.020.0051.00.005

#pragma parameterbeam_max_sigma�0.30.0051.00.005

#pragma parameterbeam_spot_power�0.330.0116.00.01

#pragma parameterbeam_min_shape�2.02.032.00.1

#pragma parameterbeam_max_shape�4.02.032.00.1

#pragma parameterbeam_shape_power�0.250.0116.00.01

#pragma parameterbeam_horiz_filter�0.00.02.01.0

#pragma parameterbeam_horiz_sigma�0.350.00.670.005

#pragma parameterbeam_horiz_linear_rgb_weight�1.00.01.00.01
#pragma parameterconvergence_offset_x_r�0.0-4.04.00.05

#pragma parameterconvergence_offset_x_g�0.0-4.04.00.05

#pragma parameterconvergence_offset_x_b�0.0-4.04.00.05

#pragma parameterconvergence_offset_y_r�0.0-2.02.00.05

#pragma parameterconvergence_offset_y_g�0.0-2.02.00.05

#pragma parameterconvergence_offset_y_b�0.0-2.02.00.05

#pragma parametermask_type�1.00.02.01.0

#pragma parametermask_sample_mode_desired�0.00.02.01.0

#pragma parametermask_specify_num_triads�0.00.01.01.0
#pragma parametermask_triad_size_desired�3.01.018.00.125
#pragma parametermask_num_triads_desired�480.0342.01920.01.0
#pragma parameteraa_subpixel_r_offset_x_runtime�-0.333333333-0.3333333330.3333333330.333333333

#pragma parameteraa_subpixel_r_offset_y_runtime�0.0-0.3333333330.3333333330.333333333

#pragma parameteraa_cubic_c�0.50.04.00.015625

#pragma parameteraa_gauss_sigma�0.50.06251.00.015625

#pragma parametergeom_mode_runtime�0.00.03.01.0

#pragma parametergeom_radius�2.00.161024.00.1

#pragma parametergeom_view_dist�2.00.51024.00.25

#pragma parametergeom_tilt_angle_x�0.0-3.141592653.141592650.017453292519943295

#pragma parametergeom_tilt_angle_y�0.0-3.141592653.141592650.017453292519943295

#pragma parametergeom_aspect_ratio_x�432.01.0512.01.0

#pragma parametergeom_aspect_ratio_y�329.01.0512.01.0

#pragma parametergeom_overscan_x�1.00.003906254.00.00390625

#pragma parametergeom_overscan_y�1.00.003906254.00.00390625

#pragma parameterborder_size�0.0150.00000010.50.005

#pragma parameterborder_darkness�2.00.016.00.0625

#pragma parameterborder_compress�2.51.064.00.0625

#pragma parameterinterlace_bff�0.00.01.01.0

#pragma parameterinterlace_1080i�0.00.01.01.0




            vec2 get_aspect_vector(float geom_aspect_ratio)
{


          float geom_clamped_aspect_ratio =
        min(geom_aspect_ratio, geom_max_aspect_ratio);
               vec2 geom_aspect =
        normalize(vec2(geom_clamped_aspect_ratio, 1.0));
    return geom_aspect;
}

            vec2 get_geom_overscan_vector()
{
    return vec2(global . geom_overscan_x, global . geom_overscan_y);
}

            vec2 get_geom_tilt_angle_vector()
{
    return vec2(global . geom_tilt_angle_x, global . geom_tilt_angle_y);
}

            vec3 get_convergence_offsets_x_vector()
{
    return vec3(global . convergence_offset_x_r, global . convergence_offset_x_g,
                             global . convergence_offset_x_b);
}

            vec3 get_convergence_offsets_y_vector()
{
    return vec3(global . convergence_offset_y_r, global . convergence_offset_y_g,
                             global . convergence_offset_y_b);
}

            vec2 get_convergence_offsets_r_vector()
{
    return vec2(global . convergence_offset_x_r, global . convergence_offset_y_r);
}

            vec2 get_convergence_offsets_g_vector()
{
    return vec2(global . convergence_offset_x_g, global . convergence_offset_y_g);
}

            vec2 get_convergence_offsets_b_vector()
{
    return vec2(global . convergence_offset_x_b, global . convergence_offset_y_b);
}

            vec2 get_aa_subpixel_r_offset()
{






            return aa_subpixel_r_offset_static;




}


       float get_mask_amplify()
{
                 float mask_grille_amplify = 1.0 / mask_grille_avg_color;
                 float mask_slot_amplify = 1.0 / mask_slot_avg_color;
                 float mask_shadow_amplify = 1.0 / mask_shadow_avg_color;
    return global . mask_type < 0.5 ? mask_grille_amplify :
                global . mask_type < 1.5 ? mask_slot_amplify :
        mask_shadow_amplify;
}

       float get_mask_sample_mode()
{


            return global . mask_sample_mode_desired;










}










































































































































                 float ntsc_gamma = 2.2;
                 float pal_gamma = 2.8;











                 float crt_reference_gamma_high = 2.5;
                 float crt_reference_gamma_low = 2.35;
                 float lcd_reference_gamma = 2.5;
                 float crt_office_gamma = 2.2;
                 float lcd_office_gamma = 2.2;





                 bool assume_opaque_alpha = false;













           float get_crt_gamma(){ return global . crt_gamma;}
           float get_gba_gamma(){ return gba_gamma;}
           float get_lcd_gamma(){ return global . lcd_gamma;}















           float get_intermediate_gamma(){ return ntsc_gamma;}

               float get_input_gamma(){ return get_crt_gamma();}
               float get_output_gamma(){ return get_lcd_gamma();}





























                     bool linearize_input = false;
               float get_pass_input_gamma(){ return 1.0;}


                     bool gamma_encode_output = true;
               float get_pass_output_gamma(){ return get_output_gamma();}




















             bool gamma_aware_bilinear = ! linearize_input;




            vec4 encode_output(vec4 color)
{
    if(gamma_encode_output)
    {
        if(assume_opaque_alpha)
        {
            return vec4(pow(color . rgb, vec3(1.0 / get_pass_output_gamma())), 1.0);
        }
        else
        {
            return vec4(pow(color . rgb, vec3(1.0 / get_pass_output_gamma())), color . a);
        }
    }
    else
    {
        return color;
    }
}

            vec4 decode_input(vec4 color)
{
    if(linearize_input)
    {
        if(assume_opaque_alpha)
        {
            return vec4(pow(color . rgb, vec3(get_pass_input_gamma())), 1.0);
        }
        else
        {
            return vec4(pow(color . rgb, vec3(get_pass_input_gamma())), color . a);
        }
    }
    else
    {
        return color;
    }
}

            vec4 decode_gamma_input(vec4 color, vec3 gamma)
{
    if(assume_opaque_alpha)
    {
        return vec4(pow(color . rgb, gamma), 1.0);
    }
    else
    {
        return vec4(pow(color . rgb, gamma), color . a);
    }
}
















































































            vec4 tex2D_linearize(sampler2D tex, vec2 tex_coords)
{ return decode_input(texture(tex, tex_coords));}

            vec4 tex2D_linearize(sampler2D tex, vec3 tex_coords)
{ return decode_input(texture(tex, tex_coords . xy));}

            vec4 tex2D_linearize(sampler2D tex, vec2 tex_coords, int texel_off)
{ return decode_input(textureLod(tex, tex_coords, texel_off));}

            vec4 tex2D_linearize(sampler2D tex, vec3 tex_coords, int texel_off)
{ return decode_input(textureLod(tex, tex_coords . xy, texel_off));}




























            vec4 tex2Dlod_linearize(sampler2D tex, vec4 tex_coords)
{ return decode_input(textureLod(tex, tex_coords . xy, 0.0));}

            vec4 tex2Dlod_linearize(sampler2D tex, vec4 tex_coords, int texel_off)
{ return decode_input(textureLod(tex, tex_coords . xy, texel_off));}

















































































































            vec4 tex2Dlod_linearize_gamma(sampler2D tex, vec4 tex_coords, vec3 gamma)
{ return decode_gamma_input(textureLod(tex, tex_coords . xy, 0.0), gamma);}

            vec4 tex2Dlod_linearize_gamma(sampler2D tex, vec4 tex_coords, int texel_off, vec3 gamma)
{ return decode_gamma_input(textureLod(tex, tex_coords . xy, texel_off), gamma);}





layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
   FragColor = encode_output(vec4(texture(Source, vTexCoord). rgb, 1.0));
}
