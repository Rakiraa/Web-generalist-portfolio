// Clock field generator — ported from the Figma storyboard build (same geometry, same rules).
// Geometry is authored on a 24px design lattice; the canvas renderer scales it to the live clock pitch.
/* eslint-disable */
// ===== Clock field v3 — two fields (full 66×20, compact 33×11), dense weather, scaled rendering =====
// Geometry is authored in design px on a 24px lattice; render(g,k) scales it to the live clock size (pitch = 24k).
let NX=66,NY=20,W=1584,H=482;
const P=24,L=11,DR=11.5,D2R=Math.PI/180,CX=792,CY=241;
function setField(nx,ny){NX=nx;NY=ny;W=nx*P;H=ny*P+2}
const FULL=()=>NX>=66;
const X=i=>12+P*i,Y=j=>13+P*j;
const cl=(v,a,b)=>v<a?a:v>b?b:v;
const hs=(i,j,s)=>{const h=Math.sin(i*127.1+j*311.7+s*74.7)*43758.5453;return h-Math.floor(h)};
const ns=(x,y,s)=>{const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),a=hs(xi,yi,s),b=hs(xi+1,yi,s),c=hs(xi,yi+1,s),d=hs(xi+1,yi+1,s);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
const f=v=>Math.round(v*10)/10;
const REST=135,IDLE=[215,330];
const field=(a1=REST,a2=REST,ro='s')=>{const g=[];for(let j=0;j<NY;j++)for(let i=0;i<NX;i++)g.push({i,j,x:X(i),y:Y(j),a1,a2,ro,lit:0});return g};
const at=(g,i,j)=>(i>=0&&j>=0&&i<NX&&j<NY)?g[j*NX+i]:null;
const tng=(fn,x,y)=>Math.atan2(fn(x,y+1)-fn(x,y-1),fn(x+1,y)-fn(x-1,y))/D2R+90;
function draw(g,segs,ro='p'){
 const D=new Map(),add=(i,j,a)=>{const k=j*NX+i;if(!at(g,i,j))return;if(!D.has(k))D.set(k,[]);D.get(k).push(a)};
 for(const [i1,j1,i2,j2] of segs){const di=Math.sign(i2-i1),dj=Math.sign(j2-j1),n=Math.max(Math.abs(i2-i1),Math.abs(j2-j1)),a=Math.atan2(dj,di)/D2R;
  for(let s=0;s<n;s++){const p=i1+di*s,q=j1+dj*s;add(p,q,a);add(p+di,q+dj,a+180)}}
 for(const [k,ds] of D){const c=g[k];let A=ds[0],B=ds[1]??ds[0];
  if(ds.length>2){let best=-1;for(let m=0;m<ds.length;m++)for(let n=m+1;n<ds.length;n++){const d=Math.abs(((ds[m]-ds[n])%360+540)%360-180);if(d>best){best=d;A=ds[m];B=ds[n]}}}
  c.a1=A;c.a2=B;c.ro=ro}
}
const rect=(i0,j0,i1,j1)=>[[i0,j0,i1,j0],[i1,j0,i1,j1],[i1,j1,i0,j1],[i0,j1,i0,j0]];
function contour(g,sdf,ro='p',skip){for(const c of g){const d=sdf(c.x,c.y);if(Math.abs(d)<12&&!(skip&&skip(c))){const t=tng(sdf,c.x,c.y);c.a1=t;c.a2=t+180;c.ro=ro}}}
const sdCirc=(cx,cy,r)=>(x,y)=>Math.hypot(x-cx,y-cy)-r;
const TPL=[[-96,0,40],[-24,-24,64],[56,-8,48],[112,0,32]];
const cloud=(x,b,s)=>({b,s,c:TPL.map(([dx,dy,r])=>[x+dx*s,b+dy*s,r*s]),x0:x-136*s,x1:x+144*s,y0:b-88*s});
const sdCloud=k=>(x,y)=>{let e=1e9;for(const c of k.c)e=Math.min(e,Math.hypot(x-c[0],y-c[1])-c[2]);return Math.max(e,y-k.b)};
function sun(g,cx,cy,r,rays,r0,r1,skip,ro='p'){
 contour(g,sdCirc(cx,cy,r),ro,skip);
 for(const c of g){const d=Math.hypot(c.x-cx,c.y-cy);if(d<r0||d>r1||(skip&&skip(c)))continue;const a=Math.atan2(c.y-cy,c.x-cx)/D2R;
  const k=Math.round(a/(360/rays))*(360/rays);if(Math.abs(Math.sin((a-k)*D2R))*d<8){c.a1=k;c.a2=k+180;c.ro=ro}}
}
// clouds: outline in `ro`, body hands lie flat in `body`
function cloudOn(g,k,ro='p',body='s'){const s=sdCloud(k);for(const c of g)if(s(c.x,c.y)<=-12){c.a1=0;c.a2=180;c.ro=body};contour(g,s,ro);return s}

