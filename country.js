const body = document.body

let country = new URLSearchParams(window.location.search).get('name');

const countryData = document.querySelector('.country-data')

const countryImg = document.querySelector('main img');

const borderDiv = document.querySelector('.border-countries');

const backBtn = document.querySelector('.back-btn');

const error = document.querySelector('.err')
const errorLabel = document.querySelector('.err-label')
const errorPara = document.querySelector('.err-label p')

const retryBtn = document.querySelector('.err-label button')

const darkModeBtn = document.querySelector('.dark-mode-div')
const darkModeIcon = darkModeBtn.querySelector('ion-icon');
const darkModeText = document.querySelector('.dark-mode-div p')


const loadingScreen = document.querySelector('.loading-screen')

const allDetails = document.querySelectorAll('.main-data p')
const impTextDiv = document.querySelector('.imp-text')

backBtn.addEventListener('click', () => {
  if (history.length > 1) {
  history.back()
 } else {
window.location.href = '/'
 }
})

function enableDarkMode() {
  body.classList.toggle('dark-mode')
}

if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode')
  darkModeIcon.setAttribute('name', 'moon-sharp')
  darkModeText.innerText = 'Light Mode'
}

darkModeBtn.addEventListener('click', () => {
  enableDarkMode()
  if (body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark')
    darkModeIcon.setAttribute('name', 'moon-sharp')
    darkModeText.innerText = 'Light Mode'
  } else {
    localStorage.setItem('theme', 'light')
    darkModeIcon.setAttribute('name', 'moon-outline')
    darkModeText.innerText = 'Dark Mode'
  }
})

function showSkeleton() {
  countryData.classList.add('loading-screen')
  countryImg.classList.add('hidden')

 if(window.innerWidth >= 768) {
   impTextDiv.classList.add('hidden')
   countryData.classList.add('big-loading-screen')
 }
}

function hideSkeleton() {
  countryData.classList.remove('loading-screen');
  countryImg.classList.remove('hidden')
 
  impTextDiv.classList.remove('hidden')
}

async function getCountryData(apiUrl) {
  try {
    const url = await fetch(`https://restcountries.com/v3.1/name/${apiUrl}?fullText=true`)
    const data = await url.json()
    countryImg.src = data[0]?.flags?.svg
    countryImg.alt = data[0]?.flags?.alt
    
    document.querySelector('h2').innerText = data[0]?.name?.common ?? 'Unknown'
    
    document.querySelector('.native-name span').innerText = data[0]?.name?.nativeName?.eng?.common ??
      Object.values(data[0]?.name?.nativeName ?? {})[0]?.common ?? 'Unknown'
    
    document.querySelector('.population span').innerText = data[0]?.population?.toLocaleString() ?? 0
    
    document.querySelector('.region span').innerText = data[0]?.region ?? 'Unknwon'
    
    document.querySelector('.sub-region span').innerText = data[0]?.subregion ?? 'Unknown'
    
    document.querySelector('.capital span').innerText = data[0]?.capital[0] ?? 'Unknown'
    
    document.querySelector('.Top-level-domain span').innerText = data[0].tld[0] ?? 'Unknown'
    
    document.querySelector('.currencies span').innerText = Object.values(data[0]?.currencies ?? {})[0]?.name ?? 'Unknown'
    
    document.querySelector('.languages span').innerText = Object.values(data[0]?.languages ?? {}).join(', ') || 'Unknown';
    
    async function getBordersData() {
      borderDiv.innerHTML = ''
      
      const h3 = document.querySelector('.border-container h3')
      
      h3.innerText = 'Border Countries:'
      
      const apiUrl = `https://restcountries.com/v3.1/alpha?codes=${data[0]?.borders?.join(',')}`
      const url = await fetch(apiUrl)
      const countryData = await url.json()
      
      countryData?.forEach((border) => {
        const btn = document.createElement('button')
        btn.classList.add('border-btn')
        btn.innerText = border?.name?.common
        borderDiv.append(btn)
      })
    }
    
    if (data[0].borders) {
      getBordersData()
    } else {
      const h3 = document.querySelector('.border-container h3')
      h3.innerText = 'No Border Countries Found'
    }
    
    return true;
  } catch (err) {
    console.log('API fetching failed:', err)
    
    error.innerText = '⚠ Failed to load country'
errorPara.classList.remove('hidden')
    errorLabel.style.display = 'block'
    
    hideSkeleton()
    countryData.classList.add('hidden')

    return false;
  }
}

showSkeleton()
fetchApi()

function fetchApi() {
  setTimeout(async () => {
    const apiResult = await getCountryData(country)
    
    if (apiResult) {
      hideSkeleton()
    }
  }, 300)
}

borderDiv.addEventListener('click', (e) => {
  const btn = e.target
  if (!btn) return
  
  const country = btn.innerText
  getCountryData(country)
})

retryBtn.addEventListener('click', () => {
  errorLabel.style.display = 'none'
  showSkeleton()
  fetchApi()
})
