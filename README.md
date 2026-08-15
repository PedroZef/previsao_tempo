# 🌦️ WeatherPulse — Condições e Previsão do Tempo

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![OpenWeather API](https://img.shields.io/badge/API-OpenWeather-orange.svg)](https://openweathermap.org/api)
[![Vitest](https://img.shields.io/badge/Tests-Vitest-yellow.svg?logo=vitest)](https://vitest.dev/)
[![License: ISC](https://img.shields.io/badge/License-ISC-green.svg)](https://opensource.org/licenses/ISC)

> Aplicação moderna, segura e responsiva para consulta das condições climáticas e previsão meteorológica em tempo real, construída com **TypeScript**, **Vite** e estética **Glassmorphism**.

---

## ✨ Funcionalidades

- 🔍 **Busca Inteligente por Cidade**: Autocompletar, histórico de buscas recentes (salvo no `localStorage`) e tags de acesso rápido.
- 📍 **Geolocalização Automática**: Detecta a localização atual do usuário com um clique via API nativa do navegador (`navigator.geolocation`).
- 🌡️ **Alternância de Unidades**: Conversão instantânea e dinâmica entre **Celsius (°C)** e **Fahrenheit (°F)** sem requisições adicionais.
- 📊 **Métricas Meteorológicas Completas**:
  - Temperatura atual, máxima, mínima e sensação térmica.
  - Umidade do ar (%) e pressão atmosférica (hPa).
  - Velocidade do vento convertida para km/h.
  - Horários exatos de nascer e pôr do sol baseados no fuso horário da cidade.
- 🎨 **Design Dinâmico & Glassmorphism**:
  - Transições de atmosfera climática no plano de fundo (Céu Limpo, Nublado, Chuva, Tempestade, Neve, Neblina).
  - Animação de flutuação dos ícones e estados de carregamento com *Skeleton Screens*.
- 🛡️ **Segurança & Boas Práticas**:
  - Chaves de API isoladas por variáveis de ambiente (`.env`).
  - Tratamento granular de erros com *Toasts* acessíveis (sem bloqueio por `alert()`).
- 🧪 **Testes Automatizados**: Suíte de testes unitários com **Vitest** para formatadores e cálculos.

---

## 🛠️ Tecnologias e Arquitetura

- **Linguagem**: TypeScript (Strict Mode)
- **Bundler & Dev Server**: Vite
- **Estilização**: CSS3 Moderno (Custom Properties / Variáveis CSS, Glassmorphism, CSS Grid & Flexbox)
- **Testes**: Vitest
- **API Meteorológica**: OpenWeatherMap API v2.5

### Estrutura de Diretórios

```
previsao_tempo/
├── .env.example            # Exemplo de configuração de variáveis de ambiente
├── index.html              # Ponto de entrada HTML semântico e acessível
├── package.json            # Scripts e dependências
├── tsconfig.json           # Configurações estritas do TypeScript
├── vite.config.ts          # Configurações do Vite
└── src/
    ├── main.ts             # Controlador principal da aplicação e eventos
    ├── vite-env.d.ts       # Declarações de tipos de ambiente Vite
    ├── services/
    │   └── weatherService.ts  # Camada de comunicação com a API do OpenWeather
    ├── types/
    │   └── weather.ts         # Interfaces e contratos de dados tipados
    ├── utils/
    │   ├── formatters.ts      # Funções utilitárias e formatadores
    │   └── formatters.test.ts # Testes unitários com Vitest
    └── styles/
        └── main.css           # Design system e tokens visuais
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- Chave de API gratuita do [OpenWeather](https://openweathermap.org/api)

### 2. Clonar e Instalar Dependências
```bash
git clone https://github.com/PedroZef/previsao_tempo.git
cd previsao_tempo
npm install
```

### 3. Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env`:
```bash
cp .env.example .env
```
Abra o arquivo `.env` e insira sua chave da OpenWeather:
```env
VITE_OPENWEATHER_API_KEY=sua_chave_aqui
```

### 4. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000` no seu navegador.

### 5. Executar os Testes
```bash
# Rodar suíte de testes
npm test

# Modo interativo (watch)
npm run test:watch
```

### 6. Build de Produção
```bash
npm run build
```
Os arquivos otimizados e minificados serão gerados no diretório `dist/`.

---

## 🌐 Deploy no GitHub Pages

O projeto conta com fluxo automatizado de CI/CD via **GitHub Actions** (`.github/workflows/deploy.yml`). A cada push na branch `main`, a aplicação é testada, compilada e publicada automaticamente no **GitHub Pages**.

🔗 **Demonstração Online**: [https://pedrozef.github.io/previsao_tempo/](https://pedrozef.github.io/previsao_tempo/)

> **Nota para ativação no GitHub**:
> Acesse o repositório no GitHub > **Settings** > **Pages** > em **Build and deployment > Source**, selecione **GitHub Actions**.

---

## 👨‍💻 Autor

Desenvolvido por **[Pedro Zeferino da Silva](https://github.com/PedroZef/)**.

---

## 📄 Licença

Este projeto está sob a licença [ISC](https://opensource.org/licenses/ISC).
