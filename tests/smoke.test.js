// End-to-end behaviour test for RevenueOS. No dependencies: run with `node tests/smoke.test.js`.
// It runs the real app code against a tiny React stand-in, clicks real handlers and checks the shared data.
const fs=require('fs'),path=require('path');
const file=process.argv[2]||path.join(__dirname,'..','src','app.js');
let src=fs.readFileSync(file,'utf8');
global.window=global;global.confirm=()=>true;
global.localStorage={_d:{},getItem(k){return this._d[k]||null},setItem(k,v){this._d[k]=v}};
global.location={hash:''};global.addEventListener=global.removeEventListener=()=>{};global.devicePixelRatio=1;
global.document={getElementById:()=>({}),title:'',documentElement:{removeAttribute(){},dataset:{}},addEventListener(){},removeEventListener(){},createElement:()=>({click(){},remove(){},style:{}}),body:{appendChild(){}},elementsFromPoint:()=>[]};
const blobs=[];global.URL={createObjectURL:b=>{blobs.push(b);return'blob:x'}};
global.FormData=class{constructor(o){this.o=o}get(k){return this.o[k]}};global.THREE={};
let store={},cur=null,roots=[];
global.React={createElement:(t,p,...c)=>({t,p:p||{},c:c.flat(Infinity).filter(x=>x!==false&&x!=null)}),
  useState(v){const s=cur.inst,i=cur.i++;if(!(i in s.slots))s.slots[i]={v:typeof v==='function'?v():v};const sl=s.slots[i];return[sl.v,nv=>{sl.v=typeof nv==='function'?nv(sl.v):nv}]},
  useRef(v){const s=cur.inst,i=cur.i++;if(!(i in s.slots))s.slots[i]={current:v===undefined?null:v};return s.slots[i]},
  useEffect(){},useId(){return'u'+(cur.i++)},useMemo:f=>f()};
global.ReactDOM={createRoot:()=>({render:el=>roots.push(el)})};
src+=';globalThis.__x={load,calc,mrrAt,MO,FLAT,PAGES,sum,forecastModel,forecastCases,forecastRates,forecastNet,forecastExportRows}';
(0,eval)(src);
const X=global.__x,AppF=roots[0].t;
function expand(n,p){if(n==null||n===false||typeof n==='string'||typeof n==='number')return n;if(Array.isArray(n))return n.map((x,i)=>expand(x,p+'/'+i));
  if(typeof n.t==='function'){const inst=store[p]||(store[p]={slots:[]}),prev=cur;cur={inst,i:0};let out;try{out=n.t({...n.p,children:n.c})}finally{cur=prev}return expand(out,p+'/c')}
  return{t:n.t,p:n.p,c:n.c.map((x,i)=>expand(x,p+'/'+(x&&x.p&&x.p.key!=null?x.p.key:i)))}}
