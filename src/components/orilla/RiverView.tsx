'use client';
import type { EstadoRio } from '@/lib/orilla/replay';
import type { Rumbo, Variante } from '@/lib/orilla/types';

type Props = { estado: EstadoRio; ocultarMapa?: boolean; descripcion: string; variante?: Variante; animando?: boolean };
type Cell = { x: number; y: number; w: number; h: number; c: number; f: number; variante?: Variante };
const W = 1200, H = 675;
const TURN: Record<Rumbo, number> = { norte: -90, este: 0, sur: 90, oeste: 180 };
const DIR: Record<Rumbo, [number, number]> = { norte: [0,-1], este: [1,0], sur: [0,1], oeste: [-1,0] };
const rnd = (a: number, b: number, n = 0) => { const v = Math.sin((a + n * 17) * 127.1 + (b - n * 3) * 311.7) * 43758.5453; return v - Math.floor(v); };

function Water(p: Cell & { shallow?: boolean }) {
  const {x,y,w,h,c,f,shallow} = p;
  return <g>
    <rect x={x} y={y} width={w} height={h} fill={shallow ? 'url(#orilla-shallow)' : 'url(#orilla-water)'} />
    <path d={'M '+(x-8)+' '+(y+h*.28)+' Q '+(x+w*.22)+' '+(y+h*.08)+' '+(x+w*.48)+' '+(y+h*.28)+' T '+(x+w+8)+' '+(y+h*.22)} fill="none" stroke="#baf5ee" strokeWidth={Math.max(2,h*.018)} opacity=".36" />
    <path d={'M '+(x-8)+' '+(y+h*.76)+' Q '+(x+w*.24)+' '+(y+h*.58)+' '+(x+w*.52)+' '+(y+h*.76)+' T '+(x+w+8)+' '+(y+h*.7)} fill="none" stroke="#dcffff" strokeWidth={Math.max(1.5,h*.012)} opacity={.2+rnd(c,f)*.14} />
    {shallow && [0,1,2,3].map(i=><ellipse key={i} cx={x+w*(.16+i*.2+rnd(c+i,f)*.04)} cy={y+h*(.6+rnd(c,f+i,3)*.22)} rx={w*.025} ry={h*.025} fill="#6c9a83" opacity=".5" />)}
  </g>;
}
function Shore({x,y,w,h,c,f}:Cell) {
  return <g>
    <rect x={x} y={y} width={w} height={h} fill="url(#orilla-earth)" />
    <path d={'M '+x+' '+(y+h*(.1+rnd(c,f)*.08))+' Q '+(x+w*.23)+' '+(y-h*.05)+' '+(x+w*.5)+' '+(y+h*.12)+' T '+(x+w)+' '+(y+h*.08)+' L '+(x+w)+' '+(y+h*.36)+' Q '+(x+w*.67)+' '+(y+h*.28)+' '+(x+w*.38)+' '+(y+h*.42)+' T '+x+' '+(y+h*.34)+' Z'} fill="#e0c18a" />
    {[0,1,2,3,4].map(i=>{const bx=x+w*(.5+(i%2?1:-1)*(.04+rnd(c+i,f)*.08));const by=y+h*.92;const tx=bx+(i%2?1:-1)*w*(.12+rnd(i,c,3)*.1);const ty=y+h*(.22+rnd(c+i,f,4)*.26);return <path key={i} d={'M '+bx+' '+by+' Q '+(bx+w*.04)+' '+(ty+h*.2)+' '+tx+' '+ty+' Q '+bx+' '+(ty+h*.28)+' '+bx+' '+by} fill={i%2?'#43864e':'#5b9d53'} stroke="#286043" strokeWidth={Math.max(1.5,h*.012)} />;})}
    {[0,1,2,3,4].map(i=>{const px=x+w*(.08+rnd(c+i,f,5)*.84),py=y+h*(.5+rnd(c,f+i,8)*.4);return <ellipse key={'s'+i} cx={px} cy={py} rx={w*.014} ry={h*.018} fill="#92734c" />;})}
  </g>;
}
function Reeds({x,y,w,h,c,f}:Cell) {
  return <g className="orilla-reeds" style={{transformBox:'fill-box',transformOrigin:'bottom center'}}>{[0,1,2,3,4,5].map(i=>{const bx=x+w*(.14+i*.14),top=y+h*(.12+rnd(c+i,f,4)*.22),lean=(rnd(c,f+i,9)-.5)*w*.1;return <g key={i}><path d={'M '+bx+' '+(y+h*.94)+' Q '+(bx+lean*.5)+' '+(y+h*.52)+' '+(bx+lean)+' '+(top+h*.1)} fill="none" stroke="#397c4f" strokeWidth={Math.max(3,h*.03)} strokeLinecap="round"/><path d={'M '+(bx+lean)+' '+(top+h*.55)+' Q '+(bx+lean*.7)+' '+(top+h*.24)+' '+(bx-w*.09)+' '+(top+h*.34)+' Q '+(bx+lean*.1)+' '+(top+h*.64)+' '+(bx+lean)+' '+(top+h*.55)} fill="#50a05a" stroke="#2c6844" strokeWidth="1.5"/><ellipse cx={bx+lean} cy={top} rx={Math.max(4,w*.018)} ry={Math.max(8,h*.09)} fill="#80542f" stroke="#523d2b" strokeWidth="1.4"/></g>;})}</g>;
}
function Dock({x,y,w,h}:Omit<Cell,'c'|'f'|'variante'>) {
  return <g filter="url(#orilla-shadow)"><path d={'M '+(x+w*.25)+' '+(y+h*.16)+' v '+(h*.7)+' M '+(x+w*.74)+' '+(y+h*.16)+' v '+(h*.7)} stroke="#50351f" strokeWidth={w*.055} strokeLinecap="round"/><path d={'M '+(x+w*.17)+' '+(y+h*.16)+' L '+(x+w*.82)+' '+(y+h*.16)+' L '+(x+w*.76)+' '+(y+h*.88)+' L '+(x+w*.22)+' '+(y+h*.88)+' Z'} fill="#946039" stroke="#4e3828" strokeWidth={Math.max(2,w*.012)}/>{[0,1,2,3,4,5].map(i=><path key={i} d={'M '+(x+w*.2)+' '+(y+h*(.25+i*.1))+' H '+(x+w*.79)} stroke={i%2?'#62452c':'#d6a36a'} strokeWidth={Math.max(2.5,h*.025)}/>)}</g>;
}
function Buoy({x,y,w,h}:Omit<Cell,'c'|'f'|'variante'>) {
  const cx=x+w/2,cy=y+h*.55;return <g><ellipse cx={cx} cy={cy+h*.14} rx={w*.2} ry={h*.07} fill="#073b4f" opacity=".35"/><ellipse cx={cx} cy={cy+h*.02} rx={w*.24} ry={h*.12} fill="none" stroke="#b9f1eb" strokeWidth="4"/><path d={'M '+cx+' '+(cy-h*.24)+' v '+(h*.11)+' C '+(cx-w*.22)+' '+(cy-h*.1)+' '+(cx-w*.18)+' '+(cy+h*.12)+' '+cx+' '+(cy+h*.16)+' C '+(cx+w*.18)+' '+(cy+h*.12)+' '+(cx+w*.22)+' '+(cy-h*.1)+' '+cx+' '+(cy-h*.24)} fill="url(#orilla-buoy)" stroke="#792e2a" strokeWidth="3"/><ellipse cx={cx-w*.07} cy={cy-h*.1} rx={w*.035} ry={h*.065} fill="#ffe3c3" opacity=".8"/></g>;
}
function Fish({x,y,w,h,size=3}:Omit<Cell,'c'|'f'|'variante'> & {size?:number}) {
  const sc=Math.max(.72,Math.min(1.2,.78+(size-1)*.08));return <g transform={'translate('+(x+w*.5)+' '+(y+h*.53)+') scale('+sc+')'}><ellipse cy={h*.07} rx={w*.2} ry={h*.06} fill="#063d50" opacity=".2"/><path d={'M '+(-w*.18)+' 0 Q '+(-w*.02)+' '+(-h*.17)+' '+(w*.13)+' 0 Q '+(-w*.02)+' '+(h*.16)+' '+(-w*.18)+' 0'} fill="#78c5b1" stroke="#28656b" strokeWidth="2.5"/><path d={'M '+(w*.11)+' 0 l '+(w*.13)+' '+(-h*.12)+' l '+(-w*.02)+' '+(h*.23)+' Z'} fill="#4d978e" stroke="#28656b" strokeWidth="2"/><circle cx={w*.075} cy={-h*.018} r={Math.max(2.5,h*.018)} fill="#fff3d6"/></g>;
}
function Beacon({x,y,w,h,level=3}:Omit<Cell,'c'|'f'|'variante'> & {level?:number}) {
  const r=Math.min(w,h)*(.2+Math.min(7,Math.max(1,level))*.025),cx=x+w/2,cy=y+h/2;return <g><circle cx={cx} cy={cy} r={r*2.1} fill="#ffd878" opacity=".14"/><circle cx={cx} cy={cy} r={r} fill="url(#orilla-light)" stroke="#fff1c4" strokeWidth="3"/>{[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return <path key={i} d={'M '+(cx+Math.cos(a)*r*1.35)+' '+(cy+Math.sin(a)*r*1.35)+' L '+(cx+Math.cos(a)*r*1.8)+' '+(cy+Math.sin(a)*r*1.8)} stroke="#ffe7a0" strokeWidth="3" strokeLinecap="round"/>;})}</g>;
}
function ObjectCell({tipo,...p}:Cell & {tipo:string}) {
  if(tipo==='#')return <Shore {...p}/>;
  if(tipo==='x')return <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="#cbb88e"/>;
  if(tipo==='S')return <g><rect x={p.x} y={p.y} width={p.w} height={p.h} fill="#b7a477"/><path d={'M '+p.x+' '+(p.y+p.h*.6)+' q '+(p.w*.25)+' '+(-p.h*.2)+' '+(p.w*.5)+' 0 t '+(p.w*.5)+' 0'} stroke="#e7d1a0" strokeWidth="4" fill="none"/></g>;
  if(tipo==='J')return <g><Water {...p}/><Reeds {...p}/></g>;
  if(tipo==='R')return <g><Water {...p}/><path d={'M '+(p.x+p.w*.1)+' '+(p.y+p.h*.8)+' Q '+(p.x+p.w*.46)+' '+(p.y+p.h*.1)+' '+(p.x+p.w*.87)+' '+(p.y+p.h*.26)} stroke="#553b29" strokeWidth={p.h*.09} strokeLinecap="round" fill="none"/></g>;
  if(tipo==='M')return <g><Water {...p}/><Dock {...p}/></g>;
  if(tipo==='B')return <g><Water {...p}/><Buoy {...p}/></g>;
  if(tipo==='F')return <g><Water {...p}/><Fish {...p} size={p.variante?.tallas?.[p.c+','+p.f]}/></g>;
  if(tipo==='*'){const species=p.variante?.muestras?.[p.c+','+p.f]?.especie;return <g><Water {...p}/><circle cx={p.x+p.w/2} cy={p.y+p.h/2} r={Math.min(p.w,p.h)*.27} fill={species?.toLowerCase().includes('bagre')?'#78b5ae':'#e5b95e'} stroke="#fff0c9" strokeWidth="3"/></g>;}
  if(tipo==='L')return <g><Water {...p}/><Beacon {...p} level={p.variante?.brillo?.[p.c+','+p.f]}/></g>;
  return <Water {...p} shallow={tipo==='~'}/>;
}
function Boat({x,y,w,h,heading,active}:{x:number;y:number;w:number;h:number;heading:Rumbo;active:boolean}) {
  const scale=Math.min(w/190,h/100,1.25);return <g transform={'translate('+x+' '+y+')'}><g className={active?'orilla-boat orilla-boat-active':'orilla-boat'}><g style={{transformBox:'fill-box',transformOrigin:'center',transform:'rotate('+TURN[heading]+'deg)'}}><g transform={'scale('+scale+')'} filter="url(#orilla-shadow)"><ellipse cy="17" rx="85" ry="17" fill="#072c3e" opacity=".35"/><path d="M -83 -1 Q -70 -29 -20 -31 Q 42 -33 84 -2 Q 61 33 -17 32 Q -68 29 -83 -1 Z" fill="url(#orilla-hull)" stroke="#432d20" strokeWidth="5"/><path d="M -68 -3 Q -42 -20 -5 -20 Q 43 -19 67 -2 Q 46 18 -7 19 Q -48 16 -68 -3 Z" fill="#d8b47a" stroke="#6f4b2c" strokeWidth="4"/><path d="M -57 -4 Q -8 -18 45 -6" stroke="#f1d39a" strokeWidth="4" fill="none"/><path d="M -19 -18 v 36 M 17 -17 v 34" stroke="#714927" strokeWidth="8" strokeLinecap="round"/><rect x="-75" y="-9" width="18" height="18" rx="5" fill="#394b4d" stroke="#d5d3c3" strokeWidth="3"/><path d="M -79 0 q -25 -12 -31 -2 q 8 11 31 4" fill="#526d70" stroke="#d2e3d9" strokeWidth="2"/><circle cx="48" cy="-7" r="3" fill="#fff4d4"/></g></g></g>{active&&<g className="orilla-wake" fill="none" stroke="#d8f9f2" strokeWidth="4" opacity=".7"><path d={'M '+(-w*.35)+' '+(-h*.1)+' q '+(-w*.1)+' '+(-h*.08)+' '+(-w*.17)+' 0 M '+(-w*.35)+' '+(h*.1)+' q '+(-w*.1)+' '+(h*.08)+' '+(-w*.17)+' 0'}/></g>}</g>;
}
function Defs(){return <defs>
  <linearGradient id="orilla-water" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#2e9eaa"/><stop offset=".42" stopColor="#126d89"/><stop offset="1" stopColor="#073d61"/></linearGradient>
  <linearGradient id="orilla-shallow" x1="0" y1="0" x2=".9" y2="1"><stop stopColor="#a5e4d8"/><stop offset=".52" stopColor="#4aafb5"/><stop offset="1" stopColor="#1c7188"/></linearGradient>
  <linearGradient id="orilla-earth" x1="0" y1="0" x2=".2" y2="1"><stop stopColor="#876b43"/><stop offset=".45" stopColor="#b58b56"/><stop offset="1" stopColor="#665139"/></linearGradient>
  <linearGradient id="orilla-buoy" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ff9873"/><stop offset=".34" stopColor="#e84c3c"/><stop offset="1" stopColor="#9d2d2c"/></linearGradient>
  <linearGradient id="orilla-hull" x1="0" y1="0" x2=".2" y2="1"><stop stopColor="#e2b878"/><stop offset=".42" stopColor="#96602f"/><stop offset="1" stopColor="#492e20"/></linearGradient>
  <radialGradient id="orilla-light"><stop stopColor="#fff8cb"/><stop offset=".45" stopColor="#ffd46e"/><stop offset="1" stopColor="#d68b36"/></radialGradient>
  <pattern id="orilla-texture" width="96" height="64" patternUnits="userSpaceOnUse"><path d="M 8 18 q 22 -8 42 0 M 50 49 q 16 -6 33 -1" stroke="#d2ffff" strokeWidth="2" fill="none" opacity=".13"/><circle cx="79" cy="14" r="2" fill="#eaffff" opacity=".18"/></pattern>
  <filter id="orilla-shadow" x="-25%" y="-35%" width="150%" height="180%"><feGaussianBlur in="SourceAlpha" stdDeviation="4"/><feOffset dy="5"/><feComponentTransfer><feFuncA type="linear" slope=".28"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="orilla-clip"><rect width={W} height={H} rx="24"/></clipPath>
</defs>;}
export default function RiverView({estado,ocultarMapa=false,descripcion,variante,animando=false}:Props){
  const rows=estado.mapa.length,cols=estado.mapa[0]?.length??1,cw=W/Math.max(1,cols),ch=H/Math.max(1,rows);
  const {c,f,rumbo}=estado.nilo,[dc,df]=DIR[rumbo],ahead=estado.mapa[f+df]?.[c+dc]??'x';
  const aheadForDisplay=ahead==='M'?'.':ahead;
  return <div className="relative isolate overflow-hidden rounded-2xl border border-[#47738a] bg-[#092c43] shadow-[0_18px_48px_-25px_rgba(3,24,38,.82)]">
    <svg viewBox={'0 0 '+W+' '+H} role="img" aria-label={descripcion} data-testid="orilla-rio" className="block h-auto w-full" preserveAspectRatio="xMidYMid meet">
      <style>{'@keyframes corriente{0%{transform:translateX(-2%);opacity:.3}50%{opacity:.65}100%{transform:translateX(2%);opacity:.3}}@keyframes juncos{0%,100%{transform:rotate(-1deg)}50%{transform:rotate(1.8deg)}}@keyframes flota{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}.orilla-current{animation:corriente 11s ease-in-out infinite alternate}.orilla-reeds{animation:juncos 4.5s ease-in-out infinite}.orilla-boat{animation:flota 3.6s ease-in-out infinite}.orilla-boat-active{animation-duration:.8s}.orilla-wake{animation:flota 1.2s ease-in-out infinite}@media(prefers-reduced-motion:reduce){.orilla-current,.orilla-reeds,.orilla-boat,.orilla-wake{animation:none!important;transition:none!important}}'}</style>
      <Defs/><g clipPath="url(#orilla-clip)"><rect width={W} height={H} fill="url(#orilla-water)"/><rect width={W} height={H} fill="url(#orilla-texture)"/>
        <g className="orilla-current" fill="none" stroke="#d7ffff" strokeWidth="5" strokeLinecap="round" opacity=".38"><path d="M -40 160 Q 110 118 250 155 T 520 156 T 810 145 T 1240 158"/><path d="M -20 495 Q 160 455 290 492 T 600 486 T 900 500 T 1230 478"/></g>
        {!ocultarMapa? <><g>{estado.mapa.map((line,row)=>Array.from(line).map((tipo,col)=><ObjectCell key={row+'-'+col} tipo={tipo} x={col*cw} y={row*ch} w={cw} h={ch} c={col} f={row} variante={variante}/>))}</g><Boat x={(c+.5)*cw} y={(f+.5)*ch} w={cw} h={ch} heading={rumbo} active={animando}/></>:<><ObjectCell tipo={aheadForDisplay} x={W*.72} y={H*.19} w={W*.2} h={H*.62} c={c+dc} f={f+df} variante={variante}/><Boat x={W*.5} y={H*.54} w={W*.33} h={H*.44} heading={rumbo} active={animando}/></>}
      </g>
    </svg>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-[#061d2c]/75 via-[#061d2c]/25 to-transparent px-3 pb-3 pt-12"><p className="max-w-[90%] rounded-full border border-white/20 bg-[#0b2638]/85 px-4 py-2 text-center text-xs font-medium text-white shadow-lg backdrop-blur-sm sm:text-sm">{descripcion}</p></div>
    <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-white/20 bg-[#08283e]/75 px-3 py-1 text-[.62rem] font-bold tracking-[.16em] text-[#d9f4e6] shadow-sm backdrop-blur-sm">ORILLA · RÍO VIVO</div>
  </div>;
}
