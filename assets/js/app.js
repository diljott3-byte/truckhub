'use strict';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const cfg=window.TRUCK_HUB_CONFIG||{};
const trucks=window.TRUCKS||[];
const money=n=>new Intl.NumberFormat('en-CA',{style:'currency',currency:cfg.currency||'CAD',maximumFractionDigits:0}).format(Number(n)||0);
const number=n=>new Intl.NumberFormat('en-CA').format(Number(n)||0);
const payment=(principal,annualRate,months)=>{const r=annualRate/1200;if(principal<=0||months<=0)return 0;return r===0?principal/months:principal*r/(1-Math.pow(1+r,-months))};
const params=new URLSearchParams(location.search);

// Canonical: avoid inventing a domain; use the deployed origin automatically.
const canonical=$('#canonical-url');
if(canonical&&/^https?:/.test(location.protocol)) canonical.href=location.origin+location.pathname+(document.body.dataset.page==='truck'&&params.get('id')?`?id=${encodeURIComponent(params.get('id'))}`:'');

// Header + navigation.
const header=$('#site-header');
const onScroll=()=>header?.classList.toggle('scrolled',scrollY>12);
onScroll();addEventListener('scroll',onScroll,{passive:true});
const menu=$('#mobile-menu');
const menuToggle=$('.menu-toggle');
menuToggle?.addEventListener('click',()=>{menu?.showModal();menuToggle.setAttribute('aria-expanded','true')});
menu?.addEventListener('close',()=>menuToggle?.setAttribute('aria-expanded','false'));
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog')?.close()));
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}));

// Reveal motion.
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
if('IntersectionObserver'in window&&!reduce.matches){document.documentElement.classList.add('js-motion');const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(el=>{if(!el.classList.contains('visible'))io.observe(el)})}

// Config-driven real contact points. Empty values stay visibly honest.
function normalizedPhone(v=''){return String(v).replace(/[^\d+]/g,'')}
function whatsappLink(message='Hello Truck Hub, I have a truck enquiry.') {const w=String(cfg.whatsapp||'').replace(/\D/g,'');return w?`https://wa.me/${w}?text=${encodeURIComponent(message)}`:''}
function contactSummary(){const parts=[];if(cfg.phone)parts.push(`Phone: ${cfg.phone}`);if(cfg.email)parts.push(`Email: ${cfg.email}`);if(cfg.location)parts.push(`Location: ${cfg.location}`);return parts.length?parts.join(' · '):'Phone, email and location can be added in assets/js/config.js.'}
$$('[data-contact-summary]').forEach(el=>el.textContent=contactSummary());
$$('[data-contact-details]').forEach(dl=>{const dds=$$('dd',dl);if(dds[0])dds[0].textContent=cfg.phone||'To be added';if(dds[1])dds[1].textContent=cfg.email||'To be added';if(dds[2])dds[2].textContent=cfg.location||'To be added'});
$$('[data-contact-actions]').forEach(box=>{const links=[];if(cfg.phone)links.push(`<a href="tel:${normalizedPhone(cfg.phone)}">Call ↗</a>`);if(cfg.whatsapp)links.push(`<a href="${whatsappLink()}" target="_blank" rel="noopener">WhatsApp ↗</a>`);if(cfg.email)links.push(`<a href="mailto:${encodeURIComponent(cfg.email)}">Email ↗</a>`);box.innerHTML=links.length?links.join(''):'<span class="sample-note">Add contact details in config.js to activate Call, WhatsApp and Email.</span>'});
$$('[data-socials]').forEach(box=>{const links=[];if(cfg.instagram)links.push(`<a href="${cfg.instagram}" target="_blank" rel="noopener">Instagram</a>`);if(cfg.facebook)links.push(`<a href="${cfg.facebook}" target="_blank" rel="noopener">Facebook</a>`);box.innerHTML=links.join('')});

