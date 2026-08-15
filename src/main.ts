import './styles/main.css'
import { WeatherApiResponse } from './types/weather'
import { fetchWeatherByCity, fetchWeatherByCoords } from './services/weatherService'
import { formatWeatherData } from './utils/formatters'

// ============================================================================
// Tipos e Estado Global da Aplicação
// ============================================================================

type Unit = 'C' | 'F'
type Theme = 'dark' | 'light'

interface AppState {
  currentData: WeatherApiResponse | null
  unit: Unit
  theme: Theme
  recentSearches: string[]
  isLoading: boolean
}

/**
 * Obtém o tema inicial salvo pelo usuário ou detecta o tema do sistema operacional.
 */
function getInitialTheme(): Theme {
  const saved = localStorage.getItem('weather_theme') as Theme | null
  if (saved === 'dark' || saved === 'light') return saved
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}

const state: AppState = {
  currentData: null,
  unit: (localStorage.getItem('weather_unit') as Unit) || 'C',
  theme: getInitialTheme(),
  recentSearches: JSON.parse(localStorage.getItem('weather_recent_searches') || '[]'),
  isLoading: false,
}

// ============================================================================
// Elementos do DOM
// ============================================================================

const searchForm = document.querySelector<HTMLFormElement>('#search-form')
const locationInput = document.querySelector<HTMLInputElement>('#input-localizacao')
const geoBtn = document.querySelector<HTMLButtonElement>('#btn-geolocation')
const searchBtn = document.querySelector<HTMLButtonElement>('#btn-search')
const weatherContainer = document.querySelector<HTMLElement>('#tempo-info')
const recentContainer = document.querySelector<HTMLElement>('#recent-searches')
const btnCelsius = document.querySelector<HTMLButtonElement>('#unit-celsius')
const btnFahrenheit = document.querySelector<HTMLButtonElement>('#unit-fahrenheit')
const btnThemeToggle = document.querySelector<HTMLButtonElement>('#btn-theme-toggle')
const toastContainer = document.querySelector<HTMLElement>('#toast-container')

// ============================================================================
// Gerenciamento de Tema (Modo Escuro / Modo Claro)
// ============================================================================

/**
 * Aplica o tema visual no elemento raiz, no body e persiste no localStorage.
 */
function applyTheme(theme: Theme) {
  state.theme = theme
  document.documentElement.setAttribute('data-theme', theme)
  document.body.setAttribute('data-theme', theme)
  localStorage.setItem('weather_theme', theme)

  if (btnThemeToggle) {
    const isDark = theme === 'dark'
    btnThemeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false')
    btnThemeToggle.setAttribute(
      'aria-label',
      isDark ? 'Ativar modo claro' : 'Ativar modo escuro'
    )
    btnThemeToggle.setAttribute(
      'title',
      isDark ? 'Modo Escuro (Clique para Modo Claro)' : 'Modo Claro (Clique para Modo Escuro)'
    )
  }
}

/**
 * Alterna entre o modo escuro e o modo claro.
 */
function toggleTheme() {
  const nextTheme: Theme = state.theme === 'dark' ? 'light' : 'dark'
  applyTheme(nextTheme)
}

// ============================================================================
// Sistema de Notificações Acessíveis (Toasts)
// ============================================================================

/**
 * Exibe uma notificação flutuante acessível na tela sem bloquear a interface.
 */
