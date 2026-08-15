(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`https://api.openweathermap.org/data/2.5/weather`;function t(){return`20686f166dd33a6c22a0f4e4d572963e`}async function n(n){let r=t(),i=`${e}?q=${encodeURIComponent(n.trim())}&appid=${r}&lang=pt_br&units=metric`,a=await fetch(i);if(!a.ok)throw a.status===404?Error(`Cidade "${n}" não encontrada. Verifique o nome e tente novamente.`):a.status===401?Error(`Chave de API inválida ou não ativada no OpenWeatherMap.`):a.status===429?Error(`Limite de requisições excedido. Tente novamente em alguns instantes.`):Error(`Erro ao buscar dados do tempo (Código: ${a.status}).`);return await a.json()}async function r(n,r){let i=`${e}?lat=${n}&lon=${r}&appid=${t()}&lang=pt_br&units=metric`,a=await fetch(i);if(!a.ok)throw a.status===401?Error(`Chave de API inválida ou não ativada no OpenWeatherMap.`):Error(`Erro ao obter previsão para a localização atual (Código: ${a.status}).`);return await a.json()}function i(e){return e?e.split(` `).map(e=>e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()).join(` `):``}function a(e,t=0){return new Date((e+t)*1e3).toUTCString().slice(17,22)}function o(e){return new Date(e*1e3).toLocaleDateString(`pt-BR`,{weekday:`long`,day:`numeric`,month:`short`})}function s(e){let t=e.weather[0]||{main:`Desconhecido`,description:`Sem descrição`,icon:`01d`};return{city:e.name,country:e.sys?.country||``,temperature:Math.round(e.main.temp),feelsLike:Math.round(e.main.feels_like),tempMin:Math.round(e.main.temp_min),tempMax:Math.round(e.main.temp_max),description:i(t.description),humidity:e.main.humidity,windSpeed:Math.round(e.wind.speed*3.6),pressure:e.main.pressure,iconUrl:`https://openweathermap.org/img/wn/${t.icon}@4x.png`,iconCode:t.icon,sunrise:a(e.sys.sunrise,e.timezone),sunset:a(e.sys.sunset,e.timezone),dtFormatted:o(e.dt)}}function c(){let e=localStorage.getItem(`weather_theme`);return e===`dark`||e===`light`?e:window.matchMedia&&window.matchMedia(`(prefers-color-scheme: light)`).matches?`light`:`dark`}var l={currentData:null,unit:localStorage.getItem(`weather_unit`)||`C`,theme:c(),recentSearches:JSON.parse(localStorage.getItem(`weather_recent_searches`)||`[]`),isLoading:!1},u=document.querySelector(`#search-form`),d=document.querySelector(`#input-localizacao`),f=document.querySelector(`#btn-geolocation`),p=document.querySelector(`#btn-search`),m=document.querySelector(`#tempo-info`),h=document.querySelector(`#recent-searches`),g=document.querySelector(`#unit-celsius`),_=document.querySelector(`#unit-fahrenheit`),v=document.querySelector(`#btn-theme-toggle`),y=document.querySelector(`#toast-container`);function b(e){if(l.theme=e,document.documentElement.setAttribute(`data-theme`,e),document.body.setAttribute(`data-theme`,e),localStorage.setItem(`weather_theme`,e),v){let t=e===`dark`;v.setAttribute(`aria-pressed`,t?`true`:`false`),v.setAttribute(`aria-label`,t?`Ativar modo claro`:`Ativar modo escuro`),v.setAttribute(`title`,t?`Modo Escuro (Clique para Modo Claro)`:`Modo Claro (Clique para Modo Escuro)`)}}function x(){b(l.theme===`dark`?`light`:`dark`)}function S(e,t=`danger`){if(!y)return;let n=document.createElement(`div`);n.className=`toast toast-${t}`,n.setAttribute(`role`,`alert`),n.innerHTML=`
    ${t===`danger`?`<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`:`<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`}
    <div class="toast-message">${e}</div>
    <button class="toast-close" aria-label="Fechar notificação">&times;</button>
  `,n.querySelector(`.toast-close`)?.addEventListener(`click`,()=>{n.remove()}),y.appendChild(n),setTimeout(()=>{n.style.opacity=`0`,n.style.transition=`opacity 0.3s ease`,setTimeout(()=>n.remove(),300)},4500)}function C(e,t){return Math.round(t===`F`?e*9/5+32:e)}function w(){!g||!_||(l.unit===`C`?(g.classList.add(`active`),g.setAttribute(`aria-pressed`,`true`),_.classList.remove(`active`),_.setAttribute(`aria-pressed`,`false`)):(_.classList.add(`active`),_.setAttribute(`aria-pressed`,`true`),g.classList.remove(`active`),g.setAttribute(`aria-pressed`,`false`)))}function T(e){let t=e.trim();t&&(l.recentSearches=[t,...l.recentSearches.filter(e=>e.toLowerCase()!==t.toLowerCase())].slice(0,5),localStorage.setItem(`weather_recent_searches`,JSON.stringify(l.recentSearches)),E())}function E(){if(h){if(l.recentSearches.length===0){h.innerHTML=``;return}h.innerHTML=`
    <span class="recent-searches-label">Recentes:</span>
    ${l.recentSearches.map(e=>`<button type="button" class="recent-tag" data-city="${e}">${e}</button>`).join(``)}
  `,h.querySelectorAll(`.recent-tag`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.getAttribute(`data-city`);t&&(d&&(d.value=t),k(t))})})}}function D(){m&&(m.innerHTML=`
    <div class="skeleton-container" aria-busy="true" aria-label="Carregando dados meteorológicos">
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-temp"></div>
      <div class="skeleton-grid">
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
        <div class="skeleton skeleton-card"></div>
      </div>
    </div>
  `)}function O(e){if(!m)return;let t=s(e),n=C(e.main.temp,l.unit),r=C(e.main.feels_like,l.unit),i=C(e.main.temp_min,l.unit),a=C(e.main.temp_max,l.unit),o=`°${l.unit}`,c=e.weather[0]?.main||`Clear`;document.body.setAttribute(`data-weather`,c),m.innerHTML=`
    <article class="weather-content" aria-label="Previsão do tempo para ${t.city}">
      <header class="weather-main">
        <div class="location-info">
          <h2 class="location-title">
            <span>${t.city}</span>
            ${t.country?`<span class="location-badge">${t.country}</span>`:``}
          </h2>
          <time class="date-info" datetime="${new Date(e.dt*1e3).toISOString()}">
            ${t.dtFormatted}
          </time>

          <div class="temp-badge-group">
            <span class="temp-primary">${n}${o}</span>
            <span class="condition-text">${t.description}</span>
          </div>
        </div>

        <div class="weather-icon-wrapper">
          <img 
            class="weather-icon-img" 
            src="${t.iconUrl}" 
            alt="${t.description}" 
            width="110" 
            height="110" 
          />
        </div>
      </header>

      <section class="metrics-grid" aria-label="Detalhes climáticos">
        <div class="metric-card">
          <div class="metric-header">
            <svg class="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
            </svg>
            <span>Sensação</span>
          </div>
          <span class="metric-value">${r}${o}</span>
          <span class="metric-sub">Min ${i}${o} / Max ${a}${o}</span>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <svg class="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
            <span>Umidade</span>
          </div>
          <span class="metric-value">${t.humidity}%</span>
          <span class="metric-sub">Pressão ${t.pressure} hPa</span>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <svg class="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
              <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
              <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
            </svg>
            <span>Vento</span>
          </div>
          <span class="metric-value">${t.windSpeed} <small>km/h</small></span>
          <span class="metric-sub">Velocidade atual</span>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <svg class="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2"/>
              <path d="M12 20v2"/>
              <path d="m4.93 4.93 1.41 1.41"/>
              <path d="m17.66 17.66 1.41 1.41"/>
              <path d="M2 12h2"/>
              <path d="M20 12h2"/>
              <path d="m6.34 17.66-1.41 1.41"/>
              <path d="m19.07 4.93-1.41 1.41"/>
            </svg>
            <span>Sol</span>
          </div>
          <span class="metric-value">${t.sunrise}</span>
          <span class="metric-sub">Pôr às ${t.sunset}</span>
        </div>
      </section>
    </article>
  `}async function k(e){let t=e.trim();if(t.length<2){S(`Digite pelo menos 2 caracteres para pesquisar a cidade.`,`warning`);return}j(!0),D();try{let e=await n(t);l.currentData=e,O(e),T(e.name)}catch(e){S(e instanceof Error?e.message:`Erro ao obter dados do clima.`,`danger`),!l.currentData&&m&&M()}finally{j(!1)}}async function A(){if(!(`geolocation`in navigator)){S(`Geolocalização não é suportada pelo seu navegador.`,`warning`);return}j(!0),D(),navigator.geolocation.getCurrentPosition(async e=>{try{let{latitude:t,longitude:n}=e.coords,i=await r(t,n);l.currentData=i,O(i),T(i.name),d&&(d.value=i.name)}catch(e){S(e instanceof Error?e.message:`Erro ao buscar localização.`,`danger`),l.currentData||M()}finally{j(!1)}},e=>{j(!1),l.currentData||M(),e.code===e.PERMISSION_DENIED?S(`Permissão de localização negada. Digite a cidade manualmente.`,`warning`):S(`Não foi possível obter sua localização geográfica.`,`danger`)},{timeout:1e4})}function j(e){l.isLoading=e,p&&(p.disabled=e),f&&(f.disabled=e)}function M(){m&&(m.innerHTML=`
    <div class="state-empty">
      <svg class="state-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
      </svg>
      <h3>Descubra o clima em qualquer lugar</h3>
      <p>Pesquise uma cidade acima ou clique no botão de localização para ver as condições em tempo real.</p>
    </div>
  `)}if(u?.addEventListener(`submit`,e=>{e.preventDefault(),d&&k(d.value)}),f?.addEventListener(`click`,()=>{A()}),g?.addEventListener(`click`,()=>{l.unit!==`C`&&(l.unit=`C`,localStorage.setItem(`weather_unit`,`C`),w(),l.currentData&&O(l.currentData))}),_?.addEventListener(`click`,()=>{l.unit!==`F`&&(l.unit=`F`,localStorage.setItem(`weather_unit`,`F`),w(),l.currentData&&O(l.currentData))}),v?.addEventListener(`click`,()=>{x()}),window.matchMedia&&window.matchMedia(`(prefers-color-scheme: dark)`).addEventListener(`change`,e=>{localStorage.getItem(`weather_theme`)||b(e.matches?`dark`:`light`)}),b(l.theme),w(),E(),l.recentSearches.length>0){let e=l.recentSearches[0];d&&(d.value=e),k(e)}else k(`São Paulo`);