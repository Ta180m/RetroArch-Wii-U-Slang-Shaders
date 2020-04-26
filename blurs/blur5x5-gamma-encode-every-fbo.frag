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




 float4 encode_output(const float4 color)
{
    if(gamma_encode_output)
    {
        if(assume_opaque_alpha)
        {
            return float4(pow(color . rgb, float3(1.0 / get_pass_output_gamma())), 1.0);
        }
        else
        {
            return float4(pow(color . rgb, float3(1.0 / get_pass_output_gamma())), color . a);
        }
    }
    else
    {
        return color;
    }
}

 float4 decode_input(const float4 color)
{
    if(linearize_input)
    {
        if(assume_opaque_alpha)
        {
            return float4(pow(color . rgb, float3(get_pass_input_gamma())), 1.0);
        }
        else
        {
            return float4(pow(color . rgb, float3(get_pass_input_gamma())), color . a);
        }
    }
    else
    {
        return color;
    }
}

 float4 decode_gamma_input(const float4 color, const float3 gamma)
{
    if(assume_opaque_alpha)
    {
        return float4(pow(color . rgb, gamma), 1.0);
    }
    else
    {
        return float4(pow(color . rgb, gamma), color . a);
    }
}
















































































 float4 tex2D_linearize(const sampler2D tex, float2 tex_coords)
{ return decode_input(texture(tex, tex_coords));}

 float4 tex2D_linearize(const sampler2D tex, float3 tex_coords)
{ return decode_input(texture(tex, tex_coords . xy));}

 float4 tex2D_linearize(const sampler2D tex, float2 tex_coords, int texel_off)
{ return decode_input(textureLod(tex, tex_coords, texel_off));}

 float4 tex2D_linearize(const sampler2D tex, float3 tex_coords, int texel_off)
{ return decode_input(textureLod(tex, tex_coords . xy, texel_off));}




























 float4 tex2Dlod_linearize(const sampler2D tex, float4 tex_coords)
{ return decode_input(textureLod(tex, tex_coords . xy, 0.0));}

 float4 tex2Dlod_linearize(const sampler2D tex, float4 tex_coords, int texel_off)
{ return decode_input(textureLod(tex, tex_coords . xy, texel_off));}

















































































































 float4 tex2Dlod_linearize_gamma(const sampler2D tex, float4 tex_coords, float3 gamma)
{ return decode_gamma_input(textureLod(tex, tex_coords . xy, 0.0), gamma);}

 float4 tex2Dlod_linearize_gamma(const sampler2D tex, float4 tex_coords, int texel_off, float3 gamma)
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



























































































































































































































































































































































































































































































































































































































float4 get_quad_vector_naive(const float4 output_pixel_num_wrt_uvxy)
{



















    float4 pixel_odd = frac(output_pixel_num_wrt_uvxy * 0.5)* 2.0;
    float4 quad_vector = pixel_odd * 2.0 - float4(1.0);
    return quad_vector;
}

float4 get_quad_vector(const float4 output_pixel_num_wrt_uvxy)
{




    float4 quad_vector_guess =
        get_quad_vector_naive(output_pixel_num_wrt_uvxy);


    float2 odd_start_mirror = 0.5 * float2(ddx(quad_vector_guess . z),
                                                ddy(quad_vector_guess . w));
    return quad_vector_guess * odd_start_mirror . xyxy;
}

float4 get_quad_vector(const float2 output_pixel_num_wrt_uv)
{











    float2 screen_uv_mirror = float2(ddx(output_pixel_num_wrt_uv . x),
                                        ddy(output_pixel_num_wrt_uv . y));
    float2 pixel_odd_wrt_uv = frac(output_pixel_num_wrt_uv * 0.5)* 2.0;
    float2 quad_vector_uv_guess =(pixel_odd_wrt_uv - float2(0.5))* 2.0;
    float2 quad_vector_screen_guess = quad_vector_uv_guess * screen_uv_mirror;


    float2 odd_start_mirror = 0.5 * float2(ddx(quad_vector_screen_guess . x),
                                                ddy(quad_vector_screen_guess . y));
    float4 quad_vector_guess = float4(
        quad_vector_uv_guess, quad_vector_screen_guess);
    return quad_vector_guess * odd_start_mirror . xyxy;
}

void quad_gather(const float4 quad_vector, const float4 curr,
    out float4 adjx, out float4 adjy, out float4 diag)
{







    adjx = curr - ddx(curr)* quad_vector . z;
    adjy = curr - ddy(curr)* quad_vector . w;
    diag = adjx - ddy(adjx)* quad_vector . w;
}

void quad_gather(const float4 quad_vector, const float3 curr,
    out float3 adjx, out float3 adjy, out float3 diag)
{

    adjx = curr - ddx(curr)* quad_vector . z;
    adjy = curr - ddy(curr)* quad_vector . w;
    diag = adjx - ddy(adjx)* quad_vector . w;
}

void quad_gather(const float4 quad_vector, const float2 curr,
    out float2 adjx, out float2 adjy, out float2 diag)
{

    adjx = curr - ddx(curr)* quad_vector . z;
    adjy = curr - ddy(curr)* quad_vector . w;
    diag = adjx - ddy(adjx)* quad_vector . w;
}

float4 quad_gather(const float4 quad_vector, const float curr)
{





    float4 all = float4(curr);
    all . y = all . x - ddx(all . x)* quad_vector . z;
    all . zw = all . xy - ddy(all . xy)* quad_vector . w;
    return all;
}

float4 quad_gather_sum(const float4 quad_vector, const float4 curr)
{


    float4 adjx, adjy, diag;
    quad_gather(quad_vector, curr, adjx, adjy, diag);
    return(curr + adjx + adjy + diag);
}

float3 quad_gather_sum(const float4 quad_vector, const float3 curr)
{

    float3 adjx, adjy, diag;
    quad_gather(quad_vector, curr, adjx, adjy, diag);
    return(curr + adjx + adjy + diag);
}

float2 quad_gather_sum(const float4 quad_vector, const float2 curr)
{

    float2 adjx, adjy, diag;
    quad_gather(quad_vector, curr, adjx, adjy, diag);
    return(curr + adjx + adjy + diag);
}

float quad_gather_sum(const float4 quad_vector, const float curr)
{

    float4 all_values = quad_gather(quad_vector, curr);
    return(all_values . x + all_values . y + all_values . z + all_values . w);
}

bool fine_derivatives_working(const float4 quad_vector, float4 curr)
{














    float4 ddx_curr = ddx(curr);
    float4 ddy_curr = ddy(curr);
    float4 adjx = curr - ddx_curr * quad_vector . z;
    float4 adjy = curr - ddy_curr * quad_vector . w;
    bool ddy_different = any(bool4(ddy_curr . x != ddy(adjx). x, ddy_curr . y != ddy(adjx). y, ddy_curr . z != ddy(adjx). z, ddy_curr . w != ddy(adjx). w));
    bool ddx_different = any(bool4(ddx_curr . x != ddx(adjy). x, ddx_curr . y != ddx(adjy). y, ddx_curr . z != ddx(adjy). z, ddx_curr . w != ddx(adjy). w));
    return any(bool2(ddy_different, ddx_different));
}

bool fine_derivatives_working_fast(const float4 quad_vector, float curr)
{













    float ddx_curr = ddx(curr);
    float ddy_curr = ddy(curr);
    float adjx = curr - ddx_curr * quad_vector . z;
    return(ddy_curr != ddy(adjx));
}




















































float4 erf6(float4 x)
{






 float4 one = float4(1.0);
 float4 sign_x = sign(x);
 float4 t = one /(one + 0.47047 * abs(x));
 float4 result = one - t *(0.3480242 + t *(- 0.0958798 + t * 0.7478556))*
  exp(-(x * x));
 return result * sign_x;
}

float3 erf6(const float3 x)
{

 float3 one = float3(1.0);
 float3 sign_x = sign(x);
 float3 t = one /(one + 0.47047 * abs(x));
 float3 result = one - t *(0.3480242 + t *(- 0.0958798 + t * 0.7478556))*
  exp(-(x * x));
 return result * sign_x;
}

float2 erf6(const float2 x)
{

 float2 one = float2(1.0);
 float2 sign_x = sign(x);
 float2 t = one /(one + 0.47047 * abs(x));
 float2 result = one - t *(0.3480242 + t *(- 0.0958798 + t * 0.7478556))*
  exp(-(x * x));
 return result * sign_x;
}

float erf6(const float x)
{

 float sign_x = sign(x);
 float t = 1.0 /(1.0 + 0.47047 * abs(x));
 float result = 1.0 - t *(0.3480242 + t *(- 0.0958798 + t * 0.7478556))*
  exp(-(x * x));
 return result * sign_x;
}

float4 erft(const float4 x)
{







 return tanh(1.202760580 * x);
}

float3 erft(const float3 x)
{

 return tanh(1.202760580 * x);
}

float2 erft(const float2 x)
{

 return tanh(1.202760580 * x);
}

float erft(const float x)
{

 return tanh(1.202760580 * x);
}

 float4 erf(const float4 x)
{





  return erf6(x);

}

 float3 erf(const float3 x)
{




  return erf6(x);

}

 float2 erf(const float2 x)
{




  return erf6(x);

}

 float erf(const float x)
{




  return erf6(x);

}




float4 gamma_impl(const float4 s, const float4 s_inv)
{














 float4 g = float4(1.12906830989);
 float4 c0 = float4(0.8109119309638332633713423362694399653724431);
 float4 c1 = float4(0.4808354605142681877121661197951496120000040);
 float4 e = float4(2.71828182845904523536028747135266249775724709);
 float4 sph = s + float4(0.5);
 float4 lanczos_sum = c0 + c1 /(s + float4(1.0));
 float4 base =(sph + g)/ e;


 return(pow(base, sph)* lanczos_sum)* s_inv;
}

float3 gamma_impl(const float3 s, const float3 s_inv)
{

 float3 g = float3(1.12906830989);
 float3 c0 = float3(0.8109119309638332633713423362694399653724431);
 float3 c1 = float3(0.4808354605142681877121661197951496120000040);
 float3 e = float3(2.71828182845904523536028747135266249775724709);
 float3 sph = s + float3(0.5);
 float3 lanczos_sum = c0 + c1 /(s + float3(1.0));
 float3 base =(sph + g)/ e;
 return(pow(base, sph)* lanczos_sum)* s_inv;
}

float2 gamma_impl(const float2 s, const float2 s_inv)
{

 float2 g = float2(1.12906830989);
 float2 c0 = float2(0.8109119309638332633713423362694399653724431);
 float2 c1 = float2(0.4808354605142681877121661197951496120000040);
 float2 e = float2(2.71828182845904523536028747135266249775724709);
 float2 sph = s + float2(0.5);
 float2 lanczos_sum = c0 + c1 /(s + float2(1.0));
 float2 base =(sph + g)/ e;
 return(pow(base, sph)* lanczos_sum)* s_inv;
}

