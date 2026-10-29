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
if(canonical && /^https?:$/.test(location.protocol)) {
  const actualId=params.get('id');
  const path=document.body.dataset.page==='truck' && actualId ? `truck.html?id=${encodeURIComponent(actualId)}` : location.pathname.replace(/^\//,'') || '';
  const url=(cfg.siteUrl||location.origin).replace(/\/$/,'')+'/'+path;
  if(document.body.dataset.page==='truck' && actualId || !canonical.getAttribute('href')) canonical.href=url;
  const ogUrl=$('meta[property="og:url"]');
  if(ogUrl && document.body.dataset.page==='truck' && actualId)ogUrl.setAttribute('content',url);
}

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
function contactEntries(){return [
  ['Phone', cfg.phone, cfg.phone ? `tel:${normalizedPhone(cfg.phone)}` : ''],
  ['Second phone', cfg.secondaryPhone, cfg.secondaryPhone ? `tel:${normalizedPhone(cfg.secondaryPhone)}` : ''],
  ['Email', cfg.email, cfg.email ? `mailto:${cfg.email}` : ''],
  ['Office address', cfg.officeAddress || cfg.location, ''],
  ['Yard address', cfg.yardAddress, '']
].filter(([,value])=>value)}
function contactValue(value,href){const node=document.createElement(href?'a':'span');node.textContent=value;if(href)node.href=href;return node}
$$('[data-contact-summary]').forEach(el=>{el.replaceChildren();contactEntries().forEach(([label,value,href])=>{const row=document.createElement('span');row.className='contact-summary-row';const title=document.createElement('strong');title.textContent=label+': ';row.append(title,contactValue(value,href));el.append(row)})});
$$('[data-contact-details]').forEach(dl=>{dl.replaceChildren();contactEntries().forEach(([label,value,href])=>{const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.append(contactValue(value,href));row.append(dt,dd);dl.append(row)})});
$$('[data-contact-actions]').forEach(box=>{box.replaceChildren();[['Call',cfg.phone],['Call second number',cfg.secondaryPhone]].forEach(([label,value])=>{if(value)box.append(contactValue(label+' ↗',`tel:${normalizedPhone(value)}`))});if(cfg.whatsapp)box.append(contactValue('WhatsApp ↗',whatsappLink()));if(cfg.email)box.append(contactValue('Email ↗',`mailto:${cfg.email}`))});
$$('[data-socials]').forEach(box=>{const links=[];if(cfg.instagram)links.push(`<a href="${cfg.instagram}" target="_blank" rel="noopener">Instagram</a>`);if(cfg.facebook)links.push(`<a href="${cfg.facebook}" target="_blank" rel="noopener">Facebook</a>`);box.innerHTML=links.join('')});

// Hero video controls and lightweight desktop magnetic interaction.
const heroVideo=$('[data-hero-video]'), videoToggle=$('.video-toggle');
if(heroVideo&&reduce.matches) heroVideo.pause();
videoToggle?.addEventListener('click',()=>{if(heroVideo.paused){heroVideo.play().catch(()=>{});videoToggle.textContent='Ⅱ';videoToggle.setAttribute('aria-label','Pause hero video');videoToggle.setAttribute('aria-pressed','false')}else{heroVideo.pause();videoToggle.textContent='▶';videoToggle.setAttribute('aria-label','Play hero video');videoToggle.setAttribute('aria-pressed','true')}});
if(matchMedia('(pointer:fine)').matches&&!reduce.matches){$$('.magnetic').forEach(el=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)*.08,y=(e.clientY-r.top-r.height/2)*.08;el.style.transform=`translate(${x}px,${y}px)`});el.addEventListener('pointerleave',()=>el.style.transform='')})}

// Statistic counters.
if(!reduce.matches&&'IntersectionObserver'in window){const counterObs=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,target=Number(el.dataset.count);let start=0;const t0=performance.now(),dur=700;const tick=t=>{const p=Math.min(1,(t-t0)/dur);el.textContent=Math.round(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);counterObs.unobserve(el)}),{threshold:.5});$$('[data-count]').forEach(el=>counterObs.observe(el))}else{$$('[data-count]').forEach(el=>el.textContent=el.dataset.count)}

