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


























                     bool linearize_input = true;
               float get_pass_input_gamma(){ return get_input_gamma();}








                     bool gamma_encode_output = false;
               float get_pass_output_gamma(){ return 1.0;}

















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



















































































































































































































































































































































































































































































































































































































































































































































































     vec4 erf6(vec4 x)
{






                   vec4 one = vec4(1.0);
            vec4 sign_x = sign(x);
            vec4 t = one /(one + 0.47047 * abs(x));
            vec4 result = one - t *(0.3480242 + t *(- 0.0958798 + t * 0.7478556))*
  exp(-(x * x));
 return result * sign_x;
}

     vec3 erf6(vec3 x)
{

                   vec3 one = vec3(1.0);
            vec3 sign_x = sign(x);
            vec3 t = one /(one + 0.47047 * abs(x));
            vec3 result = one - t *(0.3480242 + t *(- 0.0958798 + t * 0.7478556))*
  exp(-(x * x));
 return result * sign_x;
}

     vec2 erf6(vec2 x)
{

                   vec2 one = vec2(1.0);
            vec2 sign_x = sign(x);
            vec2 t = one /(one + 0.47047 * abs(x));
            vec2 result = one - t *(0.3480242 + t *(- 0.0958798 + t * 0.7478556))*
  exp(-(x * x));
 return result * sign_x;
}

float erf6(float x)
{

       float sign_x = sign(x);
       float t = 1.0 /(1.0 + 0.47047 * abs(x));
       float result = 1.0 - t *(0.3480242 + t *(- 0.0958798 + t * 0.7478556))*
  exp(-(x * x));
 return result * sign_x;
}

     vec4 erft(vec4 x)
{







 return tanh(1.202760580 * x);
}

     vec3 erft(vec3 x)
{

 return tanh(1.202760580 * x);
}

     vec2 erft(vec2 x)
{

 return tanh(1.202760580 * x);
}

float erft(float x)
{

 return tanh(1.202760580 * x);
}

            vec4 erf(vec4 x)
{





  return erf6(x);

}

            vec3 erf(vec3 x)
{




  return erf6(x);

}

            vec2 erf(vec2 x)
{




  return erf6(x);

}

       float erf(float x)
{




  return erf6(x);

}




     vec4 gamma_impl(vec4 s, vec4 s_inv)
{














                   vec4 g = vec4(1.12906830989);
                   vec4 c0 = vec4(0.8109119309638332633713423362694399653724431);
                   vec4 c1 = vec4(0.4808354605142681877121661197951496120000040);
                   vec4 e = vec4(2.71828182845904523536028747135266249775724709);
            vec4 sph = s + vec4(0.5);
            vec4 lanczos_sum = c0 + c1 /(s + vec4(1.0));
            vec4 base =(sph + g)/ e;


 return(pow(base, sph)* lanczos_sum)* s_inv;
}

     vec3 gamma_impl(vec3 s, vec3 s_inv)
{

                   vec3 g = vec3(1.12906830989);
                   vec3 c0 = vec3(0.8109119309638332633713423362694399653724431);
                   vec3 c1 = vec3(0.4808354605142681877121661197951496120000040);
                   vec3 e = vec3(2.71828182845904523536028747135266249775724709);
            vec3 sph = s + vec3(0.5);
            vec3 lanczos_sum = c0 + c1 /(s + vec3(1.0));
            vec3 base =(sph + g)/ e;
 return(pow(base, sph)* lanczos_sum)* s_inv;
}

     vec2 gamma_impl(vec2 s, vec2 s_inv)
{

                   vec2 g = vec2(1.12906830989);
                   vec2 c0 = vec2(0.8109119309638332633713423362694399653724431);
                   vec2 c1 = vec2(0.4808354605142681877121661197951496120000040);
                   vec2 e = vec2(2.71828182845904523536028747135266249775724709);
            vec2 sph = s + vec2(0.5);
            vec2 lanczos_sum = c0 + c1 /(s + vec2(1.0));
            vec2 base =(sph + g)/ e;
 return(pow(base, sph)* lanczos_sum)* s_inv;
}