const render=()=>expand({t:AppF,p:{},c:[]},'root');
const walk=(n,f)=>{if(n==null||typeof n!=='object')return;if(Array.isArray(n)){n.forEach(x=>walk(x,f));return}f(n);(n.c||[]).forEach(x=>walk(x,f))};
const txt=n=>n==null||n===false?'':typeof n==='string'||typeof n==='number'?String(n):Array.isArray(n)?n.map(txt).join(''):(n.c||[]).map(txt).join('');
const find=(tree,pred)=>{const o=[];walk(tree,n=>{if(pred(n))o.push(n)});return o};
const btn=(tree,label)=>find(tree,n=>n.t==='button'&&txt(n).trim()===label);
const D=()=>store.root.slots[0].v,K=()=>X.calc(D()),wait=ms=>new Promise(r=>setTimeout(r,ms));
let fails=0,passes=0;const ok=(c,m)=>{if(c){passes++}else{fails++;console.log('FAIL:',m)}};
const click=(tree,label,i=0)=>{const b=btn(tree,label)[i];if(!b)throw new Error('no button '+label);b.p.onClick({});return render()};
const goPage=(tree,label)=>{
  const aliases={'Command Center':'cc','Revenue':'rev','Customers':'crm','Intelligence':'ins','Operations':'auto','Settings':'st','CRM':'crm','Forecasting':'fc'};
  const target=aliases[label]||X.FLAT.find(p=>p[1]===label)?.[0],group=X.PAGES.find(g=>g[1].some(p=>p[0]===target));
  if(!target||!group)throw new Error('unknown destination '+label);
  const primary=find(tree,n=>n.t==='button'&&n.p.title===group[0])[0];
  if(!primary)throw new Error('no primary nav '+group[0]);
  primary.p.onClick({});tree=render();
  if(D().nav!==target){
    const tab=find(tree,n=>n.t==='button'&&n.p.className==='context-tab'&&txt(n)===group[1].find(p=>p[0]===target)[1])[0];
    if(!tab)throw new Error('no context tab for '+label);
    tab.p.onClick({});tree=render();
  }
  return tree;
};
const submit=(tree,vals)=>{const f=find(tree,n=>n.t==='form'&&n.p.role==='dialog')[0];if(!f)throw new Error('no form');f.p.onSubmit({preventDefault(){},target:vals});return render()};
(async()=>{
  let tree=render();ok(D().nav==='cc'&&txt(tree).includes('Command Center'),'starts on Command Center');
  // 1. every page renders via the six primary destinations and contextual tabs
  for(const[k,l]of X.FLAT){tree=goPage(tree,l);ok(D().nav===k&&txt(tree).length>150,'page '+l)}
  // 1b. deterministic prediction model: independently inspect lengths and scenario ordering.
  for(const months of [6,12,24]){
    const base=X.forecastModel(10000,{g:4,c:1.8,e:1.2},months);
    ok(base.length===months+1,'model emits '+months+' months plus today');
    ok(base[0]===10000,'model starts at current recurring revenue');
    ok(base[months]>base[0],'positive growth compounds over '+months+' months');
    const downside=X.forecastModel(10000,X.forecastCases({g:4,c:1.8,e:1.2}).Bear,months);
    const upside=X.forecastModel(10000,X.forecastCases({g:4,c:1.8,e:1.2}).Bull,months);
    ok(downside[months]<base[months]&&upside[months]>base[months],'bear/base/bull ordering over '+months+' months');
  }
  ok(X.forecastModel(0,{g:5,c:1,e:2},24).every(v=>v===0),'zero starting MRR remains zero');
  ok(X.forecastModel(100,{g:0,c:8,e:0},12)[12]<100,'negative net growth decreases MRR');
  ok(X.forecastModel(100,{g:'junk',c:100,e:-1},6).every(Number.isFinite),'malformed assumptions stay finite');
  ok(Math.abs(X.forecastModel(10000,{g:4,c:1.8,e:1.2},12)[12]-10000*Math.pow(1.034,12))<1,'model matches independent compound-interest calculation');
  ok(X.forecastNet({g:4,c:1.8,e:1.2})===3.4000000000000004||Math.abs(X.forecastNet({g:4,c:1.8,e:1.2})-3.4)<1e-9,'net growth is new plus expansion less churn');
  const exported=X.forecastExportRows([100,101,102],102,{g:3,c:1,e:1},6);
  ok(exported[0].join('|')==='Month|Data type|Historical MRR|Bear MRR|Base MRR|Bull MRR','export declares unambiguous CSV columns');
  ok(exported.filter(row=>row[1]==='Illustrative projection').length===6,'export contains selected future horizon');
  ok(exported.filter(row=>row[1]==='Actual').length===3,'export retains historical rows');
  const currentMonth=new Date().getFullYear()+'-'+String(new Date().getMonth()+1).padStart(2,'0');
  const nextMonth=new Date(new Date().getFullYear(),new Date().getMonth()+1,1);
  const nextMonthStamp=nextMonth.getFullYear()+'-'+String(nextMonth.getMonth()+1).padStart(2,'0');
  ok(exported.filter(row=>row[1]==='Actual').at(-1)[0]===currentMonth,'export uses local reporting calendar for current month');
  ok(exported.find(row=>row[1]==='Illustrative projection')[0]===nextMonthStamp,'future export starts next month, not prior UTC date');

  ok(exported.some(row=>row[0]==='Method'&&row[1].includes('illustrative')),'export discloses method and limitations');
  ok(exported.find(row=>row[0]==='Base')[5]===3,'export rounds the monthly net growth rate to readable precision');


  tree=goPage(tree,'Command Center');
  const pred=btn(tree,'Open Predictions ↗')[0];ok(!!pred,'Command Center provides prominent Predictions shortcut');
  pred.p.onClick({});tree=render();ok(D().nav==='fc','shortcut opens Predictions');
  // 2. sidebar: only six primary destinations, collapse/expand, contextual Revenue tabs
  tree=goPage(tree,'Command Center');
  ok(find(tree,n=>n.t==='button'&&typeof n.p.className==='string'&&n.p.className.includes('nav-primary')).length===6,'six primary destinations');
  let b=find(tree,n=>n.t==='button'&&n.p['aria-label']==='Collapse sidebar')[0];b.p.onClick({});tree=render();ok(D().col===true,'sidebar collapses');
  b=find(tree,n=>n.t==='button'&&n.p['aria-label']==='Expand sidebar')[0];b.p.onClick({});tree=render();ok(D().col===false,'sidebar expands');
  tree=goPage(tree,'Revenue');ok(find(tree,n=>n.t==='button'&&n.p.className==='context-tab').length===6,'Revenue context tabs');
  tree=goPage(tree,'Forecasting');ok(D().nav==='fc','context tab navigates to Forecasting');
  tree=goPage(tree,'Command Center');
  // 3. pipeline: menu move to Won creates customer, payment, MRR and workflow
  tree=goPage(tree,'Pipeline');
  let c0=D().cs.length,m0=K().mrr,r0=(D().runs||[]).length,t0=D().tx.length;
  find(tree,n=>n.t==='select'&&n.p['aria-label']==='Move Vesper Wines')[0].p.onChange({target:{value:'4'}});tree=render();
  ok(D().cs.length===c0+1,'won deal adds customer');ok(K().mrr===m0+1200,'MRR rises by plan price');ok(D().tx.length===t0+1,'first payment recorded');ok((D().runs||[]).length===r0+1,'workflow ran');
  ok(D().cs[D().cs.length-1].notes[0].m.includes('Onboard new customers'),'onboarding note added');ok(D().log[0].m.includes('Deal won'),'audit log entry');
  // 4. pipeline: pointer drag to another stage
  document.elementsFromPoint=()=>[{dataset:{stage:'2'}}];
  const card=find(tree,n=>n.t==='div'&&typeof n.p.className==='string'&&n.p.className.startsWith('deal')&&txt(n).includes('Meridian Textiles')&&n.p.onPointerDown)[0];
  const lane=find(tree,n=>n.t==='div'&&n.p.onPointerMove)[0];
  card.p.onPointerDown({button:0,clientX:100,clientY:100,target:{tagName:'DIV'},pointerId:1,currentTarget:{getBoundingClientRect:()=>({left:60,top:60,width:272}),setPointerCapture(){}}});
  lane.p.onPointerMove({clientX:420,clientY:180});lane.p.onPointerUp({});tree=render();
  ok(D().ds.find(d=>d.name==='Meridian Textiles').stage===2,'drag and drop moves deal');
  // 5. subscriptions: cancel and reactivate change MRR
  tree=goPage(tree,'Subscriptions');m0=K().mrr;r0=(D().runs||[]).length;tree=click(tree,'Cancel');ok(K().mrr<m0,'cancel lowers MRR');ok((D().runs||[]).length===r0+1,'churn workflow ran');
  const gone=D().cs.find(c=>c.ch===11),row=find(tree,n=>n.t==='tr'&&txt(n).includes(gone.name))[0];find(row,n=>n.t==='button'&&txt(n)==='Reactivate')[0].p.onClick({});tree=render();ok(Math.abs(K().mrr-m0)<1,'reactivate restores MRR');
  // 6. transactions: pay invoice, refund, filters, CSV
  tree=goPage(tree,'Transactions');let p0=K().pend.length;tree=click(tree,'Mark paid');ok(K().pend.length===p0-1,'invoice paid');
  const ref0=K().ref.reduce((a,v)=>a+v,0);r0=(D().runs||[]).length;tree=click(tree,'Refund');ok(K().ref.reduce((a,v)=>a+v,0)>ref0,'refund recorded');ok((D().runs||[]).length===r0+1,'refund workflow ran');
  tree=click(tree,'Expenses');ok(txt(tree).includes('records'),'filter chip works');
  tree=click(tree,'Export CSV');await wait(30);ok(blobs.length===1&&(await blobs[0].text()).includes('"Date","Type"'),'CSV export produces a file');
  // 7. retention, insights actions
  tree=goPage(tree,'Retention');let h0=X.sum(D().cs,c=>c.health);tree=click(tree,'Log call');ok(X.sum(D().cs,c=>c.health)>h0,'log call raises health');
  tree=goPage(tree,'Intelligence');m0=K().mrr;const up=btn(tree,'Simulate upgrades')[0];if(up){up.p.onClick({});tree=render();ok(K().mrr>m0,'confirmed local upgrade simulation raises MRR')}
  // 8. marketing and automations
  tree=goPage(tree,'Marketing');tree=click(tree,'Pause');ok(D().mk[0].on===false,'campaign pause');
  tree=goPage(tree,'Automations');const sw=find(tree,n=>n.t==='button'&&n.p.role==='switch')[0];sw.p.onClick({});tree=render();ok(D().auto[0].on===false,'workflow toggle');
  const na=D().auto.length;tree=click(tree,'Delete');ok(D().auto.length===na-1,'workflow delete');
  // 9. forms
  const forms=[['CRM','Add account',{name:'Acme Robotics',contact:'Zed',ind:'Robotics',plan:'1',reg:'EMEA',own:'Maya Chen'},()=>D().cs.some(c=>c.name==='Acme Robotics')],
    ['Pipeline','Add deal',{name:'Zephyr Labs',plan:'2',own:'Dev Patel'},()=>D().ds.some(d=>d.name==='Zephyr Labs')],
    ['Transactions','New invoice',{cid:D().cs[0].id,amt:'1500'},()=>D().tx.some(x=>x.cat==='Invoice'&&x.amt===1500)],
    ['Transactions','Record expense',{cat:'Software',amt:'777'},()=>D().tx.some(x=>x.type==='expense'&&x.amt===777)],
    ['Marketing','New campaign',{name:'Podcast ads',ch:'Events',spend:'4000',leads:'80'},()=>D().mk.some(m=>m.name==='Podcast ads')],
    ['Automations','New workflow',{name:'Notify on refunds',trig:'refund',act:'log'},()=>D().auto.some(a=>a.name==='Notify on refunds')]];
  for(const[pg,opener,vals,chk]of forms){tree=goPage(tree,pg);tree=click(tree,opener);tree=submit(tree,vals);ok(chk(),'form '+opener)}
  // 10. integrations
  tree=goPage(tree,'Integrations');ok(!txt(tree).includes(D().apiKey)&&txt(tree).includes('ros_••••'),'API key is never shown');
  const k0=D().apiKey;tree=click(tree,'Rotate key');ok(D().apiKey!==k0,'rotate key');
  const ih0=D().ih.length;tree=click(tree,'Sync now');await wait(2600);tree=render();ok(D().ih.length===ih0+1&&D().ih[0].ok,'sync writes history');
  tree=click(tree,'Re-authorize');ok(!D().ig.gads.attn,'re-authorize clears attention');
  tree=click(tree,'Connect');ok(!!txt(tree).includes('Authorize'),'connect flow opens');const au=find(tree,n=>n.t==='button'&&txt(n).startsWith('Authorize'))[0];au.p.onClick({});tree=render();
  const cb=find(tree,n=>n.t==='button'&&txt(n).startsWith('Connect '))[0];cb.p.onClick({});tree=render();ok(Object.keys(D().ig).length===6,'service connects');
  // 11. settings; unsupported currency conversion is not shown as an editable dropdown
  tree=goPage(tree,'Settings');
  ok(!txt(tree).includes('Currency USD EUR GBP'),'misleading currency selector removed');
  tree=goPage(tree,'Appearance');tree=click(tree,'Light');ok(D().theme==='light','theme setting');
  tree=goPage(tree,'Audit log');ok(txt(tree).includes('Activity log'),'audit log is accessible');
  tree=goPage(tree,'Team & access');ok(txt(tree).includes('Preview team roles'),'team roles labelled as simulated');
  tree=goPage(tree,'Settings');
  global.confirm=()=>false;const preReset=D().cs.length;tree=click(tree,'Reset sample data');ok(D().cs.length===preReset,'cancelled reset preserves records');
  global.confirm=()=>true;tree=click(tree,'Reset sample data');tree=render();ok(D().cs.length===24,'confirmed reset restores seed data');
  // 12. data invariants
  const d=D(),k=K(),mm=k.mrrS,a5=5,nw=d.cs.filter(c=>c.start>a5&&c.start<=11).reduce((s,c)=>s+X.mrrAt(c,c.start),0),ex=d.cs.filter(c=>c.ch==null&&c.upm!=null&&c.upm>a5&&c.upm>c.start).reduce((s,c)=>s+c.mrr-c.prev,0),cn=d.cs.filter(c=>c.ch!=null&&c.ch>a5).reduce((s,c)=>s+X.mrrAt(c,c.ch-1),0);
  ok(mm[a5]+nw+ex-cn===mm[11],'MRR bridge reconciles');ok(Math.abs(k.cash-(d.cash0+k.prof.reduce((a,v)=>a+v,0)))<1,'cash reconciles');
  console.log(passes+' checks passed, '+fails+' failed');process.exit(fails?1:0)
})().catch(e=>{console.log('ERROR',e.stack);process.exit(1)});