float gamma_impl(const float s, const float s_inv)
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

float4 gamma(const float4 s)
{




 return gamma_impl(s, float4(1.0)/ s);
}

float3 gamma(const float3 s)
{

 return gamma_impl(s, float3(1.0)/ s);
}

float2 gamma(const float2 s)
{

 return gamma_impl(s, float2(1.0)/ s);
}

float gamma(const float s)
{

 return gamma_impl(s, 1.0 / s);
}





float4 ligamma_small_z_impl(const float4 s, const float4 z, const float4 s_inv)
{














 float4 scale = pow(z, s);
 float4 sum = s_inv;

 float4 z_sq = z * z;
 float4 denom1 = s + float4(1.0);
 float4 denom2 = 2.0 * s + float4(4.0);
 float4 denom3 = 6.0 * s + float4(18.0);

 sum -= z / denom1;
 sum += z_sq / denom2;
 sum -= z * z_sq / denom3;


 return scale * sum;
}

float3 ligamma_small_z_impl(const float3 s, const float3 z, const float3 s_inv)
{

 float3 scale = pow(z, s);
 float3 sum = s_inv;
 float3 z_sq = z * z;
 float3 denom1 = s + float3(1.0);
 float3 denom2 = 2.0 * s + float3(4.0);
 float3 denom3 = 6.0 * s + float3(18.0);
 sum -= z / denom1;
 sum += z_sq / denom2;
 sum -= z * z_sq / denom3;
 return scale * sum;
}

float2 ligamma_small_z_impl(const float2 s, const float2 z, const float2 s_inv)
{

 float2 scale = pow(z, s);
 float2 sum = s_inv;
 float2 z_sq = z * z;
 float2 denom1 = s + float2(1.0);
 float2 denom2 = 2.0 * s + float2(4.0);
 float2 denom3 = 6.0 * s + float2(18.0);
 sum -= z / denom1;
 sum += z_sq / denom2;
 sum -= z * z_sq / denom3;
 return scale * sum;
}

float ligamma_small_z_impl(const float s, const float z, const float s_inv)
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


float4 uigamma_large_z_impl(const float4 s, const float4 z)
{













 float4 numerator = pow(z, s)* exp(- z);
 float4 denom = float4(7.0)+ z - s;
 denom = float4(5.0)+ z - s +(3.0 * s - float4(9.0))/ denom;
 denom = float4(3.0)+ z - s +(2.0 * s - float4(4.0))/ denom;
 denom = float4(1.0)+ z - s +(s - float4(1.0))/ denom;
 return numerator / denom;
}

float3 uigamma_large_z_impl(const float3 s, const float3 z)
{

 float3 numerator = pow(z, s)* exp(- z);
 float3 denom = float3(7.0)+ z - s;
 denom = float3(5.0)+ z - s +(3.0 * s - float3(9.0))/ denom;
 denom = float3(3.0)+ z - s +(2.0 * s - float3(4.0))/ denom;
 denom = float3(1.0)+ z - s +(s - float3(1.0))/ denom;
 return numerator / denom;
}

float2 uigamma_large_z_impl(const float2 s, const float2 z)
{

 float2 numerator = pow(z, s)* exp(- z);
 float2 denom = float2(7.0)+ z - s;
 denom = float2(5.0)+ z - s +(3.0 * s - float2(9.0))/ denom;
 denom = float2(3.0)+ z - s +(2.0 * s - float2(4.0))/ denom;
 denom = float2(1.0)+ z - s +(s - float2(1.0))/ denom;
 return numerator / denom;
}

float uigamma_large_z_impl(const float s, const float z)
{

 float numerator = pow(z, s)* exp(- z);
 float denom = 7.0 + z - s;
 denom = 5.0 + z - s +(3.0 * s - 9.0)/ denom;
 denom = 3.0 + z - s +(2.0 * s - 4.0)/ denom;
 denom = 1.0 + z - s +(s - 1.0)/ denom;
 return numerator / denom;
}


float4 normalized_ligamma_impl(const float4 s, const float4 z,
    float4 s_inv, const float4 gamma_s_inv)
{











 float4 thresh = float4(0.775075);
 bool4 z_is_large;
 z_is_large . x = z . x > thresh . x;
 z_is_large . y = z . y > thresh . y;
 z_is_large . z = z . z > thresh . z;
 z_is_large . w = z . w > thresh . w;
 float4 large_z = float4(1.0)- uigamma_large_z_impl(s, z)* gamma_s_inv;
 float4 small_z = ligamma_small_z_impl(s, z, s_inv)* gamma_s_inv;

 bool4 inverse_z_is_large = not(z_is_large);
 return large_z * float4(z_is_large)+ small_z * float4(inverse_z_is_large);
}

float3 normalized_ligamma_impl(const float3 s, const float3 z,
    float3 s_inv, const float3 gamma_s_inv)
{

 float3 thresh = float3(0.775075);
 bool3 z_is_large;
 z_is_large . x = z . x > thresh . x;
 z_is_large . y = z . y > thresh . y;
 z_is_large . z = z . z > thresh . z;
 float3 large_z = float3(1.0)- uigamma_large_z_impl(s, z)* gamma_s_inv;
 float3 small_z = ligamma_small_z_impl(s, z, s_inv)* gamma_s_inv;
 bool3 inverse_z_is_large = not(z_is_large);
 return large_z * float3(z_is_large)+ small_z * float3(inverse_z_is_large);
}

float2 normalized_ligamma_impl(const float2 s, const float2 z,
    float2 s_inv, const float2 gamma_s_inv)
{

 float2 thresh = float2(0.775075);
 bool2 z_is_large;
 z_is_large . x = z . x > thresh . x;
 z_is_large . y = z . y > thresh . y;
 float2 large_z = float2(1.0)- uigamma_large_z_impl(s, z)* gamma_s_inv;
 float2 small_z = ligamma_small_z_impl(s, z, s_inv)* gamma_s_inv;
 bool2 inverse_z_is_large = not(z_is_large);
 return large_z * float2(z_is_large)+ small_z * float2(inverse_z_is_large);
}

float normalized_ligamma_impl(const float s, const float z,
    float s_inv, const float gamma_s_inv)
{

 float thresh = 0.775075;
 bool z_is_large = z > thresh;
 float large_z = 1.0 - uigamma_large_z_impl(s, z)* gamma_s_inv;
 float small_z = ligamma_small_z_impl(s, z, s_inv)* gamma_s_inv;
 return large_z * float(z_is_large)+ small_z * float(! z_is_large);
}


float4 normalized_ligamma(const float4 s, const float4 z)
{



 float4 s_inv = float4(1.0)/ s;
 float4 gamma_s_inv = float4(1.0)/ gamma_impl(s, s_inv);
 return normalized_ligamma_impl(s, z, s_inv, gamma_s_inv);
}

float3 normalized_ligamma(const float3 s, const float3 z)
{

 float3 s_inv = float3(1.0)/ s;
 float3 gamma_s_inv = float3(1.0)/ gamma_impl(s, s_inv);
 return normalized_ligamma_impl(s, z, s_inv, gamma_s_inv);
}

float2 normalized_ligamma(const float2 s, const float2 z)
{

 float2 s_inv = float2(1.0)/ s;
 float2 gamma_s_inv = float2(1.0)/ gamma_impl(s, s_inv);
 return normalized_ligamma_impl(s, z, s_inv, gamma_s_inv);
}

float normalized_ligamma(const float s, const float z)
{

 float s_inv = 1.0 / s;
 float gamma_s_inv = 1.0 / gamma_impl(s, s_inv);
 return normalized_ligamma_impl(s, z, s_inv, gamma_s_inv);
}









 float4 uv2_to_uv4(float2 tex_uv)
{

    return float4(tex_uv, 0.0, 0.0);
}




 float get_fast_gaussian_weight_sum_inv(const float sigma)
{















    return min(exp(exp(0.348348412457428 /
        (sigma - 0.0860587260734721))), 0.399334576340352 / sigma);
}




