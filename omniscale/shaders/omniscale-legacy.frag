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

float quickDistance(vec4 a, vec4 b)
{
    return abs(a . x - b . x)+ abs(a . y - b . y)+ abs(a . z - b . z);
}




vec4 omniScale(sampler2D image, vec2 texCoord)
{
    vec2 pixel = texCoord * params . SourceSize . xy - vec2(0.5, 0.5);

    vec4 q11 = texture(image, vec2(floor(pixel . x)/ params . SourceSize . xy . x, floor(pixel . y)/ params . SourceSize . xy . y + 0.001));
    vec4 q12 = texture(image, vec2(floor(pixel . x)/ params . SourceSize . xy . x, ceil(pixel . y)/ params . SourceSize . xy . y + 0.001));
    vec4 q21 = texture(image, vec2(ceil(pixel . x)/ params . SourceSize . xy . x, floor(pixel . y)/ params . SourceSize . xy . y + 0.001));
    vec4 q22 = texture(image, vec2(ceil(pixel . x)/ params . SourceSize . xy . x, ceil(pixel . y)/ params . SourceSize . xy . y + 0.001));

    vec2 pos = fract(pixel);


    bool hasDownDiagonal = false;
    bool hasUpDiagonal = false;
    if(q12 == q21 && q11 != q22)hasUpDiagonal = true;
    else if(q12 != q21 && q11 == q22)hasDownDiagonal = true;
    else if(q12 == q21 && q11 == q22){
        if(q11 == q12)return q11;
        int diagonalBias = 0;
        for(float y = - 1.0;y < 3.0;y ++){
            for(float x = - 1.0;x < 3.0;x ++){
                vec4 color = texture(image,(pixel + vec2(x, y))/ params . SourceSize . xy);
                if(color == q11)diagonalBias ++;
                if(color == q12)diagonalBias --;
            }
        }
        if(diagonalBias <= 0){
            hasDownDiagonal = true;
        }
        if(diagonalBias >= 0){
            hasUpDiagonal = true;
        }
    }

    if(hasUpDiagonal || hasDownDiagonal){
        vec4 downDiagonalResult, upDiagonalResult;

        if(hasUpDiagonal){
            float diagonalPos = pos . x + pos . y;

            if(diagonalPos < 0.5){
                upDiagonalResult = q11;
            }
            else if(diagonalPos > 1.5){
                upDiagonalResult = q22;
            }
            else {
                upDiagonalResult = q12;
            }
        }

        if(hasDownDiagonal){
            float diagonalPos = 1.0 - pos . x + pos . y;

            if(diagonalPos < 0.5){
                downDiagonalResult = q21;
            }
            else if(diagonalPos > 1.5){
                downDiagonalResult = q12;
            }
            else {
                downDiagonalResult = q11;
            }
        }

        if(! hasUpDiagonal)return downDiagonalResult;
        if(! hasDownDiagonal)return upDiagonalResult;
        return mix(downDiagonalResult, upDiagonalResult, 0.5);
    }

    vec4 r1 = mix(q11, q21, fract(pos . x));
    vec4 r2 = mix(q12, q22, fract(pos . x));

    vec4 unquantized = mix(r1, r2, fract(pos . y));

    float q11d = quickDistance(unquantized, q11);
    float q21d = quickDistance(unquantized, q21);
    float q12d = quickDistance(unquantized, q12);
    float q22d = quickDistance(unquantized, q22);

    float best = min(q11d,
                     min(q21d,
                         min(q12d,
                             q22d)));

    if(q11d == best){
        return q11;
    }

    if(q21d == best){
        return q21;
    }

    if(q12d == best){
        return q12;
    }

    return q22;
}

vec4 scale(sampler2D tex, vec2 coord){
    vec2 texCoord = coord;
    vec2 pixel = vec2(1.0, 1.0)/ params . OutputSize . xy;


    vec4 q11 = omniScale(tex, texCoord + pixel * vec2(- 0.25, - 0.25));
    vec4 q21 = omniScale(tex, texCoord + pixel * vec2(+ 0.25, - 0.25));
    vec4 q12 = omniScale(tex, texCoord + pixel * vec2(- 0.25, + 0.25));
    vec4 q22 = omniScale(tex, texCoord + pixel * vec2(+ 0.25, + 0.25));

 return(q11 + q21 + q12 + q22)/ 4.0;
}

layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;

void main()
{
    FragColor = scale(Source, vTexCoord);
}