// --- weather focal pictograms: authored around (CX,CY), scaled by s, offset by (ox,oy) in whole clocks
const LB=()=>NY-2; // last live row (bottom margin)
const WX={
 clear:(g,ox=0,oy=0,s=1)=>{sun(g,CX+ox,CY+oy,84*s,12,124*s,204*s)},
 night:(g,ox=0,oy=0,s=1)=>{const mx=CX+ox,my=CY+oy,m=(x,y)=>Math.max(Math.hypot(x-mx+16*s,y-my)-104*s,-(Math.hypot(x-mx-38*s,y-my+40*s)-86*s));contour(g,m,'p')},
 partly:(g,ox=0,oy=0,s=1)=>{const T=(x,y)=>[CX+(x-CX)*s+ox,CY+(y-CY)*s+oy];const [kx,kb]=T(864,336),[sx,sy]=T(688,184);const k=cloud(kx,kb,1.5*s),sd=sdCloud(k);sun(g,sx,sy,72*s,12,104*s,164*s,c=>sd(c.x,c.y)<12);cloudOn(g,k)},
 overcast:(g,ox=0,oy=0,s=1)=>{const T=(x,y)=>[CX+(x-CX)*s+ox,CY+(y-CY)*s+oy];const [bx,bb]=T(936,228),[fx,fb]=T(744,340);const b=cloud(bx,bb,1.05*s),fr=cloud(fx,fb,1.55*s),sf=sdCloud(fr),sb=sdCloud(b);
  for(const c of g)if(sb(c.x,c.y)<=-12&&sf(c.x,c.y)>12){c.a1=0;c.a2=180;c.ro='s'}contour(g,sb,'p',c=>sf(c.x,c.y)<12);cloudOn(g,fr)},
 garoa:(g,ox=0,oy=0,s=1)=>{const k=cloud(CX+ox,CY+(248-CY)*s+oy,1.55*s);cloudOn(g,k);for(const c of g)if(c.y>k.b+16&&c.j<=LB()&&c.x>k.x0+48*s&&c.x<k.x1-48*s&&((c.i+2*c.j)%3===0)&&hs(c.i,c.j,4)>.25){c.a1=c.a2=90;c.ro='p'}},
 rain:(g,ox=0,oy=0,s=1)=>{const k=cloud(CX+ox,CY+(248-CY)*s+oy,1.55*s);cloudOn(g,k);const segs=[];const j0=Math.round((k.b+24-13)/P);
  for(let i=Math.ceil((k.x0+40*s-12)/P);i<=Math.floor((k.x1-40*s-12)/P);i+=2){const o=Math.floor(hs(i,1,9)*3);for(let j=j0+o;j+2<=LB();j+=4)segs.push([i,j,i,j+2])}draw(g,segs)},
 storm:(g,ox=0,oy=0,s=1)=>{const k=cloud(CX+(808-CX)*s+ox-16*s,CY+(232-CY)*s+oy,1.55*s);cloudOn(g,k);const ci=Math.round((CX+(808-CX)*s+ox-12)/P),cj=Math.round((k.b-13)/P)+1;
  if(s>=.75)draw(g,[[ci+1,cj,ci-1,cj+2],[ci-1,cj+2,ci+2,cj+2],[ci+2,cj+2,ci-1,cj+5],[ci-1,cj+5,ci-1,cj+7]]);
  else draw(g,[[ci+1,cj,ci,cj+1],[ci,cj+1,ci+1,cj+1],[ci+1,cj+1,ci,cj+2],[ci,cj+2,ci,cj+3]]);
  const r1=Math.round(7*s),r2=Math.round(5*s),segs=[];for(const i of [ci-r1,ci-r2,ci+r2,ci+r1])for(let j=cj+(i%2);j+2<=LB();j+=4)segs.push([i,j,i,j+2]);draw(g,segs)},
 fog:(g,ox=0,oy=0,s=1)=>{const di=ox/P,dj=oy/P,segs=[];const F=s>=.75?[[6,20,44],[8,15,40],[10,24,50],[12,17,36],[12,40,47],[14,22,45]]:[[6,18,30],[8,15,27],[10,20,32],[12,16,25]];
  F.forEach(([j,a,b])=>segs.push([a+di,j+dj,b+di,j+dj]));draw(g,segs)}
};

