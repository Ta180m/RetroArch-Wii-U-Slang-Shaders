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

layout(location = 0) in vec4 Position;
layout(location = 1) in vec2 TexCoord;
layout(location = 0) out vec2 vTexCoord;
layout(location = 1) out vec2 one;
layout(location = 2) out float mod_factor;
layout(location = 3) out vec2 ilfac;
layout(location = 4) out vec3 stretch;
layout(location = 5) out vec2 sinangle;
layout(location = 6) out vec2 cosangle;

void main()
{
   gl_Position = global . MVP * Position;
   vTexCoord = TexCoord;



                    sinangle = sin(angle);
                    cosangle = cos(angle);
                    stretch = maxscale(sinangle, cosangle);


                    ilfac = vec2(1.0, clamp(floor(params . SourceSize . y / 200.0), 1.0, 2.0));





                    one = ilfac / params . OriginalSize . xy;


                    mod_factor = vTexCoord . x * params . OriginalSize . x * params . OutputSize . x / params . OriginalSize . x;
}

