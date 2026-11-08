(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const STORAGE_KEYS = { user: "construfacil_demo_user", records: "construfacil_demo_records" };
  const pages = ["home", "servicos", "sobre", "prestadores", "orcamento", "agendamento", "historico", "contato"];
  const pageNames = { home: "Início", servicos: "Serviços", sobre: "Sobre nós", prestadores: "Buscar prestadores", orcamento: "Orçamentos", agendamento: "Agendar serviço", historico: "Histórico de serviços", contato: "Mensagens" };
  let toastTimer;
  const sampleProviders = [
    {name:"Carlos Mendes",service:"Pintura residencial",rating: "4,9",initials:"CM",description:"Pintura interna, externa e preparação de paredes."},
    {name:"Mariana Alves",service:"Pisos e revestimentos",rating:"4,8",initials:"MA",description:"Instalação de pisos, azulejos e acabamentos."},
    {name:"Rafael Santos",service:"Gesso e drywall",rating:"4,7",initials:"RS",description:"Forros, divisórias e detalhes em gesso."},
    {name:"Equipe Nova Parede",service:"Papel de parede",rating:"4,8",initials:"NP",description:"Aplicação e acabamento de papel de parede."},
    {name:"João Ferreira",service:"Instalações",rating:"4,6",initials:"JF",description:"Pequenos reparos e instalações residenciais."},
    {name:"Ana Costa",service:"Pintura",rating:"4,9",initials:"AC",description:"Pintura detalhada e acabamento de ambientes."}
  ];

  function readUser(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || "null"); } catch { return null; } }
  function readRecords(){ try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.records) || "[]"); } catch { return []; } }
  function saveRecords(records){ localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records)); }
  function escapeHtml(value){ return String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function initials(name){ return String(name || "Cliente").trim().split(/\s+/).slice(0,2).map(p=>p[0]||"").join("").toUpperCase(); }

  function showToast(message){
    const toast = $("#toast"); toast.textContent = message; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.classList.remove("show"), 3300);
  }
  function showAuth(which="login"){
    $("#authPage").classList.remove("hidden"); $("#dashboardPage").classList.add("hidden");
    pages.slice(1).forEach(p=>{ const el=$("#"+p+"Page"); if(el) el.classList.add("hidden"); });
    setAuthTab(which);
    if ($("#pageHeading")) $("#pageHeading").textContent = "Acesso";
    $$(".nav-link").forEach(b=>b.classList.remove("active"));
  }
  function setAuthTab(which){
    $$(".auth-tab").forEach(b=>b.classList.toggle("selected",b.dataset.auth===which));
    $("#loginForm").classList.toggle("hidden",which!=="login");
    $("#registerForm").classList.toggle("hidden",which!=="cadastro");
  }
  function setUserUI(user){
    const name = user?.name || "cliente";
    $("#headerGreeting").textContent = "Olá, " + name.split(" ")[0];
    $("#topAvatar").textContent = initials(name);
    if ($("#welcomeTitle")) $("#welcomeTitle").textContent = `Olá, ${name.split(" ")[0]}! Vamos tirar seu projeto do papel?`;
  }
  function navigate(page){
    if(!pages.includes(page)) page="home";
    const user=readUser();
    if(!user){showAuth("login");return;}
    $("#authPage").classList.add("hidden");
    pages.forEach(p=>{
      const el = p==="home" ? $("#dashboardPage") : $("#"+p+"Page");
      if(el) el.classList.toggle("hidden",p!==page);
    });
    if ($("#pageHeading")) $("#pageHeading").textContent=pageNames[page];
    $$(".nav-link[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
    $("#siteNav").classList.remove("open");
    if(page==="prestadores") renderProviders($("#providerSearch")?.value||"");
    if(page==="historico") renderHistory();
    if(page==="home") renderRecent();
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function addRecord(type,title,details,date,status="Registrado"){
    const records=readRecords();
    records.unshift({id:Date.now(),type,title,details,date:date||new Date().toISOString().slice(0,10),status,createdAt:new Date().toISOString()});
    saveRecords(records); renderRecent(); renderHistory(); updateStats();
  }
  function formatDate(value){
    if(!value) return "Data não informada";
    const parts=String(value).split("-");
    return parts.length===3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : value;
  }
  function recordMarkup(record){
    const icon=record.type==="Agendamento"?"▦":"▤";
    return `<article class="request-item"><div class="request-symbol">${icon}</div><div class="request-main"><strong>${escapeHtml(record.title)}</strong><p>${escapeHtml(record.details)}</p><span class="status-pill">${escapeHtml(record.status)}</span></div><div class="request-meta">${escapeHtml(record.type)}<br>${escapeHtml(formatDate(record.date))}</div></article>`;
  }
  function renderRecent(){
    const records=readRecords().slice(0,3), box=$("#recentRequests");
    box.innerHTML=records.length?records.map(recordMarkup).join(""):'<div class="empty-state">Você ainda não tem solicitações. Comece pedindo um orçamento.</div>';
  }
  function renderHistory(){
    const filter=$("#historyFilter")?.value||"all";
    const records=readRecords().filter(r=>filter==="all"||r.type===filter);
    $("#historyList").innerHTML=records.length?records.map(recordMarkup).join(""):'<div class="empty-state">Nenhum registro encontrado para este filtro.</div>';
    updateStats();
  }
  function updateStats(){
    const records=readRecords();
    $("#statRequests").textContent=records.filter(r=>r.type==="Orçamento").length;
    $("#statSchedules").textContent=records.filter(r=>r.type==="Agendamento").length;
  }
  function renderProviders(query="",sort="recommended"){
    let list=sampleProviders.filter(p=>(p.name+" "+p.service+" "+p.description).toLowerCase().includes(query.toLowerCase()));
    if(sort==="rating") list.sort((a,b)=>Number(b.rating.replace(",","."))-Number(a.rating.replace(",",".")));
    if(sort==="name") list.sort((a,b)=>a.name.localeCompare(b.name));
    $("#providerResults").innerHTML=list.length?list.map(p=>`<article class="provider-card"><div class="provider-top"><div class="provider-avatar">${escapeHtml(p.initials)}</div><div><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.service)}</small></div></div><div class="rating">★ ${escapeHtml(p.rating)} <span class="muted">• avaliação demonstrativa</span></div><p>${escapeHtml(p.description)}</p><button class="secondary-button" data-provider="${escapeHtml(p.name)}" data-service="${escapeHtml(p.service)}">Solicitar orçamento</button></article>`).join(""):'<div class="empty-state">Nenhum exemplo encontrado. Tente outro termo de busca.</div>';
  }
  function requireLoginAfterAuth(){
    const user=readUser(); if(user){setUserUI(user);navigate("home");renderRecent();updateStats();}
  }

  document.addEventListener("click", event=>{
    const nav=event.target.closest("[data-page]");
    if(nav){event.preventDefault();navigate(nav.dataset.page);return;}
    const auth=event.target.closest("[data-auth]");
    if(auth){setAuthTab(auth.dataset.auth);return;}
    const category=event.target.closest("[data-category]");
    if(category){$("#providerSearch").value=category.dataset.category;navigate("prestadores");renderProviders(category.dataset.category);return;}
    const provider=event.target.closest("[data-provider]");
    if(provider){
      $("#budgetCategory").value = [...$("#budgetCategory").options].some(o=>o.value===provider.dataset.service)?provider.dataset.service:"";
      $("#budgetTitle").value=`Orçamento para ${provider.dataset.service}`;
      navigate("orcamento");showToast(`Exemplo selecionado: ${provider.dataset.provider}. Preencha os detalhes para registrar o pedido.`);return;
    }
  });
  $("#loginForm").addEventListener("submit",event=>{
    event.preventDefault();
    const email=$("#loginEmail").value.trim(), password=$("#loginPassword").value;
 if(!email){showToast("Informe seu e-mail.");return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showToast("Digite um e-mail válido, como nome@exemplo.com.");return;}
    if(password.length<4){showToast("A senha precisa ter pelo menos 4 caracteres.");return;}
    const existing=readUser();
    const user=existing&&existing.email===email?existing:{name:email.split("@")[0].replace(/[._-]/g," ").replace(/\b\w/g,c=>c.toUpperCase()),email};
    localStorage.setItem(STORAGE_KEYS.user,JSON.stringify(user));setUserUI(user);requireLoginAfterAuth();showToast("Acesso demonstrativo realizado com sucesso.");
  });
  $("#registerForm").addEventListener("submit",event=>{
    event.preventDefault();
    const user={name:$("#registerName").value.trim(),email:$("#registerEmail").value.trim(),phone:$("#registerPhone").value.trim()};
    localStorage.setItem(STORAGE_KEYS.user,JSON.stringify(user));setUserUI(user);requireLoginAfterAuth();showToast("Conta demonstrativa criada neste navegador.");
  });
  $("#forgotButton").addEventListener("click",()=>showToast("Recuperação de senha ainda precisa ser integrada ao back-end."));
  $("#logoutButton")?.addEventListener("click",()=>{localStorage.removeItem(STORAGE_KEYS.user);showAuth("login");showToast("Você saiu da conta demonstrativa.");});
  $("#menuToggle").addEventListener("click",()=>$("#siteNav").classList.toggle("open"));
  $("#headerLogin").addEventListener("click",()=>{ if(readUser()){showToast("Você já está na área demonstrativa.");} else {showAuth("login");window.scrollTo({top:0,behavior:"smooth"});} });
  document.addEventListener("click",event=>{
    const tile=event.target.closest("[data-service-category]");
    if(tile){
      const category=tile.dataset.serviceCategory;
      $("#budgetCategory").value=[...$("#budgetCategory").options].some(o=>o.value===category)?category:"Outro acabamento";
      $("#budgetTitle").value=`Serviço de ${category}`;
      navigate("orcamento");
      showToast(`Categoria ${category} selecionada. Complete os detalhes do orçamento.`);
    }
  });
  $("#quickSearch")?.addEventListener("submit",event=>{event.preventDefault();const q=$("#quickSearchInput").value.trim();$("#providerSearch").value=q;navigate("prestadores");renderProviders(q);});
  $("#providerSearchForm").addEventListener("submit",event=>{event.preventDefault();renderProviders($("#providerSearch").value.trim(),$("#providerSort").value);});
  $("#historyFilter").addEventListener("change",renderHistory);
  $("#budgetForm").addEventListener("submit",event=>{
    event.preventDefault();
    const title=$("#budgetTitle").value.trim(), category=$("#budgetCategory").value, desc=$("#budgetDescription").value.trim(), location=$("#budgetLocation").value.trim(), date=$("#budgetDate").value;
    addRecord("Orçamento",title,`${category} • ${location} • ${desc}`,date||new Date().toISOString().slice(0,10));
    event.target.reset();navigate("historico");showToast("Solicitação registrada no protótipo. Ela ainda não foi enviada a um prestador real.");
  });
  $("#scheduleForm").addEventListener("submit",event=>{
    event.preventDefault();
    const service=$("#scheduleService").value.trim(), provider=$("#scheduleProvider").value.trim(), date=$("#scheduleDate").value, time=$("#scheduleTime").value, address=$("#scheduleAddress").value.trim(), notes=$("#scheduleNotes").value.trim();
    addRecord("Agendamento",service,`${provider?provider+" • ":""}${date} às ${time} • ${address}${notes?" • "+notes:""}`,date,"Preferência registrada");
    event.target.reset();navigate("historico");showToast("Preferência de agendamento registrada. A confirmação depende da disponibilidade real.");
  });
  $("#supportForm").addEventListener("submit",event=>{
    event.preventDefault();showToast("Mensagem registrada apenas para demonstração. O envio real exige integração com o back-end.");event.target.reset();
  });
  $("#budgetDate").min=new Date().toISOString().slice(0,10);
  $("#scheduleDate").min=new Date().toISOString().slice(0,10);
  renderProviders();
  const user=readUser();
  if(user){setUserUI(user);navigate("home");}else{showAuth("login");}
})();