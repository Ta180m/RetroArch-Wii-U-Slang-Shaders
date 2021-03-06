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













































































































































































                 float aa_pixel_diameter = 1.0;
                 float aa_lanczos_lobes = 3.0;
                 float aa_gauss_support = 1.0 / aa_pixel_diameter;
                 float aa_tent_support = 1.0 / aa_pixel_diameter;





                      vec2 aa_xy_axis_importance =
        aa_filter < 5.5 ? vec2(1.0):
        aa_filter < 8.5 ? vec2(1.0, 0.0):
        aa_filter < 9.5 ? vec2(1.0, 1.0 / aa_lanczos_lobes):
             vec2(1.0);





























































































































































































































































































































































































































































































































































































             float aa_box_support = 0.5;
             float aa_cubic_support = 2.0;






    float aa_cubic_b;
    float cubic_branch1_x3_coeff;
    float cubic_branch1_x2_coeff;
    float cubic_branch1_x0_coeff;
    float cubic_branch2_x3_coeff;
    float cubic_branch2_x2_coeff;
    float cubic_branch2_x1_coeff;
    float cubic_branch2_x0_coeff;





void assign_aa_cubic_constants()
{




        if(aa_filter > 5.5 && aa_filter < 7.5)
        {
            aa_cubic_b = 1.0 - 2.0 * global . aa_cubic_c;
            cubic_branch1_x3_coeff = 12.0 - 9.0 * aa_cubic_b - 6.0 * global . aa_cubic_c;
            cubic_branch1_x2_coeff = - 18.0 + 12.0 * aa_cubic_b + 6.0 * global . aa_cubic_c;
            cubic_branch1_x0_coeff = 6.0 - 2.0 * aa_cubic_b;
            cubic_branch2_x3_coeff = - aa_cubic_b - 6.0 * global . aa_cubic_c;
            cubic_branch2_x2_coeff = 6.0 * aa_cubic_b + 30.0 * global . aa_cubic_c;
            cubic_branch2_x1_coeff = - 12.0 * aa_cubic_b - 48.0 * global . aa_cubic_c;
            cubic_branch2_x0_coeff = 8.0 * aa_cubic_b + 24.0 * global . aa_cubic_c;
        }

}

            vec4 get_subpixel_support_diam_and_final_axis_importance()
{

                 float base_support_radius =
        aa_filter < 1.5 ? aa_box_support :
        aa_filter < 3.5 ? aa_tent_support :
        aa_filter < 5.5 ? aa_gauss_support :
        aa_filter < 7.5 ? aa_cubic_support :
        aa_filter < 9.5 ? aa_lanczos_lobes :
        aa_box_support;

               vec2 subpixel_support_radius_raw =
             vec2(base_support_radius)+ abs(get_aa_subpixel_r_offset());
    if(aa_filter < 1.5)
    {

                   vec2 subpixel_support_diam =
            2.0 * subpixel_support_radius_raw;
                   vec2 final_axis_importance = vec2(1.0);
        return vec4(subpixel_support_diam, final_axis_importance);
    }
    else
    {




                   vec2 subpixel_support_radius = max(vec2(aa_box_support, aa_box_support),
            subpixel_support_radius_raw * aa_xy_axis_importance);

                   vec2 final_axis_importance = aa_xy_axis_importance *
            subpixel_support_radius_raw / subpixel_support_radius;
                   vec2 subpixel_support_diam = 2.0 * subpixel_support_radius;
        return vec4(subpixel_support_diam, final_axis_importance);
    }
}




       float eval_box_filter(float dist)
{
    return float(abs(dist)<= aa_box_support);
}

       float eval_separable_box_filter(vec2 offset)
{
    return float(all(bvec2((abs(offset . x)<= aa_box_support),(abs(offset . y)<= aa_box_support))));
}

       float eval_tent_filter(float dist)
{
    return clamp((aa_tent_support - dist)/
        aa_tent_support, 0.0, 1.0);
}

       float eval_gaussian_filter(float dist)
{
    return exp(-(dist * dist)/(2.0 * global . aa_gauss_sigma * global . aa_gauss_sigma));
}

       float eval_cubic_filter(float dist)
{













          float abs_dist = abs(dist);


    return(abs_dist < 1.0 ?
        (cubic_branch1_x3_coeff * abs_dist +
            cubic_branch1_x2_coeff)* abs_dist * abs_dist +
            cubic_branch1_x0_coeff :
        abs_dist < 2.0 ?
            ((cubic_branch2_x3_coeff * abs_dist +
                cubic_branch2_x2_coeff)* abs_dist +
                cubic_branch2_x1_coeff)* abs_dist + cubic_branch2_x0_coeff :
            0.0)/ 6.0;
}

       float eval_separable_cubic_filter(vec2 offset)
{

    return eval_cubic_filter(offset . x)*
        eval_cubic_filter(offset . y);
}

            vec2 eval_sinc_filter(vec2 offset)
{


               vec2 pi_offset = pi * offset;
    return sin(pi_offset)/ pi_offset;
}

       float eval_separable_lanczos_sinc_filter(vec2 offset_unsafe)
{


               vec2 offset =(max(abs(offset_unsafe), 0.0000152587890625));
               vec2 xy_weights = eval_sinc_filter(offset)*
        eval_sinc_filter(offset / aa_lanczos_lobes);
    return xy_weights . x * xy_weights . y;
}

       float eval_jinc_filter_unorm(float x)
{





          float point3845_x = 0.38448566093564 * x;
          float exp_term = exp(-(point3845_x * point3845_x));
          float point8154_plus_x = 0.815362332840791 + x;
          float cos_term = cos(point8154_plus_x);
    return(
        0.0264727330997042 * min(x, 6.83134964622778)+
        0.680823557250528 * exp_term +
        - 0.0597255978950933 * min(7.41043194481873, x)* cos_term /
            (point8154_plus_x + 0.0646074538634482 *(x * x)+
            cos(x)* max(exp_term, cos(x)+ cos_term))-
        0.180837503591406);
}

       float eval_jinc_filter(float dist)
{
    return eval_jinc_filter_unorm(pi * dist);
}

       float eval_lanczos_jinc_filter(float dist)
{
    return eval_jinc_filter(dist)* eval_jinc_filter(dist / aa_lanczos_lobes);
}


            vec3 eval_unorm_rgb_weights(vec2 offset,
               vec2 final_axis_importance)
{










               vec2 offset_g = offset * final_axis_importance;
               vec2 aa_r_offset = get_aa_subpixel_r_offset();
               vec2 offset_r = offset_g - aa_r_offset * final_axis_importance;
               vec2 offset_b = offset_g + aa_r_offset * final_axis_importance;

    if(aa_filter < 0.5)
    {
        return vec3(eval_separable_box_filter(offset_r),
            eval_separable_box_filter(offset_g),
            eval_separable_box_filter(offset_b));
    }
    else if(aa_filter < 1.5)
    {
        return vec3(eval_box_filter(length(offset_r)),
            eval_box_filter(length(offset_g)),
            eval_box_filter(length(offset_b)));
    }
    else if(aa_filter < 2.5)
    {
        return vec3(
            eval_tent_filter(offset_r . x)* eval_tent_filter(offset_r . y),
            eval_tent_filter(offset_g . x)* eval_tent_filter(offset_g . y),
            eval_tent_filter(offset_b . x)* eval_tent_filter(offset_b . y));
    }
    else if(aa_filter < 3.5)
    {
        return vec3(eval_tent_filter(length(offset_r)),
            eval_tent_filter(length(offset_g)),
            eval_tent_filter(length(offset_b)));
    }
    else if(aa_filter < 4.5)
    {
        return vec3(
            eval_gaussian_filter(offset_r . x)* eval_gaussian_filter(offset_r . y),
            eval_gaussian_filter(offset_g . x)* eval_gaussian_filter(offset_g . y),
            eval_gaussian_filter(offset_b . x)* eval_gaussian_filter(offset_b . y));
    }
    else if(aa_filter < 5.5)
    {
        return vec3(eval_gaussian_filter(length(offset_r)),
            eval_gaussian_filter(length(offset_g)),
            eval_gaussian_filter(length(offset_b)));
    }
    else if(aa_filter < 6.5)
    {
        return vec3(
            eval_cubic_filter(offset_r . x)* eval_cubic_filter(offset_r . y),
            eval_cubic_filter(offset_g . x)* eval_cubic_filter(offset_g . y),
            eval_cubic_filter(offset_b . x)* eval_cubic_filter(offset_b . y));
    }
    else if(aa_filter < 7.5)
    {
        return vec3(eval_cubic_filter(length(offset_r)),
            eval_cubic_filter(length(offset_g)),
            eval_cubic_filter(length(offset_b)));
    }
    else if(aa_filter < 8.5)
    {
        return vec3(eval_separable_lanczos_sinc_filter(offset_r),
            eval_separable_lanczos_sinc_filter(offset_g),
            eval_separable_lanczos_sinc_filter(offset_b));
    }
    else if(aa_filter < 9.5)
    {
        return vec3(eval_lanczos_jinc_filter(length(offset_r)),
            eval_lanczos_jinc_filter(length(offset_g)),
            eval_lanczos_jinc_filter(length(offset_b)));
    }
    else
    {

        return vec3(eval_separable_box_filter(offset_r),
            eval_separable_box_filter(offset_g),
            eval_separable_box_filter(offset_b));
    }
}




            vec4 tex2Daa_tiled_linearize(sampler2D samp, vec2 s)
{






        return tex2D_linearize(samp, s);

}

            vec2 get_frame_sign(float frame)
{
    if(aa_temporal)
    {


              float frame_odd = float(mod(frame, 2.0)> 0.5);
                   vec2 aa_r_offset = get_aa_subpixel_r_offset();
                   vec2 mirror = - vec2(abs(aa_r_offset . x)<((max(abs(0.0), 0.0000152587890625))), abs(aa_r_offset . y)<((max(abs(0.0), 0.0000152587890625))));
        return mirror;
    }
    else
    {
        return vec2(1.0, 1.0);
    }
}




     vec3 tex2Daa_subpixel_weights_only(sampler2D tex,
               vec2 tex_uv, mat2x2 pixel_to_tex_uv)
{


               vec2 aa_r_offset = get_aa_subpixel_r_offset();
               vec2 aa_r_offset_uv_offset =(aa_r_offset * pixel_to_tex_uv);
          float color_g = tex2D_linearize(tex, tex_uv). g;
          float color_r = tex2D_linearize(tex, tex_uv + aa_r_offset_uv_offset). r;
          float color_b = tex2D_linearize(tex, tex_uv - aa_r_offset_uv_offset). b;
    return vec3(color_r, color_g, color_b);
}



     vec3 tex2Daa4x(sampler2D tex, vec2 tex_uv,
                 mat2x2 pixel_to_tex_uv, float frame)
{






                 float grid_size = 4.0;
    assign_aa_cubic_constants();
               vec4 ssd_fai = get_subpixel_support_diam_and_final_axis_importance();
               vec2 subpixel_support_diameter = ssd_fai . xy;
               vec2 final_axis_importance = ssd_fai . zw;
               vec2 xy_step = vec2(1.0, 1.0)/ grid_size * subpixel_support_diameter;
               vec2 xy_start_offset = vec2(0.5 - grid_size * 0.5, 0.5 - grid_size * 0.5)* xy_step;

               vec2 xy_offset0 = xy_start_offset + vec2(2.0, 0.0)* xy_step;
               vec2 xy_offset1 = xy_start_offset + vec2(0.0, 1.0)* xy_step;

               vec3 w0 = eval_unorm_rgb_weights(xy_offset0, final_axis_importance);
               vec3 w1 = eval_unorm_rgb_weights(xy_offset1, final_axis_importance);
               vec3 w2 = w1 . bgr;
               vec3 w3 = w0 . bgr;

               vec3 half_sum = w0 + w1;
               vec3 w_sum = half_sum + half_sum . bgr;
               vec3 w_sum_inv = vec3(1.0, 1.0, 1.0)/(w_sum);

                 mat2x2 true_pixel_to_tex_uv =
               mat2x2((pixel_to_tex_uv * aa_pixel_diameter));


               vec2 frame_sign = get_frame_sign(frame);
               vec2 uv_offset0 =(xy_offset0 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset1 =(xy_offset1 * frame_sign * true_pixel_to_tex_uv);

               vec3 sample0 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset0). rgb;
               vec3 sample1 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset1). rgb;
               vec3 sample2 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset1). rgb;
               vec3 sample3 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset0). rgb;

    return w_sum_inv *(w0 * sample0 + w1 * sample1 +
        w2 * sample2 + w3 * sample3);
}

     vec3 tex2Daa5x(sampler2D tex, vec2 tex_uv,
                 mat2x2 pixel_to_tex_uv, float frame)
{







                 float grid_size = 5.0;
    assign_aa_cubic_constants();
               vec4 ssd_fai = get_subpixel_support_diam_and_final_axis_importance();
               vec2 subpixel_support_diameter = ssd_fai . xy;
               vec2 final_axis_importance = ssd_fai . zw;
               vec2 xy_step = vec2(1.0)/ grid_size * subpixel_support_diameter;
               vec2 xy_start_offset = vec2(0.5 - grid_size * 0.5)* xy_step;

               vec2 xy_offset0 = xy_start_offset + vec2(1.0, 0.0)* xy_step;
               vec2 xy_offset1 = xy_start_offset + vec2(4.0, 1.0)* xy_step;
               vec2 xy_offset2 = xy_start_offset + vec2(2.0, 2.0)* xy_step;

               vec3 w0 = eval_unorm_rgb_weights(xy_offset0, final_axis_importance);
               vec3 w1 = eval_unorm_rgb_weights(xy_offset1, final_axis_importance);
               vec3 w2 = eval_unorm_rgb_weights(xy_offset2, final_axis_importance);
               vec3 w3 = w1 . bgr;
               vec3 w4 = w0 . bgr;

               vec3 w_sum_inv = vec3(1.0)/(w0 + w1 + w2 + w3 + w4);

                 mat2x2 true_pixel_to_tex_uv =
               mat2x2((pixel_to_tex_uv * aa_pixel_diameter));


               vec2 frame_sign = get_frame_sign(frame);
               vec2 uv_offset0 =(xy_offset0 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset1 =(xy_offset1 * frame_sign * true_pixel_to_tex_uv);

               vec3 sample0 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset0). rgb;
               vec3 sample1 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset1). rgb;
               vec3 sample2 = tex2Daa_tiled_linearize(tex, tex_uv). rgb;
               vec3 sample3 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset1). rgb;
               vec3 sample4 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset0). rgb;

    return w_sum_inv *(w0 * sample0 + w1 * sample1 +
        w2 * sample2 + w3 * sample3 + w4 * sample4);
}

     vec3 tex2Daa6x(sampler2D tex, vec2 tex_uv,
                 mat2x2 pixel_to_tex_uv, float frame)
{









                 float grid_size = 6.0;
    assign_aa_cubic_constants();
               vec4 ssd_fai = get_subpixel_support_diam_and_final_axis_importance();
               vec2 subpixel_support_diameter = ssd_fai . xy;
               vec2 final_axis_importance = ssd_fai . zw;
               vec2 xy_step = vec2(1.0)/ grid_size * subpixel_support_diameter;
               vec2 xy_start_offset = vec2(0.5 - grid_size * 0.5)* xy_step;

               vec2 xy_offset0 = xy_start_offset + vec2(4.0, 0.0)* xy_step;
               vec2 xy_offset1 = xy_start_offset + vec2(2.0, 1.0)* xy_step;
               vec2 xy_offset2 = xy_start_offset + vec2(0.0, 2.0)* xy_step;

               vec3 w0 = eval_unorm_rgb_weights(xy_offset0, final_axis_importance);
               vec3 w1 = eval_unorm_rgb_weights(xy_offset1, final_axis_importance);
               vec3 w2 = eval_unorm_rgb_weights(xy_offset2, final_axis_importance);
               vec3 w3 = w2 . bgr;
               vec3 w4 = w1 . bgr;
               vec3 w5 = w0 . bgr;

               vec3 half_sum = w0 + w1 + w2;
               vec3 w_sum = half_sum + half_sum . bgr;
               vec3 w_sum_inv = vec3(1.0)/(w_sum);

                 mat2x2 true_pixel_to_tex_uv =
               mat2x2((pixel_to_tex_uv * aa_pixel_diameter));


               vec2 frame_sign = get_frame_sign(frame);
               vec2 uv_offset0 =(xy_offset0 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset1 =(xy_offset1 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset2 =(xy_offset2 * frame_sign * true_pixel_to_tex_uv);

               vec3 sample0 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset0). rgb;
               vec3 sample1 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset1). rgb;
               vec3 sample2 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset2). rgb;
               vec3 sample3 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset2). rgb;
               vec3 sample4 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset1). rgb;
               vec3 sample5 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset0). rgb;

    return w_sum_inv *(w0 * sample0 + w1 * sample1 + w2 * sample2 +
        w3 * sample3 + w4 * sample4 + w5 * sample5);
}

     vec3 tex2Daa7x(sampler2D tex, vec2 tex_uv,
                 mat2x2 pixel_to_tex_uv, float frame)
{








                 float grid_size = 7.0;
    assign_aa_cubic_constants();
               vec4 ssd_fai = get_subpixel_support_diam_and_final_axis_importance();
               vec2 subpixel_support_diameter = ssd_fai . xy;
               vec2 final_axis_importance = ssd_fai . zw;
               vec2 xy_step = vec2(1.0)/ grid_size * subpixel_support_diameter;
               vec2 xy_start_offset = vec2(0.5 - grid_size * 0.5)* xy_step;

               vec2 xy_offset0 = xy_start_offset + vec2(1.0, 0.0)* xy_step;
               vec2 xy_offset1 = xy_start_offset + vec2(4.0, 1.0)* xy_step;
               vec2 xy_offset2 = xy_start_offset + vec2(0.0, 2.0)* xy_step;
               vec2 xy_offset3 = xy_start_offset + vec2(3.0, 3.0)* xy_step;

               vec3 w0 = eval_unorm_rgb_weights(xy_offset0, final_axis_importance);
               vec3 w1 = eval_unorm_rgb_weights(xy_offset1, final_axis_importance);
               vec3 w2 = eval_unorm_rgb_weights(xy_offset2, final_axis_importance);
               vec3 w3 = eval_unorm_rgb_weights(xy_offset3, final_axis_importance);
               vec3 w4 = w2 . bgr;
               vec3 w5 = w1 . bgr;
               vec3 w6 = w0 . bgr;

               vec3 half_sum = w0 + w1 + w2;
               vec3 w_sum = half_sum + half_sum . bgr + w3;
               vec3 w_sum_inv = vec3(1.0)/(w_sum);

                 mat2x2 true_pixel_to_tex_uv =
               mat2x2((pixel_to_tex_uv * aa_pixel_diameter));


               vec2 frame_sign = get_frame_sign(frame);
               vec2 uv_offset0 =(xy_offset0 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset1 =(xy_offset1 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset2 =(xy_offset2 * frame_sign * true_pixel_to_tex_uv);

               vec3 sample0 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset0). rgb;
               vec3 sample1 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset1). rgb;
               vec3 sample2 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset2). rgb;
               vec3 sample3 = tex2Daa_tiled_linearize(tex, tex_uv). rgb;
               vec3 sample4 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset2). rgb;
               vec3 sample5 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset1). rgb;
               vec3 sample6 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset0). rgb;

    return w_sum_inv *(
        w0 * sample0 + w1 * sample1 + w2 * sample2 + w3 * sample3 +
        w4 * sample4 + w5 * sample5 + w6 * sample6);
}

     vec3 tex2Daa8x(sampler2D tex, vec2 tex_uv,
                 mat2x2 pixel_to_tex_uv, float frame)
{









                 float grid_size = 8.0;
    assign_aa_cubic_constants();
               vec4 ssd_fai = get_subpixel_support_diam_and_final_axis_importance();
               vec2 subpixel_support_diameter = ssd_fai . xy;
               vec2 final_axis_importance = ssd_fai . zw;
               vec2 xy_step = vec2(1.0)/ grid_size * subpixel_support_diameter;
               vec2 xy_start_offset = vec2(0.5 - grid_size * 0.5)* xy_step;

               vec2 xy_offset0 = xy_start_offset + vec2(2.0, 0.0)* xy_step;
               vec2 xy_offset1 = xy_start_offset + vec2(4.0, 1.0)* xy_step;
               vec2 xy_offset2 = xy_start_offset + vec2(1.0, 2.0)* xy_step;
               vec2 xy_offset3 = xy_start_offset + vec2(7.0, 3.0)* xy_step;

               vec3 w0 = eval_unorm_rgb_weights(xy_offset0, final_axis_importance);
               vec3 w1 = eval_unorm_rgb_weights(xy_offset1, final_axis_importance);
               vec3 w2 = eval_unorm_rgb_weights(xy_offset2, final_axis_importance);
               vec3 w3 = eval_unorm_rgb_weights(xy_offset3, final_axis_importance);
               vec3 w4 = w3 . bgr;
               vec3 w5 = w2 . bgr;
               vec3 w6 = w1 . bgr;
               vec3 w7 = w0 . bgr;

               vec3 half_sum = w0 + w1 + w2 + w3;
               vec3 w_sum = half_sum + half_sum . bgr;
               vec3 w_sum_inv = vec3(1.0)/(w_sum);

                 mat2x2 true_pixel_to_tex_uv =
               mat2x2((pixel_to_tex_uv * aa_pixel_diameter));

               vec2 frame_sign = get_frame_sign(frame);
               vec2 uv_offset0 =(xy_offset0 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset1 =(xy_offset1 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset2 =(xy_offset2 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset3 =(xy_offset3 * frame_sign * true_pixel_to_tex_uv);

               vec3 sample0 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset0). rgb;
               vec3 sample1 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset1). rgb;
               vec3 sample2 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset2). rgb;
               vec3 sample3 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset3). rgb;
               vec3 sample4 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset3). rgb;
               vec3 sample5 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset2). rgb;
               vec3 sample6 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset1). rgb;
               vec3 sample7 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset0). rgb;

    return w_sum_inv *(
        w0 * sample0 + w1 * sample1 + w2 * sample2 + w3 * sample3 +
        w4 * sample4 + w5 * sample5 + w6 * sample6 + w7 * sample7);
}

     vec3 tex2Daa12x(sampler2D tex, vec2 tex_uv,
                 mat2x2 pixel_to_tex_uv, float frame)
{














                 float grid_size = 12.0;
    assign_aa_cubic_constants();
               vec4 ssd_fai = get_subpixel_support_diam_and_final_axis_importance();
               vec2 subpixel_support_diameter = ssd_fai . xy;
               vec2 final_axis_importance = ssd_fai . zw;
               vec2 xy_step = vec2(1.0)/ grid_size * subpixel_support_diameter;
               vec2 xy_start_offset = vec2(0.5 - grid_size * 0.5)* xy_step;

               vec2 xy_offset0 = xy_start_offset + vec2(3.0, 0.0)* xy_step;
               vec2 xy_offset1 = xy_start_offset + vec2(9.0, 1.0)* xy_step;
               vec2 xy_offset2 = xy_start_offset + vec2(6.0, 2.0)* xy_step;
               vec2 xy_offset3 = xy_start_offset + vec2(1.0, 3.0)* xy_step;
               vec2 xy_offset4 = xy_start_offset + vec2(11.0, 4.0)* xy_step;
               vec2 xy_offset5 = xy_start_offset + vec2(4.0, 5.0)* xy_step;

               vec3 w0 = eval_unorm_rgb_weights(xy_offset0, final_axis_importance);
               vec3 w1 = eval_unorm_rgb_weights(xy_offset1, final_axis_importance);
               vec3 w2 = eval_unorm_rgb_weights(xy_offset2, final_axis_importance);
               vec3 w3 = eval_unorm_rgb_weights(xy_offset3, final_axis_importance);
               vec3 w4 = eval_unorm_rgb_weights(xy_offset4, final_axis_importance);
               vec3 w5 = eval_unorm_rgb_weights(xy_offset5, final_axis_importance);
               vec3 w6 = w5 . bgr;
               vec3 w7 = w4 . bgr;
               vec3 w8 = w3 . bgr;
               vec3 w9 = w2 . bgr;
               vec3 w10 = w1 . bgr;
               vec3 w11 = w0 . bgr;

               vec3 half_sum = w0 + w1 + w2 + w3 + w4 + w5;
               vec3 w_sum = half_sum + half_sum . bgr;
               vec3 w_sum_inv = vec3(1.0)/ w_sum;

                 mat2x2 true_pixel_to_tex_uv =
               mat2x2((pixel_to_tex_uv * aa_pixel_diameter));


               vec2 frame_sign = get_frame_sign(frame);
               vec2 uv_offset0 =(xy_offset0 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset1 =(xy_offset1 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset2 =(xy_offset2 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset3 =(xy_offset3 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset4 =(xy_offset4 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset5 =(xy_offset5 * frame_sign * true_pixel_to_tex_uv);

               vec3 sample0 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset0). rgb;
               vec3 sample1 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset1). rgb;
               vec3 sample2 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset2). rgb;
               vec3 sample3 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset3). rgb;
               vec3 sample4 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset4). rgb;
               vec3 sample5 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset5). rgb;
               vec3 sample6 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset5). rgb;
               vec3 sample7 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset4). rgb;
               vec3 sample8 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset3). rgb;
               vec3 sample9 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset2). rgb;
               vec3 sample10 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset1). rgb;
               vec3 sample11 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset0). rgb;

    return w_sum_inv *(
        w0 * sample0 + w1 * sample1 + w2 * sample2 + w3 * sample3 +
        w4 * sample4 + w5 * sample5 + w6 * sample6 + w7 * sample7 +
        w8 * sample8 + w9 * sample9 + w10 * sample10 + w11 * sample11);
}

     vec3 tex2Daa16x(sampler2D tex, vec2 tex_uv,
                 mat2x2 pixel_to_tex_uv, float frame)
{


















                 float grid_size = 16.0;
    assign_aa_cubic_constants();
               vec4 ssd_fai = get_subpixel_support_diam_and_final_axis_importance();
               vec2 subpixel_support_diameter = ssd_fai . xy;
               vec2 final_axis_importance = ssd_fai . zw;
               vec2 xy_step = vec2(1.0)/ grid_size * subpixel_support_diameter;
               vec2 xy_start_offset = vec2(0.5 - grid_size * 0.5)* xy_step;

               vec2 xy_offset0 = xy_start_offset + vec2(2.0, 0.0)* xy_step;
               vec2 xy_offset1 = xy_start_offset + vec2(9.0, 1.0)* xy_step;
               vec2 xy_offset2 = xy_start_offset + vec2(12.0, 2.0)* xy_step;
               vec2 xy_offset3 = xy_start_offset + vec2(4.0, 3.0)* xy_step;
               vec2 xy_offset4 = xy_start_offset + vec2(8.0, 4.0)* xy_step;
               vec2 xy_offset5 = xy_start_offset + vec2(14.0, 5.0)* xy_step;
               vec2 xy_offset6 = xy_start_offset + vec2(0.0, 6.0)* xy_step;
               vec2 xy_offset7 = xy_start_offset + vec2(10.0, 7.0)* xy_step;

               vec3 w0 = eval_unorm_rgb_weights(xy_offset0, final_axis_importance);
               vec3 w1 = eval_unorm_rgb_weights(xy_offset1, final_axis_importance);
               vec3 w2 = eval_unorm_rgb_weights(xy_offset2, final_axis_importance);
               vec3 w3 = eval_unorm_rgb_weights(xy_offset3, final_axis_importance);
               vec3 w4 = eval_unorm_rgb_weights(xy_offset4, final_axis_importance);
               vec3 w5 = eval_unorm_rgb_weights(xy_offset5, final_axis_importance);
               vec3 w6 = eval_unorm_rgb_weights(xy_offset6, final_axis_importance);
               vec3 w7 = eval_unorm_rgb_weights(xy_offset7, final_axis_importance);
               vec3 w8 = w7 . bgr;
               vec3 w9 = w6 . bgr;
               vec3 w10 = w5 . bgr;
               vec3 w11 = w4 . bgr;
               vec3 w12 = w3 . bgr;
               vec3 w13 = w2 . bgr;
               vec3 w14 = w1 . bgr;
               vec3 w15 = w0 . bgr;

               vec3 half_sum = w0 + w1 + w2 + w3 + w4 + w5 + w6 + w7;
               vec3 w_sum = half_sum + half_sum . bgr;
               vec3 w_sum_inv = vec3(1.0)/(w_sum);

                 mat2x2 true_pixel_to_tex_uv =
               mat2x2((pixel_to_tex_uv * aa_pixel_diameter));


               vec2 frame_sign = get_frame_sign(frame);
               vec2 uv_offset0 =(xy_offset0 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset1 =(xy_offset1 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset2 =(xy_offset2 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset3 =(xy_offset3 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset4 =(xy_offset4 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset5 =(xy_offset5 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset6 =(xy_offset6 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset7 =(xy_offset7 * frame_sign * true_pixel_to_tex_uv);

               vec3 sample0 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset0). rgb;
               vec3 sample1 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset1). rgb;
               vec3 sample2 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset2). rgb;
               vec3 sample3 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset3). rgb;
               vec3 sample4 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset4). rgb;
               vec3 sample5 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset5). rgb;
               vec3 sample6 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset6). rgb;
               vec3 sample7 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset7). rgb;
               vec3 sample8 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset7). rgb;
               vec3 sample9 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset6). rgb;
               vec3 sample10 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset5). rgb;
               vec3 sample11 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset4). rgb;
               vec3 sample12 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset3). rgb;
               vec3 sample13 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset2). rgb;
               vec3 sample14 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset1). rgb;
               vec3 sample15 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset0). rgb;

    return w_sum_inv *(
        w0 * sample0 + w1 * sample1 + w2 * sample2 + w3 * sample3 +
        w4 * sample4 + w5 * sample5 + w6 * sample6 + w7 * sample7 +
        w8 * sample8 + w9 * sample9 + w10 * sample10 + w11 * sample11 +
        w12 * sample12 + w13 * sample13 + w14 * sample14 + w15 * sample15);
}

     vec3 tex2Daa20x(sampler2D tex, vec2 tex_uv,
                 mat2x2 pixel_to_tex_uv, float frame)
{






















                 float grid_size = 20.0;
    assign_aa_cubic_constants();
               vec4 ssd_fai = get_subpixel_support_diam_and_final_axis_importance();
               vec2 subpixel_support_diameter = ssd_fai . xy;
               vec2 final_axis_importance = ssd_fai . zw;
               vec2 xy_step = vec2(1.0)/ grid_size * subpixel_support_diameter;
               vec2 xy_start_offset = vec2(0.5 - grid_size * 0.5)* xy_step;

               vec2 xy_offset0 = xy_start_offset + vec2(7.0, 0.0)* xy_step;
               vec2 xy_offset1 = xy_start_offset + vec2(16.0, 1.0)* xy_step;
               vec2 xy_offset2 = xy_start_offset + vec2(11.0, 2.0)* xy_step;
               vec2 xy_offset3 = xy_start_offset + vec2(1.0, 3.0)* xy_step;
               vec2 xy_offset4 = xy_start_offset + vec2(5.0, 4.0)* xy_step;
               vec2 xy_offset5 = xy_start_offset + vec2(15.0, 5.0)* xy_step;
               vec2 xy_offset6 = xy_start_offset + vec2(10.0, 6.0)* xy_step;
               vec2 xy_offset7 = xy_start_offset + vec2(19.0, 7.0)* xy_step;
               vec2 xy_offset8 = xy_start_offset + vec2(2.0, 8.0)* xy_step;
               vec2 xy_offset9 = xy_start_offset + vec2(6.0, 9.0)* xy_step;

               vec3 w0 = eval_unorm_rgb_weights(xy_offset0, final_axis_importance);
               vec3 w1 = eval_unorm_rgb_weights(xy_offset1, final_axis_importance);
               vec3 w2 = eval_unorm_rgb_weights(xy_offset2, final_axis_importance);
               vec3 w3 = eval_unorm_rgb_weights(xy_offset3, final_axis_importance);
               vec3 w4 = eval_unorm_rgb_weights(xy_offset4, final_axis_importance);
               vec3 w5 = eval_unorm_rgb_weights(xy_offset5, final_axis_importance);
               vec3 w6 = eval_unorm_rgb_weights(xy_offset6, final_axis_importance);
               vec3 w7 = eval_unorm_rgb_weights(xy_offset7, final_axis_importance);
               vec3 w8 = eval_unorm_rgb_weights(xy_offset8, final_axis_importance);
               vec3 w9 = eval_unorm_rgb_weights(xy_offset9, final_axis_importance);
               vec3 w10 = w9 . bgr;
               vec3 w11 = w8 . bgr;
               vec3 w12 = w7 . bgr;
               vec3 w13 = w6 . bgr;
               vec3 w14 = w5 . bgr;
               vec3 w15 = w4 . bgr;
               vec3 w16 = w3 . bgr;
               vec3 w17 = w2 . bgr;
               vec3 w18 = w1 . bgr;
               vec3 w19 = w0 . bgr;

               vec3 half_sum = w0 + w1 + w2 + w3 + w4 + w5 + w6 + w7 + w8 + w9;
               vec3 w_sum = half_sum + half_sum . bgr;
               vec3 w_sum_inv = vec3(1.0)/(w_sum);

                 mat2x2 true_pixel_to_tex_uv =
               mat2x2((pixel_to_tex_uv * aa_pixel_diameter));


               vec2 frame_sign = get_frame_sign(frame);
               vec2 uv_offset0 =(xy_offset0 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset1 =(xy_offset1 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset2 =(xy_offset2 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset3 =(xy_offset3 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset4 =(xy_offset4 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset5 =(xy_offset5 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset6 =(xy_offset6 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset7 =(xy_offset7 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset8 =(xy_offset8 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset9 =(xy_offset9 * frame_sign * true_pixel_to_tex_uv);

               vec3 sample0 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset0). rgb;
               vec3 sample1 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset1). rgb;
               vec3 sample2 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset2). rgb;
               vec3 sample3 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset3). rgb;
               vec3 sample4 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset4). rgb;
               vec3 sample5 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset5). rgb;
               vec3 sample6 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset6). rgb;
               vec3 sample7 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset7). rgb;
               vec3 sample8 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset8). rgb;
               vec3 sample9 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset9). rgb;
               vec3 sample10 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset9). rgb;
               vec3 sample11 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset8). rgb;
               vec3 sample12 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset7). rgb;
               vec3 sample13 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset6). rgb;
               vec3 sample14 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset5). rgb;
               vec3 sample15 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset4). rgb;
               vec3 sample16 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset3). rgb;
               vec3 sample17 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset2). rgb;
               vec3 sample18 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset1). rgb;
               vec3 sample19 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset0). rgb;

    return w_sum_inv *(
        w0 * sample0 + w1 * sample1 + w2 * sample2 + w3 * sample3 +
        w4 * sample4 + w5 * sample5 + w6 * sample6 + w7 * sample7 +
        w8 * sample8 + w9 * sample9 + w10 * sample10 + w11 * sample11 +
        w12 * sample12 + w13 * sample13 + w14 * sample14 + w15 * sample15 +
        w16 * sample16 + w17 * sample17 + w18 * sample18 + w19 * sample19);
}

     vec3 tex2Daa24x(sampler2D tex, vec2 tex_uv,
                 mat2x2 pixel_to_tex_uv, float frame)
{


























                 float grid_size = 24.0;
    assign_aa_cubic_constants();
               vec4 ssd_fai = get_subpixel_support_diam_and_final_axis_importance();
               vec2 subpixel_support_diameter = ssd_fai . xy;
               vec2 final_axis_importance = ssd_fai . zw;
               vec2 xy_step = vec2(1.0)/ grid_size * subpixel_support_diameter;
               vec2 xy_start_offset = vec2(0.5 - grid_size * 0.5)* xy_step;

               vec2 xy_offset0 = xy_start_offset + vec2(6.0, 0.0)* xy_step;
               vec2 xy_offset1 = xy_start_offset + vec2(16.0, 1.0)* xy_step;
               vec2 xy_offset2 = xy_start_offset + vec2(10.0, 2.0)* xy_step;
               vec2 xy_offset3 = xy_start_offset + vec2(21.0, 3.0)* xy_step;
               vec2 xy_offset4 = xy_start_offset + vec2(5.0, 4.0)* xy_step;
               vec2 xy_offset5 = xy_start_offset + vec2(15.0, 5.0)* xy_step;
               vec2 xy_offset6 = xy_start_offset + vec2(1.0, 6.0)* xy_step;
               vec2 xy_offset7 = xy_start_offset + vec2(11.0, 7.0)* xy_step;
               vec2 xy_offset8 = xy_start_offset + vec2(19.0, 8.0)* xy_step;
               vec2 xy_offset9 = xy_start_offset + vec2(23.0, 9.0)* xy_step;
               vec2 xy_offset10 = xy_start_offset + vec2(3.0, 10.0)* xy_step;
               vec2 xy_offset11 = xy_start_offset + vec2(14.0, 11.0)* xy_step;

               vec3 w0 = eval_unorm_rgb_weights(xy_offset0, final_axis_importance);
               vec3 w1 = eval_unorm_rgb_weights(xy_offset1, final_axis_importance);
               vec3 w2 = eval_unorm_rgb_weights(xy_offset2, final_axis_importance);
               vec3 w3 = eval_unorm_rgb_weights(xy_offset3, final_axis_importance);
               vec3 w4 = eval_unorm_rgb_weights(xy_offset4, final_axis_importance);
               vec3 w5 = eval_unorm_rgb_weights(xy_offset5, final_axis_importance);
               vec3 w6 = eval_unorm_rgb_weights(xy_offset6, final_axis_importance);
               vec3 w7 = eval_unorm_rgb_weights(xy_offset7, final_axis_importance);
               vec3 w8 = eval_unorm_rgb_weights(xy_offset8, final_axis_importance);
               vec3 w9 = eval_unorm_rgb_weights(xy_offset9, final_axis_importance);
               vec3 w10 = eval_unorm_rgb_weights(xy_offset10, final_axis_importance);
               vec3 w11 = eval_unorm_rgb_weights(xy_offset11, final_axis_importance);
               vec3 w12 = w11 . bgr;
               vec3 w13 = w10 . bgr;
               vec3 w14 = w9 . bgr;
               vec3 w15 = w8 . bgr;
               vec3 w16 = w7 . bgr;
               vec3 w17 = w6 . bgr;
               vec3 w18 = w5 . bgr;
               vec3 w19 = w4 . bgr;
               vec3 w20 = w3 . bgr;
               vec3 w21 = w2 . bgr;
               vec3 w22 = w1 . bgr;
               vec3 w23 = w0 . bgr;

               vec3 half_sum = w0 + w1 + w2 + w3 + w4 +
        w5 + w6 + w7 + w8 + w9 + w10 + w11;
               vec3 w_sum = half_sum + half_sum . bgr;
               vec3 w_sum_inv = vec3(1.0)/(w_sum);

                 mat2x2 true_pixel_to_tex_uv =
               mat2x2((pixel_to_tex_uv * aa_pixel_diameter));


               vec2 frame_sign = get_frame_sign(frame);
               vec2 uv_offset0 =(xy_offset0 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset1 =(xy_offset1 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset2 =(xy_offset2 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset3 =(xy_offset3 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset4 =(xy_offset4 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset5 =(xy_offset5 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset6 =(xy_offset6 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset7 =(xy_offset7 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset8 =(xy_offset8 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset9 =(xy_offset9 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset10 =(xy_offset10 * frame_sign * true_pixel_to_tex_uv);
               vec2 uv_offset11 =(xy_offset11 * frame_sign * true_pixel_to_tex_uv);

               vec3 sample0 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset0). rgb;
               vec3 sample1 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset1). rgb;
               vec3 sample2 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset2). rgb;
               vec3 sample3 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset3). rgb;
               vec3 sample4 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset4). rgb;
               vec3 sample5 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset5). rgb;
               vec3 sample6 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset6). rgb;
               vec3 sample7 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset7). rgb;
               vec3 sample8 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset8). rgb;
               vec3 sample9 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset9). rgb;
               vec3 sample10 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset10). rgb;
               vec3 sample11 = tex2Daa_tiled_linearize(tex, tex_uv + uv_offset11). rgb;
               vec3 sample12 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset11). rgb;
               vec3 sample13 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset10). rgb;
               vec3 sample14 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset9). rgb;
               vec3 sample15 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset8). rgb;
               vec3 sample16 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset7). rgb;
               vec3 sample17 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset6). rgb;
               vec3 sample18 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset5). rgb;
               vec3 sample19 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset4). rgb;
               vec3 sample20 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset3). rgb;
               vec3 sample21 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset2). rgb;
               vec3 sample22 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset1). rgb;
               vec3 sample23 = tex2Daa_tiled_linearize(tex, tex_uv - uv_offset0). rgb;

    return w_sum_inv *(
        w0 * sample0 + w1 * sample1 + w2 * sample2 + w3 * sample3 +
        w4 * sample4 + w5 * sample5 + w6 * sample6 + w7 * sample7 +
        w8 * sample8 + w9 * sample9 + w10 * sample10 + w11 * sample11 +
        w12 * sample12 + w13 * sample13 + w14 * sample14 + w15 * sample15 +
        w16 * sample16 + w17 * sample17 + w18 * sample18 + w19 * sample19 +
        w20 * sample20 + w21 * sample21 + w22 * sample22 + w23 * sample23);
}

     vec3 tex2Daa_debug_16x_regular(sampler2D tex, vec2 tex_uv,
                 mat2x2 pixel_to_tex_uv, float frame)
{

                 float grid_size = 4.0;
    assign_aa_cubic_constants();
               vec4 ssd_fai = get_subpixel_support_diam_and_final_axis_importance();
               vec2 subpixel_support_diameter = ssd_fai . xy;
               vec2 final_axis_importance = ssd_fai . zw;
               vec2 xy_step = vec2(1.0)/ grid_size * subpixel_support_diameter;
               vec2 xy_start_offset = vec2(0.5 - grid_size * 0.5)* xy_step;

               vec2 xy_offset0 = xy_start_offset + vec2(0.0, 0.0)* xy_step;
               vec2 xy_offset1 = xy_start_offset + vec2(1.0, 0.0)* xy_step;
               vec2 xy_offset2 = xy_start_offset + vec2(2.0, 0.0)* xy_step;
               vec2 xy_offset3 = xy_start_offset + vec2(3.0, 0.0)* xy_step;
               vec2 xy_offset4 = xy_start_offset + vec2(0.0, 1.0)* xy_step;
               vec2 xy_offset5 = xy_start_offset + vec2(1.0, 1.0)* xy_step;
               vec2 xy_offset6 = xy_start_offset + vec2(2.0, 1.0)* xy_step;
               vec2 xy_offset7 = xy_start_offset + vec2(3.0, 1.0)* xy_step;




               vec3 w0 = eval_unorm_rgb_weights(xy_offset0, final_axis_importance);
               vec3 w1 = eval_unorm_rgb_weights(xy_offset1, final_axis_importance);
               vec3 w2 = eval_unorm_rgb_weights(xy_offset2, final_axis_importance);
               vec3 w3 = eval_unorm_rgb_weights(xy_offset3, final_axis_importance);
               vec3 w4 = eval_unorm_rgb_weights(xy_offset4, final_axis_importance);
               vec3 w5 = eval_unorm_rgb_weights(xy_offset5, final_axis_importance);
               vec3 w6 = eval_unorm_rgb_weights(xy_offset6, final_axis_importance);
               vec3 w7 = eval_unorm_rgb_weights(xy_offset7, final_axis_importance);
               vec3 w8 = w7 . bgr;
               vec3 w9 = w6 . bgr;
               vec3 w10 = w5 . bgr;
               vec3 w11 = w4 . bgr;
               vec3 w12 = w3 . bgr;
               vec3 w13 = w2 . bgr;
               vec3 w14 = w1 . bgr;
               vec3 w15 = w0 . bgr;

               vec3 half_sum = w0 + w1 + w2 + w3 + w4 + w5 + w6 + w7;
               vec3 w_sum = half_sum + half_sum . bgr;
               vec3 w_sum_inv = vec3(1.0)/(w_sum);

                 mat2x2 true_pixel_to_tex_uv =
               mat2x2((pixel_to_tex_uv * aa_pixel_diameter));

               vec2 uv_step_x =(vec2(xy_step . x, 0.0)* true_pixel_to_tex_uv);
               vec2 uv_step_y =(vec2(0.0, xy_step . y)* true_pixel_to_tex_uv);
               vec2 uv_offset0 = - 1.5 *(uv_step_x + uv_step_y);
               vec2 sample0_uv = tex_uv + uv_offset0;
               vec2 sample4_uv = sample0_uv + uv_step_y;
               vec2 sample8_uv = sample0_uv + uv_step_y * 2.0;
               vec2 sample12_uv = sample0_uv + uv_step_y * 3.0;

               vec3 sample0 = tex2Daa_tiled_linearize(tex, sample0_uv). rgb;
               vec3 sample1 = tex2Daa_tiled_linearize(tex, sample0_uv + uv_step_x). rgb;
               vec3 sample2 = tex2Daa_tiled_linearize(tex, sample0_uv + uv_step_x * 2.0). rgb;
               vec3 sample3 = tex2Daa_tiled_linearize(tex, sample0_uv + uv_step_x * 3.0). rgb;
               vec3 sample4 = tex2Daa_tiled_linearize(tex, sample4_uv). rgb;
               vec3 sample5 = tex2Daa_tiled_linearize(tex, sample4_uv + uv_step_x). rgb;
               vec3 sample6 = tex2Daa_tiled_linearize(tex, sample4_uv + uv_step_x * 2.0). rgb;
               vec3 sample7 = tex2Daa_tiled_linearize(tex, sample4_uv + uv_step_x * 3.0). rgb;
               vec3 sample8 = tex2Daa_tiled_linearize(tex, sample8_uv). rgb;
               vec3 sample9 = tex2Daa_tiled_linearize(tex, sample8_uv + uv_step_x). rgb;
               vec3 sample10 = tex2Daa_tiled_linearize(tex, sample8_uv + uv_step_x * 2.0). rgb;
               vec3 sample11 = tex2Daa_tiled_linearize(tex, sample8_uv + uv_step_x * 3.0). rgb;
               vec3 sample12 = tex2Daa_tiled_linearize(tex, sample12_uv). rgb;
               vec3 sample13 = tex2Daa_tiled_linearize(tex, sample12_uv + uv_step_x). rgb;
               vec3 sample14 = tex2Daa_tiled_linearize(tex, sample12_uv + uv_step_x * 2.0). rgb;
               vec3 sample15 = tex2Daa_tiled_linearize(tex, sample12_uv + uv_step_x * 3.0). rgb;

    return w_sum_inv *(
        w0 * sample0 + w1 * sample1 + w2 * sample2 + w3 * sample3 +
        w4 * sample4 + w5 * sample5 + w6 * sample6 + w7 * sample7 +
        w8 * sample8 + w9 * sample9 + w10 * sample10 + w11 * sample11 +
        w12 * sample12 + w13 * sample13 + w14 * sample14 + w15 * sample15);
}

     vec3 tex2Daa_debug_dynamic(sampler2D tex, vec2 tex_uv,
                 mat2x2 pixel_to_tex_uv, float frame)
{

                 int grid_size = 8;
    assign_aa_cubic_constants();
               vec4 ssd_fai = get_subpixel_support_diam_and_final_axis_importance();
               vec2 subpixel_support_diameter = ssd_fai . xy;
               vec2 final_axis_importance = ssd_fai . zw;
          float grid_radius_in_samples =(float(grid_size)- 1.0)/ 2.0;
               vec2 filter_space_offset_step =
        subpixel_support_diameter / vec2(grid_size);
               vec2 sample0_filter_space_offset =
        - grid_radius_in_samples * filter_space_offset_step;

         vec3 weights[64];
         vec3 weight_sum = vec3(0.0, 0.0, 0.0);
    for(int i = 0;i < grid_size;++ i)
    {
        for(int j = 0;j < grid_size;++ j)
        {

                       vec2 offset = sample0_filter_space_offset +
                     vec2(j, i)* filter_space_offset_step;
                       vec3 weight = eval_unorm_rgb_weights(offset, final_axis_importance);
            weights[i * grid_size + j]= weight;
            weight_sum += weight;
        }
    }

                 mat2x2 true_pixel_to_tex_uv =
               mat2x2((pixel_to_tex_uv * aa_pixel_diameter));
               vec2 uv_offset_step_x =
                                               (vec2(filter_space_offset_step . x, 0.0)* true_pixel_to_tex_uv);
               vec2 uv_offset_step_y =
                                               (vec2(0.0, filter_space_offset_step . y)* true_pixel_to_tex_uv);

               vec2 sample0_uv_offset = - grid_radius_in_samples *
        (uv_offset_step_x + uv_offset_step_y);
               vec2 sample0_uv = tex_uv + sample0_uv_offset;

         vec3 sum = vec3(0.0, 0.0, 0.0);
               vec3 weight_sum_inv = vec3(1.0)/ weight_sum;
    for(int i = 0;i < grid_size;++ i)
    {
                   vec2 row_i_first_sample_uv =
            sample0_uv + i * uv_offset_step_y;
        for(int j = 0;j < grid_size;++ j)
        {
                       vec2 sample_uv =
                row_i_first_sample_uv + j * uv_offset_step_x;
            sum += weights[i * grid_size + j]*
                tex2Daa_tiled_linearize(tex, sample_uv). rgb;
        }
    }
    return sum * weight_sum_inv;
}




            vec3 tex2Daa(sampler2D tex, vec2 tex_uv,
                 mat2x2 pixel_to_tex_uv, float frame)
{

    return(aa_level < 0.5)? tex2D_linearize(tex, tex_uv). rgb :
        (aa_level < 3.5)? tex2Daa_subpixel_weights_only(
            tex, tex_uv, pixel_to_tex_uv):
        (aa_level < 4.5)? tex2Daa4x(tex, tex_uv, pixel_to_tex_uv, frame):
        (aa_level < 5.5)? tex2Daa5x(tex, tex_uv, pixel_to_tex_uv, frame):
        (aa_level < 6.5)? tex2Daa6x(tex, tex_uv, pixel_to_tex_uv, frame):
        (aa_level < 7.5)? tex2Daa7x(tex, tex_uv, pixel_to_tex_uv, frame):
        (aa_level < 11.5)? tex2Daa8x(tex, tex_uv, pixel_to_tex_uv, frame):
        (aa_level < 15.5)? tex2Daa12x(tex, tex_uv, pixel_to_tex_uv, frame):
        (aa_level < 19.5)? tex2Daa16x(tex, tex_uv, pixel_to_tex_uv, frame):
        (aa_level < 23.5)? tex2Daa20x(tex, tex_uv, pixel_to_tex_uv, frame):
        (aa_level < 253.5)? tex2Daa24x(tex, tex_uv, pixel_to_tex_uv, frame):
        (aa_level < 254.5)? tex2Daa_debug_16x_regular(
            tex, tex_uv, pixel_to_tex_uv, frame):
        tex2Daa_debug_dynamic(tex, tex_uv, pixel_to_tex_uv, frame);
}



































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































     vec2 quadratic_solve(float a, float b_over_2, float c)
{






          float discriminant = b_over_2 * b_over_2 - a * c;
          float solution0 = c /(- b_over_2 + sqrt(discriminant));
    return vec2(solution0, discriminant);
}

     vec2 intersect_sphere(vec3 view_vec, vec3 eye_pos_vec)
{









          float a = dot(view_vec, view_vec);
          float b_over_2 = dot(view_vec, eye_pos_vec);
          float c = dot(eye_pos_vec, eye_pos_vec)- global . geom_radius * global . geom_radius;
    return quadratic_solve(a, b_over_2, c);
}

     vec2 intersect_cylinder(vec3 view_vec, vec3 eye_pos_vec)
{











               vec3 cylinder_top_vec = vec3(0.0, global . geom_radius, 0.0);
               vec3 cylinder_axis_vec = vec3(0.0, 1.0, 0.0);
               vec3 top_to_eye_vec = eye_pos_vec - cylinder_top_vec;
               vec3 axis_x_view = cross(cylinder_axis_vec, view_vec);
               vec3 axis_x_top_to_eye = cross(cylinder_axis_vec, top_to_eye_vec);

          float a = dot(axis_x_view, axis_x_view);
          float b_over_2 = dot(axis_x_top_to_eye, axis_x_view);
          float c = dot(axis_x_top_to_eye, axis_x_top_to_eye)-
                  global . geom_radius * global . geom_radius;
    return quadratic_solve(a, b_over_2, c);
}

     vec2 cylinder_xyz_to_uv(vec3 intersection_pos_local,
               vec2 geom_aspect)
{





          float angle_from_image_center =
                                atan(intersection_pos_local . z, intersection_pos_local . x);
          float signed_arc_len = angle_from_image_center * global . geom_radius;


               vec2 square_uv = vec2(signed_arc_len, - intersection_pos_local . y);
               vec2 video_uv = square_uv / geom_aspect;
    return video_uv;
}

     vec3 cylinder_uv_to_xyz(vec2 video_uv, vec2 geom_aspect)
{





               vec2 square_uv = video_uv * geom_aspect;
          float arc_len = square_uv . x;
          float angle_from_image_center = arc_len / global . geom_radius;
          float x_pos = sin(angle_from_image_center)* global . geom_radius;
          float z_pos = cos(angle_from_image_center)* global . geom_radius;


               vec3 intersection_pos_local = vec3(x_pos, - square_uv . y, z_pos);
    return intersection_pos_local;
}

     vec2 sphere_xyz_to_uv(vec3 intersection_pos_local,
               vec2 geom_aspect)
{














               vec3 image_center_pos_local = vec3(0.0, 0.0, global . geom_radius);
          float cp_len =
        length(cross(intersection_pos_local, image_center_pos_local));
          float dp = dot(intersection_pos_local, image_center_pos_local);
          float angle_from_image_center = atan(dp, cp_len);
          float arc_len = angle_from_image_center * global . geom_radius;


               vec2 square_uv_unit = normalize(vec2(intersection_pos_local . x,
        - intersection_pos_local . y));
               vec2 square_uv = arc_len * square_uv_unit;
               vec2 video_uv = square_uv / geom_aspect;
    return video_uv;
}

     vec3 sphere_uv_to_xyz(vec2 video_uv, vec2 geom_aspect)
{





               vec2 square_uv = video_uv * geom_aspect;




               vec2 square_uv_unit = normalize(square_uv);
          float arc_len = square_uv . y / square_uv_unit . y;
          float angle_from_image_center = arc_len / global . geom_radius;
          float xy_dist_from_sphere_center =
        sin(angle_from_image_center)* global . geom_radius;

               vec2 xy_pos = xy_dist_from_sphere_center * square_uv_unit;
          float z_pos = cos(angle_from_image_center)* global . geom_radius;
               vec3 intersection_pos_local = vec3(xy_pos . x, - xy_pos . y, z_pos);
    return intersection_pos_local;
}

     vec2 sphere_alt_xyz_to_uv(vec3 intersection_pos_local,
               vec2 geom_aspect)
{





               vec2 angle_from_image_center =

                                 atan(intersection_pos_local . zz, vec2(intersection_pos_local . x, - intersection_pos_local . y));
               vec2 signed_arc_len = angle_from_image_center * global . geom_radius;
               vec2 video_uv = signed_arc_len / geom_aspect;
    return video_uv;
}

     vec3 sphere_alt_uv_to_xyz(vec2 video_uv, vec2 geom_aspect)
{




               vec2 square_uv = video_uv * geom_aspect;
               vec2 arc_len = square_uv;
               vec2 angle_from_image_center = arc_len / global . geom_radius;
               vec2 xy_pos = sin(angle_from_image_center)* global . geom_radius;
          float z_pos = sqrt(global . geom_radius * global . geom_radius - dot(xy_pos, xy_pos));
    return vec3(xy_pos . x, - xy_pos . y, z_pos);
}

            vec2 intersect(vec3 view_vec_local, vec3 eye_pos_local,
          float geom_mode)
{
    return geom_mode < 2.5 ? intersect_sphere(view_vec_local, eye_pos_local):
        intersect_cylinder(view_vec_local, eye_pos_local);
}

            vec2 xyz_to_uv(vec3 intersection_pos_local,
               vec2 geom_aspect, float geom_mode)
{
    return geom_mode < 1.5 ?
            sphere_xyz_to_uv(intersection_pos_local, geom_aspect):
        geom_mode < 2.5 ?
            sphere_alt_xyz_to_uv(intersection_pos_local, geom_aspect):
            cylinder_xyz_to_uv(intersection_pos_local, geom_aspect);
}

            vec3 uv_to_xyz(vec2 uv, vec2 geom_aspect,
          float geom_mode)
{
    return geom_mode < 1.5 ? sphere_uv_to_xyz(uv, geom_aspect):
        geom_mode < 2.5 ? sphere_alt_uv_to_xyz(uv, geom_aspect):
        cylinder_uv_to_xyz(uv, geom_aspect);
}

     vec2 view_vec_to_uv(vec3 view_vec_local, vec3 eye_pos_local,
               vec2 geom_aspect, float geom_mode, out vec3 intersection_pos)
{


               vec2 intersect_dist_and_discriminant = intersect(view_vec_local,
        eye_pos_local, geom_mode);
               vec3 intersection_pos_local = eye_pos_local +
        view_vec_local * intersect_dist_and_discriminant . x;

    intersection_pos = intersection_pos_local;


    return intersect_dist_and_discriminant . y > 0.005 ?
        xyz_to_uv(intersection_pos_local, geom_aspect, geom_mode): vec2(1.0);
}

     vec3 get_ideal_global_eye_pos_for_points(vec3 eye_pos,
               vec2 geom_aspect, vec3 global_coords[9],
          int num_points)
{

































                 int max_centering_iters = 1;
    for(int iter = 0;iter < max_centering_iters;iter ++)
    {

             vec3 eyespace_coords[9];
        for(int i = 0;i < num_points;i ++)
        {
            eyespace_coords[i]= global_coords[i]- eye_pos;
        }












        float abs_radius = abs(global . geom_radius);
             vec2 offset_dr_min = vec2(10.0 * abs_radius, 10.0 * abs_radius);
             vec2 offset_ul_max = vec2(- 10.0 * abs_radius, - 10.0 * abs_radius);
        for(int i = 0;i < num_points;i ++)
        {
                              vec2 flipy = vec2(1.0, - 1.0);
                 vec3 eyespace_xyz = eyespace_coords[i];
                 vec2 offset_dr = eyespace_xyz . xy - vec2(- 0.5)*
                (geom_aspect * - eyespace_xyz . z)/(global . geom_view_dist * flipy);
                 vec2 offset_ul = eyespace_xyz . xy - vec2(0.5)*
                (geom_aspect * - eyespace_xyz . z)/(global . geom_view_dist * flipy);
            offset_dr_min = min(offset_dr_min, offset_dr);
            offset_ul_max = max(offset_ul_max, offset_ul);
        }



             vec2 center_offset = 0.5 *(offset_ul_max + offset_dr_min);
        eye_pos . xy += center_offset;
        for(int i = 0;i < num_points;i ++)
        {
            eyespace_coords[i]= global_coords[i]- eye_pos;
        }















        float offset_z_max = - 10.0 * global . geom_radius * global . geom_view_dist;
        for(int i = 0;i < num_points;i ++)
        {
                 vec3 eyespace_xyz_flipy = eyespace_coords[i]*
                     vec3(1.0, - 1.0, 1.0);
                 vec4 offset_zzzz = eyespace_xyz_flipy . zzzz +
                (eyespace_xyz_flipy . xyxy * global . geom_view_dist)/
                (vec4(- 0.5, - 0.5, 0.5, 0.5)* vec4(geom_aspect, geom_aspect));



            offset_z_max =(eyespace_xyz_flipy . x < 0.0)?
                max(offset_z_max, offset_zzzz . x): offset_z_max;
            offset_z_max =(eyespace_xyz_flipy . y < 0.0)?
                max(offset_z_max, offset_zzzz . y): offset_z_max;
            offset_z_max =(eyespace_xyz_flipy . x > 0.0)?
                max(offset_z_max, offset_zzzz . z): offset_z_max;
            offset_z_max =(eyespace_xyz_flipy . y > 0.0)?
                max(offset_z_max, offset_zzzz . w): offset_z_max;
            offset_z_max = max(offset_z_max, eyespace_xyz_flipy . z);
        }

        eye_pos . z += offset_z_max;
    }
    return eye_pos;
}

     vec3 get_ideal_global_eye_pos(mat3x3 local_to_global,
               vec2 geom_aspect, float geom_mode)
{


               vec3 high_view = vec3(0.0, geom_aspect . y, - global . geom_view_dist);
               vec3 low_view = high_view * vec3(1.0, - 1.0, 1.0);
          float len_sq = dot(high_view, high_view);
          float fov = abs(acos(dot(high_view, low_view)/ len_sq));

          float eye_z_spherical = global . geom_radius / sin(fov * 0.5);
               vec3 eye_pos = geom_mode < 2.5 ?
             vec3(0.0, 0.0, eye_z_spherical):
             vec3(0.0, 0.0, max(global . geom_view_dist, eye_z_spherical));







                 int num_points = 9;
         vec3 global_coords[9];
    global_coords[0]=(uv_to_xyz(vec2(0.0, 0.0), geom_aspect, geom_mode)* local_to_global);
    global_coords[1]=(uv_to_xyz(vec2(0.0, - 0.5), geom_aspect, geom_mode)* local_to_global);
    global_coords[2]=(uv_to_xyz(vec2(0.0, 0.5), geom_aspect, geom_mode)* local_to_global);
    global_coords[3]=(uv_to_xyz(vec2(- 0.5, 0.0), geom_aspect, geom_mode)* local_to_global);
    global_coords[4]=(uv_to_xyz(vec2(0.5, 0.0), geom_aspect, geom_mode)* local_to_global);
    global_coords[5]=(uv_to_xyz(vec2(- 0.5, - 0.5), geom_aspect, geom_mode)* local_to_global);
    global_coords[6]=(uv_to_xyz(vec2(0.5, - 0.5), geom_aspect, geom_mode)* local_to_global);
    global_coords[7]=(uv_to_xyz(vec2(- 0.5, 0.5), geom_aspect, geom_mode)* local_to_global);
    global_coords[8]=(uv_to_xyz(vec2(0.5, 0.5), geom_aspect, geom_mode)* local_to_global);



    float num_negative_z_coords = 0.0;
    for(int i = 0;i < num_points;i ++)
    {
        num_negative_z_coords += float(global_coords[0]. z < 0.0);
    }

    return num_negative_z_coords > 0.5 ? eye_pos :
        get_ideal_global_eye_pos_for_points(eye_pos, geom_aspect,
            global_coords, num_points);
}

       mat3x3 get_pixel_to_object_matrix(mat3x3 global_to_local,
               vec3 eye_pos_local, vec3 view_vec_global,
               vec3 intersection_pos_local, vec3 normal,
               vec2 output_size_inv)
{











               vec3 pos = intersection_pos_local;
               vec3 eye_pos = eye_pos_local;




               vec3 view_vec_right_global = view_vec_global +
             vec3(output_size_inv . x, 0.0, 0.0);
               vec3 view_vec_down_global = view_vec_global +
             vec3(0.0, - output_size_inv . y, 0.0);
               vec3 view_vec_right_local =
                                                  (view_vec_right_global * global_to_local);
               vec3 view_vec_down_local =
                                                 (view_vec_down_global * global_to_local);


               vec3 intersection_vec_dot_normal = vec3(dot(pos - eye_pos, normal), dot(pos - eye_pos, normal), dot(pos - eye_pos, normal));
               vec3 right_pos = eye_pos +(intersection_vec_dot_normal /
        dot(view_vec_right_local, normal))* view_vec_right_local;
               vec3 down_pos = eye_pos +(intersection_vec_dot_normal /
        dot(view_vec_down_local, normal))* view_vec_down_local;






               vec3 object_right_vec = right_pos - pos;
               vec3 object_down_vec = down_pos - pos;
                 mat3x3 pixel_to_object = mat3x3(
        object_right_vec . x, object_down_vec . x, 0.0,
        object_right_vec . y, object_down_vec . y, 0.0,
        object_right_vec . z, object_down_vec . z, 0.0);
    return pixel_to_object;
}

       mat3x3 get_object_to_tangent_matrix(vec3 intersection_pos_local,
               vec3 normal, vec2 geom_aspect, float geom_mode)
{






















               vec3 pos = intersection_pos_local;
                      vec3 x_vec = vec3(1.0, 0.0, 0.0);
                      vec3 y_vec = vec3(0.0, 1.0, 0.0);



         vec3 cotangent_unscaled, cobitangent_unscaled;

    if(geom_mode < 1.5)
    {









        cotangent_unscaled = normalize(cross(y_vec, pos))* geom_aspect . y;
        cobitangent_unscaled = normalize(cross(x_vec, pos))* geom_aspect . x;
    }
    else if(geom_mode < 2.5)
    {




                   vec3 tangent = normalize(
            cross(y_vec, vec3(pos . x, 0.0, pos . z)))* geom_aspect . x;
                   vec3 bitangent = normalize(
            cross(x_vec, vec3(0.0, pos . yz)))* geom_aspect . y;
        cotangent_unscaled = cross(normal, bitangent);
        cobitangent_unscaled = cross(tangent, normal);
    }
    else
    {








        cotangent_unscaled = cross(y_vec, normal)* geom_aspect . y;
        cobitangent_unscaled = vec3(0.0, - geom_aspect . x, 0.0);
    }
               vec3 computed_normal =
        cross(cobitangent_unscaled, cotangent_unscaled);
          float inv_determinant = inversesqrt(dot(computed_normal, computed_normal));
               vec3 cotangent = cotangent_unscaled * inv_determinant;
               vec3 cobitangent = cobitangent_unscaled * inv_determinant;


                 mat3x3 object_to_tangent = mat3x3(cotangent, cobitangent, normal);
    return object_to_tangent;
}

     vec2 get_curved_video_uv_coords_and_tangent_matrix(
               vec2 flat_video_uv, vec3 eye_pos_local,
               vec2 output_size_inv, vec2 geom_aspect,
          float geom_mode, mat3x3 global_to_local,
    out mat2x2 pixel_to_tangent_video_uv)
{





































               vec2 view_uv =(flat_video_uv - vec2(0.5))* geom_aspect;
               vec3 view_vec_global =
             vec3(view_uv . x, - view_uv . y, - global . geom_view_dist);


               vec3 view_vec_local =(view_vec_global * global_to_local);
         vec3 pos;
               vec2 centered_uv = view_vec_to_uv(
        view_vec_local, eye_pos_local, geom_aspect, geom_mode, pos);
               vec2 video_uv = centered_uv + vec2(0.5);




















        if(geom_force_correct_tangent_matrix)
        {

                       vec3 normal_base = geom_mode < 2.5 ? pos :
                     vec3(pos . x, 0.0, pos . z);
                       vec3 normal = normalize(normal_base);


                         mat3x3 pixel_to_object = get_pixel_to_object_matrix(
                global_to_local, eye_pos_local, view_vec_global, pos, normal,
                output_size_inv);
                         mat3x3 object_to_tangent = get_object_to_tangent_matrix(
                pos, normal, geom_aspect, geom_mode);
                         mat3x3 pixel_to_tangent3x3 =
                                                      (pixel_to_object * object_to_tangent);
            pixel_to_tangent_video_uv = mat2x2(
                pixel_to_tangent3x3[0][0], pixel_to_tangent3x3[0][1], pixel_to_tangent3x3[1][0], pixel_to_tangent3x3[1][1]);
        }
        else
        {


            pixel_to_tangent_video_uv = mat2x2(
                output_size_inv . x, 0.0, 0.0, output_size_inv . y);
        }

    return video_uv;
}