float gamma_impl(float s, float s_inv)
{

              float g = 1.12906830989;
              float c0 = 0.8109119309638332633713423362694399653724431;
              float c1 = 0.4808354605142681877121661197951496120000040;
              float e = 2.71828182845904523536028747135266249775724709;
       float sph = s + 0.5;
       float lanczos_sum = c0 + c1 /(s + 1.0);
       float base =(sph + g)/ e;
 return(pow(base, sph)* lanczos_sum)* s_inv;
}

     vec4 gamma(vec4 s)
{




 return gamma_impl(s, vec4(1.0)/ s);
}

     vec3 gamma(vec3 s)
{

 return gamma_impl(s, vec3(1.0)/ s);
}

     vec2 gamma(vec2 s)
{

 return gamma_impl(s, vec2(1.0)/ s);
}

float gamma(float s)
{

 return gamma_impl(s, 1.0 / s);
}





     vec4 ligamma_small_z_impl(vec4 s, vec4 z, vec4 s_inv)
{














            vec4 scale = pow(z, s);
      vec4 sum = s_inv;

            vec4 z_sq = z * z;
            vec4 denom1 = s + vec4(1.0);
            vec4 denom2 = 2.0 * s + vec4(4.0);
            vec4 denom3 = 6.0 * s + vec4(18.0);

 sum -= z / denom1;
 sum += z_sq / denom2;
 sum -= z * z_sq / denom3;


 return scale * sum;
}

     vec3 ligamma_small_z_impl(vec3 s, vec3 z, vec3 s_inv)
{

            vec3 scale = pow(z, s);
      vec3 sum = s_inv;
            vec3 z_sq = z * z;
            vec3 denom1 = s + vec3(1.0);
            vec3 denom2 = 2.0 * s + vec3(4.0);
            vec3 denom3 = 6.0 * s + vec3(18.0);
 sum -= z / denom1;
 sum += z_sq / denom2;
 sum -= z * z_sq / denom3;
 return scale * sum;
}

     vec2 ligamma_small_z_impl(vec2 s, vec2 z, vec2 s_inv)
{

            vec2 scale = pow(z, s);
      vec2 sum = s_inv;
            vec2 z_sq = z * z;
            vec2 denom1 = s + vec2(1.0);
            vec2 denom2 = 2.0 * s + vec2(4.0);
            vec2 denom3 = 6.0 * s + vec2(18.0);
 sum -= z / denom1;
 sum += z_sq / denom2;
 sum -= z * z_sq / denom3;
 return scale * sum;
}

float ligamma_small_z_impl(float s, float z, float s_inv)
{

       float scale = pow(z, s);
 float sum = s_inv;
       float z_sq = z * z;
       float denom1 = s + 1.0;
       float denom2 = 2.0 * s + 4.0;
       float denom3 = 6.0 * s + 18.0;
 sum -= z / denom1;
 sum += z_sq / denom2;
 sum -= z * z_sq / denom3;
 return scale * sum;
}


     vec4 uigamma_large_z_impl(vec4 s, vec4 z)
{













            vec4 numerator = pow(z, s)* exp(- z);
      vec4 denom = vec4(7.0)+ z - s;
 denom = vec4(5.0)+ z - s +(3.0 * s - vec4(9.0))/ denom;
 denom = vec4(3.0)+ z - s +(2.0 * s - vec4(4.0))/ denom;
 denom = vec4(1.0)+ z - s +(s - vec4(1.0))/ denom;
 return numerator / denom;
}

     vec3 uigamma_large_z_impl(vec3 s, vec3 z)
{

            vec3 numerator = pow(z, s)* exp(- z);
      vec3 denom = vec3(7.0)+ z - s;
 denom = vec3(5.0)+ z - s +(3.0 * s - vec3(9.0))/ denom;
 denom = vec3(3.0)+ z - s +(2.0 * s - vec3(4.0))/ denom;
 denom = vec3(1.0)+ z - s +(s - vec3(1.0))/ denom;
 return numerator / denom;
}

     vec2 uigamma_large_z_impl(vec2 s, vec2 z)
{

            vec2 numerator = pow(z, s)* exp(- z);
      vec2 denom = vec2(7.0)+ z - s;
 denom = vec2(5.0)+ z - s +(3.0 * s - vec2(9.0))/ denom;
 denom = vec2(3.0)+ z - s +(2.0 * s - vec2(4.0))/ denom;
 denom = vec2(1.0)+ z - s +(s - vec2(1.0))/ denom;
 return numerator / denom;
}