// --- secondary layer: smaller elements placed along the layout in border-strong-01 ('s'); they never enter the focal box (+2 clocks)
// positions are fractions (u, v) of the live area, so the same list serves both fields; anything that would touch the focal drops out
const SEC={
 clear:{arcs:2,sparkles:[[.42,.2,2],[.55,.62,1],[.66,.3,1],[.74,.82,2],[.83,.18,1],[.9,.55,2],[.97,.9,1],[.5,.95,1],[.36,.75,1],[.62,.05,1],[.78,.45,1],[.48,.42,1],[.88,.85,1],[.7,.98,1],[.95,.25,1],[.58,.85,2]]},
 night:{stars:true,streaks:[[.42,.8,.72],[.58,.9,.94]]},
 partly:{clouds:[[.5,.42,.6],[.66,.92,.75],[.8,.3,.5],[.95,.66,.55],[.38,1,.5],[.62,.1,.5],[.86,.98,.6],[.97,.12,.45],[.72,.58,.55]]},
 overcast:{clouds:[[.46,.52,.75],[.6,.26,.6],[.73,.74,.85],[.86,.36,.65],[.97,.82,.55],[.52,1,.5],[.36,1,.45]]},
 garoa:{clouds:[[.58,.3,.55],[.86,.22,.45]],drizzle:true},
 rain:{clouds:[[.6,.18,.5],[.88,.26,.42]],rain:3},
 storm:{clouds:[[.72,.24,.7]],bolt:true,rain:4},
 fog:{bands:true}
};
function secondary(g,k,fb,s){
 const spec=SEC[k],t=field(REST,REST,'_'),xL=X(1),xR=X(NX-2),yT=Y(1),yB=Y(LB());
 const U=u=>xL+u*(xR-xL),V=v=>yT+v*(yB-yT);
 const box={x0:X(fb.i0)-12,x1:X(fb.i1+2)+12,y0:Y(fb.j0)-12,y1:Y(fb.j1+1)+12};
 const hit=(x0,y0,x1,y1)=>x0<box.x1&&x1>box.x0&&y0<box.y1&&y1>box.y0||x0<xL-12||x1>xR+12||y0<yT-12||y1>yB+12;
 const cs=FULL()?1:.75,kept=[];
 for(const [u,v,sc] of spec.clouds||[]){const k2=cloud(U(u),V(v),Math.max(.5,sc*cs));if(hit(k2.x0,k2.y0,k2.x1,k2.b))continue;cloudOn(t,k2,'s','q');kept.push(k2)}
 const inCloud=c=>kept.some(k2=>sdCloud(k2)(c.x,c.y)<16||(c.x>k2.x0-12&&c.x<k2.x1+12&&c.y<k2.b+12));
 if(spec.bolt)for(const k2 of kept){const ci=Math.round((k2.x0+k2.x1)/2/P-.5),cj=Math.round((k2.b-13)/P)+1;draw(t,[[ci+1,cj,ci,cj+1],[ci,cj+1,ci+1,cj+1],[ci+1,cj+1,ci,cj+2],[ci,cj+2,ci,cj+3]],'s')}
 if(spec.rain){const segs=[];for(let i=1;i<=NX-2;i++){if(i%spec.rain)continue;const o=Math.floor(hs(i,2,9)*5);for(let j=1+o;j+2<=LB();j+=5)segs.push([i,j,i,j+2])}
  const tmp=field(REST,REST,'_');draw(tmp,segs,'s');for(const c of tmp)if(c.ro!=='_'&&!inCloud(c)&&t[c.j*NX+c.i].ro==='_')Object.assign(t[c.j*NX+c.i],{a1:c.a1,a2:c.a2,ro:'s'})}
 if(spec.drizzle)for(const c of t)if(c.ro==='_'&&!inCloud(c)&&c.j>=1&&c.j<=LB()&&(c.i+2*c.j)%4===0&&hs(c.i,c.j,6)>(kept.some(k2=>c.x>k2.x0&&c.x<k2.x1&&c.y>k2.b&&c.y<k2.b+120)?.3:.72)){c.a1=c.a2=90;c.ro='s'}
 if(spec.arcs){const cx=(X(fb.i0)+X(fb.i1))/2,cy=(Y(fb.j0)+Y(fb.j1))/2,r0=(X(fb.i1)-X(fb.i0))/2,st=FULL()?96:72;for(let n=1;n<=spec.arcs;n++)contour(t,sdCirc(cx,cy,r0+st*n),'s')}
 // sparkles: a faint lit dial with four short rays (size 1 or 2 clocks)
 if(spec.sparkles)for(const [u,v,z] of spec.sparkles){const ci=Math.round((U(u)-12)/P),cj=Math.round((V(v)-13)/P),zz=FULL()?z:1;
  if(ci-zz<1||ci+zz>NX-2||cj-zz<1||cj+zz>LB())continue;if(ci+zz>=fb.i0-1&&ci-zz<=fb.i1+2&&cj+zz>=fb.j0-1&&cj-zz<=fb.j1+1)continue;
  const c0=at(t,ci,cj);c0.lit=2;c0.a1=c0.a2=270;c0.ro='s';
  for(const [di,dj,a] of [[0,-1,270],[0,1,90],[-1,0,180],[1,0,0]]){if(zz===1){const c=at(t,ci+di,cj+dj);c.a1=c.a2=a;c.ro='s'}else draw(t,[[ci+di,cj+dj,ci+di*zz,cj+dj*zz]],'s')}}
  if(spec.streaks)for(const [u0,v,u1] of spec.streaks){const j=Math.round((V(v)-13)/P),i0=Math.round((U(u0)-12)/P),i1=Math.round((U(u1)-12)/P);draw(t,[[i0,j,i1,j]],'s')}
 if(spec.stars)for(const c of t){if(c.ro!=='_')continue;if(c.i<1||c.i>NX-2||c.j<1||c.j>LB())continue;if(hs(c.i,c.j,7)>.972){c.lit=1;c.a1=c.a2=270;c.ro='p'}else if(hs(c.i,c.j,13)>.9){c.lit=2;c.a1=c.a2=270;c.ro='s'}}
 if(spec.bands){const segs=[];for(let j=fb.j0;j<=LB();j+=2){let i=1+Math.floor(hs(j,3,5)*4);while(i<NX-2){const len=4+Math.floor(hs(i,j,8)*10),gap=2+Math.floor(hs(i,j,9)*4);segs.push([i,j,Math.min(NX-2,i+len),j]);i+=len+gap}}draw(t,segs,'s')}
 // mask: nothing inside the focal box (+2 clocks right, +1 row below) or the margins
 for(const c of t){if(c.ro==='_')continue;if(c.i>=fb.i0-1&&c.i<=fb.i1+2&&c.j>=fb.j0-1&&c.j<=fb.j1+1)continue;if(c.i<1||c.i>NX-2||c.j<1||c.j>LB())continue;const d=g[c.j*NX+c.i];d.a1=c.a1;d.a2=c.a2;d.ro=c.ro;d.lit=c.lit}
}
// weather: rest hands go quiet, the secondary layer fills the layout, the focal hangs from the top-left margin
function weather(g,k,o={}){
 const s=o.s??(FULL()?1:.5);
 const p=field();WX[k](p,0,0,s);let i0=1e9,j0=1e9,i1=-1,j1=-1;for(const c of p)if(c.ro==='p'&&!c.lit){i0=Math.min(i0,c.i);j0=Math.min(j0,c.j);i1=Math.max(i1,c.i);j1=Math.max(j1,c.j)}
 const di=1-i0,dj=1-j0,fb={i0:1,j0:1,i1:i1+di,j1:j1+dj};
 for(const c of g)c.ro='q';
 if(o.dense!==false)secondary(g,k,fb,s);
 WX[k](g,di*P,dj*P,s);return {offset:[di,dj],focal:fb};
}