float get_border_dim_factor(vec2 video_uv, vec2 geom_aspect)
{










               vec2 edge_dists = min(video_uv, vec2(1.0)- video_uv)*
        geom_aspect;
               vec2 border_penetration =
        max(vec2(global . border_size)- edge_dists, vec2(0.0));
          float penetration_ratio = length(border_penetration)/ global . border_size;
          float border_escape_ratio = max(1.0 - penetration_ratio, 0.0);
          float border_dim_factor =
        pow(border_escape_ratio, global . border_darkness)* max(1.0, global . border_compress);
    return min(border_dim_factor, 1.0);
}











       mat2x2 mul_scale(vec2 scale, mat2x2 matrix)
{


    vec4 temp_matrix =(vec4(matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1])* scale . xxyy);
    return mat2x2(temp_matrix . x, temp_matrix . y, temp_matrix . z, temp_matrix . w);
}

layout(location = 0) in vec2 tex_uv;
layout(location = 1) in vec4 video_and_texture_size_inv;
layout(location = 2) in vec2 output_size_inv;
layout(location = 3) in vec3 eye_pos_local;
layout(location = 4) in vec4 geom_aspect_and_overscan;
layout(location = 5) in vec3 global_to_local_row0;
layout(location = 6) in vec3 global_to_local_row1;
layout(location = 7) in vec3 global_to_local_row2;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;