float uigamma_large_z_impl(float s, float z)
{

       float numerator = pow(z, s)* exp(- z);
 float denom = 7.0 + z - s;
 denom = 5.0 + z - s +(3.0 * s - 9.0)/ denom;
 denom = 3.0 + z - s +(2.0 * s - 4.0)/ denom;
 denom = 1.0 + z - s +(s - 1.0)/ denom;
 return numerator / denom;
}


     vec4 normalized_ligamma_impl(vec4 s, vec4 z,
               vec4 s_inv, vec4 gamma_s_inv)
{











                   vec4 thresh = vec4(0.775075);
     bvec4 z_is_large;
 z_is_large . x = z . x > thresh . x;
 z_is_large . y = z . y > thresh . y;
 z_is_large . z = z . z > thresh . z;
 z_is_large . w = z . w > thresh . w;
            vec4 large_z = vec4(1.0)- uigamma_large_z_impl(s, z)* gamma_s_inv;
            vec4 small_z = ligamma_small_z_impl(s, z, s_inv)* gamma_s_inv;

     bvec4 inverse_z_is_large = not(z_is_large);
 return large_z * vec4(z_is_large)+ small_z * vec4(inverse_z_is_large);
}

     vec3 normalized_ligamma_impl(vec3 s, vec3 z,
               vec3 s_inv, vec3 gamma_s_inv)
{

                   vec3 thresh = vec3(0.775075);
     bvec3 z_is_large;
 z_is_large . x = z . x > thresh . x;
 z_is_large . y = z . y > thresh . y;
 z_is_large . z = z . z > thresh . z;
            vec3 large_z = vec3(1.0)- uigamma_large_z_impl(s, z)* gamma_s_inv;
            vec3 small_z = ligamma_small_z_impl(s, z, s_inv)* gamma_s_inv;
     bvec3 inverse_z_is_large = not(z_is_large);
 return large_z * vec3(z_is_large)+ small_z * vec3(inverse_z_is_large);
}

     vec2 normalized_ligamma_impl(vec2 s, vec2 z,
               vec2 s_inv, vec2 gamma_s_inv)
{

                   vec2 thresh = vec2(0.775075);
     bvec2 z_is_large;
 z_is_large . x = z . x > thresh . x;
 z_is_large . y = z . y > thresh . y;
            vec2 large_z = vec2(1.0)- uigamma_large_z_impl(s, z)* gamma_s_inv;
            vec2 small_z = ligamma_small_z_impl(s, z, s_inv)* gamma_s_inv;
     bvec2 inverse_z_is_large = not(z_is_large);
 return large_z * vec2(z_is_large)+ small_z * vec2(inverse_z_is_large);
}

float normalized_ligamma_impl(float s, float z,
          float s_inv, float gamma_s_inv)
{

              float thresh = 0.775075;
       bool z_is_large = z > thresh;
       float large_z = 1.0 - uigamma_large_z_impl(s, z)* gamma_s_inv;
       float small_z = ligamma_small_z_impl(s, z, s_inv)* gamma_s_inv;
 return large_z * float(z_is_large)+ small_z * float(! z_is_large);
}


     vec4 normalized_ligamma(vec4 s, vec4 z)
{



            vec4 s_inv = vec4(1.0)/ s;
            vec4 gamma_s_inv = vec4(1.0)/ gamma_impl(s, s_inv);
 return normalized_ligamma_impl(s, z, s_inv, gamma_s_inv);
}

     vec3 normalized_ligamma(vec3 s, vec3 z)
{

            vec3 s_inv = vec3(1.0)/ s;
            vec3 gamma_s_inv = vec3(1.0)/ gamma_impl(s, s_inv);
 return normalized_ligamma_impl(s, z, s_inv, gamma_s_inv);
}

     vec2 normalized_ligamma(vec2 s, vec2 z)
{

            vec2 s_inv = vec2(1.0)/ s;
            vec2 gamma_s_inv = vec2(1.0)/ gamma_impl(s, s_inv);
 return normalized_ligamma_impl(s, z, s_inv, gamma_s_inv);
}

