#version 150
#define float2 vec2
#define float3 vec3
#define float4 vec4











































uniform Push
{
   vec4 SourceSize;
   float SFX_SCN;
}params;


#pragma parameterSFX_SCN¡1.00.01.01.0


layout(std140) uniform UBO
{
   mat4 MVP;
}global;


layout(location = 0) in vec2 vTexCoord;
layout(location = 0) out vec4 FragColor;
uniform sampler2D Source;



bvec4 loadCorn(vec4 x){
 return bvec4(floor(mod(x * 15 + 0.5, 2)));
}


bvec4 loadHori(vec4 x){
 return bvec4(floor(mod(x * 7.5 + 0.25, 2)));
}


bvec4 loadVert(vec4 x){
 return bvec4(floor(mod(x * 3.75 + 0.125, 2)));
}


bvec4 loadOr(vec4 x){
 return bvec4(floor(mod(x * 1.875 + 0.0625, 2)));
}



void main()
{











 vec4 E = textureOffset(Source, vTexCoord, ivec2(0, 0));
 vec4 D = textureOffset(Source, vTexCoord, ivec2(- 1, 0)), D0 = textureOffset(Source, vTexCoord, ivec2(- 2, 0)), D1 = textureOffset(Source, vTexCoord, ivec2(- 3, 0));
 vec4 F = textureOffset(Source, vTexCoord, ivec2(1, 0)), F0 = textureOffset(Source, vTexCoord, ivec2(2, 0)), F1 = textureOffset(Source, vTexCoord, ivec2(3, 0));
 vec4 B = textureOffset(Source, vTexCoord, ivec2(0, - 1)), B0 = textureOffset(Source, vTexCoord, ivec2(0, - 2)), B1 = textureOffset(Source, vTexCoord, ivec2(0, - 3));
 vec4 H = textureOffset(Source, vTexCoord, ivec2(0, 1)), H0 = textureOffset(Source, vTexCoord, ivec2(0, 2)), H1 = textureOffset(Source, vTexCoord, ivec2(0, 3));


 bvec4 Ec = loadCorn(E), Eh = loadHori(E), Ev = loadVert(E), Eo = loadOr(E);
 bvec4 Dc = loadCorn(D), Dh = loadHori(D), Do = loadOr(D), D0c = loadCorn(D0), D0h = loadHori(D0), D1h = loadHori(D1);
 bvec4 Fc = loadCorn(F), Fh = loadHori(F), Fo = loadOr(F), F0c = loadCorn(F0), F0h = loadHori(F0), F1h = loadHori(F1);
 bvec4 Bc = loadCorn(B), Bv = loadVert(B), Bo = loadOr(B), B0c = loadCorn(B0), B0v = loadVert(B0), B1v = loadVert(B1);
 bvec4 Hc = loadCorn(H), Hv = loadVert(H), Ho = loadOr(H), H0c = loadCorn(H0), H0v = loadVert(H0), H1v = loadVert(H1);



 bool lvl1x = Ec . x &&(Dc . z || Bc . z || params . SFX_SCN == 1);
 bool lvl1y = Ec . y &&(Fc . w || Bc . w || params . SFX_SCN == 1);
 bool lvl1z = Ec . z &&(Fc . x || Hc . x || params . SFX_SCN == 1);
 bool lvl1w = Ec . w &&(Dc . y || Hc . y || params . SFX_SCN == 1);


 bvec2 lvl2x = bvec2((Ec . x && Eh . y)&& Dc . z,(Ec . y && Eh . x)&& Fc . w);
 bvec2 lvl2y = bvec2((Ec . y && Ev . z)&& Bc . w,(Ec . z && Ev . y)&& Hc . x);
 bvec2 lvl2z = bvec2((Ec . w && Eh . z)&& Dc . y,(Ec . z && Eh . w)&& Fc . x);
 bvec2 lvl2w = bvec2((Ec . x && Ev . w)&& Bc . z,(Ec . w && Ev . x)&& Hc . y);


 bvec2 lvl3x = bvec2(lvl2x . y &&(Dh . y && Dh . x)&& Fh . z, lvl2w . y &&(Bv . w && Bv . x)&& Hv . z);
 bvec2 lvl3y = bvec2(lvl2x . x &&(Fh . x && Fh . y)&& Dh . w, lvl2y . y &&(Bv . z && Bv . y)&& Hv . w);
 bvec2 lvl3z = bvec2(lvl2z . x &&(Fh . w && Fh . z)&& Dh . x, lvl2y . x &&(Hv . y && Hv . z)&& Bv . x);
 bvec2 lvl3w = bvec2(lvl2z . y &&(Dh . z && Dh . w)&& Fh . y, lvl2w . x &&(Hv . x && Hv . w)&& Bv . y);


 bvec2 lvl4x = bvec2((Dc . x && Dh . y && Eh . x && Eh . y && Fh . x && Fh . y)&&(D0c . z && D0h . w),(Bc . x && Bv . w && Ev . x && Ev . w && Hv . x && Hv . w)&&(B0c . z && B0v . y));
 bvec2 lvl4y = bvec2((Fc . y && Fh . x && Eh . y && Eh . x && Dh . y && Dh . x)&&(F0c . w && F0h . z),(Bc . y && Bv . z && Ev . y && Ev . z && Hv . y && Hv . z)&&(B0c . w && B0v . x));
 bvec2 lvl4z = bvec2((Fc . z && Fh . w && Eh . z && Eh . w && Dh . z && Dh . w)&&(F0c . x && F0h . y),(Hc . z && Hv . y && Ev . z && Ev . y && Bv . z && Bv . y)&&(H0c . x && H0v . w));
 bvec2 lvl4w = bvec2((Dc . w && Dh . z && Eh . w && Eh . z && Fh . w && Fh . z)&&(D0c . y && D0h . x),(Hc . w && Hv . x && Ev . w && Ev . x && Bv . w && Bv . x)&&(H0c . y && H0v . z));


 bvec2 lvl5x = bvec2(lvl4x . x &&(F0h . x && F0h . y)&&(D1h . z && D1h . w), lvl4y . x &&(D0h . y && D0h . x)&&(F1h . w && F1h . z));
 bvec2 lvl5y = bvec2(lvl4y . y &&(H0v . y && H0v . z)&&(B1v . w && B1v . x), lvl4z . y &&(B0v . z && B0v . y)&&(H1v . x && H1v . w));
 bvec2 lvl5z = bvec2(lvl4w . x &&(F0h . w && F0h . z)&&(D1h . y && D1h . x), lvl4z . x &&(D0h . z && D0h . w)&&(F1h . x && F1h . y));
 bvec2 lvl5w = bvec2(lvl4x . y &&(H0v . x && H0v . w)&&(B1v . z && B1v . y), lvl4w . y &&(B0v . w && B0v . x)&&(H1v . y && H1v . z));


 bvec2 lvl6x = bvec2(lvl5x . y &&(D1h . y && D1h . x), lvl5w . y &&(B1v . w && B1v . x));
 bvec2 lvl6y = bvec2(lvl5x . x &&(F1h . x && F1h . y), lvl5y . y &&(B1v . z && B1v . y));
 bvec2 lvl6z = bvec2(lvl5z . x &&(F1h . w && F1h . z), lvl5y . x &&(H1v . y && H1v . z));
 bvec2 lvl6w = bvec2(lvl5z . y &&(D1h . z && D1h . w), lvl5w . x &&(H1v . x && H1v . w));




 vec4 crn;
 crn . x =(lvl1x && Eo . x || lvl3x . x && Eo . y || lvl4x . x && Do . x || lvl6x . x && Fo . y)? 5 :(lvl1x || lvl3x . y && ! Eo . w || lvl4x . y && ! Bo . x || lvl6x . y && ! Ho . w)? 1 : lvl3x . x ? 3 : lvl3x . y ? 7 : lvl4x . x ? 2 : lvl4x . y ? 6 : lvl6x . x ? 4 : lvl6x . y ? 8 : 0;
 crn . y =(lvl1y && Eo . y || lvl3y . x && Eo . x || lvl4y . x && Fo . y || lvl6y . x && Do . x)? 5 :(lvl1y || lvl3y . y && ! Eo . z || lvl4y . y && ! Bo . y || lvl6y . y && ! Ho . z)? 3 : lvl3y . x ? 1 : lvl3y . y ? 7 : lvl4y . x ? 4 : lvl4y . y ? 6 : lvl6y . x ? 2 : lvl6y . y ? 8 : 0;
 crn . z =(lvl1z && Eo . z || lvl3z . x && Eo . w || lvl4z . x && Fo . z || lvl6z . x && Do . w)? 7 :(lvl1z || lvl3z . y && ! Eo . y || lvl4z . y && ! Ho . z || lvl6z . y && ! Bo . y)? 3 : lvl3z . x ? 1 : lvl3z . y ? 5 : lvl4z . x ? 4 : lvl4z . y ? 8 : lvl6z . x ? 2 : lvl6z . y ? 6 : 0;
 crn . w =(lvl1w && Eo . w || lvl3w . x && Eo . z || lvl4w . x && Do . w || lvl6w . x && Fo . z)? 7 :(lvl1w || lvl3w . y && ! Eo . x || lvl4w . y && ! Ho . w || lvl6w . y && ! Bo . x)? 1 : lvl3w . x ? 3 : lvl3w . y ? 5 : lvl4w . x ? 2 : lvl4w . y ? 8 : lvl6w . x ? 4 : lvl6w . y ? 6 : 0;

 vec4 mid;
 mid . x =(lvl2x . x && Eo . x || lvl2x . y && Eo . y || lvl5x . x && Do . x || lvl5x . y && Fo . y)? 5 : lvl2x . x ? 1 : lvl2x . y ? 3 : lvl5x . x ? 2 : lvl5x . y ? 4 :(Ec . x && Dc . z && Ec . y && Fc . w)?(Eo . x ? Eo . y ? 5 : 3 : 1): 0;
 mid . y =(lvl2y . x && ! Eo . y || lvl2y . y && ! Eo . z || lvl5y . x && ! Bo . y || lvl5y . y && ! Ho . z)? 3 : lvl2y . x ? 5 : lvl2y . y ? 7 : lvl5y . x ? 6 : lvl5y . y ? 8 :(Ec . y && Bc . w && Ec . z && Hc . x)?(! Eo . y ? ! Eo . z ? 3 : 7 : 5): 0;
 mid . z =(lvl2z . x && Eo . w || lvl2z . y && Eo . z || lvl5z . x && Do . w || lvl5z . y && Fo . z)? 7 : lvl2z . x ? 1 : lvl2z . y ? 3 : lvl5z . x ? 2 : lvl5z . y ? 4 :(Ec . z && Fc . x && Ec . w && Dc . y)?(Eo . z ? Eo . w ? 7 : 1 : 3): 0;
 mid . w =(lvl2w . x && ! Eo . x || lvl2w . y && ! Eo . w || lvl5w . x && ! Bo . x || lvl5w . y && ! Ho . w)? 1 : lvl2w . x ? 5 : lvl2w . y ? 7 : lvl5w . x ? 6 : lvl5w . y ? 8 :(Ec . w && Hc . y && Ec . x && Bc . z)?(! Eo . w ? ! Eo . x ? 1 : 5 : 7): 0;



 FragColor =(crn + 9 * mid)/ 80;

}
