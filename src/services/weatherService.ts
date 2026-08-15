import { WeatherApiResponse } from '../types/weather'

// URL base da API OpenWeather
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

/**
 * Obtém a chave de API das variáveis de ambiente de forma segura.
 * Lança um erro caso a chave não esteja configurada.
 */
function getApiKey(): string {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '20686f166dd33a6c22a0f4e4d572963e'
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error(
      'Chave de API do OpenWeather não configurada. Defina VITE_OPENWEATHER_API_KEY no arquivo .env'
    )
  }
  return apiKey
}

/**
 * Busca a previsão do tempo atual pelo nome da cidade.
 * @param city Nome da cidade a ser consultada
 */
export async function fetchWeatherByCity(city: string): Promise<WeatherApiResponse> {
  const apiKey = getApiKey()
  const url = `${BASE_URL}?q=${encodeURIComponent(city.trim())}&appid=${apiKey}&lang=pt_br&units=metric`

  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Cidade "${city}" não encontrada. Verifique o nome e tente novamente.`)
    }
    if (response.status === 401) {
      throw new Error('Chave de API inválida ou não ativada no OpenWeatherMap.')
    }
    if (response.status === 429) {
      throw new Error('Limite de requisições excedido. Tente novamente em alguns instantes.')
    }
    throw new Error(`Erro ao buscar dados do tempo (Código: ${response.status}).`)
  }

  return (await response.json()) as WeatherApiResponse
}

/**
 * Busca a previsão do tempo atual através de coordenadas geográficas (latitude e longitude).
 * @param lat Latitude da localização
 * @param lon Longitude da localização
 */
export async function fetchWeatherByCoords(lat: number, lon: number): Promise<WeatherApiResponse> {
  const apiKey = getApiKey()
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${apiKey}&lang=pt_br&units=metric`

  const response = await fetch(url)

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Chave de API inválida ou não ativada no OpenWeatherMap.')
    }
    throw new Error(`Erro ao obter previsão para a localização atual (Código: ${response.status}).`)
  }

  return (await response.json()) as WeatherApiResponse
}