function showToast(message: string, type: 'danger' | 'warning' | 'success' = 'danger') {
  if (!toastContainer) return

  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.setAttribute('role', 'alert')

  const iconSvg =
    type === 'danger'
      ? `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      : `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`

  toast.innerHTML = `
    ${iconSvg}
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Fechar notificação">&times;</button>
  `

  const closeBtn = toast.querySelector('.toast-close')
  closeBtn?.addEventListener('click', () => {
    toast.remove()
  })

  toastContainer.appendChild(toast)

  setTimeout(() => {
    toast.style.opacity = '0'
    toast.style.transition = 'opacity 0.3s ease'
    setTimeout(() => toast.remove(), 300)
  }, 4500)
}

// ============================================================================
// Conversão e Controle de Unidades de Temperatura
// ============================================================================

/**
 * Converte o valor de temperatura em Celsius para a unidade atual (°C ou °F).
 */
function toDisplayTemp(tempCelsius: number, unit: Unit): number {
  if (unit === 'F') {
    return Math.round((tempCelsius * 9) / 5 + 32)
  }
  return Math.round(tempCelsius)
}

/**
 * Atualiza o estado visual ativo dos botões seletores de unidade (°C / °F).
 */
function updateUnitButtons() {
  if (!btnCelsius || !btnFahrenheit) return
  if (state.unit === 'C') {
    btnCelsius.classList.add('active')
    btnCelsius.setAttribute('aria-pressed', 'true')
    btnFahrenheit.classList.remove('active')
    btnFahrenheit.setAttribute('aria-pressed', 'false')
  } else {
    btnFahrenheit.classList.add('active')
    btnFahrenheit.setAttribute('aria-pressed', 'true')
    btnCelsius.classList.remove('active')
    btnCelsius.setAttribute('aria-pressed', 'false')
  }
}

// ============================================================================
// Histórico de Buscas Recentes (localStorage)
// ============================================================================

/**
 * Salva a cidade pesquisada no histórico recente, limitando às 5 últimas entradas únicas.
 */
function addRecentSearch(city: string) {
  const normalized = city.trim()
  if (!normalized) return

  const filtered = state.recentSearches.filter(
    (c) => c.toLowerCase() !== normalized.toLowerCase()
  )
  state.recentSearches = [normalized, ...filtered].slice(0, 5)
  localStorage.setItem('weather_recent_searches', JSON.stringify(state.recentSearches))
  renderRecentSearches()
}

/**
 * Renderiza os botões (tags/chips) de buscas recentes na interface.
 */
function renderRecentSearches() {
  if (!recentContainer) return
  if (state.recentSearches.length === 0) {
    recentContainer.innerHTML = ''
    return
  }

  recentContainer.innerHTML = `
    <span class="recent-searches-label">Recentes:</span>
    ${state.recentSearches
      .map(
        (city) =>
          `<button type="button" class="recent-tag" data-city="${city}">${city}</button>`
      )
      .join('')}
  `

  recentContainer.querySelectorAll('.recent-tag').forEach((btn) => {
    btn.addEventListener('click', () => {
      const city = btn.getAttribute('data-city')
      if (city) {
        if (locationInput) locationInput.value = city
        handleSearch(city)
      }
    })
  })
}

// ============================================================================
// Renderização da Interface (Skeletons e Card Climático)
// ============================================================================

/**
 * Renderiza o esqueleto de carregamento (Skeleton Screen) durante as requisições.
 */
function renderSkeleton() {
  if (!weatherContainer) return
  weatherContainer.innerHTML = `
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
  `
}

/**
 * Renderiza as informações meteorológicas completas do clima atual.
 */
function renderWeather(data: WeatherApiResponse) {
  if (!weatherContainer) return

  const formatted = formatWeatherData(data)
  const currentTemp = toDisplayTemp(data.main.temp, state.unit)
  const feelsLike = toDisplayTemp(data.main.feels_like, state.unit)
  const tempMin = toDisplayTemp(data.main.temp_min, state.unit)
  const tempMax = toDisplayTemp(data.main.temp_max, state.unit)
  const unitSymbol = `°${state.unit}`

  // Aplica o tema atmosférico dinâmico no plano de fundo
  const mainWeather = data.weather[0]?.main || 'Clear'
  document.body.setAttribute('data-weather', mainWeather)

  weatherContainer.innerHTML = `
    <article class="weather-content" aria-label="Previsão do tempo para ${formatted.city}">
      <header class="weather-main">
        <div class="location-info">
          <h2 class="location-title">
            <span>${formatted.city}</span>
            ${formatted.country ? `<span class="location-badge">${formatted.country}</span>` : ''}
          </h2>
          <time class="date-info" datetime="${new Date(data.dt * 1000).toISOString()}">
            ${formatted.dtFormatted}
          </time>

          <div class="temp-badge-group">
            <span class="temp-primary">${currentTemp}${unitSymbol}</span>
            <span class="condition-text">${formatted.description}</span>
          </div>
        </div>

        <div class="weather-icon-wrapper">
          <img 
            class="weather-icon-img" 
            src="${formatted.iconUrl}" 
            alt="${formatted.description}" 
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
          <span class="metric-value">${feelsLike}${unitSymbol}</span>
          <span class="metric-sub">Min ${tempMin}${unitSymbol} / Max ${tempMax}${unitSymbol}</span>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <svg class="metric-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
            <span>Umidade</span>
          </div>
          <span class="metric-value">${formatted.humidity}%</span>
          <span class="metric-sub">Pressão ${formatted.pressure} hPa</span>
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
          <span class="metric-value">${formatted.windSpeed} <small>km/h</small></span>
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
          <span class="metric-value">${formatted.sunrise}</span>
          <span class="metric-sub">Pôr às ${formatted.sunset}</span>
        </div>
      </section>
    </article>
  `
}

// ============================================================================
// Ações do Usuário (Busca e Geolocalização)
// ============================================================================

/**
 * Executa a busca de previsão por nome da cidade.
 */
async function handleSearch(city: string) {
  const query = city.trim()
  if (query.length < 2) {
    showToast('Digite pelo menos 2 caracteres para pesquisar a cidade.', 'warning')
    return
  }

  setLoading(true)
  renderSkeleton()

  try {
    const data = await fetchWeatherByCity(query)
    state.currentData = data
    renderWeather(data)
    addRecentSearch(data.name)
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro ao obter dados do clima.'
    showToast(msg, 'danger')
    // Restaura o estado inicial caso ainda não haja dados carregados
    if (!state.currentData && weatherContainer) {
      renderEmptyState()
    }
  } finally {
    setLoading(false)
  }
}

/**
 * Solicita a geolocalização do dispositivo e busca a previsão das coordenadas atuais.
 */
async function handleGeolocation() {
  if (!('geolocation' in navigator)) {
    showToast('Geolocalização não é suportada pelo seu navegador.', 'warning')
    return
  }

  setLoading(true)
  renderSkeleton()

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords
        const data = await fetchWeatherByCoords(latitude, longitude)
        state.currentData = data
        renderWeather(data)
        addRecentSearch(data.name)
        if (locationInput) locationInput.value = data.name
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Erro ao buscar localização.'
        showToast(msg, 'danger')
        if (!state.currentData) renderEmptyState()
      } finally {
        setLoading(false)
      }
    },
    (err) => {
      setLoading(false)
      if (!state.currentData) renderEmptyState()
      if (err.code === err.PERMISSION_DENIED) {
        showToast('Permissão de localização negada. Digite a cidade manualmente.', 'warning')
      } else {
        showToast('Não foi possível obter sua localização geográfica.', 'danger')
      }
    },
    { timeout: 10000 }
  )
}

/**
 * Controla os estados de carregamento e desativa temporariamente os botões de ação.
 */
function setLoading(loading: boolean) {
  state.isLoading = loading
  if (searchBtn) searchBtn.disabled = loading
  if (geoBtn) geoBtn.disabled = loading
}

/**
 * Renderiza o estado vazio inicial convidando o usuário a pesquisar uma localização.
 */
function renderEmptyState() {
  if (!weatherContainer) return
  weatherContainer.innerHTML = `
    <div class="state-empty">
      <svg class="state-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
      </svg>
      <h3>Descubra o clima em qualquer lugar</h3>
      <p>Pesquise uma cidade acima ou clique no botão de localização para ver as condições em tempo real.</p>
    </div>
  `
}

// ============================================================================
// Ouvintes de Eventos e Inicialização
// ============================================================================

// Submissão do formulário de busca
searchForm?.addEventListener('submit', (e) => {
  e.preventDefault()
  if (locationInput) {
    handleSearch(locationInput.value)
  }
})

// Clique no botão de geolocalização
geoBtn?.addEventListener('click', () => {
  handleGeolocation()
})

// Alternância para Celsius
btnCelsius?.addEventListener('click', () => {
  if (state.unit !== 'C') {
    state.unit = 'C'
    localStorage.setItem('weather_unit', 'C')
    updateUnitButtons()
    if (state.currentData) renderWeather(state.currentData)
  }
})

// Alternância para Fahrenheit
btnFahrenheit?.addEventListener('click', () => {
  if (state.unit !== 'F') {
    state.unit = 'F'
    localStorage.setItem('weather_unit', 'F')
    updateUnitButtons()
    if (state.currentData) renderWeather(state.currentData)
  }
})

// Alternância de Tema (Dark / Light Mode)
btnThemeToggle?.addEventListener('click', () => {
  toggleTheme()
})

// Monitora alterações de tema no sistema operacional caso o usuário não tenha definido uma preferência manual
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('weather_theme')) {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  })
}

// Inicialização de Tema, Unidades e Histórico Recente
applyTheme(state.theme)
updateUnitButtons()
renderRecentSearches()

// Carregamento automático da última cidade pesquisada ou cidade padrão
if (state.recentSearches.length > 0) {
  const lastCity = state.recentSearches[0]
  if (locationInput) locationInput.value = lastCity
  handleSearch(lastCity)
} else {
  // Busca inicial padrão para apresentar o layout preenchido
  handleSearch('São Paulo')
}
