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
}global;





































































layout(location = 0) in vec2 tex_uv;
layout(location = 1) in vec2 blur_dxdy;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;








































































































































                 float ntsc_gamma = 2.2;
                 float pal_gamma = 2.8;











                 float crt_reference_gamma_high = 2.5;
                 float crt_reference_gamma_low = 2.35;
                 float lcd_reference_gamma = 2.5;
                 float crt_office_gamma = 2.2;
                 float lcd_office_gamma = 2.2;





                 bool assume_opaque_alpha = false;

















           float get_crt_gamma(){ return crt_reference_gamma_high;}
           float get_gba_gamma(){ return 3.5;}
           float get_lcd_gamma(){ return lcd_office_gamma;}











           float get_intermediate_gamma(){ return ntsc_gamma;}
















               float get_input_gamma(){ return ntsc_gamma;}
               float get_output_gamma(){ return ntsc_gamma;}

























                 bool linearize_input = true;
                 bool gamma_encode_output = true;



               float get_pass_input_gamma(){ return get_intermediate_gamma();}




               float get_pass_output_gamma(){ return get_intermediate_gamma();}




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






















































































































































































                     float blur3_std_dev = 0.62666015625;
                     float blur4_std_dev = 0.66171875;
                     float blur5_std_dev = 0.9845703125;
                     float blur6_std_dev = 1.02626953125;
                     float blur7_std_dev = 1.36103515625;
                     float blur8_std_dev = 1.4080078125;
                     float blur9_std_dev = 1.7533203125;
                     float blur10_std_dev = 1.80478515625;
                     float blur11_std_dev = 2.15986328125;
                     float blur12_std_dev = 2.215234375;
                     float blur17_std_dev = 3.45535583496;
                     float blur25_std_dev = 5.3409576416;
                     float blur31_std_dev = 6.86488037109;
                     float blur43_std_dev = 10.1852050781;






                 float error_blurring = 0.5;



























































































































































































































































































































































































































































































































































































































     vec4 get_quad_vector_naive(vec4 output_pixel_num_wrt_uvxy)
{



















               vec4 pixel_odd =(fract(output_pixel_num_wrt_uvxy * 0.5))* 2.0;
               vec4 quad_vector = pixel_odd * 2.0 - vec4(1.0);
    return quad_vector;
}

     vec4 get_quad_vector(vec4 output_pixel_num_wrt_uvxy)
{




               vec4 quad_vector_guess =
        get_quad_vector_naive(output_pixel_num_wrt_uvxy);


               vec2 odd_start_mirror = 0.5 * vec2(dFdx(quad_vector_guess . z),
                                                                       dFdy(quad_vector_guess . w));
    return quad_vector_guess * odd_start_mirror . xyxy;
}

     vec4 get_quad_vector(vec2 output_pixel_num_wrt_uv)
{











               vec2 screen_uv_mirror = vec2(dFdx(output_pixel_num_wrt_uv . x),
                                                                     dFdy(output_pixel_num_wrt_uv . y));
               vec2 pixel_odd_wrt_uv =(fract(output_pixel_num_wrt_uv * 0.5))* 2.0;
               vec2 quad_vector_uv_guess =(pixel_odd_wrt_uv - vec2(0.5))* 2.0;
               vec2 quad_vector_screen_guess = quad_vector_uv_guess * screen_uv_mirror;


               vec2 odd_start_mirror = 0.5 * vec2(dFdx(quad_vector_screen_guess . x),
                                                                              dFdy(quad_vector_screen_guess . y));
               vec4 quad_vector_guess = vec4(
        quad_vector_uv_guess, quad_vector_screen_guess);
    return quad_vector_guess * odd_start_mirror . xyxy;
}

void quad_gather(vec4 quad_vector, vec4 curr,
    out vec4 adjx, out vec4 adjy, out vec4 diag)
{







    adjx = curr - dFdx(curr)* quad_vector . z;
    adjy = curr - dFdy(curr)* quad_vector . w;
    diag = adjx - dFdy(adjx)* quad_vector . w;
}

void quad_gather(vec4 quad_vector, vec3 curr,
    out vec3 adjx, out vec3 adjy, out vec3 diag)
{

    adjx = curr - dFdx(curr)* quad_vector . z;
    adjy = curr - dFdy(curr)* quad_vector . w;
    diag = adjx - dFdy(adjx)* quad_vector . w;
}

void quad_gather(vec4 quad_vector, vec2 curr,
    out vec2 adjx, out vec2 adjy, out vec2 diag)
{

    adjx = curr - dFdx(curr)* quad_vector . z;
    adjy = curr - dFdy(curr)* quad_vector . w;
    diag = adjx - dFdy(adjx)* quad_vector . w;
}

     vec4 quad_gather(vec4 quad_vector, float curr)
{





         vec4 all = vec4(curr);
    all . y = all . x - dFdx(all . x)* quad_vector . z;
    all . zw = all . xy - dFdy(all . xy)* quad_vector . w;
    return all;
}

     vec4 quad_gather_sum(vec4 quad_vector, vec4 curr)
{


         vec4 adjx, adjy, diag;
    quad_gather(quad_vector, curr, adjx, adjy, diag);
    return(curr + adjx + adjy + diag);
}

     vec3 quad_gather_sum(vec4 quad_vector, vec3 curr)
{

         vec3 adjx, adjy, diag;
    quad_gather(quad_vector, curr, adjx, adjy, diag);
    return(curr + adjx + adjy + diag);
}

     vec2 quad_gather_sum(vec4 quad_vector, vec2 curr)
{

         vec2 adjx, adjy, diag;
    quad_gather(quad_vector, curr, adjx, adjy, diag);
    return(curr + adjx + adjy + diag);
}

float quad_gather_sum(vec4 quad_vector, float curr)
{

               vec4 all_values = quad_gather(quad_vector, curr);
    return(all_values . x + all_values . y + all_values . z + all_values . w);
}

bool fine_derivatives_working(vec4 quad_vector, vec4 curr)
{














         vec4 ddx_curr = dFdx(curr);
         vec4 ddy_curr = dFdy(curr);
         vec4 adjx = curr - ddx_curr * quad_vector . z;
         vec4 adjy = curr - ddy_curr * quad_vector . w;
    bool ddy_different = any(bvec4(ddy_curr . x != dFdy(adjx). x, ddy_curr . y != dFdy(adjx). y, ddy_curr . z != dFdy(adjx). z, ddy_curr . w != dFdy(adjx). w));
    bool ddx_different = any(bvec4(ddx_curr . x != dFdx(adjy). x, ddx_curr . y != dFdx(adjy). y, ddx_curr . z != dFdx(adjy). z, ddx_curr . w != dFdx(adjy). w));
    return any(bvec2(ddy_different, ddx_different));
}

