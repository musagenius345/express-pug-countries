function checkCurrency(currencies) {
  if (!currencies) { return 'N/A' }

  if (currencies) {
    const currencyNames = Object.entries(currencies).map(([currencyCode, currency]) => {
      return currency && currency.name ? currency.name : 'N/A';
    });

    return currencyNames.join(', '); // Join the currency names into a single string
  }
}



window.addEventListener('DOMContentLoaded', () => {
  main();
});

async function main() {
  // Fetch and display countries on the main page
  const data = await fetchData();
  const sortedData = sortAlphaBeta(data);
  container.setAttribute('aria-busy', 'false')
  let i = 0
  for (const item of sortedData) {
    const country = document.createElement('article')
    country.style.cursor = 'pointer'
    //const country = document.createElement('article')
    const { name, capital, population, currencies, flags } = item;
    const img = document.createElement('img')
    const nameHeading = document.createElement('h3')
    const capitalHeading = document.createElement('h4')
    const populationParagraph = document.createElement('p')
    const currencyParagraph = document.createElement('p')

    img.classList.add('flag')
    img.setAttribute('alt', `${name.common}'s flag`)
    img.setAttribute('href', `${flags.png}`)
    img.setAttribute('src', `${flags.svg}`)
    img.setAttribute('loading', 'lazy')
    nameHeading.textContent = `${name.common}`
    capitalHeading.textContent = `Capital City: ${capital}`
    populationParagraph.textContent = `Population: ${population.toLocaleString()}`
    currencyParagraph.textContent = `Currency : ${checkCurrency(currencies)}`

    country.appendChild(img)
    country.appendChild(nameHeading)
    country.appendChild(capitalHeading)
    country.appendChild(populationParagraph)
    country.appendChild(currencyParagraph)

    container.appendChild(country)
  }

  // Handle click events on country links
  const countryLinks = document.querySelectorAll('.country-link');
  countryLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const countryName = link.getAttribute('href').split('/').pop();
      await loadCountryPage(countryName);
    });
  });
}

async function loadCountryPage(countryName) {
  try {
    const response = await fetch(`/api/country/${countryName}`);
    const countryData = await response.json();

    // Render the country details page
    const countryDetailsContainer = document.querySelector('.country-details');
    countryDetailsContainer.innerHTML = ''; // Clear previous content

    const article = document.createElement('article');
    article.style.cursor = 'pointer'; // Make it consistent with the main page

    const { name, capital, population, flags } = countryData;

    const img = document.createElement('img');
    img.classList.add('flag');
    img.src = flags.svg;
    img.alt = `${name.common}'s flag`;
    img.loading = 'lazy';

    const h1 = document.createElement('h1');
    h1.textContent = name.common;

    const h2 = document.createElement('h2');
    h2.textContent = `Capital City: ${capital[0]}`; // Assuming it's an array

    const pPopulation = document.createElement('p');
    pPopulation.textContent = `Population: ${population.toLocaleString()}`;

    // You can add more elements as needed using spread syntax

    article.appendChild(img);
    article.appendChild(h1);
    article.appendChild(h2);
    article.appendChild(pPopulation);

    // Append the article to the container
    countryDetailsContainer.appendChild(article);
  } catch (error) {
    console.error(error);
  }
}









/**
 * @typedef { Object } Country
 * @property { Object } name - Information about the country 's name. *
 * @property { string } name.common - The common name of the country.
 * *@property { string } name.official - The official name of the country.
 * @property {Object} name.nativeName - Information about the native name of the country.
 * @property {string[]} tld - An array of top-level domains associated with the country.
 * @property {string} cca2 - The two-letter country code.
 * @property {string} ccn3 - The three-digit country code.
 * @property {string} cca3 - The three-letter country code.
 * @property {string} cioc - The country's International Olympic Committee (IOC) code.
 * @property {boolean} independent - Indicates whether the country is independent.
 * @property {string} status - The status of the country (e.g., 'officially-assigned').
 * @property {boolean} unMember - Indicates whether the country is a member of the United Nations.
 * @property {Object.<string, Object>} currencies - Information about the country's currencies.
 * @property {Object} idd - Information about international direct dialing (IDD) codes.
 * @property {string} idd.root - The IDD root code.
 * @property {string[]} idd.suffixes - An array of IDD suffixes.
 * @property {string[]} capital - An array of the country's capital cities.
 * @property {string[]} altSpellings - An array of alternate spellings or names for the country.
 * @property {string} region - The region where the country is located.
 * @property {string} subregion - The subregion where the country is located.
 * @property {Object.<string, string>} languages - Information about the country's languages.
 * @property {Object.<string, Object>} translations - Translations of country information.
 * @property {number[]} latlng - The latitude and longitude coordinates of the country.
 * @property {boolean} landlocked - Indicates whether the country is landlocked.
 * @property {string[]} borders - An array of bordering countries.
 * @property {number} area - The area of the country.
 * @property {Object.<string, Object>} demonyms - Information about country demonyms.
 * @property {string} flag - The flag of the country.
 * @property {Object.<string, string>} maps - URLs to maps of the country.
 * @property {number} population - The population of the country.
 * @property {Object.<string, number>} gini - The Gini coefficient data.
 * @property {string} fifa - The FIFA code of the country.
 * @property {Object} car - Information about the country's driving habits.
 * @property {string[]} car.signs - An array of road signs used in the country.
 * @property {string} car.side - The side of the road on which vehicles drive.
 * @property {string[]} timezones - An array of timezones used in the country.
 * @property {string[]} continents - An array of continents to which the country belongs.
 * @property {Object.<string, string>} flags - URLs to flag images and alternative flag descriptions.
 * @property {Object.<string, string>} coatOfArms - URLs to coat of arms images.
 * @property {string} startOfWeek - The start of the week in the country.
 * @property {Object} capitalInfo - Information about the country's capital city.
 * @property {number[]} capitalInfo.latlng - The latitude and longitude coordinates of the capital city.
 * @property {Object} postalCode - Information about postal codes in the country.
 * @property {string} postalCode.format - The format of postal codes in the country.
 * @property {string} postalCode.regex - The regular expression pattern for matching postal codes.
 */



const container = document.querySelector('.countries')


/**
 * Fetches data and returns an array of Country objects.
 * @returns {Promise<Country[]>} An array of Country objects.
 **/
async function fetchData() {
  const URL = 'https://restcountries.com/v3.1/all';

  const response = await fetch(URL);
  const data = await response.json();
  return data;
}

/**
 * Sorts an array of Country objects alphabetically by common name.
 * @param {Country[]} data - An array of Country objects.
 * @returns {Country[]} An array of Country objects sorted by common name.
 */
function sortAlphaBeta(data) {
  return data.sort((a, b) => a.name.common.toLowerCase().localeCompare(b.name.common.toLowerCase()));
}