float normalized_ligamma(float s, float z)
{

       float s_inv = 1.0 / s;
       float gamma_s_inv = 1.0 / gamma_impl(s, s_inv);
 return normalized_ligamma_impl(s, z, s_inv, gamma_s_inv);
}












































































































































































































































































































































































































































































































































































            vec3 get_gaussian_sigma(vec3 color, float sigma_range)
{















































    if(beam_spot_shape_function < 0.5)
    {

        return vec3(global . beam_min_sigma)+ sigma_range *
            pow(color, vec3(global . beam_spot_power));
    }
    else
    {

                   vec3 color_minus_1 = color - vec3(1.0);
        return vec3(global . beam_min_sigma)+ sigma_range *
            sqrt(vec3(1.0)- color_minus_1 * color_minus_1);
    }
}

            vec3 get_generalized_gaussian_beta(vec3 color,
          float shape_range)
{























    return global . beam_min_shape + shape_range * pow(color, vec3(global . beam_shape_power));
}

     vec3 scanline_gaussian_integral_contrib(vec3 dist,
               vec3 color, float pixel_height, float sigma_range)
{



















               vec3 sigma = get_gaussian_sigma(color, sigma_range);
               vec3 ph_offset = vec3(pixel_height * 0.5);
               vec3 denom_inv = 1.0 /(sigma * sqrt(2.0));
               vec3 integral_high = erf((dist + ph_offset)* denom_inv);
               vec3 integral_low = erf((dist - ph_offset)* denom_inv);
    return color * 0.5 *(integral_high - integral_low)/ pixel_height;
}

     vec3 scanline_generalized_gaussian_integral_contrib(vec3 dist,
         vec3 color, float pixel_height, float sigma_range,
    float shape_range)
{



















               vec3 alpha = sqrt(2.0)* get_gaussian_sigma(color, sigma_range);
               vec3 beta = get_generalized_gaussian_beta(color, shape_range);
               vec3 alpha_inv = vec3(1.0)/ alpha;
               vec3 s = vec3(1.0)/ beta;
               vec3 ph_offset = vec3(pixel_height * 0.5);


               vec3 gamma_s_inv = vec3(1.0)/ gamma_impl(s, beta);
               vec3 dist1 = dist + ph_offset;
               vec3 dist0 = dist - ph_offset;
               vec3 integral_high = sign(dist1)* normalized_ligamma_impl(
        s, pow(abs(dist1)* alpha_inv, beta), beta, gamma_s_inv);
               vec3 integral_low = sign(dist0)* normalized_ligamma_impl(
        s, pow(abs(dist0)* alpha_inv, beta), beta, gamma_s_inv);
    return color * 0.5 *(integral_high - integral_low)/ pixel_height;
}

     vec3 scanline_gaussian_sampled_contrib(vec3 dist, vec3 color,
          float pixel_height, float sigma_range)
{


               vec3 sigma = get_gaussian_sigma(color, sigma_range);

               vec3 sigma_inv = vec3(1.0)/ sigma;
               vec3 inner_denom_inv = 0.5 * sigma_inv * sigma_inv;
               vec3 outer_denom_inv = sigma_inv / sqrt(2.0 * pi);
    if(beam_antialias_level > 0.5)
    {

                   vec3 sample_offset = vec3(pixel_height / 3.0);
                   vec3 dist2 = dist + sample_offset;
                   vec3 dist3 = abs(dist - sample_offset);

                   vec3 scale = color / 3.0 * outer_denom_inv;
                   vec3 weight1 = exp(-(dist * dist)* inner_denom_inv);
                   vec3 weight2 = exp(-(dist2 * dist2)* inner_denom_inv);
                   vec3 weight3 = exp(-(dist3 * dist3)* inner_denom_inv);
        return scale *(weight1 + weight2 + weight3);
    }
    else
    {
        return color * exp(-(dist * dist)* inner_denom_inv)* outer_denom_inv;
    }
}

     vec3 scanline_generalized_gaussian_sampled_contrib(vec3 dist,
         vec3 color, float pixel_height, float sigma_range,
    float shape_range)
{



               vec3 alpha = sqrt(2.0)* get_gaussian_sigma(color, sigma_range);
               vec3 beta = get_generalized_gaussian_beta(color, shape_range);

               vec3 alpha_inv = vec3(1.0)/ alpha;
               vec3 beta_inv = vec3(1.0)/ beta;
               vec3 scale = color * beta * 0.5 * alpha_inv /
        gamma_impl(beta_inv, beta);
    if(beam_antialias_level > 0.5)
    {

                   vec3 sample_offset = vec3(pixel_height / 3.0);
                   vec3 dist2 = dist + sample_offset;
                   vec3 dist3 = abs(dist - sample_offset);

                   vec3 weight1 = exp(- pow(abs(dist * alpha_inv), beta));
                   vec3 weight2 = exp(- pow(abs(dist2 * alpha_inv), beta));
                   vec3 weight3 = exp(- pow(abs(dist3 * alpha_inv), beta));
        return scale / 3.0 *(weight1 + weight2 + weight3);
    }
    else
    {
        return scale * exp(- pow(abs(dist * alpha_inv), beta));
    }
}

            vec3 scanline_contrib(vec3 dist, vec3 color,
    float pixel_height, float sigma_range, float shape_range)
{








    if(beam_generalized_gaussian)
    {
        if(beam_antialias_level > 1.5)
        {
            return scanline_generalized_gaussian_integral_contrib(
                dist, color, pixel_height, sigma_range, shape_range);
        }
        else
        {
            return scanline_generalized_gaussian_sampled_contrib(
                dist, color, pixel_height, sigma_range, shape_range);
        }
    }
    else
    {
        if(beam_antialias_level > 1.5)
        {
            return scanline_gaussian_integral_contrib(
                dist, color, pixel_height, sigma_range);
        }
        else
        {
            return scanline_gaussian_sampled_contrib(
                dist, color, pixel_height, sigma_range);
        }
    }
}

            vec3 get_raw_interpolated_color(vec3 color0,
               vec3 color1, vec3 color2, vec3 color3,
               vec4 weights)
{

    return max((mat4x3(color0, color1, color2, color3)* weights), 0.0);
}

     vec3 get_interpolated_linear_color(vec3 color0, vec3 color1,
               vec3 color2, vec3 color3, vec4 weights)
{



















          float intermediate_gamma = get_intermediate_gamma();































































                       vec3 linear_mixed_color = get_raw_interpolated_color(
                color0, color1, color2, color3, weights);
                       vec3 gamma_mixed_color = get_raw_interpolated_color(
                    pow(color0, vec3(1.0 / intermediate_gamma)),
                    pow(color1, vec3(1.0 / intermediate_gamma)),
                    pow(color2, vec3(1.0 / intermediate_gamma)),
                    pow(color3, vec3(1.0 / intermediate_gamma)),
                    weights);


            return
                                                   mix(gamma_mixed_color, linear_mixed_color, global . beam_horiz_linear_rgb_weight);


}

     vec3 get_scanline_color(sampler2D tex, vec2 scanline_uv,
               vec2 uv_step_x, vec4 weights)
{












               vec3 color1 = texture(tex, scanline_uv). rgb;
               vec3 color2 = texture(tex, scanline_uv + uv_step_x). rgb;
         vec3 color0 = vec3(0.0);
         vec3 color3 = vec3(0.0);
    if(global . beam_horiz_filter > 0.5)
    {
        color0 = texture(tex, scanline_uv - uv_step_x). rgb;
        color3 = texture(tex, scanline_uv + 2.0 * uv_step_x). rgb;
    }


    return get_interpolated_linear_color(color0, color1, color2, color3, weights);
}

     vec3 sample_single_scanline_horizontal(sampler2D tex,
               vec2 tex_uv, vec2 tex_size,
               vec2 texture_size_inv)
{


               vec2 curr_texel = tex_uv * tex_size;

               vec2 prev_texel =
        floor(curr_texel - vec2(under_half))+ vec2(0.5);
               vec2 prev_texel_hor = vec2(prev_texel . x, curr_texel . y);
               vec2 prev_texel_hor_uv = prev_texel_hor * texture_size_inv;
          float prev_dist = curr_texel . x - prev_texel_hor . x;
               vec4 sample_dists = vec4(1.0 + prev_dist, prev_dist,
        1.0 - prev_dist, 2.0 - prev_dist);

         vec4 weights;
    if(global . beam_horiz_filter < 0.5)
    {

              float x = sample_dists . y;
              float w2 = x * x * x *(x *(x * 6.0 - 15.0)+ 10.0);
        weights = vec4(0.0, 1.0 - w2, w2, 0.0);
    }
    else if(global . beam_horiz_filter < 1.5)
    {

        float inner_denom_inv = 1.0 /(2.0 * global . beam_horiz_sigma * global . beam_horiz_sigma);
        weights = exp(-(sample_dists * sample_dists)* inner_denom_inv);
    }
    else
    {

                   vec4 pi_dists =(max(abs(sample_dists * pi), 0.0000152587890625));
        weights = 2.0 * sin(pi_dists)* sin(pi_dists * 0.5)/
            (pi_dists * pi_dists);
    }

               vec4 final_weights = weights / dot(weights, vec4(1.0));

               vec2 uv_step_x = vec2(texture_size_inv . x, 0.0);
    return get_scanline_color(
        tex, prev_texel_hor_uv, uv_step_x, final_weights);
}

     vec3 sample_rgb_scanline_horizontal(sampler2D tex,
               vec2 tex_uv, vec2 tex_size,
               vec2 texture_size_inv)
{


    if(beam_misconvergence)
    {
                   vec3 convergence_offsets_rgb =
            get_convergence_offsets_x_vector();
                   vec3 offset_u_rgb =
            convergence_offsets_rgb * texture_size_inv . xxx;
                   vec2 scanline_uv_r = tex_uv - vec2(offset_u_rgb . r, 0.0);
                   vec2 scanline_uv_g = tex_uv - vec2(offset_u_rgb . g, 0.0);
                   vec2 scanline_uv_b = tex_uv - vec2(offset_u_rgb . b, 0.0);
                   vec3 sample_r = sample_single_scanline_horizontal(
            tex, scanline_uv_r, tex_size, texture_size_inv);
                   vec3 sample_g = sample_single_scanline_horizontal(
            tex, scanline_uv_g, tex_size, texture_size_inv);
                   vec3 sample_b = sample_single_scanline_horizontal(
            tex, scanline_uv_b, tex_size, texture_size_inv);
        return vec3(sample_r . r, sample_g . g, sample_b . b);
    }
    else
    {
        return sample_single_scanline_horizontal(tex, tex_uv, tex_size,
            texture_size_inv);
    }
}

     vec2 get_last_scanline_uv(vec2 tex_uv, vec2 tex_size,
               vec2 texture_size_inv, vec2 il_step_multiple,
          float FrameCount, out float dist)
{










          float field_offset = floor(il_step_multiple . y * 0.75)*
                                                           mod(FrameCount + float(global . interlace_bff), 2.0);
               vec2 curr_texel = tex_uv * tex_size;

               vec2 prev_texel_num = floor(curr_texel - vec2(under_half));
          float wrong_field =
                                                           mod(prev_texel_num . y + field_offset, il_step_multiple . y);
               vec2 scanline_texel_num = prev_texel_num - vec2(0.0, wrong_field);

               vec2 scanline_texel = scanline_texel_num + vec2(0.5);
               vec2 scanline_uv = scanline_texel * texture_size_inv;

    dist =(curr_texel . y - scanline_texel . y)/ il_step_multiple . y;
    return scanline_uv;
}

       bool is_interlaced(float num_lines)
{

    if(interlace_detect)
    {












              bool sd_interlace =((num_lines > 288.5)&&(num_lines < 576.5));
              bool hd_interlace = bool(global . interlace_1080i)?
            ((num_lines > 1079.5)&&(num_lines < 1080.5)):
            false;
        return(sd_interlace || hd_interlace);
    }
    else
    {
        return false;
    }
}





layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 tex_uv;
layout(location = 1) out vec2 uv_step;
layout(location = 2) out float interlaced;

void main()
{
   gl_Position = global . MVP * Position;
   tex_uv = TexCoord * 1.00001;
   uv_step = vec2(1.0)/ params . SourceSize . xy;


               vec2 _video_size = params . SourceSize . xy;
    interlaced = float(is_interlaced(_video_size . y));
}

