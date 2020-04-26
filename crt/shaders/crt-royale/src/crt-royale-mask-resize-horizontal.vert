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







































































#pragma parametercrt_gamma¡2.51.05.00.025

#pragma parameterlcd_gamma¡2.21.05.00.025

#pragma parameterlevels_contrast¡1.00.04.00.015625

#pragma parameterhalation_weight¡0.00.01.00.005
#pragma parameterdiffusion_weight¡0.0750.01.00.005
#pragma parameterbloom_underestimate_levels¡0.80.05.00.01

#pragma parameterbloom_excess¡0.00.01.00.005
#pragma parameterbeam_min_sigma¡0.020.0051.00.005

#pragma parameterbeam_max_sigma¡0.30.0051.00.005

#pragma parameterbeam_spot_power¡0.330.0116.00.01

#pragma parameterbeam_min_shape¡2.02.032.00.1

#pragma parameterbeam_max_shape¡4.02.032.00.1

#pragma parameterbeam_shape_power¡0.250.0116.00.01

#pragma parameterbeam_horiz_filter¡0.00.02.01.0

#pragma parameterbeam_horiz_sigma¡0.350.00.670.005

#pragma parameterbeam_horiz_linear_rgb_weight¡1.00.01.00.01
#pragma parameterconvergence_offset_x_r¡0.0-4.04.00.05

#pragma parameterconvergence_offset_x_g¡0.0-4.04.00.05

#pragma parameterconvergence_offset_x_b¡0.0-4.04.00.05

#pragma parameterconvergence_offset_y_r¡0.0-2.02.00.05

#pragma parameterconvergence_offset_y_g¡0.0-2.02.00.05

#pragma parameterconvergence_offset_y_b¡0.0-2.02.00.05

#pragma parametermask_type¡1.00.02.01.0

#pragma parametermask_sample_mode_desired¡0.00.02.01.0

#pragma parametermask_specify_num_triads¡0.00.01.01.0
#pragma parametermask_triad_size_desired¡3.01.018.00.125
#pragma parametermask_num_triads_desired¡480.0342.01920.01.0
#pragma parameteraa_subpixel_r_offset_x_runtime¡-0.333333333-0.3333333330.3333333330.333333333

#pragma parameteraa_subpixel_r_offset_y_runtime¡0.0-0.3333333330.3333333330.333333333

#pragma parameteraa_cubic_c¡0.50.04.00.015625

#pragma parameteraa_gauss_sigma¡0.50.06251.00.015625

#pragma parametergeom_mode_runtime¡0.00.03.01.0

#pragma parametergeom_radius¡2.00.161024.00.1

#pragma parametergeom_view_dist¡2.00.51024.00.25

#pragma parametergeom_tilt_angle_x¡0.0-3.141592653.141592650.017453292519943295

#pragma parametergeom_tilt_angle_y¡0.0-3.141592653.141592650.017453292519943295

#pragma parametergeom_aspect_ratio_x¡432.01.0512.01.0

#pragma parametergeom_aspect_ratio_y¡329.01.0512.01.0

#pragma parametergeom_overscan_x¡1.00.003906254.00.00390625

#pragma parametergeom_overscan_y¡1.00.003906254.00.00390625

#pragma parameterborder_size¡0.0150.00000010.50.005

#pragma parameterborder_darkness¡2.00.016.00.0625

#pragma parameterborder_compress¡2.51.064.00.0625

#pragma parameterinterlace_bff¡0.00.01.01.0