float3 tex2Dblur11resize(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
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


    float3 sum = float3(0.0, 0.0, 0.0);
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

float3 tex2Dblur9resize(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
{




    float denom_inv = 0.5 /(sigma * sigma);
    float w0 = 1.0;
    float w1 = exp(- 1.0 * denom_inv);
    float w2 = exp(- 4.0 * denom_inv);
    float w3 = exp(- 9.0 * denom_inv);
    float w4 = exp(- 16.0 * denom_inv);
    float weight_sum_inv = 1.0 /(w0 + 2.0 *(w1 + w2 + w3 + w4));

    float3 sum = float3(0.0, 0.0, 0.0);
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

float3 tex2Dblur7resize(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
{




    float denom_inv = 0.5 /(sigma * sigma);
    float w0 = 1.0;
    float w1 = exp(- 1.0 * denom_inv);
    float w2 = exp(- 4.0 * denom_inv);
    float w3 = exp(- 9.0 * denom_inv);
    float weight_sum_inv = 1.0 /(w0 + 2.0 *(w1 + w2 + w3));

    float3 sum = float3(0.0, 0.0, 0.0);
    sum += w3 * tex2D_linearize(tex, tex_uv - 3.0 * dxdy). rgb;
    sum += w2 * tex2D_linearize(tex, tex_uv - 2.0 * dxdy). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv - 1.0 * dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv + 1.0 * dxdy). rgb;
    sum += w2 * tex2D_linearize(tex, tex_uv + 2.0 * dxdy). rgb;
    sum += w3 * tex2D_linearize(tex, tex_uv + 3.0 * dxdy). rgb;
    return sum * weight_sum_inv;
}

float3 tex2Dblur5resize(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
{




    float denom_inv = 0.5 /(sigma * sigma);
    float w0 = 1.0;
    float w1 = exp(- 1.0 * denom_inv);
    float w2 = exp(- 4.0 * denom_inv);
    float weight_sum_inv = 1.0 /(w0 + 2.0 *(w1 + w2));

    float3 sum = float3(0.0, 0.0, 0.0);
    sum += w2 * tex2D_linearize(tex, tex_uv - 2.0 * dxdy). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv - 1.0 * dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv + 1.0 * dxdy). rgb;
    sum += w2 * tex2D_linearize(tex, tex_uv + 2.0 * dxdy). rgb;
    return sum * weight_sum_inv;
}

float3 tex2Dblur3resize(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
{




    float denom_inv = 0.5 /(sigma * sigma);
    float w0 = 1.0;
    float w1 = exp(- 1.0 * denom_inv);
    float weight_sum_inv = 1.0 /(w0 + 2.0 * w1);

    float3 sum = float3(0.0, 0.0, 0.0);
    sum += w1 * tex2D_linearize(tex, tex_uv - 1.0 * dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w1 * tex2D_linearize(tex, tex_uv + 1.0 * dxdy). rgb;
    return sum * weight_sum_inv;
}




float3 tex2Dblur11fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
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

    float3 sum = float3(0.0, 0.0, 0.0);
    sum += w45 * tex2D_linearize(tex, tex_uv -(4.0 + w45_ratio)* dxdy). rgb;
    sum += w23 * tex2D_linearize(tex, tex_uv -(2.0 + w23_ratio)* dxdy). rgb;
    sum += w01 * tex2D_linearize(tex, tex_uv - w01_ratio * dxdy). rgb;
    sum += w01 * tex2D_linearize(tex, tex_uv + w01_ratio * dxdy). rgb;
    sum += w23 * tex2D_linearize(tex, tex_uv +(2.0 + w23_ratio)* dxdy). rgb;
    sum += w45 * tex2D_linearize(tex, tex_uv +(4.0 + w45_ratio)* dxdy). rgb;
    return sum * weight_sum_inv;
}

float3 tex2Dblur9fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
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

    float3 sum = float3(0.0, 0.0, 0.0);
    sum += w34 * tex2D_linearize(tex, tex_uv -(3.0 + w34_ratio)* dxdy). rgb;
    sum += w12 * tex2D_linearize(tex, tex_uv -(1.0 + w12_ratio)* dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w12 * tex2D_linearize(tex, tex_uv +(1.0 + w12_ratio)* dxdy). rgb;
    sum += w34 * tex2D_linearize(tex, tex_uv +(3.0 + w34_ratio)* dxdy). rgb;
    return sum * weight_sum_inv;
}

float3 tex2Dblur7fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
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

    float3 sum = float3(0.0, 0.0, 0.0);
    sum += w23 * tex2D_linearize(tex, tex_uv -(2.0 + w23_ratio)* dxdy). rgb;
    sum += w01 * tex2D_linearize(tex, tex_uv - w01_ratio * dxdy). rgb;
    sum += w01 * tex2D_linearize(tex, tex_uv + w01_ratio * dxdy). rgb;
    sum += w23 * tex2D_linearize(tex, tex_uv +(2.0 + w23_ratio)* dxdy). rgb;
    return sum * weight_sum_inv;
}

float3 tex2Dblur5fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
{





    float denom_inv = 0.5 /(sigma * sigma);
    float w0 = 1.0;
    float w1 = exp(- 1.0 * denom_inv);
    float w2 = exp(- 4.0 * denom_inv);
    float weight_sum_inv = 1.0 /(w0 + 2.0 *(w1 + w2));

    float w12 = w1 + w2;
    float w12_ratio = w2 / w12;

    float3 sum = float3(0.0, 0.0, 0.0);
    sum += w12 * tex2D_linearize(tex, tex_uv -(1.0 + w12_ratio)* dxdy). rgb;
    sum += w0 * tex2D_linearize(tex, tex_uv). rgb;
    sum += w12 * tex2D_linearize(tex, tex_uv +(1.0 + w12_ratio)* dxdy). rgb;
    return sum * weight_sum_inv;
}

float3 tex2Dblur3fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
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





float3 tex2Dblur43fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
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

    float3 sum = float3(0.0, 0.0, 0.0);
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

float3 tex2Dblur31fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
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

    float3 sum = float3(0.0, 0.0, 0.0);
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

float3 tex2Dblur25fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
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

    float3 sum = float3(0.0, 0.0, 0.0);
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

float3 tex2Dblur17fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
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

    float3 sum = float3(0.0, 0.0, 0.0);
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




float3 tex2Dblur3x3resize(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
{






    float denom_inv = 0.5 /(sigma * sigma);



    float2 sample4_uv = tex_uv;
    float2 dx = float2(dxdy . x, 0.0);
    float2 dy = float2(0.0, dxdy . y);
    float2 sample1_uv = sample4_uv - dy;
    float2 sample7_uv = sample4_uv + dy;
    float3 sample0 = tex2D_linearize(tex, sample1_uv - dx). rgb;
    float3 sample1 = tex2D_linearize(tex, sample1_uv). rgb;
    float3 sample2 = tex2D_linearize(tex, sample1_uv + dx). rgb;
    float3 sample3 = tex2D_linearize(tex, sample4_uv - dx). rgb;
    float3 sample4 = tex2D_linearize(tex, sample4_uv). rgb;
    float3 sample5 = tex2D_linearize(tex, sample4_uv + dx). rgb;
    float3 sample6 = tex2D_linearize(tex, sample7_uv - dx). rgb;
    float3 sample7 = tex2D_linearize(tex, sample7_uv). rgb;
    float3 sample8 = tex2D_linearize(tex, sample7_uv + dx). rgb;

    float w4 = 1.0;
    float w1_3_5_7 = exp(-(dot(float2(1.0, 0.0), float2(1.0, 0.0)))* denom_inv);
    float w0_2_6_8 = exp(-(dot(float2(1.0, 1.0), float2(1.0, 1.0)))* denom_inv);
    float weight_sum_inv = 1.0 /(w4 + 4.0 *(w1_3_5_7 + w0_2_6_8));

    float3 sum = w4 * sample4 +
        w1_3_5_7 *(sample1 + sample3 + sample5 + sample7)+
        w0_2_6_8 *(sample0 + sample2 + sample6 + sample8);
    return sum * weight_sum_inv;
}




float3 tex2Dblur9x9(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
{









































    float denom_inv = 0.5 /(sigma * sigma);
    float w1off = exp(- 1.0 * denom_inv);
    float w2off = exp(- 4.0 * denom_inv);
    float w3off = exp(- 9.0 * denom_inv);
    float w4off = exp(- 16.0 * denom_inv);
    float texel1to2ratio = w2off /(w1off + w2off);
    float texel3to4ratio = w4off /(w3off + w4off);


    float2 sample1R_texel_offset = float2(1.0, 0.0)+ float2(texel1to2ratio, 0.0);
    float2 sample2R_texel_offset = float2(3.0, 0.0)+ float2(texel3to4ratio, 0.0);
    float2 sample3d_texel_offset = float2(1.0, 1.0)+ float2(texel1to2ratio, texel1to2ratio);
    float2 sample4d_texel_offset = float2(3.0, 1.0)+ float2(texel3to4ratio, texel1to2ratio);
    float2 sample5d_texel_offset = float2(1.0, 3.0)+ float2(texel1to2ratio, texel3to4ratio);
    float2 sample6d_texel_offset = float2(3.0, 3.0)+ float2(texel3to4ratio, texel3to4ratio);




    float w1R1 = w1off;
    float w1R2 = w2off;
    float w2R1 = w3off;
    float w2R2 = w4off;
    float w3d1 = exp(-(dot(float2(1.0, 1.0), float2(1.0, 1.0)))* denom_inv);
    float w3d2_3d3 = exp(-(dot(float2(2.0, 1.0), float2(2.0, 1.0)))* denom_inv);
    float w3d4 = exp(-(dot(float2(2.0, 2.0), float2(2.0, 2.0)))* denom_inv);
    float w4d1_5d1 = exp(-(dot(float2(3.0, 1.0), float2(3.0, 1.0)))* denom_inv);
    float w4d2_5d3 = exp(-(dot(float2(4.0, 1.0), float2(4.0, 1.0)))* denom_inv);
    float w4d3_5d2 = exp(-(dot(float2(3.0, 2.0), float2(3.0, 2.0)))* denom_inv);
    float w4d4_5d4 = exp(-(dot(float2(4.0, 2.0), float2(4.0, 2.0)))* denom_inv);
    float w6d1 = exp(-(dot(float2(3.0, 3.0), float2(3.0, 3.0)))* denom_inv);
    float w6d2_6d3 = exp(-(dot(float2(4.0, 3.0), float2(4.0, 3.0)))* denom_inv);
    float w6d4 = exp(-(dot(float2(4.0, 4.0), float2(4.0, 4.0)))* denom_inv);

    float w0 = 1.0;
    float w1 = w1R1 + w1R2;
    float w2 = w2R1 + w2R2;
    float w3 = w3d1 + 2.0 * w3d2_3d3 + w3d4;
    float w4 = w4d1_5d1 + w4d2_5d3 + w4d3_5d2 + w4d4_5d4;
    float w5 = w4;
    float w6 = w6d1 + 2.0 * w6d2_6d3 + w6d4;

    float weight_sum_inv =
        1.0 /(w0 + 4.0 *(w1 + w2 + w3 + w4 + w5 + w6));



    float2 mirror_x = float2(- 1.0, 1.0);
    float2 mirror_y = float2(1.0, - 1.0);
    float2 mirror_xy = float2(- 1.0, - 1.0);
    float2 dxdy_mirror_x = dxdy * mirror_x;
    float2 dxdy_mirror_y = dxdy * mirror_y;
    float2 dxdy_mirror_xy = dxdy * mirror_xy;

    float3 sample0C = tex2D_linearize(tex, tex_uv). rgb;
    float3 sample1R = tex2D_linearize(tex, tex_uv + dxdy * sample1R_texel_offset). rgb;
    float3 sample1D = tex2D_linearize(tex, tex_uv + dxdy * sample1R_texel_offset . yx). rgb;
    float3 sample1L = tex2D_linearize(tex, tex_uv - dxdy * sample1R_texel_offset). rgb;
    float3 sample1U = tex2D_linearize(tex, tex_uv - dxdy * sample1R_texel_offset . yx). rgb;
    float3 sample2R = tex2D_linearize(tex, tex_uv + dxdy * sample2R_texel_offset). rgb;
    float3 sample2D = tex2D_linearize(tex, tex_uv + dxdy * sample2R_texel_offset . yx). rgb;
    float3 sample2L = tex2D_linearize(tex, tex_uv - dxdy * sample2R_texel_offset). rgb;
    float3 sample2U = tex2D_linearize(tex, tex_uv - dxdy * sample2R_texel_offset . yx). rgb;
    float3 sample3d = tex2D_linearize(tex, tex_uv + dxdy * sample3d_texel_offset). rgb;
    float3 sample3c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample3d_texel_offset). rgb;
    float3 sample3b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample3d_texel_offset). rgb;
    float3 sample3a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample3d_texel_offset). rgb;
    float3 sample4d = tex2D_linearize(tex, tex_uv + dxdy * sample4d_texel_offset). rgb;
    float3 sample4c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample4d_texel_offset). rgb;
    float3 sample4b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample4d_texel_offset). rgb;
    float3 sample4a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample4d_texel_offset). rgb;
    float3 sample5d = tex2D_linearize(tex, tex_uv + dxdy * sample5d_texel_offset). rgb;
    float3 sample5c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample5d_texel_offset). rgb;
    float3 sample5b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample5d_texel_offset). rgb;
    float3 sample5a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample5d_texel_offset). rgb;
    float3 sample6d = tex2D_linearize(tex, tex_uv + dxdy * sample6d_texel_offset). rgb;
    float3 sample6c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample6d_texel_offset). rgb;
    float3 sample6b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample6d_texel_offset). rgb;
    float3 sample6a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample6d_texel_offset). rgb;



    float3 sum = w0 * sample0C;
    sum += w1 *(sample1R + sample1D + sample1L + sample1U);
    sum += w2 *(sample2R + sample2D + sample2L + sample2U);
    sum += w3 *(sample3d + sample3c + sample3b + sample3a);
    sum += w4 *(sample4d + sample4c + sample4b + sample4a);
    sum += w5 *(sample5d + sample5c + sample5b + sample5a);
    sum += w6 *(sample6d + sample6c + sample6b + sample6a);
    return sum * weight_sum_inv;
}