// Hero video controls and lightweight desktop magnetic interaction.
const heroVideo=$('[data-hero-video]'), videoToggle=$('.video-toggle');
if(heroVideo&&reduce.matches) heroVideo.pause();
videoToggle?.addEventListener('click',()=>{if(heroVideo.paused){heroVideo.play().catch(()=>{});videoToggle.textContent='Ⅱ';videoToggle.setAttribute('aria-label','Pause hero video');videoToggle.setAttribute('aria-pressed','false')}else{heroVideo.pause();videoToggle.textContent='▶';videoToggle.setAttribute('aria-label','Play hero video');videoToggle.setAttribute('aria-pressed','true')}});
if(matchMedia('(pointer:fine)').matches&&!reduce.matches){$$('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.08,y=(e.clientY-r.top-r.height/2)*.08;el.style.transform=`translate(${x}px,${y}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')})}

// Statistic counters.
if(!reduce.matches&&'IntersectionObserver'in window){const counterObs=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=Number(el.dataset.count);let start=0;const t0=performance.now(),dur=700;const tick=t=>{const p=Math.min(1,(t-t0)/dur);el.textContent=Math.round(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);counterObs.unobserve(el)}),{threshold:.5});$$('[data-count]').forEach(el=>counterObs.observe(el))}else{$$('[data-count]').forEach(el=>el.textContent=el.dataset.count)}

function statusClass(status){return status.toLowerCase().replace(/\s+/g,'-')}
function card(t,{compact=false}={}){const est=payment(t.price*.8,cfg.defaultRate||7.9,60);return `<article class="truck-card"><a class="truck-image-link" href="truck.html?id=${encodeURIComponent(t.id)}" aria-label="View ${t.year} ${t.make} ${t.model}"><img src="assets/images/${t.image}.webp" srcset="assets/images/${t.image}-small.webp 640w, assets/images/${t.image}.webp 1600w" sizes="(max-width:700px) 50vw, 25vw" width="1600" height="1100" alt="Representative ${t.make} ${t.model} commercial truck" loading="lazy"><span class="status-badge ${statusClass(t.status)}">${t.status}</span><span class="stock-label">${t.id}</span></a><div class="truck-card-body"><div class="truck-meta"><span>${t.year} / ${t.type}</span><span>${t.location}</span></div><h3>${t.make.toUpperCase()} ${t.model.toUpperCase()}</h3><div class="specs"><span>${number(t.mileage)} km</span><span>${t.transmission}</span><span>${t.engine}</span><span>${t.hp} hp</span></div><div class="card-bottom"><span class="price">${money(t.price)} <small>CAD</small></span><a class="card-arrow" href="truck.html?id=${encodeURIComponent(t.id)}" aria-label="Open ${t.id}">↗</a></div><p class="estimate">Est. ${money(est)}/mo · 20% down · ${cfg.defaultRate||7.9}% · 60 mo.</p></div></article>`}

// Homepage inventory surfaces.
const featured=$('#featured-trucks');if(featured)featured.innerHTML=trucks.filter(t=>t.featured&&t.status!=='Sold').slice(0,4).map(t=>card(t)).join('');
const sold=$('#sold-trucks');if(sold)sold.innerHTML=trucks.filter(t=>t.status==='Sold').slice(0,3).map(t=>`<a class="sold-mini" href="truck.html?id=${encodeURIComponent(t.id)}"><img src="assets/images/${t.image}-small.webp" alt=""><span><strong>${t.year} ${t.make} ${t.model}</strong><br>${t.id} · ${number(t.mileage)} km</span><b>SOLD</b></a>`).join('');