bool fine_derivatives_working_fast(vec4 quad_vector, float curr)
{













    float ddx_curr = dFdx(curr);
    float ddy_curr = dFdy(curr);
    float adjx = curr - ddx_curr * quad_vector . z;
    return(ddy_curr != dFdy(adjx));
}




















































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









            vec4 uv2_to_uv4(vec2 tex_uv)
{

    return vec4(tex_uv, 0.0, 0.0);
}




       float get_fast_gaussian_weight_sum_inv(float sigma)
{















    return min(exp(exp(0.348348412457428 /
        (sigma - 0.0860587260734721))), 0.399334576340352 / sigma);
}




     vec3 tex2Dblur11resize(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{





          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float w2 = exp(- 4.0 * denom_inv);
          float w3 = exp(- 9.0 * denom_inv);
          float w4 = exp(- 16.0 * denom_inv);
          float w5 = exp(- 25.0 * denom_inv);
          float weight_sum_inv = 1.0 /
        (w0 + 2.0 *(w1 + w2 + w3 + w4 + w5));


         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w5 * tex2D_linearize(tex, tex_uv - 5.0 * dxdy). rgb;
    sum += w4 * tex2D_linearize(tex, tex_uv - 4.0 * dxdy). rgb;
    sum += w3 * tex2D_linearize(tex, tex_uv - 3.0 * dxdy). rgb;
    sum += w2 * tex2D_linearize(tex, tex_uv - 2.0 * dxdy). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv - 1.0 * dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv + 1.0 * dxdy). rgb;
    sum += w2 * tex2D_linearize(tex, tex_uv + 2.0 * dxdy). rgb;
    sum += w3 * tex2D_linearize(tex, tex_uv + 3.0 * dxdy). rgb;
    sum += w4 * tex2D_linearize(tex, tex_uv + 4.0 * dxdy). rgb;
    sum += w5 * tex2D_linearize(tex, tex_uv + 5.0 * dxdy). rgb;
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur9resize(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{




          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float w2 = exp(- 4.0 * denom_inv);
          float w3 = exp(- 9.0 * denom_inv);
          float w4 = exp(- 16.0 * denom_inv);
          float weight_sum_inv = 1.0 /(w0 + 2.0 *(w1 + w2 + w3 + w4));

         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w4 * tex2D_linearize(tex, tex_uv - 4.0 * dxdy). rgb;
    sum += w3 * tex2D_linearize(tex, tex_uv - 3.0 * dxdy). rgb;
    sum += w2 * tex2D_linearize(tex, tex_uv - 2.0 * dxdy). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv - 1.0 * dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv + 1.0 * dxdy). rgb;
    sum += w2 * tex2D_linearize(tex, tex_uv + 2.0 * dxdy). rgb;
    sum += w3 * tex2D_linearize(tex, tex_uv + 3.0 * dxdy). rgb;
    sum += w4 * tex2D_linearize(tex, tex_uv + 4.0 * dxdy). rgb;
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur7resize(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{




          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float w2 = exp(- 4.0 * denom_inv);
          float w3 = exp(- 9.0 * denom_inv);
          float weight_sum_inv = 1.0 /(w0 + 2.0 *(w1 + w2 + w3));

         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w3 * tex2D_linearize(tex, tex_uv - 3.0 * dxdy). rgb;
    sum += w2 * tex2D_linearize(tex, tex_uv - 2.0 * dxdy). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv - 1.0 * dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv + 1.0 * dxdy). rgb;
    sum += w2 * tex2D_linearize(tex, tex_uv + 2.0 * dxdy). rgb;
    sum += w3 * tex2D_linearize(tex, tex_uv + 3.0 * dxdy). rgb;
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur5resize(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{




          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float w2 = exp(- 4.0 * denom_inv);
          float weight_sum_inv = 1.0 /(w0 + 2.0 *(w1 + w2));

         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w2 * tex2D_linearize(tex, tex_uv - 2.0 * dxdy). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv - 1.0 * dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv + 1.0 * dxdy). rgb;
    sum += w2 * tex2D_linearize(tex, tex_uv + 2.0 * dxdy). rgb;
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur3resize(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{




          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float weight_sum_inv = 1.0 /(w0 + 2.0 * w1);

         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w1 * tex2D_linearize(tex, tex_uv - 1.0 * dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv + 1.0 * dxdy). rgb;
    return sum * weight_sum_inv;
}




     vec3 tex2Dblur11fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{







          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float w2 = exp(- 4.0 * denom_inv);
          float w3 = exp(- 9.0 * denom_inv);
          float w4 = exp(- 16.0 * denom_inv);
          float w5 = exp(- 25.0 * denom_inv);
          float weight_sum_inv = 1.0 /
        (w0 + 2.0 *(w1 + w2 + w3 + w4 + w5));


          float w01 = w0 * 0.5 + w1;
          float w23 = w2 + w3;
          float w45 = w4 + w5;
          float w01_ratio = w1 / w01;
          float w23_ratio = w3 / w23;
          float w45_ratio = w5 / w45;

         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w45 * tex2D_linearize(tex, tex_uv -(4.0 + w45_ratio)* dxdy). rgb;
    sum += w23 * tex2D_linearize(tex, tex_uv -(2.0 + w23_ratio)* dxdy). rgb;
    sum += w01 * tex2D_linearize(tex, tex_uv - w01_ratio * dxdy). rgb;
    sum += w01 * tex2D_linearize(tex, tex_uv + w01_ratio * dxdy). rgb;
    sum += w23 * tex2D_linearize(tex, tex_uv +(2.0 + w23_ratio)* dxdy). rgb;
    sum += w45 * tex2D_linearize(tex, tex_uv +(4.0 + w45_ratio)* dxdy). rgb;
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur9fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{





          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float w2 = exp(- 4.0 * denom_inv);
          float w3 = exp(- 9.0 * denom_inv);
          float w4 = exp(- 16.0 * denom_inv);
          float weight_sum_inv = 1.0 /(w0 + 2.0 *(w1 + w2 + w3 + w4));

          float w12 = w1 + w2;
          float w34 = w3 + w4;
          float w12_ratio = w2 / w12;
          float w34_ratio = w4 / w34;

         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w34 * tex2D_linearize(tex, tex_uv -(3.0 + w34_ratio)* dxdy). rgb;
    sum += w12 * tex2D_linearize(tex, tex_uv -(1.0 + w12_ratio)* dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w12 * tex2D_linearize(tex, tex_uv +(1.0 + w12_ratio)* dxdy). rgb;
    sum += w34 * tex2D_linearize(tex, tex_uv +(3.0 + w34_ratio)* dxdy). rgb;
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur7fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{




          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float w2 = exp(- 4.0 * denom_inv);
          float w3 = exp(- 9.0 * denom_inv);
          float weight_sum_inv = 1.0 /(w0 + 2.0 *(w1 + w2 + w3));


          float w01 = w0 * 0.5 + w1;
          float w23 = w2 + w3;
          float w01_ratio = w1 / w01;
          float w23_ratio = w3 / w23;

         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w23 * tex2D_linearize(tex, tex_uv -(2.0 + w23_ratio)* dxdy). rgb;
    sum += w01 * tex2D_linearize(tex, tex_uv - w01_ratio * dxdy). rgb;
    sum += w01 * tex2D_linearize(tex, tex_uv + w01_ratio * dxdy). rgb;
    sum += w23 * tex2D_linearize(tex, tex_uv +(2.0 + w23_ratio)* dxdy). rgb;
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur5fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{





          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float w2 = exp(- 4.0 * denom_inv);
          float weight_sum_inv = 1.0 /(w0 + 2.0 *(w1 + w2));

          float w12 = w1 + w2;
          float w12_ratio = w2 / w12;

         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w12 * tex2D_linearize(tex, tex_uv -(1.0 + w12_ratio)* dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w12 * tex2D_linearize(tex, tex_uv +(1.0 + w12_ratio)* dxdy). rgb;
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur3fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{




          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float weight_sum_inv = 1.0 /(w0 + 2.0 * w1);


          float w01 = w0 * 0.5 + w1;
          float w01_ratio = w1 / w01;

    return 0.5 *(
        tex2D_linearize(tex, tex_uv - w01_ratio * dxdy). rgb +
        tex2D_linearize(tex, tex_uv + w01_ratio * dxdy). rgb);
}





     vec3 tex2Dblur43fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{




          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float w2 = exp(- 4.0 * denom_inv);
          float w3 = exp(- 9.0 * denom_inv);
          float w4 = exp(- 16.0 * denom_inv);
          float w5 = exp(- 25.0 * denom_inv);
          float w6 = exp(- 36.0 * denom_inv);
          float w7 = exp(- 49.0 * denom_inv);
          float w8 = exp(- 64.0 * denom_inv);
          float w9 = exp(- 81.0 * denom_inv);
          float w10 = exp(- 100.0 * denom_inv);
          float w11 = exp(- 121.0 * denom_inv);
          float w12 = exp(- 144.0 * denom_inv);
          float w13 = exp(- 169.0 * denom_inv);
          float w14 = exp(- 196.0 * denom_inv);
          float w15 = exp(- 225.0 * denom_inv);
          float w16 = exp(- 256.0 * denom_inv);
          float w17 = exp(- 289.0 * denom_inv);
          float w18 = exp(- 324.0 * denom_inv);
          float w19 = exp(- 361.0 * denom_inv);
          float w20 = exp(- 400.0 * denom_inv);
          float w21 = exp(- 441.0 * denom_inv);



          float weight_sum_inv = get_fast_gaussian_weight_sum_inv(sigma);


          float w0_1 = w0 * 0.5 + w1;
          float w2_3 = w2 + w3;
          float w4_5 = w4 + w5;
          float w6_7 = w6 + w7;
          float w8_9 = w8 + w9;
          float w10_11 = w10 + w11;
          float w12_13 = w12 + w13;
          float w14_15 = w14 + w15;
          float w16_17 = w16 + w17;
          float w18_19 = w18 + w19;
          float w20_21 = w20 + w21;
          float w0_1_ratio = w1 / w0_1;
          float w2_3_ratio = w3 / w2_3;
          float w4_5_ratio = w5 / w4_5;
          float w6_7_ratio = w7 / w6_7;
          float w8_9_ratio = w9 / w8_9;
          float w10_11_ratio = w11 / w10_11;
          float w12_13_ratio = w13 / w12_13;
          float w14_15_ratio = w15 / w14_15;
          float w16_17_ratio = w17 / w16_17;
          float w18_19_ratio = w19 / w18_19;
          float w20_21_ratio = w21 / w20_21;

         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w20_21 * tex2D_linearize(tex, tex_uv -(20.0 + w20_21_ratio)* dxdy). rgb;
    sum += w18_19 * tex2D_linearize(tex, tex_uv -(18.0 + w18_19_ratio)* dxdy). rgb;
    sum += w16_17 * tex2D_linearize(tex, tex_uv -(16.0 + w16_17_ratio)* dxdy). rgb;
    sum += w14_15 * tex2D_linearize(tex, tex_uv -(14.0 + w14_15_ratio)* dxdy). rgb;
    sum += w12_13 * tex2D_linearize(tex, tex_uv -(12.0 + w12_13_ratio)* dxdy). rgb;
    sum += w10_11 * tex2D_linearize(tex, tex_uv -(10.0 + w10_11_ratio)* dxdy). rgb;
    sum += w8_9 * tex2D_linearize(tex, tex_uv -(8.0 + w8_9_ratio)* dxdy). rgb;
    sum += w6_7 * tex2D_linearize(tex, tex_uv -(6.0 + w6_7_ratio)* dxdy). rgb;
    sum += w4_5 * tex2D_linearize(tex, tex_uv -(4.0 + w4_5_ratio)* dxdy). rgb;
    sum += w2_3 * tex2D_linearize(tex, tex_uv -(2.0 + w2_3_ratio)* dxdy). rgb;
    sum += w0_1 * tex2D_linearize(tex, tex_uv - w0_1_ratio * dxdy). rgb;
    sum += w0_1 * tex2D_linearize(tex, tex_uv + w0_1_ratio * dxdy). rgb;
    sum += w2_3 * tex2D_linearize(tex, tex_uv +(2.0 + w2_3_ratio)* dxdy). rgb;
    sum += w4_5 * tex2D_linearize(tex, tex_uv +(4.0 + w4_5_ratio)* dxdy). rgb;
    sum += w6_7 * tex2D_linearize(tex, tex_uv +(6.0 + w6_7_ratio)* dxdy). rgb;
    sum += w8_9 * tex2D_linearize(tex, tex_uv +(8.0 + w8_9_ratio)* dxdy). rgb;
    sum += w10_11 * tex2D_linearize(tex, tex_uv +(10.0 + w10_11_ratio)* dxdy). rgb;
    sum += w12_13 * tex2D_linearize(tex, tex_uv +(12.0 + w12_13_ratio)* dxdy). rgb;
    sum += w14_15 * tex2D_linearize(tex, tex_uv +(14.0 + w14_15_ratio)* dxdy). rgb;
    sum += w16_17 * tex2D_linearize(tex, tex_uv +(16.0 + w16_17_ratio)* dxdy). rgb;
    sum += w18_19 * tex2D_linearize(tex, tex_uv +(18.0 + w18_19_ratio)* dxdy). rgb;
    sum += w20_21 * tex2D_linearize(tex, tex_uv +(20.0 + w20_21_ratio)* dxdy). rgb;
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur31fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{




          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float w2 = exp(- 4.0 * denom_inv);
          float w3 = exp(- 9.0 * denom_inv);
          float w4 = exp(- 16.0 * denom_inv);
          float w5 = exp(- 25.0 * denom_inv);
          float w6 = exp(- 36.0 * denom_inv);
          float w7 = exp(- 49.0 * denom_inv);
          float w8 = exp(- 64.0 * denom_inv);
          float w9 = exp(- 81.0 * denom_inv);
          float w10 = exp(- 100.0 * denom_inv);
          float w11 = exp(- 121.0 * denom_inv);
          float w12 = exp(- 144.0 * denom_inv);
          float w13 = exp(- 169.0 * denom_inv);
          float w14 = exp(- 196.0 * denom_inv);
          float w15 = exp(- 225.0 * denom_inv);



          float weight_sum_inv = get_fast_gaussian_weight_sum_inv(sigma);


          float w0_1 = w0 * 0.5 + w1;
          float w2_3 = w2 + w3;
          float w4_5 = w4 + w5;
          float w6_7 = w6 + w7;
          float w8_9 = w8 + w9;
          float w10_11 = w10 + w11;
          float w12_13 = w12 + w13;
          float w14_15 = w14 + w15;
          float w0_1_ratio = w1 / w0_1;
          float w2_3_ratio = w3 / w2_3;
          float w4_5_ratio = w5 / w4_5;
          float w6_7_ratio = w7 / w6_7;
          float w8_9_ratio = w9 / w8_9;
          float w10_11_ratio = w11 / w10_11;
          float w12_13_ratio = w13 / w12_13;
          float w14_15_ratio = w15 / w14_15;

         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w14_15 * tex2D_linearize(tex, tex_uv -(14.0 + w14_15_ratio)* dxdy). rgb;
    sum += w12_13 * tex2D_linearize(tex, tex_uv -(12.0 + w12_13_ratio)* dxdy). rgb;
    sum += w10_11 * tex2D_linearize(tex, tex_uv -(10.0 + w10_11_ratio)* dxdy). rgb;
    sum += w8_9 * tex2D_linearize(tex, tex_uv -(8.0 + w8_9_ratio)* dxdy). rgb;
    sum += w6_7 * tex2D_linearize(tex, tex_uv -(6.0 + w6_7_ratio)* dxdy). rgb;
    sum += w4_5 * tex2D_linearize(tex, tex_uv -(4.0 + w4_5_ratio)* dxdy). rgb;
    sum += w2_3 * tex2D_linearize(tex, tex_uv -(2.0 + w2_3_ratio)* dxdy). rgb;
    sum += w0_1 * tex2D_linearize(tex, tex_uv - w0_1_ratio * dxdy). rgb;
    sum += w0_1 * tex2D_linearize(tex, tex_uv + w0_1_ratio * dxdy). rgb;
    sum += w2_3 * tex2D_linearize(tex, tex_uv +(2.0 + w2_3_ratio)* dxdy). rgb;
    sum += w4_5 * tex2D_linearize(tex, tex_uv +(4.0 + w4_5_ratio)* dxdy). rgb;
    sum += w6_7 * tex2D_linearize(tex, tex_uv +(6.0 + w6_7_ratio)* dxdy). rgb;
    sum += w8_9 * tex2D_linearize(tex, tex_uv +(8.0 + w8_9_ratio)* dxdy). rgb;
    sum += w10_11 * tex2D_linearize(tex, tex_uv +(10.0 + w10_11_ratio)* dxdy). rgb;
    sum += w12_13 * tex2D_linearize(tex, tex_uv +(12.0 + w12_13_ratio)* dxdy). rgb;
    sum += w14_15 * tex2D_linearize(tex, tex_uv +(14.0 + w14_15_ratio)* dxdy). rgb;
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur25fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{





          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float w2 = exp(- 4.0 * denom_inv);
          float w3 = exp(- 9.0 * denom_inv);
          float w4 = exp(- 16.0 * denom_inv);
          float w5 = exp(- 25.0 * denom_inv);
          float w6 = exp(- 36.0 * denom_inv);
          float w7 = exp(- 49.0 * denom_inv);
          float w8 = exp(- 64.0 * denom_inv);
          float w9 = exp(- 81.0 * denom_inv);
          float w10 = exp(- 100.0 * denom_inv);
          float w11 = exp(- 121.0 * denom_inv);
          float w12 = exp(- 144.0 * denom_inv);


          float weight_sum_inv = get_fast_gaussian_weight_sum_inv(sigma);

          float w1_2 = w1 + w2;
          float w3_4 = w3 + w4;
          float w5_6 = w5 + w6;
          float w7_8 = w7 + w8;
          float w9_10 = w9 + w10;
          float w11_12 = w11 + w12;
          float w1_2_ratio = w2 / w1_2;
          float w3_4_ratio = w4 / w3_4;
          float w5_6_ratio = w6 / w5_6;
          float w7_8_ratio = w8 / w7_8;
          float w9_10_ratio = w10 / w9_10;
          float w11_12_ratio = w12 / w11_12;

         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w11_12 * tex2D_linearize(tex, tex_uv -(11.0 + w11_12_ratio)* dxdy). rgb;
    sum += w9_10 * tex2D_linearize(tex, tex_uv -(9.0 + w9_10_ratio)* dxdy). rgb;
    sum += w7_8 * tex2D_linearize(tex, tex_uv -(7.0 + w7_8_ratio)* dxdy). rgb;
    sum += w5_6 * tex2D_linearize(tex, tex_uv -(5.0 + w5_6_ratio)* dxdy). rgb;
    sum += w3_4 * tex2D_linearize(tex, tex_uv -(3.0 + w3_4_ratio)* dxdy). rgb;
    sum += w1_2 * tex2D_linearize(tex, tex_uv -(1.0 + w1_2_ratio)* dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w1_2 * tex2D_linearize(tex, tex_uv +(1.0 + w1_2_ratio)* dxdy). rgb;
    sum += w3_4 * tex2D_linearize(tex, tex_uv +(3.0 + w3_4_ratio)* dxdy). rgb;
    sum += w5_6 * tex2D_linearize(tex, tex_uv +(5.0 + w5_6_ratio)* dxdy). rgb;
    sum += w7_8 * tex2D_linearize(tex, tex_uv +(7.0 + w7_8_ratio)* dxdy). rgb;
    sum += w9_10 * tex2D_linearize(tex, tex_uv +(9.0 + w9_10_ratio)* dxdy). rgb;
    sum += w11_12 * tex2D_linearize(tex, tex_uv +(11.0 + w11_12_ratio)* dxdy). rgb;
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur17fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{





          float denom_inv = 0.5 /(sigma * sigma);
          float w0 = 1.0;
          float w1 = exp(- 1.0 * denom_inv);
          float w2 = exp(- 4.0 * denom_inv);
          float w3 = exp(- 9.0 * denom_inv);
          float w4 = exp(- 16.0 * denom_inv);
          float w5 = exp(- 25.0 * denom_inv);
          float w6 = exp(- 36.0 * denom_inv);
          float w7 = exp(- 49.0 * denom_inv);
          float w8 = exp(- 64.0 * denom_inv);


          float weight_sum_inv = get_fast_gaussian_weight_sum_inv(sigma);

          float w1_2 = w1 + w2;
          float w3_4 = w3 + w4;
          float w5_6 = w5 + w6;
          float w7_8 = w7 + w8;
          float w1_2_ratio = w2 / w1_2;
          float w3_4_ratio = w4 / w3_4;
          float w5_6_ratio = w6 / w5_6;
          float w7_8_ratio = w8 / w7_8;

         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w7_8 * tex2D_linearize(tex, tex_uv -(7.0 + w7_8_ratio)* dxdy). rgb;
    sum += w5_6 * tex2D_linearize(tex, tex_uv -(5.0 + w5_6_ratio)* dxdy). rgb;
    sum += w3_4 * tex2D_linearize(tex, tex_uv -(3.0 + w3_4_ratio)* dxdy). rgb;
    sum += w1_2 * tex2D_linearize(tex, tex_uv -(1.0 + w1_2_ratio)* dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w1_2 * tex2D_linearize(tex, tex_uv +(1.0 + w1_2_ratio)* dxdy). rgb;
    sum += w3_4 * tex2D_linearize(tex, tex_uv +(3.0 + w3_4_ratio)* dxdy). rgb;
    sum += w5_6 * tex2D_linearize(tex, tex_uv +(5.0 + w5_6_ratio)* dxdy). rgb;
    sum += w7_8 * tex2D_linearize(tex, tex_uv +(7.0 + w7_8_ratio)* dxdy). rgb;
    return sum * weight_sum_inv;
}




     vec3 tex2Dblur3x3resize(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{






          float denom_inv = 0.5 /(sigma * sigma);



               vec2 sample4_uv = tex_uv;
               vec2 dx = vec2(dxdy . x, 0.0);
               vec2 dy = vec2(0.0, dxdy . y);
               vec2 sample1_uv = sample4_uv - dy;
               vec2 sample7_uv = sample4_uv + dy;
               vec3 sample0 = tex2D_linearize(tex, sample1_uv - dx). rgb;
               vec3 sample1 = tex2D_linearize(tex, sample1_uv). rgb;
               vec3 sample2 = tex2D_linearize(tex, sample1_uv + dx). rgb;
               vec3 sample3 = tex2D_linearize(tex, sample4_uv - dx). rgb;
               vec3 sample4 = tex2D_linearize(tex, sample4_uv). rgb;
               vec3 sample5 = tex2D_linearize(tex, sample4_uv + dx). rgb;
               vec3 sample6 = tex2D_linearize(tex, sample7_uv - dx). rgb;
               vec3 sample7 = tex2D_linearize(tex, sample7_uv). rgb;
               vec3 sample8 = tex2D_linearize(tex, sample7_uv + dx). rgb;

          float w4 = 1.0;
          float w1_3_5_7 = exp(-(dot(vec2(1.0, 0.0), vec2(1.0, 0.0)))* denom_inv);
          float w0_2_6_8 = exp(-(dot(vec2(1.0, 1.0), vec2(1.0, 1.0)))* denom_inv);
          float weight_sum_inv = 1.0 /(w4 + 4.0 *(w1_3_5_7 + w0_2_6_8));

               vec3 sum = w4 * sample4 +
        w1_3_5_7 *(sample1 + sample3 + sample5 + sample7)+
        w0_2_6_8 *(sample0 + sample2 + sample6 + sample8);
    return sum * weight_sum_inv;
}




     vec3 tex2Dblur9x9(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{









































          float denom_inv = 0.5 /(sigma * sigma);
          float w1off = exp(- 1.0 * denom_inv);
          float w2off = exp(- 4.0 * denom_inv);
          float w3off = exp(- 9.0 * denom_inv);
          float w4off = exp(- 16.0 * denom_inv);
          float texel1to2ratio = w2off /(w1off + w2off);
          float texel3to4ratio = w4off /(w3off + w4off);


               vec2 sample1R_texel_offset = vec2(1.0, 0.0)+ vec2(texel1to2ratio, 0.0);
               vec2 sample2R_texel_offset = vec2(3.0, 0.0)+ vec2(texel3to4ratio, 0.0);
               vec2 sample3d_texel_offset = vec2(1.0, 1.0)+ vec2(texel1to2ratio, texel1to2ratio);
               vec2 sample4d_texel_offset = vec2(3.0, 1.0)+ vec2(texel3to4ratio, texel1to2ratio);
               vec2 sample5d_texel_offset = vec2(1.0, 3.0)+ vec2(texel1to2ratio, texel3to4ratio);
               vec2 sample6d_texel_offset = vec2(3.0, 3.0)+ vec2(texel3to4ratio, texel3to4ratio);




          float w1R1 = w1off;
          float w1R2 = w2off;
          float w2R1 = w3off;
          float w2R2 = w4off;
          float w3d1 = exp(-(dot(vec2(1.0, 1.0), vec2(1.0, 1.0)))* denom_inv);
          float w3d2_3d3 = exp(-(dot(vec2(2.0, 1.0), vec2(2.0, 1.0)))* denom_inv);
          float w3d4 = exp(-(dot(vec2(2.0, 2.0), vec2(2.0, 2.0)))* denom_inv);
          float w4d1_5d1 = exp(-(dot(vec2(3.0, 1.0), vec2(3.0, 1.0)))* denom_inv);
          float w4d2_5d3 = exp(-(dot(vec2(4.0, 1.0), vec2(4.0, 1.0)))* denom_inv);
          float w4d3_5d2 = exp(-(dot(vec2(3.0, 2.0), vec2(3.0, 2.0)))* denom_inv);
          float w4d4_5d4 = exp(-(dot(vec2(4.0, 2.0), vec2(4.0, 2.0)))* denom_inv);
          float w6d1 = exp(-(dot(vec2(3.0, 3.0), vec2(3.0, 3.0)))* denom_inv);
          float w6d2_6d3 = exp(-(dot(vec2(4.0, 3.0), vec2(4.0, 3.0)))* denom_inv);
          float w6d4 = exp(-(dot(vec2(4.0, 4.0), vec2(4.0, 4.0)))* denom_inv);

          float w0 = 1.0;
          float w1 = w1R1 + w1R2;
          float w2 = w2R1 + w2R2;
          float w3 = w3d1 + 2.0 * w3d2_3d3 + w3d4;
          float w4 = w4d1_5d1 + w4d2_5d3 + w4d3_5d2 + w4d4_5d4;
          float w5 = w4;
          float w6 = w6d1 + 2.0 * w6d2_6d3 + w6d4;

          float weight_sum_inv =
        1.0 /(w0 + 4.0 *(w1 + w2 + w3 + w4 + w5 + w6));



               vec2 mirror_x = vec2(- 1.0, 1.0);
               vec2 mirror_y = vec2(1.0, - 1.0);
               vec2 mirror_xy = vec2(- 1.0, - 1.0);
               vec2 dxdy_mirror_x = dxdy * mirror_x;
               vec2 dxdy_mirror_y = dxdy * mirror_y;
               vec2 dxdy_mirror_xy = dxdy * mirror_xy;

               vec3 sample0C = tex2D_linearize(tex, tex_uv). rgb;
               vec3 sample1R = tex2D_linearize(tex, tex_uv + dxdy * sample1R_texel_offset). rgb;
               vec3 sample1D = tex2D_linearize(tex, tex_uv + dxdy * sample1R_texel_offset . yx). rgb;
               vec3 sample1L = tex2D_linearize(tex, tex_uv - dxdy * sample1R_texel_offset). rgb;
               vec3 sample1U = tex2D_linearize(tex, tex_uv - dxdy * sample1R_texel_offset . yx). rgb;
               vec3 sample2R = tex2D_linearize(tex, tex_uv + dxdy * sample2R_texel_offset). rgb;
               vec3 sample2D = tex2D_linearize(tex, tex_uv + dxdy * sample2R_texel_offset . yx). rgb;
               vec3 sample2L = tex2D_linearize(tex, tex_uv - dxdy * sample2R_texel_offset). rgb;
               vec3 sample2U = tex2D_linearize(tex, tex_uv - dxdy * sample2R_texel_offset . yx). rgb;
               vec3 sample3d = tex2D_linearize(tex, tex_uv + dxdy * sample3d_texel_offset). rgb;
               vec3 sample3c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample3d_texel_offset). rgb;
               vec3 sample3b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample3d_texel_offset). rgb;
               vec3 sample3a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample3d_texel_offset). rgb;
               vec3 sample4d = tex2D_linearize(tex, tex_uv + dxdy * sample4d_texel_offset). rgb;
               vec3 sample4c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample4d_texel_offset). rgb;
               vec3 sample4b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample4d_texel_offset). rgb;
               vec3 sample4a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample4d_texel_offset). rgb;
               vec3 sample5d = tex2D_linearize(tex, tex_uv + dxdy * sample5d_texel_offset). rgb;
               vec3 sample5c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample5d_texel_offset). rgb;
               vec3 sample5b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample5d_texel_offset). rgb;
               vec3 sample5a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample5d_texel_offset). rgb;
               vec3 sample6d = tex2D_linearize(tex, tex_uv + dxdy * sample6d_texel_offset). rgb;
               vec3 sample6c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample6d_texel_offset). rgb;
               vec3 sample6b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample6d_texel_offset). rgb;
               vec3 sample6a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample6d_texel_offset). rgb;



         vec3 sum = w0 * sample0C;
    sum += w1 *(sample1R + sample1D + sample1L + sample1U);
    sum += w2 *(sample2R + sample2D + sample2L + sample2U);
    sum += w3 *(sample3d + sample3c + sample3b + sample3a);
    sum += w4 *(sample4d + sample4c + sample4b + sample4a);
    sum += w5 *(sample5d + sample5c + sample5b + sample5a);
    sum += w6 *(sample6d + sample6c + sample6b + sample6a);
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur7x7(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{

























          float denom_inv = 0.5 /(sigma * sigma);
          float w0off = 1.0;
          float w1off = exp(- 1.0 * denom_inv);
          float w2off = exp(- 4.0 * denom_inv);
          float w3off = exp(- 9.0 * denom_inv);
          float texel0to1ratio = w1off /(w0off * 0.5 + w1off);
          float texel2to3ratio = w3off /(w2off + w3off);


               vec2 sample1d_texel_offset = vec2(texel0to1ratio, texel0to1ratio);
               vec2 sample2d_texel_offset = vec2(2.0, 0.0)+ vec2(texel2to3ratio, texel0to1ratio);
               vec2 sample3d_texel_offset = vec2(0.0, 2.0)+ vec2(texel0to1ratio, texel2to3ratio);
               vec2 sample4d_texel_offset = vec2(2.0, 2.0)+ vec2(texel2to3ratio, texel2to3ratio);




          float w1abcd = 1.0;
          float w1bd2_1cd3 = exp(-(dot(vec2(1.0, 0.0), vec2(1.0, 0.0)))* denom_inv);
          float w2bd1_3cd1 = exp(-(dot(vec2(2.0, 0.0), vec2(2.0, 0.0)))* denom_inv);
          float w2bd2_3cd2 = exp(-(dot(vec2(3.0, 0.0), vec2(3.0, 0.0)))* denom_inv);
          float w1d4 = exp(-(dot(vec2(1.0, 1.0), vec2(1.0, 1.0)))* denom_inv);
          float w2d3_3d2 = exp(-(dot(vec2(2.0, 1.0), vec2(2.0, 1.0)))* denom_inv);
          float w2d4_3d4 = exp(-(dot(vec2(3.0, 1.0), vec2(3.0, 1.0)))* denom_inv);
          float w4d1 = exp(-(dot(vec2(2.0, 2.0), vec2(2.0, 2.0)))* denom_inv);
          float w4d2_4d3 = exp(-(dot(vec2(3.0, 2.0), vec2(3.0, 2.0)))* denom_inv);
          float w4d4 = exp(-(dot(vec2(3.0, 3.0), vec2(3.0, 3.0)))* denom_inv);


          float w1 = w1abcd * 0.25 + w1bd2_1cd3 + w1d4;
          float w2_3 =(w2bd1_3cd1 + w2bd2_3cd2)* 0.5 + w2d3_3d2 + w2d4_3d4;
          float w4 = w4d1 + 2.0 * w4d2_4d3 + w4d4;

          float weight_sum_inv =
        1.0 /(4.0 *(w1 + 2.0 * w2_3 + w4));



               vec2 mirror_x = vec2(- 1.0, 1.0);
               vec2 mirror_y = vec2(1.0, - 1.0);
               vec2 mirror_xy = vec2(- 1.0, - 1.0);
               vec2 dxdy_mirror_x = dxdy * mirror_x;
               vec2 dxdy_mirror_y = dxdy * mirror_y;
               vec2 dxdy_mirror_xy = dxdy * mirror_xy;
               vec3 sample1a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample1d_texel_offset). rgb;
               vec3 sample2a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample2d_texel_offset). rgb;
               vec3 sample3a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample3d_texel_offset). rgb;
               vec3 sample4a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample4d_texel_offset). rgb;
               vec3 sample1b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample1d_texel_offset). rgb;
               vec3 sample2b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample2d_texel_offset). rgb;
               vec3 sample3b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample3d_texel_offset). rgb;
               vec3 sample4b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample4d_texel_offset). rgb;
               vec3 sample1c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample1d_texel_offset). rgb;
               vec3 sample2c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample2d_texel_offset). rgb;
               vec3 sample3c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample3d_texel_offset). rgb;
               vec3 sample4c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample4d_texel_offset). rgb;
               vec3 sample1d = tex2D_linearize(tex, tex_uv + dxdy * sample1d_texel_offset). rgb;
               vec3 sample2d = tex2D_linearize(tex, tex_uv + dxdy * sample2d_texel_offset). rgb;
               vec3 sample3d = tex2D_linearize(tex, tex_uv + dxdy * sample3d_texel_offset). rgb;
               vec3 sample4d = tex2D_linearize(tex, tex_uv + dxdy * sample4d_texel_offset). rgb;



         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum += w1 *(sample1a + sample1b + sample1c + sample1d);
    sum += w2_3 *(sample2a + sample2b + sample2c + sample2d);
    sum += w2_3 *(sample3a + sample3b + sample3c + sample3d);
    sum += w4 *(sample4a + sample4b + sample4c + sample4d);
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur5x5(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{



















          float denom_inv = 0.5 /(sigma * sigma);
          float w1off = exp(- 1.0 * denom_inv);
          float w2off = exp(- 4.0 * denom_inv);
          float texel1to2ratio = w2off /(w1off + w2off);


               vec2 sample1R_texel_offset = vec2(1.0, 0.0)+ vec2(texel1to2ratio, 0.0);
               vec2 sample2d_texel_offset = vec2(1.0, 1.0)+ vec2(texel1to2ratio, texel1to2ratio);




          float w1R1 = w1off;
          float w1R2 = w2off;
          float w2d1 = exp(-(dot(vec2(1.0, 1.0), vec2(1.0, 1.0)))* denom_inv);
          float w2d2_3 = exp(-(dot(vec2(2.0, 1.0), vec2(2.0, 1.0)))* denom_inv);
          float w2d4 = exp(-(dot(vec2(2.0, 2.0), vec2(2.0, 2.0)))* denom_inv);

          float w0 = 1.0;
          float w1 = w1R1 + w1R2;
          float w2 = w2d1 + 2.0 * w2d2_3 + w2d4;

          float weight_sum_inv = 1.0 /(w0 + 4.0 *(w1 + w2));



               vec2 mirror_x = vec2(- 1.0, 1.0);
               vec2 mirror_y = vec2(1.0, - 1.0);
               vec2 mirror_xy = vec2(- 1.0, - 1.0);
               vec2 dxdy_mirror_x = dxdy * mirror_x;
               vec2 dxdy_mirror_y = dxdy * mirror_y;
               vec2 dxdy_mirror_xy = dxdy * mirror_xy;
               vec3 sample0C = tex2D_linearize(tex, tex_uv). rgb;
               vec3 sample1R = tex2D_linearize(tex, tex_uv + dxdy * sample1R_texel_offset). rgb;
               vec3 sample1D = tex2D_linearize(tex, tex_uv + dxdy * sample1R_texel_offset . yx). rgb;
               vec3 sample1L = tex2D_linearize(tex, tex_uv - dxdy * sample1R_texel_offset). rgb;
               vec3 sample1U = tex2D_linearize(tex, tex_uv - dxdy * sample1R_texel_offset . yx). rgb;
               vec3 sample2d = tex2D_linearize(tex, tex_uv + dxdy * sample2d_texel_offset). rgb;
               vec3 sample2c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample2d_texel_offset). rgb;
               vec3 sample2b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample2d_texel_offset). rgb;
               vec3 sample2a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample2d_texel_offset). rgb;



         vec3 sum = w0 * sample0C;
    sum += w1 *(sample1R + sample1D + sample1L + sample1U);
    sum += w2 *(sample2a + sample2b + sample2c + sample2d);
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur3x3(sampler2D tex, vec2 tex_uv,
               vec2 dxdy, float sigma)
{


















          float denom_inv = 0.5 /(sigma * sigma);
          float w0off = 1.0;
          float w1off = exp(- 1.0 * denom_inv);
          float texel0to1ratio = w1off /(w0off * 0.5 + w1off);


               vec2 sample0d_texel_offset = vec2(texel0to1ratio, texel0to1ratio);



               vec2 mirror_x = vec2(- 1.0, 1.0);
               vec2 mirror_y = vec2(1.0, - 1.0);
               vec2 mirror_xy = vec2(- 1.0, - 1.0);
               vec2 dxdy_mirror_x = dxdy * mirror_x;
               vec2 dxdy_mirror_y = dxdy * mirror_y;
               vec2 dxdy_mirror_xy = dxdy * mirror_xy;
               vec3 sample0a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample0d_texel_offset). rgb;
               vec3 sample0b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample0d_texel_offset). rgb;
               vec3 sample0c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample0d_texel_offset). rgb;
               vec3 sample0d = tex2D_linearize(tex, tex_uv + dxdy * sample0d_texel_offset). rgb;



    return 0.25 *(sample0a + sample0b + sample0c + sample0d);
}




     vec3 tex2Dblur12x12shared(sampler2D tex,
               vec4 tex_uv, vec2 dxdy, vec4 quad_vector,
          float sigma)
{











































































          float denom_inv = 0.5 /(sigma * sigma);
          float w0off = 1.0;
          float w0_5off = exp(-(0.5 * 0.5)* denom_inv);
          float w1off = exp(-(1.0 * 1.0)* denom_inv);
          float w1_5off = exp(-(1.5 * 1.5)* denom_inv);
          float w2off = exp(-(2.0 * 2.0)* denom_inv);
          float w2_5off = exp(-(2.5 * 2.5)* denom_inv);
          float w3_5off = exp(-(3.5 * 3.5)* denom_inv);
          float w4_5off = exp(-(4.5 * 4.5)* denom_inv);
          float w5_5off = exp(-(5.5 * 5.5)* denom_inv);
          float texel0to1ratio = mix(w1_5off /(w0_5off + w1_5off), 0.5, error_blurring);
          float texel2to3ratio = mix(w3_5off /(w2_5off + w3_5off), 0.5, error_blurring);
          float texel4to5ratio = mix(w5_5off /(w4_5off + w5_5off), 0.5, error_blurring);

          float texel0to1ratio_nearest = w1off /(w0off + w1off);
          float texel1to2ratio_nearest = w2off /(w1off + w2off);


               vec2 sample0curr_texel_offset = vec2(0.0, 0.0)+ vec2(texel0to1ratio_nearest, texel0to1ratio_nearest);
               vec2 sample0adjx_texel_offset = vec2(- 1.0, 0.0)+ vec2(- texel1to2ratio_nearest, texel0to1ratio_nearest);
               vec2 sample0adjy_texel_offset = vec2(0.0, - 1.0)+ vec2(texel0to1ratio_nearest, - texel1to2ratio_nearest);
               vec2 sample0diag_texel_offset = vec2(- 1.0, - 1.0)+ vec2(- texel1to2ratio_nearest, - texel1to2ratio_nearest);
               vec2 sample1_texel_offset = vec2(2.0, 0.0)+ vec2(texel2to3ratio, texel0to1ratio);
               vec2 sample2_texel_offset = vec2(4.0, 0.0)+ vec2(texel4to5ratio, texel0to1ratio);
               vec2 sample3_texel_offset = vec2(0.0, 2.0)+ vec2(texel0to1ratio, texel2to3ratio);
               vec2 sample4_texel_offset = vec2(2.0, 2.0)+ vec2(texel2to3ratio, texel2to3ratio);
               vec2 sample5_texel_offset = vec2(4.0, 2.0)+ vec2(texel4to5ratio, texel2to3ratio);
               vec2 sample6_texel_offset = vec2(0.0, 4.0)+ vec2(texel0to1ratio, texel4to5ratio);
               vec2 sample7_texel_offset = vec2(2.0, 4.0)+ vec2(texel2to3ratio, texel4to5ratio);
               vec2 sample8_texel_offset = vec2(4.0, 4.0)+ vec2(texel4to5ratio, texel4to5ratio);














          float w8diag =(exp(-(dot(vec2(- 6.0, - 6.0), vec2(- 6.0, - 6.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0 + 1.0, - 6.0), vec2(- 6.0 + 1.0, - 6.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0, - 6.0 + 1.0), vec2(- 6.0, - 6.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0 + 1.0, - 6.0 + 1.0), vec2(- 6.0 + 1.0, - 6.0 + 1.0)))* denom_inv));
          float w7diag =(exp(-(dot(vec2(- 4.0, - 6.0), vec2(- 4.0, - 6.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 6.0), vec2(- 4.0 + 1.0, - 6.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, - 6.0 + 1.0), vec2(- 4.0, - 6.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 6.0 + 1.0), vec2(- 4.0 + 1.0, - 6.0 + 1.0)))* denom_inv));
          float w6diag =(exp(-(dot(vec2(- 2.0, - 6.0), vec2(- 2.0, - 6.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 6.0), vec2(- 2.0 + 1.0, - 6.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, - 6.0 + 1.0), vec2(- 2.0, - 6.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 6.0 + 1.0), vec2(- 2.0 + 1.0, - 6.0 + 1.0)))* denom_inv));
          float w6adjy =(exp(-(dot(vec2(0.0, - 6.0), vec2(0.0, - 6.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 6.0), vec2(0.0 + 1.0, - 6.0)))* denom_inv)+ exp(-(dot(vec2(0.0, - 6.0 + 1.0), vec2(0.0, - 6.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 6.0 + 1.0), vec2(0.0 + 1.0, - 6.0 + 1.0)))* denom_inv));
          float w7adjy =(exp(-(dot(vec2(2.0, - 6.0), vec2(2.0, - 6.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 6.0), vec2(2.0 + 1.0, - 6.0)))* denom_inv)+ exp(-(dot(vec2(2.0, - 6.0 + 1.0), vec2(2.0, - 6.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 6.0 + 1.0), vec2(2.0 + 1.0, - 6.0 + 1.0)))* denom_inv));
          float w8adjy =(exp(-(dot(vec2(4.0, - 6.0), vec2(4.0, - 6.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, - 6.0), vec2(4.0 + 1.0, - 6.0)))* denom_inv)+ exp(-(dot(vec2(4.0, - 6.0 + 1.0), vec2(4.0, - 6.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, - 6.0 + 1.0), vec2(4.0 + 1.0, - 6.0 + 1.0)))* denom_inv));
          float w5diag =(exp(-(dot(vec2(- 6.0, - 4.0), vec2(- 6.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0 + 1.0, - 4.0), vec2(- 6.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0, - 4.0 + 1.0), vec2(- 6.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0 + 1.0, - 4.0 + 1.0), vec2(- 6.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w4diag =(exp(-(dot(vec2(- 4.0, - 4.0), vec2(- 4.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 4.0), vec2(- 4.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, - 4.0 + 1.0), vec2(- 4.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 4.0 + 1.0), vec2(- 4.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w3diag =(exp(-(dot(vec2(- 2.0, - 4.0), vec2(- 2.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 4.0), vec2(- 2.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, - 4.0 + 1.0), vec2(- 2.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 4.0 + 1.0), vec2(- 2.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w3adjy =(exp(-(dot(vec2(0.0, - 4.0), vec2(0.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 4.0), vec2(0.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(0.0, - 4.0 + 1.0), vec2(0.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 4.0 + 1.0), vec2(0.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w4adjy =(exp(-(dot(vec2(2.0, - 4.0), vec2(2.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 4.0), vec2(2.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(2.0, - 4.0 + 1.0), vec2(2.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 4.0 + 1.0), vec2(2.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w5adjy =(exp(-(dot(vec2(4.0, - 4.0), vec2(4.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, - 4.0), vec2(4.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(4.0, - 4.0 + 1.0), vec2(4.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, - 4.0 + 1.0), vec2(4.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w2diag =(exp(-(dot(vec2(- 6.0, - 2.0), vec2(- 6.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0 + 1.0, - 2.0), vec2(- 6.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0, - 2.0 + 1.0), vec2(- 6.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0 + 1.0, - 2.0 + 1.0), vec2(- 6.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w1diag =(exp(-(dot(vec2(- 4.0, - 2.0), vec2(- 4.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 2.0), vec2(- 4.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, - 2.0 + 1.0), vec2(- 4.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 2.0 + 1.0), vec2(- 4.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w0diag =(exp(-(dot(vec2(- 2.0, - 2.0), vec2(- 2.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 2.0), vec2(- 2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, - 2.0 + 1.0), vec2(- 2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 2.0 + 1.0), vec2(- 2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w0adjy =(exp(-(dot(vec2(0.0, - 2.0), vec2(0.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 2.0), vec2(0.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0, - 2.0 + 1.0), vec2(0.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 2.0 + 1.0), vec2(0.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w1adjy =(exp(-(dot(vec2(2.0, - 2.0), vec2(2.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 2.0), vec2(2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0, - 2.0 + 1.0), vec2(2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 2.0 + 1.0), vec2(2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w2adjy =(exp(-(dot(vec2(4.0, - 2.0), vec2(4.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, - 2.0), vec2(4.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(4.0, - 2.0 + 1.0), vec2(4.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, - 2.0 + 1.0), vec2(4.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w2adjx =(exp(-(dot(vec2(- 6.0, 0.0), vec2(- 6.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0 + 1.0, 0.0), vec2(- 6.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0, 0.0 + 1.0), vec2(- 6.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0 + 1.0, 0.0 + 1.0), vec2(- 6.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w1adjx =(exp(-(dot(vec2(- 4.0, 0.0), vec2(- 4.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 0.0), vec2(- 4.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, 0.0 + 1.0), vec2(- 4.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 0.0 + 1.0), vec2(- 4.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w0adjx =(exp(-(dot(vec2(- 2.0, 0.0), vec2(- 2.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 0.0), vec2(- 2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, 0.0 + 1.0), vec2(- 2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 0.0 + 1.0), vec2(- 2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w0curr =(exp(-(dot(vec2(0.0, 0.0), vec2(0.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 0.0), vec2(0.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(0.0, 0.0 + 1.0), vec2(0.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 0.0 + 1.0), vec2(0.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w1curr =(exp(-(dot(vec2(2.0, 0.0), vec2(2.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 0.0), vec2(2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(2.0, 0.0 + 1.0), vec2(2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 0.0 + 1.0), vec2(2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w2curr =(exp(-(dot(vec2(4.0, 0.0), vec2(4.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, 0.0), vec2(4.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(4.0, 0.0 + 1.0), vec2(4.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, 0.0 + 1.0), vec2(4.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w5adjx =(exp(-(dot(vec2(- 6.0, 2.0), vec2(- 6.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0 + 1.0, 2.0), vec2(- 6.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0, 2.0 + 1.0), vec2(- 6.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0 + 1.0, 2.0 + 1.0), vec2(- 6.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w4adjx =(exp(-(dot(vec2(- 4.0, 2.0), vec2(- 4.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 2.0), vec2(- 4.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, 2.0 + 1.0), vec2(- 4.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 2.0 + 1.0), vec2(- 4.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w3adjx =(exp(-(dot(vec2(- 2.0, 2.0), vec2(- 2.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 2.0), vec2(- 2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, 2.0 + 1.0), vec2(- 2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 2.0 + 1.0), vec2(- 2.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w3curr =(exp(-(dot(vec2(0.0, 2.0), vec2(0.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 2.0), vec2(0.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0, 2.0 + 1.0), vec2(0.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 2.0 + 1.0), vec2(0.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w4curr =(exp(-(dot(vec2(2.0, 2.0), vec2(2.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 2.0), vec2(2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0, 2.0 + 1.0), vec2(2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 2.0 + 1.0), vec2(2.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w5curr =(exp(-(dot(vec2(4.0, 2.0), vec2(4.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, 2.0), vec2(4.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(4.0, 2.0 + 1.0), vec2(4.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, 2.0 + 1.0), vec2(4.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w8adjx =(exp(-(dot(vec2(- 6.0, 4.0), vec2(- 6.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0 + 1.0, 4.0), vec2(- 6.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0, 4.0 + 1.0), vec2(- 6.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 6.0 + 1.0, 4.0 + 1.0), vec2(- 6.0 + 1.0, 4.0 + 1.0)))* denom_inv));
          float w7adjx =(exp(-(dot(vec2(- 4.0, 4.0), vec2(- 4.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 4.0), vec2(- 4.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, 4.0 + 1.0), vec2(- 4.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 4.0 + 1.0), vec2(- 4.0 + 1.0, 4.0 + 1.0)))* denom_inv));
          float w6adjx =(exp(-(dot(vec2(- 2.0, 4.0), vec2(- 2.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 4.0), vec2(- 2.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, 4.0 + 1.0), vec2(- 2.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 4.0 + 1.0), vec2(- 2.0 + 1.0, 4.0 + 1.0)))* denom_inv));
          float w6curr =(exp(-(dot(vec2(0.0, 4.0), vec2(0.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 4.0), vec2(0.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(0.0, 4.0 + 1.0), vec2(0.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 4.0 + 1.0), vec2(0.0 + 1.0, 4.0 + 1.0)))* denom_inv));
          float w7curr =(exp(-(dot(vec2(2.0, 4.0), vec2(2.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 4.0), vec2(2.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(2.0, 4.0 + 1.0), vec2(2.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 4.0 + 1.0), vec2(2.0 + 1.0, 4.0 + 1.0)))* denom_inv));
          float w8curr =(exp(-(dot(vec2(4.0, 4.0), vec2(4.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, 4.0), vec2(4.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(4.0, 4.0 + 1.0), vec2(4.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, 4.0 + 1.0), vec2(4.0 + 1.0, 4.0 + 1.0)))* denom_inv));


               vec4 w0 = vec4(w0curr, w0adjx, w0adjy, w0diag);
               vec4 w1 = vec4(w1curr, w1adjx, w1adjy, w1diag);
               vec4 w2 = vec4(w2curr, w2adjx, w2adjy, w2diag);
               vec4 w3 = vec4(w3curr, w3adjx, w3adjy, w3diag);
               vec4 w4 = vec4(w4curr, w4adjx, w4adjy, w4diag);
               vec4 w5 = vec4(w5curr, w5adjx, w5adjy, w5diag);
               vec4 w6 = vec4(w6curr, w6adjx, w6adjy, w6diag);
               vec4 w7 = vec4(w7curr, w7adjx, w7adjy, w7diag);
               vec4 w8 = vec4(w8curr, w8adjx, w8adjy, w8diag);

               vec4 weight_sum4 = w0 + w1 + w2 + w3 + w4 + w5 + w6 + w7 + w8;
               vec2 weight_sum2 = weight_sum4 . xy + weight_sum4 . zw;
          float weight_sum = weight_sum2 . x + weight_sum2 . y;
          float weight_sum_inv = 1.0 /(weight_sum);



               vec2 dxdy_curr = dxdy * quad_vector . xy;

               vec3 sample0curr = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0curr_texel_offset). rgb;
               vec3 sample0adjx = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjx_texel_offset). rgb;
               vec3 sample0adjy = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjy_texel_offset). rgb;
               vec3 sample0diag = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0diag_texel_offset). rgb;
               vec3 sample1curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample1_texel_offset)). rgb;
               vec3 sample2curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample2_texel_offset)). rgb;
               vec3 sample3curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample3_texel_offset)). rgb;
               vec3 sample4curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample4_texel_offset)). rgb;
               vec3 sample5curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample5_texel_offset)). rgb;
               vec3 sample6curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample6_texel_offset)). rgb;
               vec3 sample7curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample7_texel_offset)). rgb;
               vec3 sample8curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample8_texel_offset)). rgb;



         vec3 sample1adjx, sample1adjy, sample1diag;
         vec3 sample2adjx, sample2adjy, sample2diag;
         vec3 sample3adjx, sample3adjy, sample3diag;
         vec3 sample4adjx, sample4adjy, sample4diag;
         vec3 sample5adjx, sample5adjy, sample5diag;
         vec3 sample6adjx, sample6adjy, sample6diag;
         vec3 sample7adjx, sample7adjy, sample7diag;
         vec3 sample8adjx, sample8adjy, sample8diag;
    quad_gather(quad_vector, sample1curr, sample1adjx, sample1adjy, sample1diag);
    quad_gather(quad_vector, sample2curr, sample2adjx, sample2adjy, sample2diag);
    quad_gather(quad_vector, sample3curr, sample3adjx, sample3adjy, sample3diag);
    quad_gather(quad_vector, sample4curr, sample4adjx, sample4adjy, sample4diag);
    quad_gather(quad_vector, sample5curr, sample5adjx, sample5adjy, sample5diag);
    quad_gather(quad_vector, sample6curr, sample6adjx, sample6adjy, sample6diag);
    quad_gather(quad_vector, sample7curr, sample7adjx, sample7adjy, sample7diag);
    quad_gather(quad_vector, sample8curr, sample8adjx, sample8adjy, sample8diag);



         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum +=(mat4x3(sample0curr, sample0adjx, sample0adjy, sample0diag)* w0);
    sum +=(mat4x3(sample1curr, sample1adjx, sample1adjy, sample1diag)* w1);
    sum +=(mat4x3(sample2curr, sample2adjx, sample2adjy, sample2diag)* w2);
    sum +=(mat4x3(sample3curr, sample3adjx, sample3adjy, sample3diag)* w3);
    sum +=(mat4x3(sample4curr, sample4adjx, sample4adjy, sample4diag)* w4);
    sum +=(mat4x3(sample5curr, sample5adjx, sample5adjy, sample5diag)* w5);
    sum +=(mat4x3(sample6curr, sample6adjx, sample6adjy, sample6diag)* w6);
    sum +=(mat4x3(sample7curr, sample7adjx, sample7adjy, sample7diag)* w7);
    sum +=(mat4x3(sample8curr, sample8adjx, sample8adjy, sample8diag)* w8);
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur10x10shared(sampler2D tex,
               vec4 tex_uv, vec2 dxdy, vec4 quad_vector,
          float sigma)
{



















          float denom_inv = 0.5 /(sigma * sigma);
          float w0off = 1.0;
          float w0_5off = exp(-(0.5 * 0.5)* denom_inv);
          float w1off = exp(-(1.0 * 1.0)* denom_inv);
          float w1_5off = exp(-(1.5 * 1.5)* denom_inv);
          float w2off = exp(-(2.0 * 2.0)* denom_inv);
          float w2_5off = exp(-(2.5 * 2.5)* denom_inv);
          float w3_5off = exp(-(3.5 * 3.5)* denom_inv);
          float w4_5off = exp(-(4.5 * 4.5)* denom_inv);
          float w5_5off = exp(-(5.5 * 5.5)* denom_inv);
          float texel0to1ratio = mix(w1_5off /(w0_5off + w1_5off), 0.5, error_blurring);
          float texel2to3ratio = mix(w3_5off /(w2_5off + w3_5off), 0.5, error_blurring);
          float texel4to5ratio = mix(w5_5off /(w4_5off + w5_5off), 0.5, error_blurring);

          float texel0to1ratio_nearest = w1off /(w0off + w1off);
          float texel1to2ratio_nearest = w2off /(w1off + w2off);


               vec2 sample0curr_texel_offset = vec2(0.0, 0.0)+ vec2(texel0to1ratio_nearest, texel0to1ratio_nearest);
               vec2 sample0adjx_texel_offset = vec2(- 1.0, 0.0)+ vec2(- texel1to2ratio_nearest, texel0to1ratio_nearest);
               vec2 sample0adjy_texel_offset = vec2(0.0, - 1.0)+ vec2(texel0to1ratio_nearest, - texel1to2ratio_nearest);
               vec2 sample0diag_texel_offset = vec2(- 1.0, - 1.0)+ vec2(- texel1to2ratio_nearest, - texel1to2ratio_nearest);
               vec2 sample1_texel_offset = vec2(2.0, 0.0)+ vec2(texel2to3ratio, texel0to1ratio);
               vec2 sample2_texel_offset = vec2(4.0, 0.0)+ vec2(texel4to5ratio, texel0to1ratio);
               vec2 sample3_texel_offset = vec2(0.0, 2.0)+ vec2(texel0to1ratio, texel2to3ratio);
               vec2 sample4_texel_offset = vec2(2.0, 2.0)+ vec2(texel2to3ratio, texel2to3ratio);
               vec2 sample5_texel_offset = vec2(4.0, 2.0)+ vec2(texel4to5ratio, texel2to3ratio);
               vec2 sample6_texel_offset = vec2(0.0, 4.0)+ vec2(texel0to1ratio, texel4to5ratio);
               vec2 sample7_texel_offset = vec2(2.0, 4.0)+ vec2(texel2to3ratio, texel4to5ratio);
               vec2 sample8_texel_offset = vec2(4.0, 4.0)+ vec2(texel4to5ratio, texel4to5ratio);













          float w4diag =(exp(-(dot(vec2(- 4.0, - 4.0), vec2(- 4.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 4.0), vec2(- 4.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, - 4.0 + 1.0), vec2(- 4.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 4.0 + 1.0), vec2(- 4.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w3diag =(exp(-(dot(vec2(- 2.0, - 4.0), vec2(- 2.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 4.0), vec2(- 2.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, - 4.0 + 1.0), vec2(- 2.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 4.0 + 1.0), vec2(- 2.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w3adjy =(exp(-(dot(vec2(0.0, - 4.0), vec2(0.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 4.0), vec2(0.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(0.0, - 4.0 + 1.0), vec2(0.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 4.0 + 1.0), vec2(0.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w4adjy =(exp(-(dot(vec2(2.0, - 4.0), vec2(2.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 4.0), vec2(2.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(2.0, - 4.0 + 1.0), vec2(2.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 4.0 + 1.0), vec2(2.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w5adjy =(exp(-(dot(vec2(4.0, - 4.0), vec2(4.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, - 4.0), vec2(4.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(4.0, - 4.0 + 1.0), vec2(4.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, - 4.0 + 1.0), vec2(4.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w1diag =(exp(-(dot(vec2(- 4.0, - 2.0), vec2(- 4.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 2.0), vec2(- 4.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, - 2.0 + 1.0), vec2(- 4.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 2.0 + 1.0), vec2(- 4.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w0diag =(exp(-(dot(vec2(- 2.0, - 2.0), vec2(- 2.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 2.0), vec2(- 2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, - 2.0 + 1.0), vec2(- 2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 2.0 + 1.0), vec2(- 2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w0adjy =(exp(-(dot(vec2(0.0, - 2.0), vec2(0.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 2.0), vec2(0.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0, - 2.0 + 1.0), vec2(0.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 2.0 + 1.0), vec2(0.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w1adjy =(exp(-(dot(vec2(2.0, - 2.0), vec2(2.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 2.0), vec2(2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0, - 2.0 + 1.0), vec2(2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 2.0 + 1.0), vec2(2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w2adjy =(exp(-(dot(vec2(4.0, - 2.0), vec2(4.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, - 2.0), vec2(4.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(4.0, - 2.0 + 1.0), vec2(4.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, - 2.0 + 1.0), vec2(4.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w1adjx =(exp(-(dot(vec2(- 4.0, 0.0), vec2(- 4.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 0.0), vec2(- 4.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, 0.0 + 1.0), vec2(- 4.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 0.0 + 1.0), vec2(- 4.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w0adjx =(exp(-(dot(vec2(- 2.0, 0.0), vec2(- 2.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 0.0), vec2(- 2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, 0.0 + 1.0), vec2(- 2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 0.0 + 1.0), vec2(- 2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w0curr =(exp(-(dot(vec2(0.0, 0.0), vec2(0.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 0.0), vec2(0.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(0.0, 0.0 + 1.0), vec2(0.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 0.0 + 1.0), vec2(0.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w1curr =(exp(-(dot(vec2(2.0, 0.0), vec2(2.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 0.0), vec2(2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(2.0, 0.0 + 1.0), vec2(2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 0.0 + 1.0), vec2(2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w2curr =(exp(-(dot(vec2(4.0, 0.0), vec2(4.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, 0.0), vec2(4.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(4.0, 0.0 + 1.0), vec2(4.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, 0.0 + 1.0), vec2(4.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w4adjx =(exp(-(dot(vec2(- 4.0, 2.0), vec2(- 4.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 2.0), vec2(- 4.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, 2.0 + 1.0), vec2(- 4.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 2.0 + 1.0), vec2(- 4.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w3adjx =(exp(-(dot(vec2(- 2.0, 2.0), vec2(- 2.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 2.0), vec2(- 2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, 2.0 + 1.0), vec2(- 2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 2.0 + 1.0), vec2(- 2.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w3curr =(exp(-(dot(vec2(0.0, 2.0), vec2(0.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 2.0), vec2(0.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0, 2.0 + 1.0), vec2(0.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 2.0 + 1.0), vec2(0.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w4curr =(exp(-(dot(vec2(2.0, 2.0), vec2(2.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 2.0), vec2(2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0, 2.0 + 1.0), vec2(2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 2.0 + 1.0), vec2(2.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w5curr =(exp(-(dot(vec2(4.0, 2.0), vec2(4.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, 2.0), vec2(4.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(4.0, 2.0 + 1.0), vec2(4.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, 2.0 + 1.0), vec2(4.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w7adjx =(exp(-(dot(vec2(- 4.0, 4.0), vec2(- 4.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 4.0), vec2(- 4.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, 4.0 + 1.0), vec2(- 4.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 4.0 + 1.0), vec2(- 4.0 + 1.0, 4.0 + 1.0)))* denom_inv));
          float w6adjx =(exp(-(dot(vec2(- 2.0, 4.0), vec2(- 2.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 4.0), vec2(- 2.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, 4.0 + 1.0), vec2(- 2.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 4.0 + 1.0), vec2(- 2.0 + 1.0, 4.0 + 1.0)))* denom_inv));
          float w6curr =(exp(-(dot(vec2(0.0, 4.0), vec2(0.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 4.0), vec2(0.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(0.0, 4.0 + 1.0), vec2(0.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 4.0 + 1.0), vec2(0.0 + 1.0, 4.0 + 1.0)))* denom_inv));
          float w7curr =(exp(-(dot(vec2(2.0, 4.0), vec2(2.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 4.0), vec2(2.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(2.0, 4.0 + 1.0), vec2(2.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 4.0 + 1.0), vec2(2.0 + 1.0, 4.0 + 1.0)))* denom_inv));
          float w8curr =(exp(-(dot(vec2(4.0, 4.0), vec2(4.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, 4.0), vec2(4.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(vec2(4.0, 4.0 + 1.0), vec2(4.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(4.0 + 1.0, 4.0 + 1.0), vec2(4.0 + 1.0, 4.0 + 1.0)))* denom_inv));


          float weight_sum_inv = 1.0 /(w0curr + w1curr + w2curr + w3curr +
        w4curr + w5curr + w6curr + w7curr + w8curr +
        w0adjx + w1adjx + w3adjx + w4adjx + w6adjx + w7adjx +
        w0adjy + w1adjy + w2adjy + w3adjy + w4adjy + w5adjy +
        w0diag + w1diag + w3diag + w4diag);

               vec4 w0 = vec4(w0curr, w0adjx, w0adjy, w0diag);
               vec4 w1 = vec4(w1curr, w1adjx, w1adjy, w1diag);
               vec4 w3 = vec4(w3curr, w3adjx, w3adjy, w3diag);
               vec4 w4 = vec4(w4curr, w4adjx, w4adjy, w4diag);
               vec4 w2and5 = vec4(w2curr, w2adjy, w5curr, w5adjy);
               vec4 w6and7 = vec4(w6curr, w6adjx, w7curr, w7adjx);



               vec2 dxdy_curr = dxdy * quad_vector . xy;

               vec3 sample0curr = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0curr_texel_offset). rgb;
               vec3 sample0adjx = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjx_texel_offset). rgb;
               vec3 sample0adjy = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjy_texel_offset). rgb;
               vec3 sample0diag = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0diag_texel_offset). rgb;
               vec3 sample1curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample1_texel_offset)). rgb;
               vec3 sample2curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample2_texel_offset)). rgb;
               vec3 sample3curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample3_texel_offset)). rgb;
               vec3 sample4curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample4_texel_offset)). rgb;
               vec3 sample5curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample5_texel_offset)). rgb;
               vec3 sample6curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample6_texel_offset)). rgb;
               vec3 sample7curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample7_texel_offset)). rgb;
               vec3 sample8curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample8_texel_offset)). rgb;



         vec3 sample1adjx, sample1adjy, sample1diag;
         vec3 sample2adjx, sample2adjy, sample2diag;
         vec3 sample3adjx, sample3adjy, sample3diag;
         vec3 sample4adjx, sample4adjy, sample4diag;
         vec3 sample5adjx, sample5adjy, sample5diag;
         vec3 sample6adjx, sample6adjy, sample6diag;
         vec3 sample7adjx, sample7adjy, sample7diag;
    quad_gather(quad_vector, sample1curr, sample1adjx, sample1adjy, sample1diag);
    quad_gather(quad_vector, sample2curr, sample2adjx, sample2adjy, sample2diag);
    quad_gather(quad_vector, sample3curr, sample3adjx, sample3adjy, sample3diag);
    quad_gather(quad_vector, sample4curr, sample4adjx, sample4adjy, sample4diag);
    quad_gather(quad_vector, sample5curr, sample5adjx, sample5adjy, sample5diag);
    quad_gather(quad_vector, sample6curr, sample6adjx, sample6adjy, sample6diag);
    quad_gather(quad_vector, sample7curr, sample7adjx, sample7adjy, sample7diag);



         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum +=(mat4x3(sample0curr, sample0adjx, sample0adjy, sample0diag)* w0);
    sum +=(mat4x3(sample1curr, sample1adjx, sample1adjy, sample1diag)* w1);
    sum +=(mat4x3(sample3curr, sample3adjx, sample3adjy, sample3diag)* w3);
    sum +=(mat4x3(sample4curr, sample4adjx, sample4adjy, sample4diag)* w4);

    sum +=(mat4x3(sample2curr, sample2adjy, sample5curr, sample5adjy)* w2and5);
    sum +=(mat4x3(sample6curr, sample6adjx, sample7curr, sample7adjx)* w6and7);
    sum += w8curr * sample8curr;

    return sum * weight_sum_inv;
}

     vec3 tex2Dblur8x8shared(sampler2D tex,
               vec4 tex_uv, vec2 dxdy, vec4 quad_vector,
          float sigma)
{






























          float denom_inv = 0.5 /(sigma * sigma);
          float w0off = 1.0;
          float w0_5off = exp(-(0.5 * 0.5)* denom_inv);
          float w1off = exp(-(1.0 * 1.0)* denom_inv);
          float w1_5off = exp(-(1.5 * 1.5)* denom_inv);
          float w2off = exp(-(2.0 * 2.0)* denom_inv);
          float w2_5off = exp(-(2.5 * 2.5)* denom_inv);
          float w3_5off = exp(-(3.5 * 3.5)* denom_inv);
          float texel0to1ratio = mix(w1_5off /(w0_5off + w1_5off), 0.5, error_blurring);
          float texel2to3ratio = mix(w3_5off /(w2_5off + w3_5off), 0.5, error_blurring);

          float texel0to1ratio_nearest = w1off /(w0off + w1off);
          float texel1to2ratio_nearest = w2off /(w1off + w2off);


               vec2 sample0curr_texel_offset = vec2(0.0, 0.0)+ vec2(texel0to1ratio_nearest, texel0to1ratio_nearest);
               vec2 sample0adjx_texel_offset = vec2(- 1.0, 0.0)+ vec2(- texel1to2ratio_nearest, texel0to1ratio_nearest);
               vec2 sample0adjy_texel_offset = vec2(0.0, - 1.0)+ vec2(texel0to1ratio_nearest, - texel1to2ratio_nearest);
               vec2 sample0diag_texel_offset = vec2(- 1.0, - 1.0)+ vec2(- texel1to2ratio_nearest, - texel1to2ratio_nearest);
               vec2 sample1_texel_offset = vec2(2.0, 0.0)+ vec2(texel2to3ratio, texel0to1ratio);
               vec2 sample2_texel_offset = vec2(0.0, 2.0)+ vec2(texel0to1ratio, texel2to3ratio);
               vec2 sample3_texel_offset = vec2(2.0, 2.0)+ vec2(texel2to3ratio, texel2to3ratio);









          float w3diag =(exp(-(dot(vec2(- 4.0, - 4.0), vec2(- 4.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 4.0), vec2(- 4.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, - 4.0 + 1.0), vec2(- 4.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 4.0 + 1.0), vec2(- 4.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w2diag =(exp(-(dot(vec2(- 2.0, - 4.0), vec2(- 2.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 4.0), vec2(- 2.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, - 4.0 + 1.0), vec2(- 2.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 4.0 + 1.0), vec2(- 2.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w2adjy =(exp(-(dot(vec2(0.0, - 4.0), vec2(0.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 4.0), vec2(0.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(0.0, - 4.0 + 1.0), vec2(0.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 4.0 + 1.0), vec2(0.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w3adjy =(exp(-(dot(vec2(2.0, - 4.0), vec2(2.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 4.0), vec2(2.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(vec2(2.0, - 4.0 + 1.0), vec2(2.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 4.0 + 1.0), vec2(2.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
          float w1diag =(exp(-(dot(vec2(- 4.0, - 2.0), vec2(- 4.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 2.0), vec2(- 4.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, - 2.0 + 1.0), vec2(- 4.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, - 2.0 + 1.0), vec2(- 4.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w0diag =(exp(-(dot(vec2(- 2.0, - 2.0), vec2(- 2.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 2.0), vec2(- 2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, - 2.0 + 1.0), vec2(- 2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 2.0 + 1.0), vec2(- 2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w0adjy =(exp(-(dot(vec2(0.0, - 2.0), vec2(0.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 2.0), vec2(0.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0, - 2.0 + 1.0), vec2(0.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 2.0 + 1.0), vec2(0.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w1adjy =(exp(-(dot(vec2(2.0, - 2.0), vec2(2.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 2.0), vec2(2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0, - 2.0 + 1.0), vec2(2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 2.0 + 1.0), vec2(2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w1adjx =(exp(-(dot(vec2(- 4.0, 0.0), vec2(- 4.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 0.0), vec2(- 4.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, 0.0 + 1.0), vec2(- 4.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 0.0 + 1.0), vec2(- 4.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w0adjx =(exp(-(dot(vec2(- 2.0, 0.0), vec2(- 2.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 0.0), vec2(- 2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, 0.0 + 1.0), vec2(- 2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 0.0 + 1.0), vec2(- 2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w0curr =(exp(-(dot(vec2(0.0, 0.0), vec2(0.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 0.0), vec2(0.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(0.0, 0.0 + 1.0), vec2(0.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 0.0 + 1.0), vec2(0.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w1curr =(exp(-(dot(vec2(2.0, 0.0), vec2(2.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 0.0), vec2(2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(2.0, 0.0 + 1.0), vec2(2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 0.0 + 1.0), vec2(2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w3adjx =(exp(-(dot(vec2(- 4.0, 2.0), vec2(- 4.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 2.0), vec2(- 4.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0, 2.0 + 1.0), vec2(- 4.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 4.0 + 1.0, 2.0 + 1.0), vec2(- 4.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w2adjx =(exp(-(dot(vec2(- 2.0, 2.0), vec2(- 2.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 2.0), vec2(- 2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, 2.0 + 1.0), vec2(- 2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 2.0 + 1.0), vec2(- 2.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w2curr =(exp(-(dot(vec2(0.0, 2.0), vec2(0.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 2.0), vec2(0.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0, 2.0 + 1.0), vec2(0.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 2.0 + 1.0), vec2(0.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w3curr =(exp(-(dot(vec2(2.0, 2.0), vec2(2.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 2.0), vec2(2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0, 2.0 + 1.0), vec2(2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 2.0 + 1.0), vec2(2.0 + 1.0, 2.0 + 1.0)))* denom_inv));


               vec4 w0 = vec4(w0curr, w0adjx, w0adjy, w0diag);
               vec4 w1 = vec4(w1curr, w1adjx, w1adjy, w1diag);
               vec4 w2 = vec4(w2curr, w2adjx, w2adjy, w2diag);
               vec4 w3 = vec4(w3curr, w3adjx, w3adjy, w3diag);

               vec4 weight_sum4 = w0 + w1 + w2 + w3;
               vec2 weight_sum2 = weight_sum4 . xy + weight_sum4 . zw;
          float weight_sum = weight_sum2 . x + weight_sum2 . y;
          float weight_sum_inv = 1.0 /(weight_sum);



               vec2 dxdy_curr = dxdy * quad_vector . xy;

               vec3 sample0curr = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0curr_texel_offset). rgb;
               vec3 sample0adjx = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjx_texel_offset). rgb;
               vec3 sample0adjy = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjy_texel_offset). rgb;
               vec3 sample0diag = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0diag_texel_offset). rgb;
               vec3 sample1curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample1_texel_offset)). rgb;
               vec3 sample2curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample2_texel_offset)). rgb;
               vec3 sample3curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample3_texel_offset)). rgb;



         vec3 sample1adjx, sample1adjy, sample1diag;
         vec3 sample2adjx, sample2adjy, sample2diag;
         vec3 sample3adjx, sample3adjy, sample3diag;
    quad_gather(quad_vector, sample1curr, sample1adjx, sample1adjy, sample1diag);
    quad_gather(quad_vector, sample2curr, sample2adjx, sample2adjy, sample2diag);
    quad_gather(quad_vector, sample3curr, sample3adjx, sample3adjy, sample3diag);



         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum +=(mat4x3(sample0curr, sample0adjx, sample0adjy, sample0diag)* w0);
    sum +=(mat4x3(sample1curr, sample1adjx, sample1adjy, sample1diag)* w1);
    sum +=(mat4x3(sample2curr, sample2adjx, sample2adjy, sample2diag)* w2);
    sum +=(mat4x3(sample3curr, sample3adjx, sample3adjy, sample3diag)* w3);
    return sum * weight_sum_inv;
}

     vec3 tex2Dblur6x6shared(sampler2D tex,
               vec4 tex_uv, vec2 dxdy, vec4 quad_vector,
          float sigma)
{



















          float denom_inv = 0.5 /(sigma * sigma);
          float w0off = 1.0;
          float w0_5off = exp(-(0.5 * 0.5)* denom_inv);
          float w1off = exp(-(1.0 * 1.0)* denom_inv);
          float w1_5off = exp(-(1.5 * 1.5)* denom_inv);
          float w2off = exp(-(2.0 * 2.0)* denom_inv);
          float w2_5off = exp(-(2.5 * 2.5)* denom_inv);
          float w3_5off = exp(-(3.5 * 3.5)* denom_inv);
          float texel0to1ratio = mix(w1_5off /(w0_5off + w1_5off), 0.5, error_blurring);
          float texel2to3ratio = mix(w3_5off /(w2_5off + w3_5off), 0.5, error_blurring);

          float texel0to1ratio_nearest = w1off /(w0off + w1off);
          float texel1to2ratio_nearest = w2off /(w1off + w2off);


               vec2 sample0curr_texel_offset = vec2(0.0, 0.0)+ vec2(texel0to1ratio_nearest, texel0to1ratio_nearest);
               vec2 sample0adjx_texel_offset = vec2(- 1.0, 0.0)+ vec2(- texel1to2ratio_nearest, texel0to1ratio_nearest);
               vec2 sample0adjy_texel_offset = vec2(0.0, - 1.0)+ vec2(texel0to1ratio_nearest, - texel1to2ratio_nearest);
               vec2 sample0diag_texel_offset = vec2(- 1.0, - 1.0)+ vec2(- texel1to2ratio_nearest, - texel1to2ratio_nearest);
               vec2 sample1_texel_offset = vec2(2.0, 0.0)+ vec2(texel2to3ratio, texel0to1ratio);
               vec2 sample2_texel_offset = vec2(0.0, 2.0)+ vec2(texel0to1ratio, texel2to3ratio);
               vec2 sample3_texel_offset = vec2(2.0, 2.0)+ vec2(texel2to3ratio, texel2to3ratio);













          float w0diag =(exp(-(dot(vec2(- 2.0, - 2.0), vec2(- 2.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 2.0), vec2(- 2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, - 2.0 + 1.0), vec2(- 2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, - 2.0 + 1.0), vec2(- 2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w0adjy =(exp(-(dot(vec2(0.0, - 2.0), vec2(0.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 2.0), vec2(0.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0, - 2.0 + 1.0), vec2(0.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, - 2.0 + 1.0), vec2(0.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w1adjy =(exp(-(dot(vec2(2.0, - 2.0), vec2(2.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 2.0), vec2(2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0, - 2.0 + 1.0), vec2(2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, - 2.0 + 1.0), vec2(2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
          float w0adjx =(exp(-(dot(vec2(- 2.0, 0.0), vec2(- 2.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 0.0), vec2(- 2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, 0.0 + 1.0), vec2(- 2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 0.0 + 1.0), vec2(- 2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w0curr =(exp(-(dot(vec2(0.0, 0.0), vec2(0.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 0.0), vec2(0.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(0.0, 0.0 + 1.0), vec2(0.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 0.0 + 1.0), vec2(0.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w1curr =(exp(-(dot(vec2(2.0, 0.0), vec2(2.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 0.0), vec2(2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(vec2(2.0, 0.0 + 1.0), vec2(2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 0.0 + 1.0), vec2(2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
          float w2adjx =(exp(-(dot(vec2(- 2.0, 2.0), vec2(- 2.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 2.0), vec2(- 2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0, 2.0 + 1.0), vec2(- 2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(- 2.0 + 1.0, 2.0 + 1.0), vec2(- 2.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w2curr =(exp(-(dot(vec2(0.0, 2.0), vec2(0.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 2.0), vec2(0.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(0.0, 2.0 + 1.0), vec2(0.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(0.0 + 1.0, 2.0 + 1.0), vec2(0.0 + 1.0, 2.0 + 1.0)))* denom_inv));
          float w3curr =(exp(-(dot(vec2(2.0, 2.0), vec2(2.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 2.0), vec2(2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(vec2(2.0, 2.0 + 1.0), vec2(2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(vec2(2.0 + 1.0, 2.0 + 1.0), vec2(2.0 + 1.0, 2.0 + 1.0)))* denom_inv));


          float weight_sum_inv = 1.0 /(w0curr + w1curr + w2curr + w3curr +
        w0adjx + w2adjx + w0adjy + w1adjy + w0diag);

               vec4 w0 = vec4(w0curr, w0adjx, w0adjy, w0diag);



               vec2 dxdy_curr = dxdy * quad_vector . xy;

               vec3 sample0curr = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0curr_texel_offset). rgb;
               vec3 sample0adjx = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjx_texel_offset). rgb;
               vec3 sample0adjy = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjy_texel_offset). rgb;
               vec3 sample0diag = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0diag_texel_offset). rgb;
               vec3 sample1curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample1_texel_offset)). rgb;
               vec3 sample2curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample2_texel_offset)). rgb;
               vec3 sample3curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample3_texel_offset)). rgb;



         vec3 sample1adjx, sample1adjy, sample1diag;
         vec3 sample2adjx, sample2adjy, sample2diag;
    quad_gather(quad_vector, sample1curr, sample1adjx, sample1adjy, sample1diag);
    quad_gather(quad_vector, sample2curr, sample2adjx, sample2adjy, sample2diag);




         vec3 sum = vec3(0.0, 0.0, 0.0);
    sum +=(mat4x3(sample0curr, sample0adjx, sample0adjy, sample0diag)* w0);
    sum += w1curr * sample1curr + w1adjy * sample1adjy + w2curr * sample2curr +
            w2adjx * sample2adjx + w3curr * sample3curr;
    return sum * weight_sum_inv;
}








            vec3 tex2Dblur11resize(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur11resize(tex, tex_uv, dxdy, blur11_std_dev);
}
            vec3 tex2Dblur9resize(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur9resize(tex, tex_uv, dxdy, blur9_std_dev);
}
            vec3 tex2Dblur7resize(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur7resize(tex, tex_uv, dxdy, blur7_std_dev);
}
            vec3 tex2Dblur5resize(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur5resize(tex, tex_uv, dxdy, blur5_std_dev);
}
            vec3 tex2Dblur3resize(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur3resize(tex, tex_uv, dxdy, blur3_std_dev);
}

            vec3 tex2Dblur11fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur11fast(tex, tex_uv, dxdy, blur11_std_dev);
}
            vec3 tex2Dblur9fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur9fast(tex, tex_uv, dxdy, blur9_std_dev);
}
            vec3 tex2Dblur7fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur7fast(tex, tex_uv, dxdy, blur7_std_dev);
}
            vec3 tex2Dblur5fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur5fast(tex, tex_uv, dxdy, blur5_std_dev);
}
            vec3 tex2Dblur3fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur3fast(tex, tex_uv, dxdy, blur3_std_dev);
}

            vec3 tex2Dblur43fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur43fast(tex, tex_uv, dxdy, blur43_std_dev);
}
            vec3 tex2Dblur31fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur31fast(tex, tex_uv, dxdy, blur31_std_dev);
}
            vec3 tex2Dblur25fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur25fast(tex, tex_uv, dxdy, blur25_std_dev);
}
            vec3 tex2Dblur17fast(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur17fast(tex, tex_uv, dxdy, blur17_std_dev);
}

            vec3 tex2Dblur3x3resize(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur3x3resize(tex, tex_uv, dxdy, blur3_std_dev);
}

            vec3 tex2Dblur9x9(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur9x9(tex, tex_uv, dxdy, blur9_std_dev);
}
            vec3 tex2Dblur7x7(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur7x7(tex, tex_uv, dxdy, blur7_std_dev);
}
            vec3 tex2Dblur5x5(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur5x5(tex, tex_uv, dxdy, blur5_std_dev);
}
            vec3 tex2Dblur3x3(sampler2D tex, vec2 tex_uv,
               vec2 dxdy)
{
    return tex2Dblur3x3(tex, tex_uv, dxdy, blur3_std_dev);
}

            vec3 tex2Dblur12x12shared(sampler2D tex,
               vec4 tex_uv, vec2 dxdy, vec4 quad_vector)
{
    return tex2Dblur12x12shared(tex, tex_uv, dxdy, quad_vector, blur12_std_dev);
}
            vec3 tex2Dblur10x10shared(sampler2D tex,
               vec4 tex_uv, vec2 dxdy, vec4 quad_vector)
{
    return tex2Dblur10x10shared(tex, tex_uv, dxdy, quad_vector, blur10_std_dev);
}
            vec3 tex2Dblur8x8shared(sampler2D tex,
               vec4 tex_uv, vec2 dxdy, vec4 quad_vector)
{
    return tex2Dblur8x8shared(tex, tex_uv, dxdy, quad_vector, blur8_std_dev);
}
            vec3 tex2Dblur6x6shared(sampler2D tex,
               vec4 tex_uv, vec2 dxdy, vec4 quad_vector)
{
    return tex2Dblur6x6shared(tex, tex_uv, dxdy, quad_vector, blur6_std_dev);
}





void main()
{
 vec3 color = tex2Dblur7fast(Source, tex_uv, blur_dxdy);

   FragColor = encode_output(vec4(color, 1.0));
}
