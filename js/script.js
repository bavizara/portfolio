// Background particle network
(function(){
  const c=document.getElementById('bg'),x=c.getContext('2d');
  let w,h,pts=[],dpr=Math.min(window.devicePixelRatio||1,2);
  const N=()=>Math.min(90,Math.floor(window.innerWidth/18));
  function size(){w=c.width=innerWidth*dpr;h=c.height=innerHeight*dpr;x.setTransform(dpr,0,0,dpr,0,0);pts=Array.from({length:N()},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25}))}
  let mx=-999,my=-999;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY});
  function step(){
    x.clearRect(0,0,innerWidth,innerHeight);
    for(const p of pts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;}
    for(let i=0;i<pts.length;i++){
      const a=pts[i];
      x.fillStyle='rgba(243,217,139,.7)';x.beginPath();x.arc(a.x,a.y,1.2,0,6.283);x.fill();
      for(let j=i+1;j<pts.length;j++){
        const b=pts[j],d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<150){x.strokeStyle='rgba(124,58,237,'+(0.35*(1-d/150))+')';x.lineWidth=.6;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}
      }
      const dm=Math.hypot(a.x-mx,a.y-my);
      if(dm<180){x.strokeStyle='rgba(212,175,55,'+(0.5*(1-dm/180))+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(mx,my);x.stroke();}
    }
    requestAnimationFrame(step);
  }
  size();addEventListener('resize',size);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches) step();
})();

// Cursor glow
(function(){
  const g=document.getElementById('glow');
  addEventListener('mousemove',e=>{g.style.left=e.clientX+'px';g.style.top=e.clientY+'px'});
})();

// Typing role
(function(){
  const roles=['Azure Integration Developer','Microsoft BizTalk Server Engineer','.NET / C# Developer','Enterprise Integration Specialist'];
  const el=document.getElementById('typed');let r=0,i=0,del=false;
  function tick(){
    const word=roles[r];
    el.textContent=del?word.slice(0,i--):word.slice(0,i++);
    let d=del?40:85;
    if(!del&&i>word.length){d=1800;del=true;}
    else if(del&&i<0){del=false;r=(r+1)%roles.length;i=0;d=400;}
    setTimeout(tick,d);
  }
  setTimeout(tick,900);
})();

// Marquee
(function(){
  const items=['Microsoft BizTalk Server','Azure Logic Apps','API Management','Service Bus','BRE & BAM','WCF · SOAP · REST','XML · XSLT · XSD','EDI · Flat File','C# / .NET','Ansible · BTDF','Azure DevOps','Root Cause Analysis'];
  const t=document.getElementById('marquee');
  const html=items.map(s=>'<span>'+s+'</span>').join('');
  t.innerHTML=html+html;
})();

// Reveal + counters + bars + timeline beam
(function(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting)return;
      const el=en.target;
      el.classList.add('in');
      el.querySelectorAll('[data-count]').forEach(countUp);
      el.querySelectorAll('[data-w]').forEach(b=>b.style.width=b.dataset.w+'%');
      io.unobserve(el);
    });
  },{threshold:.18});
  document.querySelectorAll('.reveal,.card,.stat,.job').forEach(el=>io.observe(el));
  // stat counters for stat blocks (reveal target)
  document.querySelectorAll('.stat .num,.stat').forEach(()=>{});
  function countUp(el){
    const target=+el.dataset.count,suf=el.dataset.suffix||'';let n=0;
    const step=()=>{n+=Math.max(1,Math.ceil(target/40));if(n>=target){el.textContent=target+suf;return;}el.textContent=n+suf;requestAnimationFrame(step);};
    step();
  }
  // Animate bars & chips for cards entering view
  const io2=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){e.target.querySelectorAll('[data-w]').forEach(b=>b.style.width=b.dataset.w+'%');e.target.querySelectorAll('.chip').forEach((c,i)=>c.style.transitionDelay=(i*60)+'ms');io2.unobserve(e.target);}
  }),{threshold:.3});
  document.querySelectorAll('.card').forEach(c=>io2.observe(c));
  // timeline beam
  const tl=document.getElementById('timeline'),beam=document.getElementById('beam');
  const io3=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){beam.style.height=tl.offsetHeight*.92+'px';io3.unobserve(tl);}}),{threshold:.1});
  io3.observe(tl);
  document.querySelectorAll('.job').forEach(j=>{const o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){j.classList.add('in');o.disconnect();}}),{threshold:.5});o.observe(j);});
})();

// Nav active + progress
(function(){
  const links=[...document.querySelectorAll('#nav a')];
  const secs=links.map(a=>document.querySelector(a.getAttribute('href')));
  const prog=document.getElementById('progress');
  addEventListener('scroll',()=>{
    const max=document.documentElement.scrollHeight-innerHeight;
    prog.style.width=(scrollY/max*100)+'%';
    let cur=-1;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<innerHeight*.4)cur=i;});
    links.forEach((a,i)=>a.classList.toggle('active',i===cur));
  },{passive:true});
})();

// Hero name, year
document.getElementById('yr').textContent=new Date().getFullYear();
