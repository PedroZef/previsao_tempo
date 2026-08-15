/**
 * Condição climática retornada pela API do OpenWeather.
 */
export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

/**
 * Métricas principais de temperatura, pressão e umidade.
 */
export interface MainWeatherData {
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  pressure: number
  humidity: number
  sea_level?: number
  grnd_level?: number
}

/**
 * Dados de velocidade e direção do vento.
 */
export interface WindData {
  speed: number
  deg: number
  gust?: number
}

/**
 * Percentual de cobertura de nuvens.
 */
export interface CloudsData {
  all: number
}

/**
 * Informações do sistema (país, nascer e pôr do sol).
 */
export interface SysData {
  type?: number
  id?: number
  country: string
  sunrise: number
  sunset: number
}

/**
 * Coordenadas geográficas (latitude e longitude).
 */
export interface Coordinates {
  lon: number
  lat: number
}

/**
 * Contrato completo da resposta da API OpenWeather (v2.5).
 */
export interface WeatherApiResponse {
  coord: Coordinates
  weather: WeatherCondition[]
  base: string
  main: MainWeatherData
  visibility: number
  wind: WindData
  clouds: CloudsData
  dt: number
  sys: SysData
  timezone: number
  id: number
  name: string
  cod: number
}

/**
 * Dados meteorológicos formatados prontos para exibição na interface do usuário.
 */
export interface FormattedWeatherData {
  city: string
  country: string
  temperature: number
  feelsLike: number
  tempMin: number
  tempMax: number
  description: string
  humidity: number
  windSpeed: number
  pressure: number
  iconUrl: string
  iconCode: string
  sunrise: string
  sunset: string
  dtFormatted: string
}

/**
 * Estrutura para tratamento padronizado de erros climáticos.
 */
export interface WeatherError {
  message: string
  code?: number
}