// --- wind (unchanged composition; compact quiet zone ends after the readout)
const sdSeg=(ax,ay,bx,by)=>(x,y)=>{const vx=bx-ax,vy=by-ay,t=cl(((x-ax)*vx+(y-ay)*vy)/(vx*vx+vy*vy),0,1);return Math.hypot(x-ax-vx*t,y-ay-vy*t)};
function line(g,ax,ay,bx,by,ro='p'){const s=sdSeg(ax,ay,bx,by),a=Math.atan2(by-ay,bx-ax)/D2R;for(const c of g)if(s(c.x,c.y)<12){c.a1=a;c.a2=a+180;c.ro=ro}}
const COL=k=>1+4*k;
const SEG4={a:[0,0,2,0],b:[2,0,2,1],c:[2,1,2,2],d:[0,2,2,2],e:[0,1,0,2],f:[0,0,0,1],g:[0,1,2,1]};
const UNIT={k:{w:2,s:[[0,0,0,2],[1,1,2,0],[1,1,2,2]]},m:{w:2,s:[[0,1,0,2],[0,1,2,1],[2,1,2,2],[1,1,1,2]]},'/':{w:2,s:[[0,2,2,0]]},h:{w:2,s:[[0,0,0,2],[0,1,2,1],[2,1,2,2]]}};
const LET={N:{w:2,s:[[0,2,0,0],[0,0,2,2],[2,2,2,0]]},E:{w:2,s:[[2,0,0,0],[0,0,0,2],[0,2,2,2],[0,1,2,1]]},S:{w:2,s:[[2,0,0,0],[0,0,0,1],[0,1,2,1],[2,1,2,2],[2,2,0,2]]},W:{w:2,s:[[0,0,0,2],[0,2,1,1],[1,1,2,2],[2,2,2,0]]}};
const POINTS=['N','NE','E','SE','S','SW','W','NW'];
const DIG=['abcdef','bc','abged','abgcd','fgbc','afgcd','afgedc','abc','abcdefg','abcdfg'];
function wind(g,bearingFrom,kmh=12){
 const t0=bearingFrom+90,co=Math.cos(t0*D2R),si=Math.sin(t0*D2R);
 const ang=(x,y)=>{const u=x*co+y*si,v=-x*si+y*co;return t0+20*Math.sin(2*Math.PI*u/440+v/220)+8*(ns(x/260,y/260,5)-.5)};
 const QZ=FULL()?[24,11]:[21,NY];
 const A=COL(0),B=COL(2),r1=1,r2=7,box={x0:-1,x1:X(QZ[0])+12,y0:-1,y1:Y(QZ[1])+12};
 const inBox=(x,y)=>x>box.x0&&x<box.x1&&y>box.y0&&y<box.y1;
 const DS=72,DT=36,G=new Map(),kk=(x,y)=>Math.floor(x/DS)+','+Math.floor(y/DS);
 const near=(x,y)=>{let m=1e9;const gx=Math.floor(x/DS),gy=Math.floor(y/DS);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const arr=G.get((gx+a)+','+(gy+b));if(arr)for(const p of arr){const d=Math.hypot(p[0]-x,p[1]-y);if(d<m)m=d}}return m};
 for(let y=12;y<H;y+=24)for(let x=12;x<W;x+=24){if(inBox(x,y)||near(x,y)<DS)continue;
  const run=dir=>{const o=[];let px=x,py=y;for(let k=0;k<400;k++){const a=ang(px,py);px+=dir*8*Math.cos(a*D2R);py+=dir*8*Math.sin(a*D2R);if(px<0||px>W||py<0||py>H||inBox(px,py)||near(px,py)<DT)break;o.push([px,py])}return o};
  const pts=[...run(-1).reverse(),[x,y],...run(1)];if(pts.length<12)continue;
  for(const p of pts){const k=kk(p[0],p[1]);if(!G.has(k))G.set(k,[]);G.get(k).push(p)}}
 for(const c of g){const a=ang(c.x,c.y);c.a1=a;c.a2=a+180;c.ro=(!inBox(c.x,c.y)&&near(c.x,c.y)<12)?'s':'q'}
 const cI=A+2,cJ=r1+2,CXc=X(cI),CYc=Y(cJ);
 contour(g,sdCirc(CXc,CYc,29),'p');
 for(let k=0;k<4;k++){const a=k*90-90,ca=Math.cos(a*D2R),sa=Math.sin(a*D2R);line(g,CXc+ca*44,CYc+sa*44,CXc+ca*52,CYc+sa*52)}
 const c0=at(g,cI,cJ);c0.a1=c0.a2=bearingFrom-90;c0.ro='p';
 const pt=POINTS[Math.round((((bearingFrom%360)+360)%360)/45)%8];
 const text=(str,F,x,y,ro='p')=>{const ls=[];for(const ch of str){if(ch===' '){x+=2;continue}for(const [a,b,c,e] of F[ch].s)ls.push([x+a,y+b,x+c,y+e]);x+=F[ch].w+1}draw(g,ls,ro);return x};
 text(pt,LET,B,r1+1);
 const on=[],off=[];String(Math.min(99,Math.round(kmh))).padStart(2,' ').split('').forEach((d,n)=>{for(const s in SEG4){const [a,b,c,e]=SEG4[s];((d!==' '&&DIG[+d].includes(s))?on:off).push([A+n*3+a,r2+b,A+n*3+c,r2+e])}});
 draw(g,off,'g');draw(g,on,'p');
 text('km/h',UNIT,B,r2);
 return {point:pt,compass:[cI,cJ]};
}