float3 tex2Dblur7x7(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
{

























    float denom_inv = 0.5 /(sigma * sigma);
    float w0off = 1.0;
    float w1off = exp(- 1.0 * denom_inv);
    float w2off = exp(- 4.0 * denom_inv);
    float w3off = exp(- 9.0 * denom_inv);
    float texel0to1ratio = w1off /(w0off * 0.5 + w1off);
    float texel2to3ratio = w3off /(w2off + w3off);


    float2 sample1d_texel_offset = float2(texel0to1ratio, texel0to1ratio);
    float2 sample2d_texel_offset = float2(2.0, 0.0)+ float2(texel2to3ratio, texel0to1ratio);
    float2 sample3d_texel_offset = float2(0.0, 2.0)+ float2(texel0to1ratio, texel2to3ratio);
    float2 sample4d_texel_offset = float2(2.0, 2.0)+ float2(texel2to3ratio, texel2to3ratio);




    float w1abcd = 1.0;
    float w1bd2_1cd3 = exp(-(dot(float2(1.0, 0.0), float2(1.0, 0.0)))* denom_inv);
    float w2bd1_3cd1 = exp(-(dot(float2(2.0, 0.0), float2(2.0, 0.0)))* denom_inv);
    float w2bd2_3cd2 = exp(-(dot(float2(3.0, 0.0), float2(3.0, 0.0)))* denom_inv);
    float w1d4 = exp(-(dot(float2(1.0, 1.0), float2(1.0, 1.0)))* denom_inv);
    float w2d3_3d2 = exp(-(dot(float2(2.0, 1.0), float2(2.0, 1.0)))* denom_inv);
    float w2d4_3d4 = exp(-(dot(float2(3.0, 1.0), float2(3.0, 1.0)))* denom_inv);
    float w4d1 = exp(-(dot(float2(2.0, 2.0), float2(2.0, 2.0)))* denom_inv);
    float w4d2_4d3 = exp(-(dot(float2(3.0, 2.0), float2(3.0, 2.0)))* denom_inv);
    float w4d4 = exp(-(dot(float2(3.0, 3.0), float2(3.0, 3.0)))* denom_inv);


    float w1 = w1abcd * 0.25 + w1bd2_1cd3 + w1d4;
    float w2_3 =(w2bd1_3cd1 + w2bd2_3cd2)* 0.5 + w2d3_3d2 + w2d4_3d4;
    float w4 = w4d1 + 2.0 * w4d2_4d3 + w4d4;

    float weight_sum_inv =
        1.0 /(4.0 *(w1 + 2.0 * w2_3 + w4));



    float2 mirror_x = float2(- 1.0, 1.0);
    float2 mirror_y = float2(1.0, - 1.0);
    float2 mirror_xy = float2(- 1.0, - 1.0);
    float2 dxdy_mirror_x = dxdy * mirror_x;
    float2 dxdy_mirror_y = dxdy * mirror_y;
    float2 dxdy_mirror_xy = dxdy * mirror_xy;
    float3 sample1a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample1d_texel_offset). rgb;
    float3 sample2a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample2d_texel_offset). rgb;
    float3 sample3a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample3d_texel_offset). rgb;
    float3 sample4a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample4d_texel_offset). rgb;
    float3 sample1b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample1d_texel_offset). rgb;
    float3 sample2b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample2d_texel_offset). rgb;
    float3 sample3b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample3d_texel_offset). rgb;
    float3 sample4b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample4d_texel_offset). rgb;
    float3 sample1c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample1d_texel_offset). rgb;
    float3 sample2c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample2d_texel_offset). rgb;
    float3 sample3c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample3d_texel_offset). rgb;
    float3 sample4c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample4d_texel_offset). rgb;
    float3 sample1d = tex2D_linearize(tex, tex_uv + dxdy * sample1d_texel_offset). rgb;
    float3 sample2d = tex2D_linearize(tex, tex_uv + dxdy * sample2d_texel_offset). rgb;
    float3 sample3d = tex2D_linearize(tex, tex_uv + dxdy * sample3d_texel_offset). rgb;
    float3 sample4d = tex2D_linearize(tex, tex_uv + dxdy * sample4d_texel_offset). rgb;



    float3 sum = float3(0.0, 0.0, 0.0);
    sum += w1 *(sample1a + sample1b + sample1c + sample1d);
    sum += w2_3 *(sample2a + sample2b + sample2c + sample2d);
    sum += w2_3 *(sample3a + sample3b + sample3c + sample3d);
    sum += w4 *(sample4a + sample4b + sample4c + sample4d);
    return sum * weight_sum_inv;
}

float3 tex2Dblur5x5(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
{



















    float denom_inv = 0.5 /(sigma * sigma);
    float w1off = exp(- 1.0 * denom_inv);
    float w2off = exp(- 4.0 * denom_inv);
    float texel1to2ratio = w2off /(w1off + w2off);


    float2 sample1R_texel_offset = float2(1.0, 0.0)+ float2(texel1to2ratio, 0.0);
    float2 sample2d_texel_offset = float2(1.0, 1.0)+ float2(texel1to2ratio, texel1to2ratio);




    float w1R1 = w1off;
    float w1R2 = w2off;
    float w2d1 = exp(-(dot(float2(1.0, 1.0), float2(1.0, 1.0)))* denom_inv);
    float w2d2_3 = exp(-(dot(float2(2.0, 1.0), float2(2.0, 1.0)))* denom_inv);
    float w2d4 = exp(-(dot(float2(2.0, 2.0), float2(2.0, 2.0)))* denom_inv);

    float w0 = 1.0;
    float w1 = w1R1 + w1R2;
    float w2 = w2d1 + 2.0 * w2d2_3 + w2d4;

    float weight_sum_inv = 1.0 /(w0 + 4.0 *(w1 + w2));



    float2 mirror_x = float2(- 1.0, 1.0);
    float2 mirror_y = float2(1.0, - 1.0);
    float2 mirror_xy = float2(- 1.0, - 1.0);
    float2 dxdy_mirror_x = dxdy * mirror_x;
    float2 dxdy_mirror_y = dxdy * mirror_y;
    float2 dxdy_mirror_xy = dxdy * mirror_xy;
    float3 sample0C = tex2D_linearize(tex, tex_uv). rgb;
    float3 sample1R = tex2D_linearize(tex, tex_uv + dxdy * sample1R_texel_offset). rgb;
    float3 sample1D = tex2D_linearize(tex, tex_uv + dxdy * sample1R_texel_offset . yx). rgb;
    float3 sample1L = tex2D_linearize(tex, tex_uv - dxdy * sample1R_texel_offset). rgb;
    float3 sample1U = tex2D_linearize(tex, tex_uv - dxdy * sample1R_texel_offset . yx). rgb;
    float3 sample2d = tex2D_linearize(tex, tex_uv + dxdy * sample2d_texel_offset). rgb;
    float3 sample2c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample2d_texel_offset). rgb;
    float3 sample2b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample2d_texel_offset). rgb;
    float3 sample2a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample2d_texel_offset). rgb;



    float3 sum = w0 * sample0C;
    sum += w1 *(sample1R + sample1D + sample1L + sample1U);
    sum += w2 *(sample2a + sample2b + sample2c + sample2d);
    return sum * weight_sum_inv;
}

float3 tex2Dblur3x3(const sampler2D tex, const float2 tex_uv,
    float2 dxdy, const float sigma)
{


















    float denom_inv = 0.5 /(sigma * sigma);
    float w0off = 1.0;
    float w1off = exp(- 1.0 * denom_inv);
    float texel0to1ratio = w1off /(w0off * 0.5 + w1off);


    float2 sample0d_texel_offset = float2(texel0to1ratio, texel0to1ratio);



    float2 mirror_x = float2(- 1.0, 1.0);
    float2 mirror_y = float2(1.0, - 1.0);
    float2 mirror_xy = float2(- 1.0, - 1.0);
    float2 dxdy_mirror_x = dxdy * mirror_x;
    float2 dxdy_mirror_y = dxdy * mirror_y;
    float2 dxdy_mirror_xy = dxdy * mirror_xy;
    float3 sample0a = tex2D_linearize(tex, tex_uv + dxdy_mirror_xy * sample0d_texel_offset). rgb;
    float3 sample0b = tex2D_linearize(tex, tex_uv + dxdy_mirror_y * sample0d_texel_offset). rgb;
    float3 sample0c = tex2D_linearize(tex, tex_uv + dxdy_mirror_x * sample0d_texel_offset). rgb;
    float3 sample0d = tex2D_linearize(tex, tex_uv + dxdy * sample0d_texel_offset). rgb;



    return 0.25 *(sample0a + sample0b + sample0c + sample0d);
}