function statusClass(status){return status.toLowerCase().replace(/\s+/g,'-')}
const escapeHtml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const titleOf=t=>`${t.year} ${t.make} ${t.model}`;
const priceLabel=t=>Number.isFinite(t.price)&&t.price>0?`${money(t.price)} CAD`:'Contact for price';
function cardSpecs(t){return [t.length?`${t.length} ft length`:null,Number.isFinite(t.reeferHours)?`${number(t.reeferHours)} reefer hrs`:t.axles,t.reeferUnit||t.brakes,t.suspension].filter(Boolean)}
function detailSpecs(t){return [['Year',t.year],['Make',t.make],['Type',t.type],['Length',t.length?`${t.length} ft`:null],['Reefer unit',t.reeferUnit],['Reefer hours',Number.isFinite(t.reeferHours)?number(t.reeferHours):null],['Suspension',t.suspension],['Rims',t.rims],['Aerodynamic skirts',t.skirts],['Axles',t.axles],['Sliding axles',t.slidingAxles],['Brakes',t.brakes],['Tire size',t.tireSize],['GVWR',t.gvwr],['Inspection',t.inspection],['Listing reference',t.id]].filter(([,v])=>v!==undefined&&v!==null&&v!=='')}
function card(t){const photo=t.photos[0];return `<article class="truck-card trailer-card"><a class="truck-image-link" href="truck.html?id=${encodeURIComponent(t.id)}" aria-label="View ${escapeHtml(titleOf(t))}"><img src="${escapeHtml(photo.src)}" style="clip-path:inset(${photo.frameClip||'0'})" width="1024" height="768" alt="${escapeHtml(titleOf(t)+' — '+photo.alt)}" loading="lazy"><span class="status-badge ${statusClass(t.status)}">${escapeHtml(t.status)}</span><span class="stock-label">${escapeHtml(t.id)}</span></a><div class="truck-card-body"><div class="truck-meta"><span>${t.year} / ${escapeHtml(t.type)}</span></div><h3>${escapeHtml(t.make.toUpperCase())}<br>${escapeHtml(t.model.toUpperCase())}</h3><div class="specs">${cardSpecs(t).map(v=>`<span>${escapeHtml(v)}</span>`).join('')}</div><div class="card-bottom"><span class="price">${priceLabel(t)}</span><a class="card-arrow" href="truck.html?id=${encodeURIComponent(t.id)}" aria-label="Open ${escapeHtml(t.id)}">↗</a></div><a class="text-link" href="tel:${normalizedPhone(cfg.phone)}">Call for details ↗</a></div></article>`}

// Homepage and filter choices follow the actual inventory.
$$('[data-inventory-count]').forEach(el=>{el.dataset.count=trucks.length;el.textContent=trucks.length});
$$('[data-make-count]').forEach(el=>{el.dataset.count=new Set(trucks.map(t=>t.make)).size;el.textContent=el.dataset.count});
const featured=$('#featured-trucks');if(featured)featured.innerHTML=trucks.filter(t=>t.featured&&t.status!=='Sold').slice(0,4).map(t=>card(t)).join('');
const quick=$('[data-inventory-makes]');if(quick)quick.innerHTML='<a href="inventory.html">All trailers</a>'+[...new Set(trucks.map(t=>t.make))].map(make=>`<a href="inventory.html?make=${encodeURIComponent(make)}">${escapeHtml(make)}</a>`).join('');
const sold=$('#sold-trucks');if(sold){const soldItems=trucks.filter(t=>t.status==='Sold');sold.closest('section').hidden=!soldItems.length;sold.innerHTML=soldItems.map(t=>card(t)).join('')}