// Inventory search + filters.
if($('#inventory-grid')){
  const fields=['make','model','year','transmission','price','mileage'];let activeStatus=params.get('status')||'';
  if(params.get('make'))$('#filter-make').value=params.get('make');
  if(params.get('model'))$('#filter-model').value=params.get('model');
  if(params.get('year'))$('#filter-year').value=params.get('year');
  $$('[data-status]').forEach(b=>{b.classList.toggle('active',b.dataset.status===activeStatus);b.addEventListener('click',()=>{activeStatus=b.dataset.status;$$('[data-status]').forEach(x=>x.classList.toggle('active',x===b));renderInventory()})});
  function renderInventory(){
    const q=$('#search').value.toLowerCase().trim();
    let list=trucks.filter(t=>{
      const hay=`${t.year} ${t.make} ${t.model} ${t.id} ${t.engine} ${t.status}`.toLowerCase();
      if(q&&!hay.includes(q))return false;if(activeStatus&&t.status!==activeStatus)return false;
      return fields.every(k=>{const el=$('#filter-'+k),v=el?.value||'';if(!v)return true;if(k==='price'||k==='mileage')return t[k]<=Number(v);return String(t[k])===v})
    });
    const sort=$('#sort').value;
    list.sort((a,b)=>sort==='newest'?b.year-a.year:sort==='price-low'?a.price-b.price:sort==='price-high'?b.price-a.price:sort==='mileage'?a.mileage-b.mileage:(b.featured-a.featured)||(a.status==='Sold')-(b.status==='Sold'));
    $('#inventory-grid').innerHTML=list.map(t=>card(t,{compact:true})).join('');$('#result-count').textContent=`${list.length} truck${list.length===1?'':'s'} shown`;$('#empty').hidden=!!list.length;
    const count=fields.filter(k=>$('#filter-'+k)?.value).length+(activeStatus?1:0);$('#filter-count').textContent=count;
  }
  $('#search').addEventListener('input',renderInventory);$('#sort').addEventListener('change',renderInventory);$('#open-filter').addEventListener('click',()=>$('#filters').showModal());$('#apply-filters').addEventListener('click',()=>{renderInventory();$('#filters').close()});$('#clear-filters').addEventListener('click',()=>{fields.forEach(k=>{const el=$('#filter-'+k);if(el)el.value=''});$('#search').value='';$('#sort').value='featured';activeStatus='';$$('[data-status]').forEach(b=>b.classList.toggle('active',!b.dataset.status));renderInventory()});renderInventory();
}

// Finance calculator with range/number sync and payment split visual.
if($('#calculator')){
  const rangePairs=['price','down','trade'];
  const requestedPrice=Number(params.get('price'));if(requestedPrice>0){$('#price').value=Math.min(Number($('#price').max),requestedPrice);$('#price-number').value=requestedPrice}
  const sync=(key,fromRange=true)=>{const range=$('#'+key),num=$('#'+key+'-number');if(fromRange)num.value=range.value;else range.value=Math.max(Number(range.min),Math.min(Number(range.max),Number(num.value)||0));const val=Number(range.value),min=Number(range.min),max=Number(range.max),pct=((val-min)/(max-min))*100;range.style.background=`linear-gradient(90deg,var(--red) ${pct}%,var(--soft) ${pct}%)`};
  rangePairs.forEach(k=>{const r=$('#'+k),n=$('#'+k+'-number');r.addEventListener('input',()=>{sync(k,true);calculate()});n.addEventListener('input',()=>{sync(k,false);calculate()});sync(k,true)});
  ['rate','term'].forEach(k=>$('#'+k).addEventListener('input',calculate));
  function calculate(){const p=Number($('#price-number').value),d=Number($('#down-number').value),t=Number($('#trade-number').value),r=Number($('#rate').value),n=Number($('#term').value);const valid=[p,d,t,r,n].every(Number.isFinite)&&p>0&&d>=0&&t>=0&&r>=0&&n>0&&d+t<=p;$('#calc-error').textContent=valid?'':'Down payment plus trade-in cannot exceed the truck price.';if(!valid)return;const financed=p-d-t,mo=payment(financed,r,n),loan=mo*n,interest=Math.max(0,loan-financed),bi=mo*12/26;$('#price-output').textContent=money(p);$('#down-output').textContent=money(d);$('#trade-output').textContent=money(t);$('#monthly').textContent=money(mo);$('#biweekly').textContent=money(bi);$('#principal').textContent=money(financed);$('#interest').textContent=money(interest);$('#loan-total').textContent=money(loan);$('#cash-total').textContent=money(d+t);const pp=loan?Math.max(0,Math.min(100,financed/loan*100)):100;$('#principal-bar').style.width=`${pp}%`;const truck=params.get('truck')||'';$('#finance-enquire').href=`contact.html?topic=Financing&truck=${encodeURIComponent(truck)}&estimate=${encodeURIComponent(`${money(mo)}/month on ${money(p)} price, ${money(d)} down, ${money(t)} trade, ${r}%, ${n} months`)}`}
  calculate();
}

