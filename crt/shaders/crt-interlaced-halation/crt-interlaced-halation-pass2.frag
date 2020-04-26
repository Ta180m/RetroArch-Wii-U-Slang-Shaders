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








































                    float CRTgamma = 2.4;

                    float monitorgamma = 2.2;

                    vec2 overscan = vec2(1.0, 1.0);

                    vec2 aspect = vec2(1.0, 0.75);


                    float d = 2.0;

                    float R = 2.0;



                    vec2 angle = vec2(0.0, 0.0);

                    float cornersize = 0.01;


                    float cornersmooth = 800.0;




            float intersect(vec2 xy, vec2 sinangle, vec2 cosangle)
            {
                    float A = dot(xy, xy)+ d * d;
                    float B = 2.0 *(R *(dot(xy, sinangle)- d * cosangle . x * cosangle . y)- d * d);
                    float C = d * d + 2.0 * R * d * cosangle . x * cosangle . y;
                    return(- B - sqrt(B * B - 4.0 * A * C))/(2.0 * A);
            }

            vec2 bkwtrans(vec2 xy, vec2 sinangle, vec2 cosangle)
            {
                    float c = intersect(xy, sinangle, cosangle);
                    vec2 point = vec2(c)* xy;
                    point -= vec2(- R)* sinangle;
                    point /= vec2(R);
                    vec2 tang = sinangle / cosangle;
                    vec2 poc = point / cosangle;
                    float A = dot(tang, tang)+ 1.0;
                    float B = - 2.0 * dot(poc, tang);
                    float C = dot(poc, poc)- 1.0;
                    float a =(- B + sqrt(B * B - 4.0 * A * C))/(2.0 * A);
                    vec2 uv =(point - a * sinangle)/ cosangle;
                    float r = max(abs(R * acos(a)), 1e-5);;
                    return uv * r / sin(r / R);
            }

            vec2 fwtrans(vec2 uv, vec2 sinangle, vec2 cosangle)
            {
                    float r = max(abs(sqrt(dot(uv, uv))), 1e-5);;
                    uv *= sin(r / R)/ r;
                    float x = 1.0 - cos(r / R);
                    float D = d / R + x * cosangle . x * cosangle . y + dot(uv, sinangle);
                    return d *(uv * cosangle - x * sinangle)/ D;
            }

            vec3 maxscale(vec2 sinangle, vec2 cosangle)
            {
                    vec2 c = bkwtrans(- R * sinangle /(1.0 + R / d * cosangle . x * cosangle . y), sinangle, cosangle);
                    vec2 a = vec2(0.5, 0.5)* aspect;
                    vec2 lo = vec2(fwtrans(vec2(- a . x, c . y), sinangle, cosangle). x,
                                 fwtrans(vec2(c . x, - a . y), sinangle, cosangle). y)/ aspect;
                    vec2 hi = vec2(fwtrans(vec2(+ a . x, c . y), sinangle, cosangle). x,
                                 fwtrans(vec2(c . x, + a . y), sinangle, cosangle). y)/ aspect;
                    return vec3((hi + lo)* aspect * 0.5, max(hi . x - lo . x, hi . y - lo . y));
            }







            vec4 scanlineWeights(float distance, vec4 color)
            {











                    vec4 wid = 0.3 + 0.1 * pow(color, vec4(3.0));
                    vec4 weights = vec4(distance / wid);
                    return 0.4 * exp(- weights * weights)/ wid;





            }

layout(location = 0) in vec2 vTexCoord;
layout(location = 1) in vec2 one;
layout(location = 2) in float mod_factor;
layout(location = 3) in vec2 ilfac;
layout(location = 4) in vec3 stretch;
layout(location = 5) in vec2 sinangle;
layout(location = 6) in vec2 cosangle;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;
uniform sampler2D Original;



void main()
{























                    vec2 cd = vTexCoord;

                    cd =(cd - vec2(0.5))* aspect * stretch . z + stretch . xy;
                    vec2 xy =(bkwtrans(cd, sinangle, cosangle)/ overscan / aspect + vec2(0.5));




                    vec2 cd2 = xy;

                    cd2 =(cd2 - vec2(0.5))* overscan + vec2(0.5);
                    cd2 = min(cd2, vec2(1.0)- cd2)* aspect;
                    vec2 cdist = vec2(cornersize);
                    cd2 =(cdist - min(cd2, cdist));
                    float dist = sqrt(dot(cd2, cd2));
                    float cval = clamp((cdist . x - dist)* cornersmooth, 0.0, 1.0);

                    vec2 xy2 =((xy - vec2(0.5))* vec2(1.0, 1.0)+ vec2(0.5));


                    vec2 ilfloat = vec2(0.0, ilfac . y > 1.5 ? mod(vec2(params . FrameCount, params . FrameCount). x, 2.0): 0.0);

                    vec2 ratio_scale =(xy * params . SourceSize . xy - vec2(0.5)+ ilfloat)/ ilfac;





                    vec2 uv_ratio = fract(ratio_scale);


                    xy =(floor(ratio_scale)* ilfac + vec2(0.5)- ilfloat)/ params . SourceSize . xy;




                    vec4 coeffs = 3.141592653589 * vec4(1.0 + uv_ratio . x, uv_ratio . x, 1.0 - uv_ratio . x, 2.0 - uv_ratio . x);


                    coeffs = max(abs(coeffs), 1e-5);;


                    coeffs = 2.0 * sin(coeffs)* sin(coeffs / 2.0)/(coeffs * coeffs);


                    coeffs /= dot(coeffs, vec4(1.0));




               vec4 col = clamp(



                                                           (mat4x4(pow(texture(Original,(xy + vec2(- one . x, 0.0))), vec4(CRTgamma)), pow(texture(Original,(xy)), vec4(CRTgamma)), pow(texture(Original,(xy + vec2(one . x, 0.0))), vec4(CRTgamma)), pow(texture(Original,(xy + vec2(2.0 * one . x, 0.0))), vec4(CRTgamma)))* coeffs),
                  0.0, 1.0);
               vec4 col2 = clamp(



                                                             (mat4x4(pow(texture(Original,(xy + vec2(- one . x, one . y))), vec4(CRTgamma)), pow(texture(Original,(xy + vec2(0.0, one . y))), vec4(CRTgamma)), pow(texture(Original,(xy + one)), vec4(CRTgamma)), pow(texture(Original,(xy + vec2(2.0 * one . x, one . y))), vec4(CRTgamma)))* coeffs),
                  0.0, 1.0);









                    vec4 weights = scanlineWeights(uv_ratio . y, col);
                    vec4 weights2 = scanlineWeights(1.0 - uv_ratio . y, col2);








                    vec3 mul_res =(col * weights + col2 * weights2). rgb;

               mul_res += pow(texture(Source, xy2). rgb, vec3(monitorgamma))* 0.1;

               mul_res *= vec3(cval);










                    vec3 dotMaskWeights = mix(
                            vec3(1.0, 1.0, 1.0),
                            vec3(1.0, 1.0, 1.0),
                            floor(mod(mod_factor, 2.0)));



                    mul_res *= dotMaskWeights;


                    mul_res = pow(mul_res, vec3(1.0 / monitorgamma));


   FragColor = vec4(mul_res, 1.0);
}