if($('#inventory-grid')){
  const fields=['make','type','year','suspension','price','reeferHours'];let activeStatus=params.get('status')||'';
  ['make','type','year','suspension'].forEach(k=>{const el=$('#filter-'+k);const values=[...new Set(trucks.map(t=>t[k]))].filter(v=>v!==undefined);el.innerHTML='<option value="">All</option>'+values.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');if(params.get(k))el.value=params.get(k)});
  $('#status-chips').innerHTML='<button data-status="" class="active">All</button>'+[...new Set(trucks.map(t=>t.status))].map(v=>`<button data-status="${escapeHtml(v)}">${escapeHtml(v)}</button>`).join('');
  $$('[data-status]').forEach(b=>{b.classList.toggle('active',b.dataset.status===activeStatus);b.setAttribute('aria-pressed',String(b.dataset.status===activeStatus));b.addEventListener('click',()=>{activeStatus=b.dataset.status;$$('[data-status]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderInventory()})});
  function renderInventory(){
    const q=$('#search').value.toLowerCase().trim();
    let list=trucks.filter(t=>{
      const hay=`${titleOf(t)} ${t.id} ${t.type} ${t.reeferUnit||''} ${t.suspension} ${t.status}`.toLowerCase();
      if(q&&!hay.includes(q))return false;if(activeStatus&&t.status!==activeStatus)return false;
      return fields.every(k=>{const v=$('#filter-'+k)?.value||'';if(!v)return true;if(k==='price'||k==='reeferHours')return Number.isFinite(t[k])&&t[k]<=Number(v);return String(t[k])===v})
    });
    const sort=$('#sort').value;
    list.sort((a,b)=>{if(sort==='newest')return b.year-a.year;if(sort==='hours'){if(!Number.isFinite(a.reeferHours))return Number.isFinite(b.reeferHours)?1:0;if(!Number.isFinite(b.reeferHours))return -1;return a.reeferHours-b.reeferHours;}if(sort.startsWith('price-')){if(!Number.isFinite(a.price))return Number.isFinite(b.price)?1:0;if(!Number.isFinite(b.price))return -1;return sort==='price-low'?a.price-b.price:b.price-a.price}return Number(b.featured)-Number(a.featured)});
    $('#inventory-grid').innerHTML=list.map(t=>card(t)).join('');$('#result-count').textContent=`${list.length} trailer${list.length===1?'':'s'} shown`;$('#empty').hidden=!!list.length;
    $('#filter-count').textContent=fields.filter(k=>$('#filter-'+k)?.value).length+(activeStatus?1:0);
  }
  $('#search').addEventListener('input',renderInventory);$('#sort').addEventListener('change',renderInventory);$('#open-filter').addEventListener('click',()=>$('#filters').showModal());$('#apply-filters').addEventListener('click',()=>{renderInventory();$('#filters').close()});$('#clear-filters').addEventListener('click',()=>{fields.forEach(k=>{const el=$('#filter-'+k);if(el)el.value=''});$('#search').value='';$('#sort').value='featured';activeStatus='';$$('[data-status]').forEach(b=>{b.classList.toggle('active',!b.dataset.status);b.setAttribute('aria-pressed',String(!b.dataset.status))});renderInventory()});renderInventory();
}

// Finance calculator: never display an estimate for invalid or out-of-range inputs.
if($('#calculator')){
  const rangePairs=['price','down','trade'];
  const labels={price:'Price',down:'Down payment',trade:'Trade-in value'};
  const requestedPrice=Number(params.get('price'));
  if(Number.isFinite(requestedPrice)&&requestedPrice>0){
    const r=$('#price'), n=$('#price-number');
    const clamped=Math.min(Number(r.max),Math.max(Number(r.min),requestedPrice));
    r.value=String(clamped); n.value=String(clamped);
  }
  function colorRange(key){
    const r=$('#'+key),min=Number(r.min),max=Number(r.max);
    const pct=max===min?0:(Number(r.value)-min)/(max-min)*100;
    r.style.background=`linear-gradient(90deg,var(--red) ${Math.max(0,Math.min(100,pct))}%,var(--soft) ${Math.max(0,Math.min(100,pct))}%)`;
  }
  function setResultEmpty(message){
    $('#calc-error').textContent=message;
    ['price-output','down-output','trade-output','monthly','biweekly','principal','interest','loan-total','cash-total'].forEach(k=>$('#'+k).textContent='—');
    $('#principal-bar').style.width='0%';
    $('#finance-enquire').href='contact.html?topic=Financing';
  }
  function calculate(){
    const values={};
    for(const key of rangePairs){
      const el=$('#'+key+'-number'),val=el.value.trim()===''?NaN:Number(el.value);
      const min=Number($('#'+key).min),max=Number($('#'+key).max);
      if(!Number.isFinite(val)||val<min||val>max){
        setResultEmpty(`${labels[key]} must be between ${money(min)} and ${money(max)}.`);
        return;
      }
      values[key]=val;
    }
    const p=values.price,d=values.down,t=values.trade;
    const rateEl=$('#rate'),r=rateEl.value.trim()===''?NaN:Number(rateEl.value);
    const n=Number($('#term').value);
    if(!Number.isFinite(r)||r<Number(rateEl.min)||r>Number(rateEl.max)){
      setResultEmpty(`Interest rate must be between ${rateEl.min}% and ${rateEl.max}%.`);return;
    }
    if(![24,36,48,60,72,84].includes(n)){setResultEmpty('Select a valid loan term.');return}
    if(d+t>p){setResultEmpty('Down payment plus trade-in cannot exceed the purchase price.');return}
    $('#calc-error').textContent='';
    const financed=p-d-t,mo=payment(financed,r,n),loan=mo*n,interest=Math.max(0,loan-financed),bi=mo*12/26;
    if(![financed,mo,loan,interest,bi].every(Number.isFinite)){setResultEmpty('Please check your estimate inputs.');return}
    $('#price-output').textContent=money(p);$('#down-output').textContent=money(d);$('#trade-output').textContent=money(t);
    $('#monthly').textContent=money(mo);$('#biweekly').textContent=money(bi);$('#principal').textContent=money(financed);
    $('#interest').textContent=money(interest);$('#loan-total').textContent=money(loan);$('#cash-total').textContent=money(d+t);
    $('#principal-bar').style.width=`${loan?Math.max(0,Math.min(100,financed/loan*100)):100}%`;
    const truck=params.get('truck')||'';
    const estimate=`${money(mo)}/month on ${money(p)} price, ${money(d)} down, ${money(t)} trade, ${r}%, ${n} months`;
    $('#finance-enquire').href=`contact.html?topic=Financing&truck=${encodeURIComponent(truck)}&estimate=${encodeURIComponent(estimate)}`;
  }
  rangePairs.forEach(key=>{
    const range=$('#'+key),num=$('#'+key+'-number');
    range.addEventListener('input',()=>{num.value=range.value;colorRange(key);calculate()});
    num.addEventListener('input',()=>{
      const v=Number(num.value),min=Number(range.min),max=Number(range.max);
      if(num.value.trim()!==''&&Number.isFinite(v))range.value=String(Math.min(max,Math.max(min,v)));
      colorRange(key);calculate();
    });
    // Finalize typed values only after editing, without hijacking partial input.
    num.addEventListener('change',()=>{
      const v=num.value.trim()===''?NaN:Number(num.value);
      if(Number.isFinite(v)){num.value=String(Math.min(Number(range.max),Math.max(Number(range.min),v)));range.value=num.value}
      colorRange(key);calculate();
    });
    colorRange(key);
  });
  ['rate','term'].forEach(key=>$('#'+key).addEventListener('input',calculate));
  calculate();
}

// Trailer detail page: genuine individual photos and trailer-specific specifications.
if($('#truck-page')){
 const id=params.get('id')||trucks[0]?.id,t=trucks.find(x=>x.id===id);
 const related=$('#related-trucks');
 if(!t){$('#truck-page').innerHTML='<div class="empty-state"><h1>TRAILER NOT FOUND.</h1><p>This listing is no longer in our inventory.</p><a class="button red" href="inventory.html">Back to inventory</a></div>';if(related)related.closest('section').hidden=true}
 else{
  const title=titleOf(t),desc=`${title}. ${cardSpecs(t).join(', ')}. ${priceLabel(t)}.`;
  document.title=`${title} | Truck Hub Canada`;
  $('meta[name="description"]')?.setAttribute('content',desc);$('meta[property="og:title"]')?.setAttribute('content',title);$('meta[property="og:description"]')?.setAttribute('content',desc);$('meta[property="og:image"]')?.setAttribute('content',new URL(t.photos[0].src,location.href).href);
  const enquiry=`contact.html?truck=${encodeURIComponent(title+' / '+t.id)}`;
  const specs=detailSpecs(t);
  $('#truck-page').innerHTML=`<div class="truck-page-layout"><div class="truck-gallery"><div class="truck-gallery-main"><img id="truck-main-image" src="${t.photos[0].src}" width="1024" height="768" alt="${escapeHtml(title+' — '+t.photos[0].alt)}"></div><div class="gallery-navigation"><button type="button" id="gallery-prev" aria-label="Previous photo">←</button><span id="gallery-caption" aria-live="polite"></span><button type="button" id="gallery-next" aria-label="Next photo">→</button></div><div class="thumb-row">${t.photos.map((p,i)=>`<button type="button" class="thumb ${i===0?'active':''}" data-photo="${i}" aria-label="View photo ${i+1}: ${escapeHtml(p.alt)}" aria-pressed="${i===0}"><img src="${p.src}" style="clip-path:inset(${p.frameClip||'0'})" width="1024" height="768" alt="" loading="lazy"></button>`).join('')}</div><a id="gallery-full" class="text-link" href="${t.photos[0].src}" target="_blank" rel="noopener">Open full photo ↗</a></div><div class="truck-page-copy"><span class="eyebrow">${escapeHtml(t.id)} / ${escapeHtml(t.type.toUpperCase())}</span><h1>${t.year} ${escapeHtml(t.make.toUpperCase())}<br><em>${escapeHtml(t.model.toUpperCase())}</em></h1><div class="truck-page-price">${priceLabel(t)}</div><p class="truck-page-note">Contact our team for current availability, pricing and further details.</p>${t.inspection?`<p class="inspection-note">${escapeHtml(t.inspection)}</p>`:''}<dl class="spec-grid">${specs.map(([k,v])=>`<div><dt>${k}</dt><dd>${escapeHtml(v)}</dd></div>`).join('')}</dl><div class="truck-cta-stack"><a class="button red" href="tel:${normalizedPhone(cfg.phone)}">Call for details ↗</a><a class="button dark" href="${enquiry}">Request info ↗</a><a class="button outline" href="contact.html?topic=Financing&truck=${encodeURIComponent(title+' / '+t.id)}">Ask about financing</a></div><div class="share-row"><span>${t.photos.length} photos</span><button id="share-truck">Share trailer</button></div></div></div>`;
  let current=0;
  function showPhoto(index){current=(index+t.photos.length)%t.photos.length;const p=t.photos[current];$('#truck-main-image').src=p.src;$('#truck-main-image').style.clipPath=`inset(${p.frameClip||'0'})`;$('#truck-main-image').alt=title+' — '+p.alt;$('#gallery-caption').textContent=`${current+1} / ${t.photos.length} · ${p.alt}`;$('#gallery-full').href=p.src;$$('[data-photo]').forEach(b=>{const active=Number(b.dataset.photo)===current;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))})}
  $$('[data-photo]').forEach(b=>b.addEventListener('click',()=>showPhoto(Number(b.dataset.photo))));$('#gallery-prev').addEventListener('click',()=>showPhoto(current-1));$('#gallery-next').addEventListener('click',()=>showPhoto(current+1));showPhoto(0);
  $('#share-truck').addEventListener('click',async()=>{try{if(navigator.share)await navigator.share({title,text:title+' — '+priceLabel(t),url:location.href});else{await navigator.clipboard.writeText(location.href);$('#share-truck').textContent='Link copied'}}catch{}});
  const ld=document.createElement('script');ld.type='application/ld+json';ld.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Product',name:title,sku:t.id,brand:{'@type':'Brand',name:t.make},description:desc,image:t.photos.map(p=>new URL(p.src,location.href).href),additionalProperty:specs.map(([name,value])=>({'@type':'PropertyValue',name,value}))});document.head.appendChild(ld);
  if(related){const items=trucks.filter(x=>x.id!==t.id&&x.status!=='Sold').slice(0,3);related.closest('section').hidden=!items.length;related.innerHTML=items.map(x=>card(x)).join('')}
 }
}

// Prefill enquiries from query parameters.
if($('#enquiry-truck')&&params.get('truck'))$('#enquiry-truck').value=params.get('truck');
if($('#enquiry-topic')&&params.get('topic')){const v=params.get('topic').toLowerCase();const opt=[...$('#enquiry-topic').options].find(o=>o.value.toLowerCase()===v);if(opt)$('#enquiry-topic').value=opt.value}
if(params.get('estimate')&&$('.contact-form textarea[name="message"]'))$('.contact-form textarea[name="message"]').value=`Finance estimate: ${params.get('estimate')}`;

// Enquiry delivery: Netlify must be explicitly configured; otherwise offer manual email/copy options.
function encodeForm(fd){return [...fd].map(([k,v])=>`${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')}
function buildMessage(fd){return [...fd].filter(([k])=>k!=='form-name'&&k!=='bot-field').map(([k,v])=>`${k.replace(/-/g,' ').replace(/^./,c=>c.toUpperCase())}: ${v}`).join('\n')}
$$('.enquiry-form').forEach(form=>form.addEventListener('submit',async e=>{
  e.preventDefault();
  const result=$('.form-result',form),submit=$('[type="submit"]',form);
  if(submit.disabled)return;
  // A static site cannot enforce backend anti-spam or rate limits. Netlify validates the honeypot server-side.
  const fd=new FormData(form),name=String(fd.get('name')||'').trim(),phone=String(fd.get('phone')||'').trim();
  const digits=phone.replace(/\D/g,'');
  const messageField=String(fd.get('message')||'').trim();
  if(fd.get('bot-field')){result.textContent='Please contact our team directly.';return}
  if(name.length<2||name.length>100||digits.length<7||digits.length>15||phone.length>25||messageField.length>3000){
    result.textContent='Please enter your name and a valid telephone number, and keep your message under 3,000 characters.';
    return;
  }
  if(form.classList.contains('contact-form')&&!messageField){result.textContent='Please enter a message before continuing.';return}
  const preferred=String(fd.get('preferred-contact')||'');
  if(preferred==='Email'&&!String(fd.get('email')||'').trim()){
    result.textContent='Please enter an email address if you prefer an email reply.';
    return;
  }
  for(const k of ['name','phone','message']) if(fd.has(k)) fd.set(k,String(fd.get(k)).trim());
  const message=buildMessage(fd);
  const netlifyEnabled=cfg.formProvider==='netlify' && /^https?:$/.test(location.protocol);
  submit.disabled=true;
  if(netlifyEnabled)result.innerHTML='<p class="sample-note">Sending…</p>';
  let sent=false;
  try{
    if(netlifyEnabled){
      const controller=new AbortController();
      const timer=setTimeout(()=>controller.abort(),12000);
      try{
        const response=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:encodeForm(fd),signal:controller.signal});
        sent=response.ok;
      }finally{clearTimeout(timer)}
    }
  }catch{sent=false}
  finally{submit.disabled=false}
  if(sent){result.innerHTML='<p role="status"><strong>Enquiry submitted to our form service.</strong> Thank you for contacting us.</p>';form.reset();return}
  const actions=[];
  if(cfg.email)actions.push(`<a class="button outline" href="mailto:${encodeURIComponent(cfg.email)}?subject=${encodeURIComponent('Truck Hub enquiry')}&body=${encodeURIComponent(message)}">Open email</a>`);
  const wa=whatsappLink(message);if(wa)actions.push(`<a class="button outline" href="${wa}" target="_blank" rel="noopener">Open WhatsApp</a>`);
  const safe=escapeHtml(message);
  result.innerHTML=`<p role="status"><strong>Your enquiry has not been sent automatically.</strong> Please use the email option below or copy your prepared message.</p><textarea readonly rows="8" aria-label="Prepared enquiry">${safe}</textarea><div class="fallback-actions"><button class="button outline" type="button" data-copy-enquiry>Copy enquiry</button>${actions.join('')}</div>`;
  $('[data-copy-enquiry]',result)?.addEventListener('click',async ev=>{try{await navigator.clipboard.writeText(message);ev.currentTarget.textContent='Copied'}catch{const ta=$('textarea',result);ta.select();ev.currentTarget.textContent='Select and copy'}})
}));

// Legal notices.
$$('[data-legal]').forEach(b=>b.addEventListener('click',()=>{const type=b.dataset.legal;$('#legal-content').innerHTML=type==='privacy'?'<span class="eyebrow">LEGAL</span><h2>PRIVACY</h2><p>Contact Truck Hub by email for information about how enquiry details are handled and for privacy-related requests. Do not send sensitive financial documents through this website. The full business privacy policy should be confirmed before using automatic form processing.</p>':'<span class="eyebrow">LEGAL</span><h2>TERMS</h2><p>Contact Truck Hub to confirm current inventory availability, specifications, condition, pricing, taxes and fees. Finance calculations are estimates and are not offers or approvals.</p>';$('#legal').showModal()}));
