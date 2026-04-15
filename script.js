const body = document.body

const filterBtn = document.querySelector('.filter-div');
const filterDropdown = document.querySelector('.filter-dropdown');

const countryCard = document.querySelector('.country-card');
const countrySection = document.querySelector('.country-section');

const searchBar = document.querySelector('.search-field');

const error = document.querySelector('.err')
const errorLabel = document.querySelector('.err-label')
const errorPara = document.querySelector('.err-label p')

const retryBtn = document.querySelector('.err-label button')

const darkModeBtn = document.querySelector('.dark-mode-div');
const darkModeIcon = darkModeBtn.querySelector('ion-icon');
const darkModeText = document.querySelector('.dark-mode-div p')

const loadingCard = document.querySelector('.template')

if (filterBtn) {
  filterBtn.addEventListener('click', (e) => {
    filterDropdown.classList.toggle('open')
    filterBtn.classList.toggle('active')
  })
}

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

let allCountriesData;
let allCountriesCard;
let clonedCard;

function showSkeleton() {
  let skeletonCount;
  
  if (window.innerWidth < 768) {
    skeletonCount = 4
  } else if (window.innerWidth >= 768 && window.innerWidth < 1579) {
    skeletonCount = 6
  } else {
    skeletonCount = 10
  }
  
  for (let i = 0; i < skeletonCount; i++) {
    loadingCard.classList.add('loading-card');
    
    const clonedCard = loadingCard.cloneNode(true);
    
    countrySection.append(clonedCard)
  }
}

function hideSkeleton() {
  const allLoadingCards = document.querySelectorAll('.loading-card');
  
  allLoadingCards?.forEach((card) => {
    card.remove();
  })
}

async function getCountryData(apiUrl) {
  try {
    const url = await fetch(apiUrl);
    const response = await url.json();
    
    allCountriesData = response
    
    response.forEach((country) => {
      clonedCard = countryCard.cloneNode(true)
      clonedCard.classList.remove('template', 'loading-card')
      
      const clonedCardFlag = clonedCard.querySelector('img')
      clonedCardFlag.src = country?.flags?.svg
      clonedCardFlag.alt = country.flags.alt
      
      clonedCard.querySelector('h2').innerText = country?.name?.common
      
      clonedCard.querySelector('.population .info-value').innerText = country?.population?.toLocaleString() ?? 0
      
      clonedCard.querySelector('.region .info-value').innerText = country?.region ?? 'Unknown'
      
      clonedCard.querySelector('.capital .info-value').innerText = country?.capital?.[0] ?? 'Unknown'
      
      countrySection.append(clonedCard)
    })
    
    allCountriesCard = document.querySelectorAll('.country-card:not(.template, .loading-card)')
    
    return true;
  } catch (err) {
    console.log('API fetching failed:', err)
    
    error.innerText = '⚠ Failed to load country'
    errorPara.classList.remove('hidden')
    retryBtn.classList.remove('hidden')
    errorLabel.style.display = 'block'
    
    hideSkeleton();
    
    return false;
  }
}

const countriesUrl = 'https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital'

showSkeleton()
fetchApi()

function fetchApi() {
  setTimeout(async () => {
    const apiResult = await getCountryData(countriesUrl)
    
    if (apiResult) {
      hideSkeleton()
    }
  }, 300)
}

if (countrySection) {
  countrySection.addEventListener('click', (e) => {
    const card = e.target.closest('.country-card')
    
    if (!card) return
    
    const country = card.querySelector('h2').innerText
    
    window.location.href = `country.html?name=${country}`
  })
}

let currentSearch = ''
let currentRegion = 'all'

function updateUI(input, region) {
  let matchFound = false;
  
  allCountriesCard?.forEach((card) => {
    const countryName = card.querySelector('h2').innerText.toLowerCase()
    const cardRegion = card.querySelector('.region .info-value').innerText
    
    if (countryName.includes(input) && (region === 'all' || region === cardRegion)) {
      matchFound = true;
      card.style.display = 'block'
      
    } else {
      card.style.display = 'none'
    }
  })
  
  if (!matchFound) {
    error.innerText = 'No Country Found'
    errorPara.classList.add('hidden')
    retryBtn.classList.add('hidden')
    errorLabel.style.display = 'block'
  } else {
    error.innerText = ''
    errorLabel.style.display = 'none'
  }
  
  if(currentSearch === '') {
    error.innerText = ''
    errorLabel.style.display = 'none'
  }
}

searchBar.addEventListener('input', (e) => {
  currentSearch = e.target.value.toLowerCase()
  
  updateUI(currentSearch, currentRegion)
})

const continentAllSpan = document.querySelectorAll('.filter-dropdown p span')

filterDropdown.addEventListener('click', (e) => {
  const continent = e.target.closest('p')
  if (!continent) return
  
  continentAllSpan.forEach(span => span.innerText = '')
  
  continent.querySelector('span').innerHTML = '<ion-icon name="checkmark-outline"></ion-icon>'
  currentRegion = continent.childNodes[0].textContent.trim()
  
  updateUI(currentSearch, currentRegion)
})

retryBtn.addEventListener('click', () => {
  errorLabel.style.display = 'none'
  showSkeleton()
  fetchApi()
})
