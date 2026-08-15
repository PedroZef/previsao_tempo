import { describe, it, expect } from 'vitest'
import { capitalizeWords, formatTimeFromTimestamp, formatWeatherData } from './formatters'
import { WeatherApiResponse } from '../types/weather'

describe('Formatadores meteorológicos (formatters)', () => {
  it('deve converter a primeira letra de cada palavra em maiúscula', () => {
    expect(capitalizeWords('céu limpo')).toBe('Céu Limpo')
    expect(capitalizeWords('nuvens dispersas')).toBe('Nuvens Dispersas')
    expect(capitalizeWords('')).toBe('')
  })

  it('deve formatar hora UTC com deslocamento de fuso horário', () => {
    // 1700000000 = 2023-11-14T22:13:20Z
    // com deslocamento 0: 22:13
    const formatted = formatTimeFromTimestamp(1700000000, 0)
    expect(formatted).toBe('22:13')
  })

  it('deve converter a resposta bruta WeatherApiResponse na estrutura FormattedWeatherData', () => {
    const mockApiResponse: WeatherApiResponse = {
      coord: { lon: -46.63, lat: -23.54 },
      weather: [
        {
          id: 800,
          main: 'Clear',
          description: 'céu limpo',
          icon: '01d',
        },
      ],
      base: 'stations',
      main: {
        temp: 24.6,
        feels_like: 25.1,
        temp_min: 22.0,
        temp_max: 26.5,
        pressure: 1015,
        humidity: 60,
      },
      visibility: 10000,
      wind: {
        speed: 5.0, // 5 m/s = 18 km/h
        deg: 180,
      },
      clouds: { all: 0 },
      dt: 1700000000,
      sys: {
        country: 'BR',
        sunrise: 1700000000,
        sunset: 1700045000,
      },
      timezone: -10800,
      id: 3448439,
      name: 'São Paulo',
      cod: 200,
    }

    const result = formatWeatherData(mockApiResponse)

    expect(result.city).toBe('São Paulo')
    expect(result.country).toBe('BR')
    expect(result.temperature).toBe(25) // Arredondamento de 24.6
    expect(result.feelsLike).toBe(25) // Arredondamento de 25.1
    expect(result.tempMin).toBe(22)
    expect(result.tempMax).toBe(27) // Arredondamento de 26.5
    expect(result.description).toBe('Céu Limpo')
    expect(result.humidity).toBe(60)
    expect(result.windSpeed).toBe(18) // 5 m/s * 3.6 = 18 km/h
    expect(result.pressure).toBe(1015)
    expect(result.iconUrl).toBe('https://openweathermap.org/img/wn/01d@4x.png')
  })
})
