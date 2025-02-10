let searchBtn = document.getElementById("search-btn");
let countryInp = document.getElementById("country-inp");
let countryInfo = document.getElementById("country-info");
let battleBtn = document.getElementById("battle-btn");
let battleSection = document.getElementById("battle-section");
let battleInp = document.getElementById("country-battle-inp");
let battleStartBtn = document.getElementById("battle-start-btn");
let result = document.getElementById("result");

let country1 = null;
let country2 = null;

// Hàm lấy thông tin quốc gia
async function fetchCountryData(countryName) {
  try {
    let response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
    let data = await response.json();
    return data[0]; // Trả về quốc gia đầu tiên
  } catch (error) {
    return null;
  }
}

// Xử lý tìm kiếm quốc gia đầu tiên
searchBtn.addEventListener("click", async () => {
  let countryName = countryInp.value.trim();
  if (!countryName) {
    countryInfo.innerHTML = `<h3>Please enter a country name.</h3>`;
    return;
  }

  country1 = await fetchCountryData(countryName);
  if (!country1) {
    countryInfo.innerHTML = `<h3>Invalid country name. Try again.</h3>`;
    return;
  }

  countryInfo.innerHTML = `
    <h2>${country1.name.common}</h2>
    <img src="${country1.flags.svg}" class="flag-img">
    <p>Population: ${country1.population.toLocaleString()}</p>
    <p>Area: ${country1.area.toLocaleString()} km²</p>
    <p>Capital: ${country1.capital?.[0] || "N/A"}</p>
    <p>Region: ${country1.region}</p>
    <p>Subregion: ${country1.subregion || "N/A"}</p>
    <p>Languages: ${Object.values(country1.languages || {}).join(", ")}</p>
    <p>Currencies: ${Object.values(country1.currencies || {}).map(c => c.name).join(", ")}</p>
    <p>Timezones: ${country1.timezones.join(", ")}</p>
  `;

  battleBtn.classList.remove("hidden"); // Hiện nút Battle
});

// Khi nhấn nút "Battle với quốc gia khác"
battleBtn.addEventListener("click", () => {
  battleSection.classList.remove("hidden");
});

// Khi bắt đầu Battle
battleStartBtn.addEventListener("click", async () => {
  let countryName = battleInp.value.trim();
  if (!countryName) {
    result.innerHTML = `<h3 class="error-message">Please enter a second country name.</h3>`;
    return;
  }

  country2 = await fetchCountryData(countryName);
  if (!country2) {
    result.innerHTML = `<h3>Invalid country name. Try again.</h3>`;
    return;
  }

  let population1 = country1.population || 0;
  let population2 = country2.population || 0;
  let area1 = country1.area || 0;
  let area2 = country2.area || 0;
  let gdp1 = country1.gini ? Object.values(country1.gini)[0] || 0 : 0;
  let gdp2 = country2.gini ? Object.values(country2.gini)[0] || 0 : 0;
  let timezone1 = country1.timezones.length;
  let timezone2 = country2.timezones.length;

  let winnerPopulation = population1 > population2 ? country1.name.common : country2.name.common;
  let winnerArea = area1 > area2 ? country1.name.common : country2.name.common;
  let winnerGdp = gdp1 > gdp2 ? country1.name.common : country2.name.common;
  let winnerTimezones = timezone1 > timezone2 ? country1.name.common : country2.name.common;

  result.innerHTML = `
    <h2>Country Battle Royale</h2>
    <div class="battle">
      <div class="country">
        <img src="${country1.flags.svg}" class="flag-img">
        <h3>${country1.name.common}</h3>
        <p>Population: ${population1.toLocaleString()}</p>
        <p>Area: ${area1.toLocaleString()} km²</p>
        <p>Capital: ${country1.capital?.[0] || "N/A"}</p>
        <p>Region: ${country1.region}</p>
        <p>Subregion: ${country1.subregion || "N/A"}</p>
        <p>Languages: ${Object.values(country1.languages || {}).join(", ")}</p>
        <p>Currencies: ${Object.values(country1.currencies || {}).map(c => c.name).join(", ")}</p>
        <p>Timezones: ${country1.timezones.join(", ")}</p>
      </div>
      <div class="vs">VS</div>
      <div class="country">
        <img src="${country2.flags.svg}" class="flag-img">
        <h3>${country2.name.common}</h3>
        <p>Population: ${population2.toLocaleString()}</p>
        <p>Area: ${area2.toLocaleString()} km²</p>
        <p>Capital: ${country2.capital?.[0] || "N/A"}</p>
        <p>Region: ${country2.region}</p>
        <p>Subregion: ${country2.subregion || "N/A"}</p>
        <p>Languages: ${Object.values(country2.languages || {}).join(", ")}</p>
        <p>Currencies: ${Object.values(country2.currencies || {}).map(c => c.name).join(", ")}</p>
        <p>Timezones: ${country2.timezones.join(", ")}</p>
      </div>
    </div>
    <h3>🏆 Winner (Population): ${winnerPopulation}</h3>
    <h3>🏆 Winner (Area): ${winnerArea}</h3>
    <h3>🏆 Winner (GDP Gini Index): ${winnerGdp}</h3>
    <h3>🏆 Winner (Timezones Count): ${winnerTimezones}</h3>
  `;
});