// Dynamic truck detail page.
if($('#truck-page')){
  const id=params.get('id')||trucks[0]?.id,t=trucks.find(x=>x.id===id);
  if(!t){$('#truck-page').innerHTML='<div class="empty-state"><h1>TRUCK NOT FOUND.</h1><p>The stock number is unavailable.</p><a class="button red" href="inventory.html">Back to inventory</a></div>'}
  else{
    document.title=`${t.year} ${t.make} ${t.model} ${t.id} | Truck Hub Canada`;
    const desc=`View sample specifications, price and payment estimate for ${t.year} ${t.make} ${t.model} stock ${t.id}.`;$('meta[name="description"]')?.setAttribute('content',desc);
    const est=payment(t.price*.8,cfg.defaultRate||7.9,60),disabled=t.status==='Sold'?' aria-disabled="true" tabindex="-1"':'';
    $('#truck-page').innerHTML=`<div class="truck-page-layout"><div class="truck-gallery"><div class="truck-gallery-main"><span class="status-badge ${statusClass(t.status)}">${t.status}</span><img id="truck-main-image" src="assets/images/${t.image}.webp" alt="Representative ${t.make} ${t.model} commercial truck"></div><div class="thumb-row"><button class="thumb active" data-crop="center" aria-label="Full truck view"><img src="assets/images/${t.image}-small.webp" alt=""></button><button class="thumb" data-crop="right" aria-label="Cab detail crop"><img src="assets/images/${t.image}-small.webp" alt=""></button><button class="thumb" data-crop="left" aria-label="Chassis detail crop"><img src="assets/images/${t.image}-small.webp" alt=""></button></div><p class="sample-note">Sample gallery using a representative source photo. Replace these slots with real vehicle photos when inventory is loaded.</p></div><div class="truck-page-copy"><span class="eyebrow">${t.id} / ${t.status.toUpperCase()}</span><h1>${t.year} ${t.make.toUpperCase()}<br><em>${t.model.toUpperCase()}</em></h1><div class="truck-page-price">${money(t.price)} CAD</div><p class="truck-page-note">Illustrative sample listing · Availability, condition, taxes and fees must be confirmed.</p><dl class="spec-grid">${[['Year',t.year],['Mileage',`${number(t.mileage)} km`],['Engine',t.engine],['Power',`${t.hp} hp`],['Transmission',t.transmission],['Sleeper',t.sleeper],['Axle',t.axle],['Stock',t.id]].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl><p>Estimated payment: <strong>${money(est)}/month</strong> with 20% down, ${cfg.defaultRate||7.9}% and 60 months.</p><div class="truck-cta-stack"><a class="button red" href="contact.html?truck=${encodeURIComponent(`${t.year} ${t.make} ${t.model} / ${t.id}`)}"${disabled}>Request info ↗</a><a class="button dark" href="finance.html?price=${t.price}&truck=${encodeURIComponent(`${t.make} ${t.model} / ${t.id}`)}">Finance estimate ↗</a><a class="button outline" href="contact.html?topic=Trade-in&truck=${encodeURIComponent(t.id)}">Trade-in enquiry</a></div><div class="share-row"><span>${t.location} · ${t.type}</span><button id="share-truck">Share truck</button></div></div></div>`;
    const main=$('#truck-main-image');$$('.thumb').forEach(b=>b.addEventListener('click',()=>{$$('.thumb').forEach(x=>x.classList.toggle('active',x===b));main.style.objectFit=b.dataset.crop==='center'?'contain':'cover';main.style.transform=b.dataset.crop==='center'?'none':'scale(1.18)';main.style.objectPosition=b.dataset.crop==='right'?'75% center':b.dataset.crop==='left'?'25% center':'center'}));
    $('#share-truck')?.addEventListener('click',async()=>{const data={title:document.title,text:`${t.year} ${t.make} ${t.model} – ${money(t.price)} CAD`,url:location.href};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(location.href);$('#share-truck').textContent='Link copied'}}catch{}});
    const ld=document.createElement('script');ld.type='application/ld+json';ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Vehicle','name':`${t.year} ${t.make} ${t.model}`,'vehicleIdentificationNumber':t.id,'modelDate':String(t.year),'manufacturer':{'@type':'Organization','name':t.make},'mileageFromOdometer':{'@type':'QuantitativeValue','value':t.mileage,'unitCode':'KMT'},'vehicleTransmission':t.transmission,'offers':{'@type':'Offer','price':t.price,'priceCurrency':'CAD','availability':t.status==='Available'?'https://schema.org/InStock':'https://schema.org/OutOfStock'}});document.head.appendChild(ld);
    const related=$('#related-trucks');if(related)related.innerHTML=trucks.filter(x=>x.id!==t.id&&x.status!=='Sold').slice(0,3).map(x=>card(x)).join('');
  }
}