void main()
{

               vec2 geom_aspect = geom_aspect_and_overscan . xy;
               vec2 geom_overscan = geom_aspect_and_overscan . zw;
               vec2 video_size_inv = video_and_texture_size_inv . xy;
               vec2 texture_size_inv = video_and_texture_size_inv . zw;


                     mat3x3 global_to_local = mat3x3(global_to_local_row0,
            global_to_local_row1, global_to_local_row2);




              float geom_mode = global . geom_mode_runtime;








               vec2 flat_video_uv = tex_uv *(params . SourceSize . xy * video_size_inv);
           mat2x2 pixel_to_video_uv;
         vec2 video_uv_no_geom_overscan;
    if(geom_mode > 0.5)
    {
        video_uv_no_geom_overscan =
            get_curved_video_uv_coords_and_tangent_matrix(flat_video_uv,
                eye_pos_local, output_size_inv, geom_aspect,
                geom_mode, global_to_local, pixel_to_video_uv);
    }
    else
    {
        video_uv_no_geom_overscan = flat_video_uv;
        pixel_to_video_uv = mat2x2(
            output_size_inv . x, 0.0, 0.0, output_size_inv . y);
    }

               vec2 video_uv =
        (video_uv_no_geom_overscan - vec2(0.5, 0.5))/ geom_overscan + vec2(0.5, 0.5);
               vec2 tex_uv = video_uv *(params . SourceSize . xy * texture_size_inv);


                 mat2x2 pixel_to_tex_uv =
        mul_scale(params . SourceSize . xy * texture_size_inv /
            geom_aspect_and_overscan . zw, pixel_to_video_uv);





               vec2 abs_aa_r_offset = abs(get_aa_subpixel_r_offset());
          bool need_subpixel_aa = abs_aa_r_offset . x + abs_aa_r_offset . y > 0.0;
         vec3 color;







           if(aa_level > 0.5 && need_subpixel_aa)
    {

        color = tex2Daa_subpixel_weights_only(
                        Source, tex_uv, pixel_to_tex_uv);
    }
    else
    {
        color = tex2D_linearize(Source, tex_uv). rgb;
    }


          float border_dim_factor = get_border_dim_factor(video_uv, geom_aspect);
               vec3 final_color = color * border_dim_factor;

    FragColor = encode_output(vec4(final_color, 1.0));
}

