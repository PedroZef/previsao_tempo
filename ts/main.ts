const form = document.querySelector('#search-form > form')
const input: HTMLInputElement | null =
  document.querySelector('#input-localizacao')

const sectionTempoInfos = document.querySelector('#tempo-info')

form?.addEventListener('submit', async (event) => {
  event.preventDefault()

  if (!input || !sectionTempoInfos) return

  const localizacao = input.value

  if (localizacao.length < 3) {
    alert('O local precisar ter, pelo memos 3 letras.')
    return
  }

  try {
    const resposta =
      await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${localizacao}&appid=20686f166dd33a6c22a0f4e4d572963e&lang=pt-br&units=metric
`)

    const dados = await resposta.json()
    const infos = {
      temperatura: Math.round(dados.main.temp),
      local: dados.name,
      icone: `https://openweathermap.org/img/wn/${dados.weather[0].icon}@4x.png`,
    }

    sectionTempoInfos.innerHTML = `
    <div class="tempo-dados">
          <h2>${infos.local}</h2>

          <span>${infos.temperatura}ºC</span>
        </div>

        <img
  src ="${infos.icone}"
    />`

    console.log(dados)
  } catch (error) {
    alert('Erro ao buscar informações do tempo ou da cidade.')
  }
})
