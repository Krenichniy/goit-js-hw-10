// import countryCard from './country.hbs';
import debounce from 'lodash.debounce';
import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const refs = {
  onCountrySearch: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.onCountrySearch.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

// function that searches country on user input
function searchCountry({ target: { value } }) {
  const form = value.trim();
  clearMarkup();

  if (!form) {
    return;
  }

  fetchCountries(form).then(render).catch(onFetchError);
}

// function that renders  countries list or exact country dependes of quatity of entered symbols on user input
function render(countries) {
  clearMarkup();

  if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length > 1) {
    renderCountryList(countries);
    onCountryList(countries);
  } else {
    renderCountryItem(countries);
  }
}
// function that renders  countries list
function renderCountryList(countries) {
  refs.countryList.innerHTML = createCountryItem(countries);
}
// function that add litener to the  countries list
function onCountryList(countries) {
  const items = document.querySelectorAll('.country-list__item');
  items.forEach(item => item.addEventListener('click', onCountryItem));

  function onCountryItem(event) {
    const { currentTarget } = event;

    const filteredItem = countries.filter(
      country => country.name.official === currentTarget.dataset.item,
    );
    console.log(filteredItem);

    render(filteredItem);

    items.forEach(item => item.removeEventListener('click', onCountryItem));
  }
}
// function that creates  country list markup
function createCountryItem(countries) {
  return countries
    .map(country => {
      const {
        name: { official },
        flags: { svg },
      } = country;

      return `<li class="country-list__item" data-item="${official}">
        <img src="${svg}" alt="${official}" width="30" >
        <p>${official}</p>
      </li>`;
    })
    .join('');
}
// function that renders country list item
function renderCountryItem(countries) {
  refs.countryList.innerHTML = createCountryInfo(countries);
}
// add country card markup
function createCountryInfo(countries) {
  return countries
    .map(country => {
      const {
        name: { official },
        flags: { svg },
        capital,
        population,
        languages,
      } = country;
      const allLanguges = Object.values(languages).join(',');

      return `<div class="card">
  <div class="card-img-top">
    <img src="${svg}" alt="${official}"  width="30" />
    <h1>${official}</h1>
  </div>

  <div class="card-body">
    <p class="card-text">Capital: ${capital}</p>
    <p class="card-text">Population: ${population}</p>
    <p class="card-text">Languages:${allLanguges}</p>

  </div>
</div>`;
    })
    .join('');
}
// function that acts on response error
function onFetchError(error) {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
// function that cleans markup
function clearMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