// Prefill enquiries from query parameters.
if($('#enquiry-truck')&&params.get('truck'))$('#enquiry-truck').value=params.get('truck');
if($('#enquiry-topic')&&params.get('topic')){const v=params.get('topic').toLowerCase();const opt=[...$('#enquiry-topic').options].find(o=>o.value.toLowerCase()===v);if(opt)$('#enquiry-topic').value=opt.value}
if(params.get('estimate')&&$('.contact-form textarea[name="message"]'))$('.contact-form textarea[name="message"]').value=`Finance estimate: ${params.get('estimate')}`;

// Static-host form delivery: try Netlify-compatible POST, then provide configured fallbacks.
function encodeForm(fd){return [...fd].map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')}
function buildMessage(fd){return [...fd].filter(([k])=>k!=='form-name'&&k!=='bot-field').map(([k,v])=>`${k.replace(/-/g,' ').replace(/^./,c=>c.toUpperCase())}: ${v}`).join('\n')}
$$('.enquiry-form').forEach(form=>form.addEventListener('submit',async e=>{
  e.preventDefault();const fd=new FormData(form),result=$('.form-result',form),message=buildMessage(fd);result.innerHTML='<p class="sample-note">Sending…</p>';
  let sent=false;
  if(/^https?:/.test(location.protocol)&&!location.hostname.includes('github.io')){try{const body=encodeForm(fd);const r=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});sent=r.ok}catch{sent=false}}
  if(sent){result.innerHTML='<p><strong>Enquiry submitted.</strong> The host accepted the form.</p>';form.reset();return}
  const actions=[];if(cfg.email)actions.push(`<a class="button outline" href="mailto:${encodeURIComponent(cfg.email)}?subject=${encodeURIComponent('Truck Hub enquiry')}&body=${encodeURIComponent(message)}">Open email</a>`);const wa=whatsappLink(message);if(wa)actions.push(`<a class="button outline" href="${wa}" target="_blank" rel="noopener">Open WhatsApp</a>`);
  result.innerHTML=`<p><strong>Form delivery is not active on this host.</strong> Your enquiry is prepared below.</p><textarea readonly rows="8" aria-label="Prepared enquiry">${message.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</textarea><div class="fallback-actions"><button class="button outline" type="button" data-copy-enquiry>Copy enquiry</button>${actions.join('')}</div>`;
  $('[data-copy-enquiry]',result)?.addEventListener('click',async ev=>{try{await navigator.clipboard.writeText(message);ev.currentTarget.textContent='Copied'}catch{const ta=$('textarea',result);ta.select();ev.currentTarget.textContent='Select and copy'}})
}));

// Legal notices.
$$('[data-legal]').forEach(b=>b.addEventListener('click',()=>{const type=b.dataset.legal;$('#legal-content').innerHTML=type==='privacy'?'<span class="eyebrow">LEGAL</span><h2>PRIVACY</h2><p>This static build does not include analytics or tracking by default. Contact forms are prepared for host-provided form handling. Add the business privacy policy, contact details, retention practices and any analytics disclosures before public launch.</p>':'<span class="eyebrow">LEGAL</span><h2>TERMS</h2><p>Inventory, prices, photos, specifications and finance calculations in this demonstration are illustrative. They are not offers or approvals. Replace demonstration data with verified dealership information and approved legal terms before public launch.</p>';$('#legal').showModal()}));
