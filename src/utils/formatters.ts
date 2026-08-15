import { WeatherApiResponse, FormattedWeatherData } from '../types/weather'

/**
 * Converte a primeira letra de cada palavra para maiúscula (ex: "céu limpo" -> "Céu Limpo").
 */
export function capitalizeWords(str: string): string {
  if (!str) return ''
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Formata um timestamp Unix em hora legível (HH:MM), aplicando o deslocamento de fuso horário em segundos.
 */
export function formatTimeFromTimestamp(timestamp: number, timezoneOffsetSeconds = 0): string {
  const date = new Date((timestamp + timezoneOffsetSeconds) * 1000)
  return date.toUTCString().slice(17, 22) // Formato HH:MM
}

/**
 * Formata um timestamp Unix na data por extenso em português (ex: "quarta-feira, 15 de ago.").
 */
export function formatDateFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  })
}

/**
 * Processa e formata os dados brutos da API OpenWeather para a estrutura limpa de visualização da interface.
 */
export function formatWeatherData(data: WeatherApiResponse): FormattedWeatherData {
  const weather = data.weather[0] || {
    main: 'Desconhecido',
    description: 'Sem descrição',
    icon: '01d',
  }

  return {
    city: data.name,
    country: data.sys?.country || '',
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    description: capitalizeWords(weather.description),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // Converte de metros/segundo para km/h
    pressure: data.main.pressure,
    iconUrl: `https://openweathermap.org/img/wn/${weather.icon}@4x.png`,
    iconCode: weather.icon,
    sunrise: formatTimeFromTimestamp(data.sys.sunrise, data.timezone),
    sunset: formatTimeFromTimestamp(data.sys.sunset, data.timezone),
    dtFormatted: formatDateFromTimestamp(data.dt),
  }
}