// --- time, centred. Full field: outlined segments, 44 × 16 clocks. Compact field: single-line segments, 25 × 9 clocks, colon as two lit dials.
const SEG={a:[2,0,6,1],g:[2,7,6,8],d:[2,14,6,15],f:[0,2,1,6],b:[7,2,8,6],e:[0,9,1,13],c:[7,9,8,13]};
const SEG2={a:[1,0,3,0],b:[4,1,4,3],c:[4,5,4,7],d:[1,8,3,8],e:[0,5,0,7],f:[0,1,0,3],g:[1,4,3,4]};
function time(g,hhmm){
 const ds=hhmm.replace(':','').split(''),on=[],off=[];
 if(FULL()){const i0=Math.floor((NX-44)/2),j0=Math.floor((NY-16)/2),xs=[0,10,25,35];
  ds.forEach((d,n)=>{for(const s in SEG){const [a,b,c,e]=SEG[s];(DIG[+d].includes(s)?on:off).push(...rect(i0+xs[n]+a,j0+b,i0+xs[n]+c,j0+e))}});
  on.push(...rect(i0+21,j0+4,i0+22,j0+5),...rect(i0+21,j0+10,i0+22,j0+11));draw(g,off,'g');draw(g,on,'p');return {i0,j0}}
 const i0=Math.floor((NX-25)/2),j0=Math.floor((NY-9)/2),xs=[0,6,14,20];
 ds.forEach((d,n)=>{for(const s in SEG2){const [a,b,c,e]=SEG2[s];(DIG[+d].includes(s)?on:off).push([i0+xs[n]+a,j0+b,i0+xs[n]+c,j0+e])}});
 draw(g,off,'g');draw(g,on,'p');for(const r of [3,5]){const c=at(g,i0+12,j0+r);c.lit=1;c.a1=c.a2=270;c.ro='p'}
 return {i0,j0};
}
function state(name,o={}){
 if(name==='idle')return field(IDLE[0],IDLE[1],'s');
 const g=field();
 if(name==='weather')weather(g,o.wx||'partly',o);
 if(name==='wind')wind(g,o.from??140,o.kmh??12);
 if(name==='time')time(g,o.hhmm||'14:27');
 return g;
}
const bez=(x1,y1,x2,y2)=>t=>{let a=0,b=1,m=t;for(let k=0;k<30;k++){m=(a+b)/2;const u=1-m,x=3*u*u*m*x1+3*u*m*m*x2+m*m*m;if(x<t)a=m;else b=m}const u=1-m;return 3*u*u*m*y1+3*u*m*m*y2+m*m*m};
const EASE=bez(.4,.14,.3,1),DUR=1600,STAG=600;
const cw=(a,b)=>{let d=((b-a)%360+360)%360;if(d<30)d+=360;return d};
function tween(F,T,t,stag){return F.map((c,k)=>{const d=T[k],p=cl((t*(DUR+STAG)-stag(c)*STAG)/DUR,0,1),e=EASE(p);
 return {...c,a1:c.a1+cw(c.a1,d.a1)*e,a2:c.a2+(cw(c.a2,d.a2)+360)*e,ro:p<.5?c.ro:d.ro,lit:p<.5?c.lit:d.lit}})}
