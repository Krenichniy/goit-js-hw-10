const BASE_URL = 'https://restcountries.com/v3.1/name/';
// const filterCountry = `fields={name.official},capital,population,languages,{flags.svg}`;
// const url = 'https://restcountries.com/v2/name?fields=name,capital,currencies';
const searchParams = new URLSearchParams({
  fields: 'name,capital,population,flags,languages',
});

export function fetchCountries(name) {
  const url = `${BASE_URL}${name}?${searchParams}`;
  return fetch(url).then(response => {
    return response.json();
  });
}