float3 tex2Dblur12x12shared(const sampler2D tex,
    float4 tex_uv, const float2 dxdy, const float4 quad_vector,
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
    float texel0to1ratio = lerp(w1_5off /(w0_5off + w1_5off), 0.5, error_blurring);
    float texel2to3ratio = lerp(w3_5off /(w2_5off + w3_5off), 0.5, error_blurring);
    float texel4to5ratio = lerp(w5_5off /(w4_5off + w5_5off), 0.5, error_blurring);

    float texel0to1ratio_nearest = w1off /(w0off + w1off);
    float texel1to2ratio_nearest = w2off /(w1off + w2off);


    float2 sample0curr_texel_offset = float2(0.0, 0.0)+ float2(texel0to1ratio_nearest, texel0to1ratio_nearest);
    float2 sample0adjx_texel_offset = float2(- 1.0, 0.0)+ float2(- texel1to2ratio_nearest, texel0to1ratio_nearest);
    float2 sample0adjy_texel_offset = float2(0.0, - 1.0)+ float2(texel0to1ratio_nearest, - texel1to2ratio_nearest);
    float2 sample0diag_texel_offset = float2(- 1.0, - 1.0)+ float2(- texel1to2ratio_nearest, - texel1to2ratio_nearest);
    float2 sample1_texel_offset = float2(2.0, 0.0)+ float2(texel2to3ratio, texel0to1ratio);
    float2 sample2_texel_offset = float2(4.0, 0.0)+ float2(texel4to5ratio, texel0to1ratio);
    float2 sample3_texel_offset = float2(0.0, 2.0)+ float2(texel0to1ratio, texel2to3ratio);
    float2 sample4_texel_offset = float2(2.0, 2.0)+ float2(texel2to3ratio, texel2to3ratio);
    float2 sample5_texel_offset = float2(4.0, 2.0)+ float2(texel4to5ratio, texel2to3ratio);
    float2 sample6_texel_offset = float2(0.0, 4.0)+ float2(texel0to1ratio, texel4to5ratio);
    float2 sample7_texel_offset = float2(2.0, 4.0)+ float2(texel2to3ratio, texel4to5ratio);
    float2 sample8_texel_offset = float2(4.0, 4.0)+ float2(texel4to5ratio, texel4to5ratio);














    float w8diag =(exp(-(dot(float2(- 6.0, - 6.0), float2(- 6.0, - 6.0)))* denom_inv)+ exp(-(dot(float2(- 6.0 + 1.0, - 6.0), float2(- 6.0 + 1.0, - 6.0)))* denom_inv)+ exp(-(dot(float2(- 6.0, - 6.0 + 1.0), float2(- 6.0, - 6.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 6.0 + 1.0, - 6.0 + 1.0), float2(- 6.0 + 1.0, - 6.0 + 1.0)))* denom_inv));
    float w7diag =(exp(-(dot(float2(- 4.0, - 6.0), float2(- 4.0, - 6.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 6.0), float2(- 4.0 + 1.0, - 6.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, - 6.0 + 1.0), float2(- 4.0, - 6.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 6.0 + 1.0), float2(- 4.0 + 1.0, - 6.0 + 1.0)))* denom_inv));
    float w6diag =(exp(-(dot(float2(- 2.0, - 6.0), float2(- 2.0, - 6.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 6.0), float2(- 2.0 + 1.0, - 6.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, - 6.0 + 1.0), float2(- 2.0, - 6.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 6.0 + 1.0), float2(- 2.0 + 1.0, - 6.0 + 1.0)))* denom_inv));
    float w6adjy =(exp(-(dot(float2(0.0, - 6.0), float2(0.0, - 6.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 6.0), float2(0.0 + 1.0, - 6.0)))* denom_inv)+ exp(-(dot(float2(0.0, - 6.0 + 1.0), float2(0.0, - 6.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 6.0 + 1.0), float2(0.0 + 1.0, - 6.0 + 1.0)))* denom_inv));
    float w7adjy =(exp(-(dot(float2(2.0, - 6.0), float2(2.0, - 6.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 6.0), float2(2.0 + 1.0, - 6.0)))* denom_inv)+ exp(-(dot(float2(2.0, - 6.0 + 1.0), float2(2.0, - 6.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 6.0 + 1.0), float2(2.0 + 1.0, - 6.0 + 1.0)))* denom_inv));
    float w8adjy =(exp(-(dot(float2(4.0, - 6.0), float2(4.0, - 6.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, - 6.0), float2(4.0 + 1.0, - 6.0)))* denom_inv)+ exp(-(dot(float2(4.0, - 6.0 + 1.0), float2(4.0, - 6.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, - 6.0 + 1.0), float2(4.0 + 1.0, - 6.0 + 1.0)))* denom_inv));
    float w5diag =(exp(-(dot(float2(- 6.0, - 4.0), float2(- 6.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 6.0 + 1.0, - 4.0), float2(- 6.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 6.0, - 4.0 + 1.0), float2(- 6.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 6.0 + 1.0, - 4.0 + 1.0), float2(- 6.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w4diag =(exp(-(dot(float2(- 4.0, - 4.0), float2(- 4.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 4.0), float2(- 4.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, - 4.0 + 1.0), float2(- 4.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 4.0 + 1.0), float2(- 4.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w3diag =(exp(-(dot(float2(- 2.0, - 4.0), float2(- 2.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 4.0), float2(- 2.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, - 4.0 + 1.0), float2(- 2.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 4.0 + 1.0), float2(- 2.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w3adjy =(exp(-(dot(float2(0.0, - 4.0), float2(0.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 4.0), float2(0.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(0.0, - 4.0 + 1.0), float2(0.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 4.0 + 1.0), float2(0.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w4adjy =(exp(-(dot(float2(2.0, - 4.0), float2(2.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 4.0), float2(2.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(2.0, - 4.0 + 1.0), float2(2.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 4.0 + 1.0), float2(2.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w5adjy =(exp(-(dot(float2(4.0, - 4.0), float2(4.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, - 4.0), float2(4.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(4.0, - 4.0 + 1.0), float2(4.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, - 4.0 + 1.0), float2(4.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w2diag =(exp(-(dot(float2(- 6.0, - 2.0), float2(- 6.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 6.0 + 1.0, - 2.0), float2(- 6.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 6.0, - 2.0 + 1.0), float2(- 6.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 6.0 + 1.0, - 2.0 + 1.0), float2(- 6.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w1diag =(exp(-(dot(float2(- 4.0, - 2.0), float2(- 4.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 2.0), float2(- 4.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, - 2.0 + 1.0), float2(- 4.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 2.0 + 1.0), float2(- 4.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w0diag =(exp(-(dot(float2(- 2.0, - 2.0), float2(- 2.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 2.0), float2(- 2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, - 2.0 + 1.0), float2(- 2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 2.0 + 1.0), float2(- 2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w0adjy =(exp(-(dot(float2(0.0, - 2.0), float2(0.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 2.0), float2(0.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(0.0, - 2.0 + 1.0), float2(0.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 2.0 + 1.0), float2(0.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w1adjy =(exp(-(dot(float2(2.0, - 2.0), float2(2.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 2.0), float2(2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(2.0, - 2.0 + 1.0), float2(2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 2.0 + 1.0), float2(2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w2adjy =(exp(-(dot(float2(4.0, - 2.0), float2(4.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, - 2.0), float2(4.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(4.0, - 2.0 + 1.0), float2(4.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, - 2.0 + 1.0), float2(4.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w2adjx =(exp(-(dot(float2(- 6.0, 0.0), float2(- 6.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 6.0 + 1.0, 0.0), float2(- 6.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 6.0, 0.0 + 1.0), float2(- 6.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 6.0 + 1.0, 0.0 + 1.0), float2(- 6.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w1adjx =(exp(-(dot(float2(- 4.0, 0.0), float2(- 4.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 0.0), float2(- 4.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, 0.0 + 1.0), float2(- 4.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 0.0 + 1.0), float2(- 4.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w0adjx =(exp(-(dot(float2(- 2.0, 0.0), float2(- 2.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 0.0), float2(- 2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, 0.0 + 1.0), float2(- 2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 0.0 + 1.0), float2(- 2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w0curr =(exp(-(dot(float2(0.0, 0.0), float2(0.0, 0.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 0.0), float2(0.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(0.0, 0.0 + 1.0), float2(0.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 0.0 + 1.0), float2(0.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w1curr =(exp(-(dot(float2(2.0, 0.0), float2(2.0, 0.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 0.0), float2(2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(2.0, 0.0 + 1.0), float2(2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 0.0 + 1.0), float2(2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w2curr =(exp(-(dot(float2(4.0, 0.0), float2(4.0, 0.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, 0.0), float2(4.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(4.0, 0.0 + 1.0), float2(4.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, 0.0 + 1.0), float2(4.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w5adjx =(exp(-(dot(float2(- 6.0, 2.0), float2(- 6.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 6.0 + 1.0, 2.0), float2(- 6.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 6.0, 2.0 + 1.0), float2(- 6.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 6.0 + 1.0, 2.0 + 1.0), float2(- 6.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w4adjx =(exp(-(dot(float2(- 4.0, 2.0), float2(- 4.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 2.0), float2(- 4.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, 2.0 + 1.0), float2(- 4.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 2.0 + 1.0), float2(- 4.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w3adjx =(exp(-(dot(float2(- 2.0, 2.0), float2(- 2.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 2.0), float2(- 2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, 2.0 + 1.0), float2(- 2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 2.0 + 1.0), float2(- 2.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w3curr =(exp(-(dot(float2(0.0, 2.0), float2(0.0, 2.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 2.0), float2(0.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(0.0, 2.0 + 1.0), float2(0.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 2.0 + 1.0), float2(0.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w4curr =(exp(-(dot(float2(2.0, 2.0), float2(2.0, 2.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 2.0), float2(2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(2.0, 2.0 + 1.0), float2(2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 2.0 + 1.0), float2(2.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w5curr =(exp(-(dot(float2(4.0, 2.0), float2(4.0, 2.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, 2.0), float2(4.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(4.0, 2.0 + 1.0), float2(4.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, 2.0 + 1.0), float2(4.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w8adjx =(exp(-(dot(float2(- 6.0, 4.0), float2(- 6.0, 4.0)))* denom_inv)+ exp(-(dot(float2(- 6.0 + 1.0, 4.0), float2(- 6.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(float2(- 6.0, 4.0 + 1.0), float2(- 6.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 6.0 + 1.0, 4.0 + 1.0), float2(- 6.0 + 1.0, 4.0 + 1.0)))* denom_inv));
    float w7adjx =(exp(-(dot(float2(- 4.0, 4.0), float2(- 4.0, 4.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 4.0), float2(- 4.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, 4.0 + 1.0), float2(- 4.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 4.0 + 1.0), float2(- 4.0 + 1.0, 4.0 + 1.0)))* denom_inv));
    float w6adjx =(exp(-(dot(float2(- 2.0, 4.0), float2(- 2.0, 4.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 4.0), float2(- 2.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, 4.0 + 1.0), float2(- 2.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 4.0 + 1.0), float2(- 2.0 + 1.0, 4.0 + 1.0)))* denom_inv));
    float w6curr =(exp(-(dot(float2(0.0, 4.0), float2(0.0, 4.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 4.0), float2(0.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(float2(0.0, 4.0 + 1.0), float2(0.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 4.0 + 1.0), float2(0.0 + 1.0, 4.0 + 1.0)))* denom_inv));
    float w7curr =(exp(-(dot(float2(2.0, 4.0), float2(2.0, 4.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 4.0), float2(2.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(float2(2.0, 4.0 + 1.0), float2(2.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 4.0 + 1.0), float2(2.0 + 1.0, 4.0 + 1.0)))* denom_inv));
    float w8curr =(exp(-(dot(float2(4.0, 4.0), float2(4.0, 4.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, 4.0), float2(4.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(float2(4.0, 4.0 + 1.0), float2(4.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, 4.0 + 1.0), float2(4.0 + 1.0, 4.0 + 1.0)))* denom_inv));


    float4 w0 = float4(w0curr, w0adjx, w0adjy, w0diag);
    float4 w1 = float4(w1curr, w1adjx, w1adjy, w1diag);
    float4 w2 = float4(w2curr, w2adjx, w2adjy, w2diag);
    float4 w3 = float4(w3curr, w3adjx, w3adjy, w3diag);
    float4 w4 = float4(w4curr, w4adjx, w4adjy, w4diag);
    float4 w5 = float4(w5curr, w5adjx, w5adjy, w5diag);
    float4 w6 = float4(w6curr, w6adjx, w6adjy, w6diag);
    float4 w7 = float4(w7curr, w7adjx, w7adjy, w7diag);
    float4 w8 = float4(w8curr, w8adjx, w8adjy, w8diag);

    float4 weight_sum4 = w0 + w1 + w2 + w3 + w4 + w5 + w6 + w7 + w8;
    float2 weight_sum2 = weight_sum4 . xy + weight_sum4 . zw;
    float weight_sum = weight_sum2 . x + weight_sum2 . y;
    float weight_sum_inv = 1.0 /(weight_sum);



    float2 dxdy_curr = dxdy * quad_vector . xy;

    float3 sample0curr = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0curr_texel_offset). rgb;
    float3 sample0adjx = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjx_texel_offset). rgb;
    float3 sample0adjy = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjy_texel_offset). rgb;
    float3 sample0diag = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0diag_texel_offset). rgb;
    float3 sample1curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample1_texel_offset)). rgb;
    float3 sample2curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample2_texel_offset)). rgb;
    float3 sample3curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample3_texel_offset)). rgb;
    float3 sample4curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample4_texel_offset)). rgb;
    float3 sample5curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample5_texel_offset)). rgb;
    float3 sample6curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample6_texel_offset)). rgb;
    float3 sample7curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample7_texel_offset)). rgb;
    float3 sample8curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample8_texel_offset)). rgb;



    float3 sample1adjx, sample1adjy, sample1diag;
    float3 sample2adjx, sample2adjy, sample2diag;
    float3 sample3adjx, sample3adjy, sample3diag;
    float3 sample4adjx, sample4adjy, sample4diag;
    float3 sample5adjx, sample5adjy, sample5diag;
    float3 sample6adjx, sample6adjy, sample6diag;
    float3 sample7adjx, sample7adjy, sample7diag;
    float3 sample8adjx, sample8adjy, sample8diag;
    quad_gather(quad_vector, sample1curr, sample1adjx, sample1adjy, sample1diag);
    quad_gather(quad_vector, sample2curr, sample2adjx, sample2adjy, sample2diag);
    quad_gather(quad_vector, sample3curr, sample3adjx, sample3adjy, sample3diag);
    quad_gather(quad_vector, sample4curr, sample4adjx, sample4adjy, sample4diag);
    quad_gather(quad_vector, sample5curr, sample5adjx, sample5adjy, sample5diag);
    quad_gather(quad_vector, sample6curr, sample6adjx, sample6adjy, sample6diag);
    quad_gather(quad_vector, sample7curr, sample7adjx, sample7adjy, sample7diag);
    quad_gather(quad_vector, sample8curr, sample8adjx, sample8adjy, sample8diag);



    float3 sum = float3(0.0, 0.0, 0.0);
    sum += mul(w0, float4x3(sample0curr, sample0adjx, sample0adjy, sample0diag));
    sum += mul(w1, float4x3(sample1curr, sample1adjx, sample1adjy, sample1diag));
    sum += mul(w2, float4x3(sample2curr, sample2adjx, sample2adjy, sample2diag));
    sum += mul(w3, float4x3(sample3curr, sample3adjx, sample3adjy, sample3diag));
    sum += mul(w4, float4x3(sample4curr, sample4adjx, sample4adjy, sample4diag));
    sum += mul(w5, float4x3(sample5curr, sample5adjx, sample5adjy, sample5diag));
    sum += mul(w6, float4x3(sample6curr, sample6adjx, sample6adjy, sample6diag));
    sum += mul(w7, float4x3(sample7curr, sample7adjx, sample7adjy, sample7diag));
    sum += mul(w8, float4x3(sample8curr, sample8adjx, sample8adjy, sample8diag));
    return sum * weight_sum_inv;
}

float3 tex2Dblur10x10shared(const sampler2D tex,
    float4 tex_uv, const float2 dxdy, const float4 quad_vector,
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
    float texel0to1ratio = lerp(w1_5off /(w0_5off + w1_5off), 0.5, error_blurring);
    float texel2to3ratio = lerp(w3_5off /(w2_5off + w3_5off), 0.5, error_blurring);
    float texel4to5ratio = lerp(w5_5off /(w4_5off + w5_5off), 0.5, error_blurring);

    float texel0to1ratio_nearest = w1off /(w0off + w1off);
    float texel1to2ratio_nearest = w2off /(w1off + w2off);


    float2 sample0curr_texel_offset = float2(0.0, 0.0)+ float2(texel0to1ratio_nearest, texel0to1ratio_nearest);
    float2 sample0adjx_texel_offset = float2(- 1.0, 0.0)+ float2(- texel1to2ratio_nearest, texel0to1ratio_nearest);
    float2 sample0adjy_texel_offset = float2(0.0, - 1.0)+ float2(texel0to1ratio_nearest, - texel1to2ratio_nearest);
    float2 sample0diag_texel_offset = float2(- 1.0, - 1.0)+ float2(- texel1to2ratio_nearest, - texel1to2ratio_nearest);
    float2 sample1_texel_offset = float2(2.0, 0.0)+ float2(texel2to3ratio, texel0to1ratio);
    float2 sample2_texel_offset = float2(4.0, 0.0)+ float2(texel4to5ratio, texel0to1ratio);
    float2 sample3_texel_offset = float2(0.0, 2.0)+ float2(texel0to1ratio, texel2to3ratio);
    float2 sample4_texel_offset = float2(2.0, 2.0)+ float2(texel2to3ratio, texel2to3ratio);
    float2 sample5_texel_offset = float2(4.0, 2.0)+ float2(texel4to5ratio, texel2to3ratio);
    float2 sample6_texel_offset = float2(0.0, 4.0)+ float2(texel0to1ratio, texel4to5ratio);
    float2 sample7_texel_offset = float2(2.0, 4.0)+ float2(texel2to3ratio, texel4to5ratio);
    float2 sample8_texel_offset = float2(4.0, 4.0)+ float2(texel4to5ratio, texel4to5ratio);













    float w4diag =(exp(-(dot(float2(- 4.0, - 4.0), float2(- 4.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 4.0), float2(- 4.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, - 4.0 + 1.0), float2(- 4.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 4.0 + 1.0), float2(- 4.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w3diag =(exp(-(dot(float2(- 2.0, - 4.0), float2(- 2.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 4.0), float2(- 2.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, - 4.0 + 1.0), float2(- 2.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 4.0 + 1.0), float2(- 2.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w3adjy =(exp(-(dot(float2(0.0, - 4.0), float2(0.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 4.0), float2(0.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(0.0, - 4.0 + 1.0), float2(0.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 4.0 + 1.0), float2(0.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w4adjy =(exp(-(dot(float2(2.0, - 4.0), float2(2.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 4.0), float2(2.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(2.0, - 4.0 + 1.0), float2(2.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 4.0 + 1.0), float2(2.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w5adjy =(exp(-(dot(float2(4.0, - 4.0), float2(4.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, - 4.0), float2(4.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(4.0, - 4.0 + 1.0), float2(4.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, - 4.0 + 1.0), float2(4.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w1diag =(exp(-(dot(float2(- 4.0, - 2.0), float2(- 4.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 2.0), float2(- 4.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, - 2.0 + 1.0), float2(- 4.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 2.0 + 1.0), float2(- 4.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w0diag =(exp(-(dot(float2(- 2.0, - 2.0), float2(- 2.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 2.0), float2(- 2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, - 2.0 + 1.0), float2(- 2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 2.0 + 1.0), float2(- 2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w0adjy =(exp(-(dot(float2(0.0, - 2.0), float2(0.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 2.0), float2(0.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(0.0, - 2.0 + 1.0), float2(0.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 2.0 + 1.0), float2(0.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w1adjy =(exp(-(dot(float2(2.0, - 2.0), float2(2.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 2.0), float2(2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(2.0, - 2.0 + 1.0), float2(2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 2.0 + 1.0), float2(2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w2adjy =(exp(-(dot(float2(4.0, - 2.0), float2(4.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, - 2.0), float2(4.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(4.0, - 2.0 + 1.0), float2(4.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, - 2.0 + 1.0), float2(4.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w1adjx =(exp(-(dot(float2(- 4.0, 0.0), float2(- 4.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 0.0), float2(- 4.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, 0.0 + 1.0), float2(- 4.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 0.0 + 1.0), float2(- 4.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w0adjx =(exp(-(dot(float2(- 2.0, 0.0), float2(- 2.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 0.0), float2(- 2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, 0.0 + 1.0), float2(- 2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 0.0 + 1.0), float2(- 2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w0curr =(exp(-(dot(float2(0.0, 0.0), float2(0.0, 0.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 0.0), float2(0.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(0.0, 0.0 + 1.0), float2(0.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 0.0 + 1.0), float2(0.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w1curr =(exp(-(dot(float2(2.0, 0.0), float2(2.0, 0.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 0.0), float2(2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(2.0, 0.0 + 1.0), float2(2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 0.0 + 1.0), float2(2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w2curr =(exp(-(dot(float2(4.0, 0.0), float2(4.0, 0.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, 0.0), float2(4.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(4.0, 0.0 + 1.0), float2(4.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, 0.0 + 1.0), float2(4.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w4adjx =(exp(-(dot(float2(- 4.0, 2.0), float2(- 4.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 2.0), float2(- 4.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, 2.0 + 1.0), float2(- 4.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 2.0 + 1.0), float2(- 4.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w3adjx =(exp(-(dot(float2(- 2.0, 2.0), float2(- 2.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 2.0), float2(- 2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, 2.0 + 1.0), float2(- 2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 2.0 + 1.0), float2(- 2.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w3curr =(exp(-(dot(float2(0.0, 2.0), float2(0.0, 2.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 2.0), float2(0.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(0.0, 2.0 + 1.0), float2(0.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 2.0 + 1.0), float2(0.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w4curr =(exp(-(dot(float2(2.0, 2.0), float2(2.0, 2.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 2.0), float2(2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(2.0, 2.0 + 1.0), float2(2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 2.0 + 1.0), float2(2.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w5curr =(exp(-(dot(float2(4.0, 2.0), float2(4.0, 2.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, 2.0), float2(4.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(4.0, 2.0 + 1.0), float2(4.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, 2.0 + 1.0), float2(4.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w7adjx =(exp(-(dot(float2(- 4.0, 4.0), float2(- 4.0, 4.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 4.0), float2(- 4.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, 4.0 + 1.0), float2(- 4.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 4.0 + 1.0), float2(- 4.0 + 1.0, 4.0 + 1.0)))* denom_inv));
    float w6adjx =(exp(-(dot(float2(- 2.0, 4.0), float2(- 2.0, 4.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 4.0), float2(- 2.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, 4.0 + 1.0), float2(- 2.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 4.0 + 1.0), float2(- 2.0 + 1.0, 4.0 + 1.0)))* denom_inv));
    float w6curr =(exp(-(dot(float2(0.0, 4.0), float2(0.0, 4.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 4.0), float2(0.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(float2(0.0, 4.0 + 1.0), float2(0.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 4.0 + 1.0), float2(0.0 + 1.0, 4.0 + 1.0)))* denom_inv));
    float w7curr =(exp(-(dot(float2(2.0, 4.0), float2(2.0, 4.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 4.0), float2(2.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(float2(2.0, 4.0 + 1.0), float2(2.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 4.0 + 1.0), float2(2.0 + 1.0, 4.0 + 1.0)))* denom_inv));
    float w8curr =(exp(-(dot(float2(4.0, 4.0), float2(4.0, 4.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, 4.0), float2(4.0 + 1.0, 4.0)))* denom_inv)+ exp(-(dot(float2(4.0, 4.0 + 1.0), float2(4.0, 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(4.0 + 1.0, 4.0 + 1.0), float2(4.0 + 1.0, 4.0 + 1.0)))* denom_inv));


    float weight_sum_inv = 1.0 /(w0curr + w1curr + w2curr + w3curr +
        w4curr + w5curr + w6curr + w7curr + w8curr +
        w0adjx + w1adjx + w3adjx + w4adjx + w6adjx + w7adjx +
        w0adjy + w1adjy + w2adjy + w3adjy + w4adjy + w5adjy +
        w0diag + w1diag + w3diag + w4diag);

    float4 w0 = float4(w0curr, w0adjx, w0adjy, w0diag);
    float4 w1 = float4(w1curr, w1adjx, w1adjy, w1diag);
    float4 w3 = float4(w3curr, w3adjx, w3adjy, w3diag);
    float4 w4 = float4(w4curr, w4adjx, w4adjy, w4diag);
    float4 w2and5 = float4(w2curr, w2adjy, w5curr, w5adjy);
    float4 w6and7 = float4(w6curr, w6adjx, w7curr, w7adjx);



    float2 dxdy_curr = dxdy * quad_vector . xy;

    float3 sample0curr = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0curr_texel_offset). rgb;
    float3 sample0adjx = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjx_texel_offset). rgb;
    float3 sample0adjy = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjy_texel_offset). rgb;
    float3 sample0diag = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0diag_texel_offset). rgb;
    float3 sample1curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample1_texel_offset)). rgb;
    float3 sample2curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample2_texel_offset)). rgb;
    float3 sample3curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample3_texel_offset)). rgb;
    float3 sample4curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample4_texel_offset)). rgb;
    float3 sample5curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample5_texel_offset)). rgb;
    float3 sample6curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample6_texel_offset)). rgb;
    float3 sample7curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample7_texel_offset)). rgb;
    float3 sample8curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample8_texel_offset)). rgb;



    float3 sample1adjx, sample1adjy, sample1diag;
    float3 sample2adjx, sample2adjy, sample2diag;
    float3 sample3adjx, sample3adjy, sample3diag;
    float3 sample4adjx, sample4adjy, sample4diag;
    float3 sample5adjx, sample5adjy, sample5diag;
    float3 sample6adjx, sample6adjy, sample6diag;
    float3 sample7adjx, sample7adjy, sample7diag;
    quad_gather(quad_vector, sample1curr, sample1adjx, sample1adjy, sample1diag);
    quad_gather(quad_vector, sample2curr, sample2adjx, sample2adjy, sample2diag);
    quad_gather(quad_vector, sample3curr, sample3adjx, sample3adjy, sample3diag);
    quad_gather(quad_vector, sample4curr, sample4adjx, sample4adjy, sample4diag);
    quad_gather(quad_vector, sample5curr, sample5adjx, sample5adjy, sample5diag);
    quad_gather(quad_vector, sample6curr, sample6adjx, sample6adjy, sample6diag);
    quad_gather(quad_vector, sample7curr, sample7adjx, sample7adjy, sample7diag);



    float3 sum = float3(0.0, 0.0, 0.0);
    sum += mul(w0, float4x3(sample0curr, sample0adjx, sample0adjy, sample0diag));
    sum += mul(w1, float4x3(sample1curr, sample1adjx, sample1adjy, sample1diag));
    sum += mul(w3, float4x3(sample3curr, sample3adjx, sample3adjy, sample3diag));
    sum += mul(w4, float4x3(sample4curr, sample4adjx, sample4adjy, sample4diag));

    sum += mul(w2and5, float4x3(sample2curr, sample2adjy, sample5curr, sample5adjy));
    sum += mul(w6and7, float4x3(sample6curr, sample6adjx, sample7curr, sample7adjx));
    sum += w8curr * sample8curr;

    return sum * weight_sum_inv;
}

float3 tex2Dblur8x8shared(const sampler2D tex,
    float4 tex_uv, const float2 dxdy, const float4 quad_vector,
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
    float texel0to1ratio = lerp(w1_5off /(w0_5off + w1_5off), 0.5, error_blurring);
    float texel2to3ratio = lerp(w3_5off /(w2_5off + w3_5off), 0.5, error_blurring);

    float texel0to1ratio_nearest = w1off /(w0off + w1off);
    float texel1to2ratio_nearest = w2off /(w1off + w2off);


    float2 sample0curr_texel_offset = float2(0.0, 0.0)+ float2(texel0to1ratio_nearest, texel0to1ratio_nearest);
    float2 sample0adjx_texel_offset = float2(- 1.0, 0.0)+ float2(- texel1to2ratio_nearest, texel0to1ratio_nearest);
    float2 sample0adjy_texel_offset = float2(0.0, - 1.0)+ float2(texel0to1ratio_nearest, - texel1to2ratio_nearest);
    float2 sample0diag_texel_offset = float2(- 1.0, - 1.0)+ float2(- texel1to2ratio_nearest, - texel1to2ratio_nearest);
    float2 sample1_texel_offset = float2(2.0, 0.0)+ float2(texel2to3ratio, texel0to1ratio);
    float2 sample2_texel_offset = float2(0.0, 2.0)+ float2(texel0to1ratio, texel2to3ratio);
    float2 sample3_texel_offset = float2(2.0, 2.0)+ float2(texel2to3ratio, texel2to3ratio);









    float w3diag =(exp(-(dot(float2(- 4.0, - 4.0), float2(- 4.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 4.0), float2(- 4.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, - 4.0 + 1.0), float2(- 4.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 4.0 + 1.0), float2(- 4.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w2diag =(exp(-(dot(float2(- 2.0, - 4.0), float2(- 2.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 4.0), float2(- 2.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, - 4.0 + 1.0), float2(- 2.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 4.0 + 1.0), float2(- 2.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w2adjy =(exp(-(dot(float2(0.0, - 4.0), float2(0.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 4.0), float2(0.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(0.0, - 4.0 + 1.0), float2(0.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 4.0 + 1.0), float2(0.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w3adjy =(exp(-(dot(float2(2.0, - 4.0), float2(2.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 4.0), float2(2.0 + 1.0, - 4.0)))* denom_inv)+ exp(-(dot(float2(2.0, - 4.0 + 1.0), float2(2.0, - 4.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 4.0 + 1.0), float2(2.0 + 1.0, - 4.0 + 1.0)))* denom_inv));
    float w1diag =(exp(-(dot(float2(- 4.0, - 2.0), float2(- 4.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 2.0), float2(- 4.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, - 2.0 + 1.0), float2(- 4.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, - 2.0 + 1.0), float2(- 4.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w0diag =(exp(-(dot(float2(- 2.0, - 2.0), float2(- 2.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 2.0), float2(- 2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, - 2.0 + 1.0), float2(- 2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 2.0 + 1.0), float2(- 2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w0adjy =(exp(-(dot(float2(0.0, - 2.0), float2(0.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 2.0), float2(0.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(0.0, - 2.0 + 1.0), float2(0.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 2.0 + 1.0), float2(0.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w1adjy =(exp(-(dot(float2(2.0, - 2.0), float2(2.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 2.0), float2(2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(2.0, - 2.0 + 1.0), float2(2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 2.0 + 1.0), float2(2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w1adjx =(exp(-(dot(float2(- 4.0, 0.0), float2(- 4.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 0.0), float2(- 4.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, 0.0 + 1.0), float2(- 4.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 0.0 + 1.0), float2(- 4.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w0adjx =(exp(-(dot(float2(- 2.0, 0.0), float2(- 2.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 0.0), float2(- 2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, 0.0 + 1.0), float2(- 2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 0.0 + 1.0), float2(- 2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w0curr =(exp(-(dot(float2(0.0, 0.0), float2(0.0, 0.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 0.0), float2(0.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(0.0, 0.0 + 1.0), float2(0.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 0.0 + 1.0), float2(0.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w1curr =(exp(-(dot(float2(2.0, 0.0), float2(2.0, 0.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 0.0), float2(2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(2.0, 0.0 + 1.0), float2(2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 0.0 + 1.0), float2(2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w3adjx =(exp(-(dot(float2(- 4.0, 2.0), float2(- 4.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 2.0), float2(- 4.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 4.0, 2.0 + 1.0), float2(- 4.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 4.0 + 1.0, 2.0 + 1.0), float2(- 4.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w2adjx =(exp(-(dot(float2(- 2.0, 2.0), float2(- 2.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 2.0), float2(- 2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, 2.0 + 1.0), float2(- 2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 2.0 + 1.0), float2(- 2.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w2curr =(exp(-(dot(float2(0.0, 2.0), float2(0.0, 2.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 2.0), float2(0.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(0.0, 2.0 + 1.0), float2(0.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 2.0 + 1.0), float2(0.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w3curr =(exp(-(dot(float2(2.0, 2.0), float2(2.0, 2.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 2.0), float2(2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(2.0, 2.0 + 1.0), float2(2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 2.0 + 1.0), float2(2.0 + 1.0, 2.0 + 1.0)))* denom_inv));


    float4 w0 = float4(w0curr, w0adjx, w0adjy, w0diag);
    float4 w1 = float4(w1curr, w1adjx, w1adjy, w1diag);
    float4 w2 = float4(w2curr, w2adjx, w2adjy, w2diag);
    float4 w3 = float4(w3curr, w3adjx, w3adjy, w3diag);

    float4 weight_sum4 = w0 + w1 + w2 + w3;
    float2 weight_sum2 = weight_sum4 . xy + weight_sum4 . zw;
    float weight_sum = weight_sum2 . x + weight_sum2 . y;
    float weight_sum_inv = 1.0 /(weight_sum);



    float2 dxdy_curr = dxdy * quad_vector . xy;

    float3 sample0curr = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0curr_texel_offset). rgb;
    float3 sample0adjx = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjx_texel_offset). rgb;
    float3 sample0adjy = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjy_texel_offset). rgb;
    float3 sample0diag = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0diag_texel_offset). rgb;
    float3 sample1curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample1_texel_offset)). rgb;
    float3 sample2curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample2_texel_offset)). rgb;
    float3 sample3curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample3_texel_offset)). rgb;



    float3 sample1adjx, sample1adjy, sample1diag;
    float3 sample2adjx, sample2adjy, sample2diag;
    float3 sample3adjx, sample3adjy, sample3diag;
    quad_gather(quad_vector, sample1curr, sample1adjx, sample1adjy, sample1diag);
    quad_gather(quad_vector, sample2curr, sample2adjx, sample2adjy, sample2diag);
    quad_gather(quad_vector, sample3curr, sample3adjx, sample3adjy, sample3diag);



    float3 sum = float3(0.0, 0.0, 0.0);
    sum += mul(w0, float4x3(sample0curr, sample0adjx, sample0adjy, sample0diag));
    sum += mul(w1, float4x3(sample1curr, sample1adjx, sample1adjy, sample1diag));
    sum += mul(w2, float4x3(sample2curr, sample2adjx, sample2adjy, sample2diag));
    sum += mul(w3, float4x3(sample3curr, sample3adjx, sample3adjy, sample3diag));
    return sum * weight_sum_inv;
}

float3 tex2Dblur6x6shared(const sampler2D tex,
    float4 tex_uv, const float2 dxdy, const float4 quad_vector,
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
    float texel0to1ratio = lerp(w1_5off /(w0_5off + w1_5off), 0.5, error_blurring);
    float texel2to3ratio = lerp(w3_5off /(w2_5off + w3_5off), 0.5, error_blurring);

    float texel0to1ratio_nearest = w1off /(w0off + w1off);
    float texel1to2ratio_nearest = w2off /(w1off + w2off);


    float2 sample0curr_texel_offset = float2(0.0, 0.0)+ float2(texel0to1ratio_nearest, texel0to1ratio_nearest);
    float2 sample0adjx_texel_offset = float2(- 1.0, 0.0)+ float2(- texel1to2ratio_nearest, texel0to1ratio_nearest);
    float2 sample0adjy_texel_offset = float2(0.0, - 1.0)+ float2(texel0to1ratio_nearest, - texel1to2ratio_nearest);
    float2 sample0diag_texel_offset = float2(- 1.0, - 1.0)+ float2(- texel1to2ratio_nearest, - texel1to2ratio_nearest);
    float2 sample1_texel_offset = float2(2.0, 0.0)+ float2(texel2to3ratio, texel0to1ratio);
    float2 sample2_texel_offset = float2(0.0, 2.0)+ float2(texel0to1ratio, texel2to3ratio);
    float2 sample3_texel_offset = float2(2.0, 2.0)+ float2(texel2to3ratio, texel2to3ratio);













    float w0diag =(exp(-(dot(float2(- 2.0, - 2.0), float2(- 2.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 2.0), float2(- 2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, - 2.0 + 1.0), float2(- 2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, - 2.0 + 1.0), float2(- 2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w0adjy =(exp(-(dot(float2(0.0, - 2.0), float2(0.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 2.0), float2(0.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(0.0, - 2.0 + 1.0), float2(0.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, - 2.0 + 1.0), float2(0.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w1adjy =(exp(-(dot(float2(2.0, - 2.0), float2(2.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 2.0), float2(2.0 + 1.0, - 2.0)))* denom_inv)+ exp(-(dot(float2(2.0, - 2.0 + 1.0), float2(2.0, - 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, - 2.0 + 1.0), float2(2.0 + 1.0, - 2.0 + 1.0)))* denom_inv));
    float w0adjx =(exp(-(dot(float2(- 2.0, 0.0), float2(- 2.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 0.0), float2(- 2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, 0.0 + 1.0), float2(- 2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 0.0 + 1.0), float2(- 2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w0curr =(exp(-(dot(float2(0.0, 0.0), float2(0.0, 0.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 0.0), float2(0.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(0.0, 0.0 + 1.0), float2(0.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 0.0 + 1.0), float2(0.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w1curr =(exp(-(dot(float2(2.0, 0.0), float2(2.0, 0.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 0.0), float2(2.0 + 1.0, 0.0)))* denom_inv)+ exp(-(dot(float2(2.0, 0.0 + 1.0), float2(2.0, 0.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 0.0 + 1.0), float2(2.0 + 1.0, 0.0 + 1.0)))* denom_inv));
    float w2adjx =(exp(-(dot(float2(- 2.0, 2.0), float2(- 2.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 2.0), float2(- 2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(- 2.0, 2.0 + 1.0), float2(- 2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(- 2.0 + 1.0, 2.0 + 1.0), float2(- 2.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w2curr =(exp(-(dot(float2(0.0, 2.0), float2(0.0, 2.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 2.0), float2(0.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(0.0, 2.0 + 1.0), float2(0.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(0.0 + 1.0, 2.0 + 1.0), float2(0.0 + 1.0, 2.0 + 1.0)))* denom_inv));
    float w3curr =(exp(-(dot(float2(2.0, 2.0), float2(2.0, 2.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 2.0), float2(2.0 + 1.0, 2.0)))* denom_inv)+ exp(-(dot(float2(2.0, 2.0 + 1.0), float2(2.0, 2.0 + 1.0)))* denom_inv)+ exp(-(dot(float2(2.0 + 1.0, 2.0 + 1.0), float2(2.0 + 1.0, 2.0 + 1.0)))* denom_inv));


    float weight_sum_inv = 1.0 /(w0curr + w1curr + w2curr + w3curr +
        w0adjx + w2adjx + w0adjy + w1adjy + w0diag);

    float4 w0 = float4(w0curr, w0adjx, w0adjy, w0diag);



    float2 dxdy_curr = dxdy * quad_vector . xy;

    float3 sample0curr = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0curr_texel_offset). rgb;
    float3 sample0adjx = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjx_texel_offset). rgb;
    float3 sample0adjy = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0adjy_texel_offset). rgb;
    float3 sample0diag = tex2D_linearize(tex, tex_uv . xy + dxdy_curr * sample0diag_texel_offset). rgb;
    float3 sample1curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample1_texel_offset)). rgb;
    float3 sample2curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample2_texel_offset)). rgb;
    float3 sample3curr = tex2Dlod_linearize(tex, tex_uv + uv2_to_uv4(dxdy_curr * sample3_texel_offset)). rgb;



    float3 sample1adjx, sample1adjy, sample1diag;
    float3 sample2adjx, sample2adjy, sample2diag;
    quad_gather(quad_vector, sample1curr, sample1adjx, sample1adjy, sample1diag);
    quad_gather(quad_vector, sample2curr, sample2adjx, sample2adjy, sample2diag);




    float3 sum = float3(0.0, 0.0, 0.0);
    sum += mul(w0, float4x3(sample0curr, sample0adjx, sample0adjy, sample0diag));
    sum += w1curr * sample1curr + w1adjy * sample1adjy + w2curr * sample2curr +
            w2adjx * sample2adjx + w3curr * sample3curr;
    return sum * weight_sum_inv;
}








 float3 tex2Dblur11resize(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur11resize(tex, tex_uv, dxdy, blur11_std_dev);
}
 float3 tex2Dblur9resize(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur9resize(tex, tex_uv, dxdy, blur9_std_dev);
}
 float3 tex2Dblur7resize(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur7resize(tex, tex_uv, dxdy, blur7_std_dev);
}
 float3 tex2Dblur5resize(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur5resize(tex, tex_uv, dxdy, blur5_std_dev);
}
 float3 tex2Dblur3resize(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur3resize(tex, tex_uv, dxdy, blur3_std_dev);
}

 float3 tex2Dblur11fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur11fast(tex, tex_uv, dxdy, blur11_std_dev);
}
 float3 tex2Dblur9fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur9fast(tex, tex_uv, dxdy, blur9_std_dev);
}
 float3 tex2Dblur7fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur7fast(tex, tex_uv, dxdy, blur7_std_dev);
}
 float3 tex2Dblur5fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur5fast(tex, tex_uv, dxdy, blur5_std_dev);
}
 float3 tex2Dblur3fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur3fast(tex, tex_uv, dxdy, blur3_std_dev);
}

 float3 tex2Dblur43fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur43fast(tex, tex_uv, dxdy, blur43_std_dev);
}
 float3 tex2Dblur31fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur31fast(tex, tex_uv, dxdy, blur31_std_dev);
}
 float3 tex2Dblur25fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur25fast(tex, tex_uv, dxdy, blur25_std_dev);
}
 float3 tex2Dblur17fast(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur17fast(tex, tex_uv, dxdy, blur17_std_dev);
}

 float3 tex2Dblur3x3resize(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur3x3resize(tex, tex_uv, dxdy, blur3_std_dev);
}

 float3 tex2Dblur9x9(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur9x9(tex, tex_uv, dxdy, blur9_std_dev);
}
 float3 tex2Dblur7x7(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur7x7(tex, tex_uv, dxdy, blur7_std_dev);
}
 float3 tex2Dblur5x5(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur5x5(tex, tex_uv, dxdy, blur5_std_dev);
}
 float3 tex2Dblur3x3(const sampler2D tex, const float2 tex_uv,
    float2 dxdy)
{
    return tex2Dblur3x3(tex, tex_uv, dxdy, blur3_std_dev);
}

 float3 tex2Dblur12x12shared(const sampler2D tex,
    float4 tex_uv, const float2 dxdy, const float4 quad_vector)
{
    return tex2Dblur12x12shared(tex, tex_uv, dxdy, quad_vector, blur12_std_dev);
}
 float3 tex2Dblur10x10shared(const sampler2D tex,
    float4 tex_uv, const float2 dxdy, const float4 quad_vector)
{
    return tex2Dblur10x10shared(tex, tex_uv, dxdy, quad_vector, blur10_std_dev);
}
 float3 tex2Dblur8x8shared(const sampler2D tex,
    float4 tex_uv, const float2 dxdy, const float4 quad_vector)
{
    return tex2Dblur8x8shared(tex, tex_uv, dxdy, quad_vector, blur8_std_dev);
}
 float3 tex2Dblur6x6shared(const sampler2D tex,
    float4 tex_uv, const float2 dxdy, const float4 quad_vector)
{
    return tex2Dblur6x6shared(tex, tex_uv, dxdy, quad_vector, blur6_std_dev);
}





layout(location = 0) in vec2 tex_uv;
layout(location = 1) in vec2 blur_dxdy;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
 vec3 color = tex2Dblur5x5(Source, tex_uv, blur_dxdy);

   FragColor = encode_output(vec4(color, 1.0));
}