const radial=(px,py)=>{const m=Math.hypot(Math.max(px,W-px),Math.max(py,H-py));return c=>Math.hypot(c.x-px,c.y-py)/m};
const along=th=>{const dx=Math.cos(th*D2R),dy=Math.sin(th*D2R);const pr=c=>c.x*dx+c.y*dy;const lo=Math.min(0,W*dx,H*dy,W*dx+H*dy),hi=Math.max(0,W*dx,H*dy,W*dx+H*dy);return c=>(pr(c)-lo)/(hi-lo)};
const ltr=c=>c.i/(NX-1),ttb=c=>c.j/(NY-1);
function trail(g,pts){
 const cells=[];for(const [x,y] of pts){const i=Math.round((x-12)/P),j=Math.round((y-13)/P),l=cells[cells.length-1];
  if(l&&l[0]===i&&l[1]===j)continue;if(l){let [a,b]=l;while(Math.max(Math.abs(i-a),Math.abs(j-b))>1){a+=Math.sign(i-a);b+=Math.sign(j-b);cells.push([a,b])}}cells.push([i,j])}
 for(let k=1;k<cells.length-1;k++){const a=cells[k-1],c=cells[k+1];if(Math.abs(a[0]-c[0])===1&&Math.abs(a[1]-c[1])===1){cells.splice(k,1)}}
 const n=cells.length;cells.forEach(([i,j],k)=>{const c=at(g,i,j);if(!c)return;const pv=cells[k-1],nx=cells[k+1],ds=[];
  if(pv)ds.push(Math.atan2(pv[1]-j,pv[0]-i)/D2R);if(nx)ds.push(Math.atan2(nx[1]-j,nx[0]-i)/D2R);c.a1=ds[0];c.a2=ds[1]??ds[0];
  const age=(n-1-k)/Math.max(1,n-1);c.ro=age<.34?'t1':age<.67?'t2':'t3'});
}
// --- render at clock pitch 24k: coordinates, hands and dials scale; strokes stay 1px
const ring=(x,y,r)=>`M${f(x-r)} ${f(y)}a${r} ${r} 0 1 0 ${f(2*r)} 0a${r} ${r} 0 1 0 ${f(-2*r)} 0`;
function render(g,k=1,dy=0){
 const Q={dial:'',lit:'',lits:'',q:'',s:'',g:'',p:'',t1:'',t2:'',t3:''};
 const seg=(x,y,a)=>`M${f(x)} ${f(y)}L${f(x+L*k*Math.cos(a*D2R))} ${f(y+L*k*Math.sin(a*D2R))}`;
 for(const c of g){const x=c.x*k,y=c.y*k+dy;if(c.lit===1)Q.lit+=ring(x,y,DR*k);else if(c.lit===2)Q.lits+=ring(x,y,DR*k);else Q.dial+=ring(x,y,DR*k);
  const sp=Math.abs((((c.a2-c.a1)%360)+360)%360);Q[c.ro==='_'?'q':c.ro]+=seg(x,y,c.a1)+(sp>1&&sp<359?seg(x,y,c.a2):'')}
 return [{d:Q.dial,role:'dial',w:1,name:'dials'},{d:Q.q,role:'quiet',w:1,name:'hands — quiet'},{d:Q.lits,role:'secondary',w:1,name:'lit dials — faint'},{d:Q.lit,role:'primary',w:1,name:'lit dials'},{d:Q.s,role:'secondary',w:1,name:'hands — secondary / rest'},{d:Q.g,role:'secondary',w:1,name:'hands — unlit segments'},{d:Q.p,role:'primary',w:1,name:'hands — drawing'},
  {d:Q.t3,role:'trail',w:1,op:.3,name:'trail — tail'},{d:Q.t2,role:'trail',w:1,op:.6,name:'trail — mid'},{d:Q.t1,role:'trail',w:1,op:1,name:'trail — head'}];
}

export { setField, field, state, weather, wind, time, trail, X, Y, P, L, DR, D2R, IDLE, REST, NX, NY, W, H, FULL, radial, along, ltr, ttb, POINTS, EASE, DUR, STAG, cw };