#pragma parameterinterlace_1080i¡0.00.01.01.0




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
























































































































































































































































































































































































































































































































































































































































































































































             float mask_min_allowed_tile_size = ceil(
    mask_min_allowed_triad_size * mask_triads_per_tile);
             float mask_min_expected_tile_size =
        mask_min_allowed_tile_size;

             float pi_over_lobes = pi / mask_sinc_lobes;
             float max_sinc_resize_samples_float = 2.0 * mask_sinc_lobes *
    mask_resize_src_lut_size . x / mask_min_expected_tile_size;

             float max_sinc_resize_samples_m4 = ceil(
    max_sinc_resize_samples_float * 0.25)* 4.0;




       float get_dynamic_loop_size(float magnification_scale)
{








          float min_samples_float = 2.0 * mask_sinc_lobes / magnification_scale;
          float min_samples_m4 = ceil(min_samples_float * 0.25)* 4.0;




              float max_samples_m4 = min(128.0, max_sinc_resize_samples_m4);

    return min(min_samples_m4, max_samples_m4);
}

     vec2 get_first_texel_tile_uv_and_dist(vec2 tex_uv,
               vec2 tex_size, float dr,
          float input_tiles_per_texture_r, float samples,
                 bool vertical)
{
















               vec2 curr_texel = tex_uv * tex_size;
               vec2 prev_texel =
        floor(curr_texel - vec2(under_half))+ vec2(0.5);
               vec2 first_texel = prev_texel - vec2(samples / 2.0 - 1.0);
               vec2 first_texel_uv_wrap_2D = first_texel * dr;
               vec2 first_texel_dist_2D = curr_texel - first_texel;

               vec2 first_texel_tile_uv_wrap_2D =
        first_texel_uv_wrap_2D * input_tiles_per_texture_r;


               vec2 coord_negative =
             vec2((first_texel_tile_uv_wrap_2D . x < 0.),(first_texel_tile_uv_wrap_2D . y < 0.));
               vec2 first_texel_tile_uv_2D =
                                        (fract(first_texel_tile_uv_wrap_2D))+ coord_negative;

               vec2 tile_u_and_dist =
             vec2(first_texel_tile_uv_2D . x, first_texel_dist_2D . x);
               vec2 tile_v_and_dist =
             vec2(first_texel_tile_uv_2D . y, first_texel_dist_2D . y);
    return vertical ? tile_v_and_dist : tile_u_and_dist;

}

            vec4 tex2Dlod0try(sampler2D tex, vec2 tex_uv)
{








            return texture(tex, tex_uv);


}











































































     vec3 downsample_vertical_sinc_tiled(sampler2D tex,
               vec2 tex_uv, vec2 tex_size, float dr,
          float magnification_scale, float tile_size_uv_r)
{



















                     int samples = int(max_sinc_resize_samples_m4);






                 float input_tiles_per_texture_r = 1.0 / tile_size_uv_r;

               vec2 first_texel_tile_r_and_dist = get_first_texel_tile_uv_and_dist(
        tex_uv, tex_size, dr, input_tiles_per_texture_r, samples, true);
               vec4 first_texel_tile_uv_rrrr = first_texel_tile_r_and_dist . xxxx;
               vec4 first_dist_unscaled = first_texel_tile_r_and_dist . yyyy;

                 float tile_dr = dr * input_tiles_per_texture_r;




    int i_base = 0;
         vec4 weight_sum = vec4(0.0);
         vec3 pixel_color = vec3(0.0);
                 int i_step = 4;


















































        for(int i = 0;i < samples;i += i_step)
        {
                                           vec4 true_i = vec4(i_base + i)+ vec4(0.0, 1.0, 2.0, 3.0);vec4 tile_uv_r =(fract(first_texel_tile_uv_rrrr + true_i * tile_dr));vec4 tex_uv_r = tile_uv_r * tile_size_uv_r;;vec3 new_sample0 = tex2Dlod0try(tex, vec2(tex_uv . x, tex_uv_r . x)). rgb;vec3 new_sample1 = tex2Dlod0try(tex, vec2(tex_uv . x, tex_uv_r . y)). rgb;vec3 new_sample2 = tex2Dlod0try(tex, vec2(tex_uv . x, tex_uv_r . z)). rgb;vec3 new_sample3 = tex2Dlod0try(tex, vec2(tex_uv . x, tex_uv_r . w)). rgb;vec4 dist = magnification_scale * abs(first_dist_unscaled - true_i);vec4 pi_dist = pi * dist;vec4 pi_dist_over_lobes = pi_over_lobes * dist;vec4 weights = min(sin(pi_dist)* sin(pi_dist_over_lobes)/(pi_dist * pi_dist_over_lobes), vec4(1.0));;pixel_color += new_sample0 * weights . xxx;pixel_color += new_sample1 * weights . yyy;pixel_color += new_sample2 * weights . zzz;pixel_color += new_sample3 * weights . www;weight_sum += weights;;;
        }


               vec2 weight_sum_reduce = weight_sum . xy + weight_sum . zw;
               vec3 scalar_weight_sum = vec3(weight_sum_reduce . x +
        weight_sum_reduce . y);
    return(pixel_color / scalar_weight_sum);
}

     vec3 downsample_horizontal_sinc_tiled(sampler2D tex,
               vec2 tex_uv, vec2 tex_size, float dr,
          float magnification_scale, float tile_size_uv_r)
{
















                     int samples = int(max_sinc_resize_samples_m4);






          float input_tiles_per_texture_r = 1.0 / tile_size_uv_r;

               vec2 first_texel_tile_r_and_dist = get_first_texel_tile_uv_and_dist(
        tex_uv, tex_size, dr, input_tiles_per_texture_r, samples, false);
               vec4 first_texel_tile_uv_rrrr = first_texel_tile_r_and_dist . xxxx;
               vec4 first_dist_unscaled = first_texel_tile_r_and_dist . yyyy;

          float tile_dr = dr * input_tiles_per_texture_r;




    int i_base = 0;
         vec4 weight_sum = vec4(0.0);
         vec3 pixel_color = vec3(0.0);
                 int i_step = 4;


















































        for(int i = 0;i < samples;i += i_step)
        {
                                             vec4 true_i = vec4(i_base + i)+ vec4(0.0, 1.0, 2.0, 3.0);vec4 tile_uv_r =(fract(first_texel_tile_uv_rrrr + true_i * tile_dr));vec4 tex_uv_r = tile_uv_r * tile_size_uv_r;;vec3 new_sample0 = tex2Dlod0try(tex, vec2(tex_uv_r . x, tex_uv . y)). rgb;vec3 new_sample1 = tex2Dlod0try(tex, vec2(tex_uv_r . y, tex_uv . y)). rgb;vec3 new_sample2 = tex2Dlod0try(tex, vec2(tex_uv_r . z, tex_uv . y)). rgb;vec3 new_sample3 = tex2Dlod0try(tex, vec2(tex_uv_r . w, tex_uv . y)). rgb;vec4 dist = magnification_scale * abs(first_dist_unscaled - true_i);vec4 pi_dist = pi * dist;vec4 pi_dist_over_lobes = pi_over_lobes * dist;vec4 weights = min(sin(pi_dist)* sin(pi_dist_over_lobes)/(pi_dist * pi_dist_over_lobes), vec4(1.0));;pixel_color += new_sample0 * weights . xxx;pixel_color += new_sample1 * weights . yyy;pixel_color += new_sample2 * weights . zzz;pixel_color += new_sample3 * weights . www;weight_sum += weights;;;
        }


               vec2 weight_sum_reduce = weight_sum . xy + weight_sum . zw;
               vec3 scalar_weight_sum = vec3(weight_sum_reduce . x +
        weight_sum_reduce . y);
    return(pixel_color / scalar_weight_sum);
}




     vec2 get_resized_mask_tile_size(vec2 estimated_viewport_size,
               vec2 estimated_mask_resize_output_size,
          bool solemnly_swear_same_inputs_for_every_pass)
{

































                 float tile_aspect_ratio_inv =
        mask_resize_src_lut_size . y / mask_resize_src_lut_size . x;
                 float tile_aspect_ratio = 1.0 / tile_aspect_ratio_inv;
                      vec2 tile_aspect = vec2(1.0, tile_aspect_ratio_inv);


          float desired_tile_size_x = mask_triads_per_tile *


                                      mix(global . mask_triad_size_desired, estimated_viewport_size . x / global . mask_num_triads_desired, global . mask_specify_num_triads);
    if(get_mask_sample_mode()> 0.5)
    {

        return desired_tile_size_x * tile_aspect;
    }

          float temp_tile_size_x =
        min(desired_tile_size_x, mask_resize_src_lut_size . x);

               vec2 temp_tile_size = temp_tile_size_x * tile_aspect;
                      vec2 min_tile_size =
        mask_min_allowed_tile_size * tile_aspect;
               vec2 max_tile_size =
        estimated_mask_resize_output_size / mask_resize_num_tiles;
               vec2 clamped_tile_size =
        clamp(temp_tile_size, min_tile_size, max_tile_size);





















          float x_tile_size_from_y =
        clamped_tile_size . y * tile_aspect_ratio;
          float y_tile_size_from_x =

                                                        mix(clamped_tile_size . y, clamped_tile_size . x * tile_aspect_ratio_inv, float(solemnly_swear_same_inputs_for_every_pass));
               vec2 reclamped_tile_size = vec2(
        min(clamped_tile_size . x, x_tile_size_from_y),
        min(clamped_tile_size . y, y_tile_size_from_x));



               vec2 final_resized_tile_size =
        floor(reclamped_tile_size + vec2((max(abs(0.0), 0.0000152587890625))));
    return final_resized_tile_size;
}




     vec4 get_mask_sampling_parameters(vec2 mask_resize_texture_size,
               vec2 mask_resize_video_size, vec2 true_viewport_size,
    out vec2 mask_tiles_per_screen)
{




















          float mask_sample_mode = get_mask_sample_mode();
               vec2 mask_resize_tile_size = get_resized_mask_tile_size(
        true_viewport_size, mask_resize_video_size, false);
    if(mask_sample_mode < 0.5)
    {


                   vec2 mask_tile_uv_size = mask_resize_tile_size /
            mask_resize_texture_size;
                   vec2 skipped_tiles = mask_start_texels / mask_resize_tile_size;
                   vec2 mask_tile_start_uv = skipped_tiles * mask_tile_uv_size;

        mask_tiles_per_screen = true_viewport_size / mask_resize_tile_size;
        return vec4(mask_tile_start_uv, mask_tile_uv_size);
    }
    else
    {




                          vec2 mask_tile_uv_size = vec2(1.0);
                          vec2 mask_tile_start_uv = vec2(0.0);
        if(mask_sample_mode > 1.5)
        {

            mask_tiles_per_screen = true_viewport_size / mask_texture_large_size;
        }
        else
        {

            mask_tiles_per_screen = true_viewport_size / mask_resize_tile_size;
        }
        return vec4(mask_tile_start_uv, mask_tile_uv_size);
    }
}






























     vec2 convert_phosphor_tile_uv_wrap_to_tex_uv(vec2 tile_uv_wrap,
               vec4 mask_tile_start_uv_and_size)
{












    if(get_mask_sample_mode()< 0.5)
    {





                 vec2 tile_uv =(fract(tile_uv_wrap * 0.5))* 2.0;











                   vec2 mask_tex_uv = mask_tile_start_uv_and_size . xy +
            tile_uv * mask_tile_start_uv_and_size . zw;
        return mask_tex_uv;
    }
    else
    {





        return tile_uv_wrap;
    }
}





layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 src_tex_uv_wrap;
layout(location = 1) out vec2 tile_uv_wrap;
layout(location = 2) out vec2 resize_magnification_scale;
layout(location = 3) out vec2 src_dxdy;
layout(location = 4) out vec2 tile_size_uv;
layout(location = 5) out vec2 input_tiles_per_texture;

void main()
{
   gl_Position = global . MVP * Position;
        vec2 tex_uv = TexCoord . xy;


               vec2 estimated_viewport_size =
         params . OutputSize . xy / mask_resize_viewport_scale;



               vec2 mask_resize_tile_size = get_resized_mask_tile_size(
        estimated_viewport_size, params . OutputSize . xy, false);




               vec2 output_tiles_this_pass = params . OutputSize . xy / mask_resize_tile_size;
               vec2 output_video_uv = tex_uv * params . SourceSize . xy / params . SourceSize . xy;
    tile_uv_wrap = output_video_uv * output_tiles_this_pass;


               vec2 input_tile_size = vec2(min(
        mask_resize_src_lut_size . x, params . SourceSize . xy . x), mask_resize_tile_size . y);
    tile_size_uv = input_tile_size / params . SourceSize . xy;
    input_tiles_per_texture = params . SourceSize . xy / input_tile_size;



    src_tex_uv_wrap = tile_uv_wrap * tile_size_uv;




    resize_magnification_scale = mask_resize_tile_size / input_tile_size;
    src_dxdy = vec2(1.0 / params . SourceSize . xy . x, 0.0);


}

