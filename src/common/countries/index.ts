import englishCities from './english/cities.json';
import englishCountries from './english/countries.json';
import englishProvince from './english/provinceList.json';
import englishStates from './english/states.json';
import italianCities from './italian/cities.json';
import italianCountries from './italian/countries.json';
import italianProvince from './italian/provinceList.json';
import italianStates from './italian/states.json';

export const getCountriesJson = (language: string) => {
  switch (language) {
    case 'english':
      return englishCountries;
    case 'italian':
      return italianCountries;
  }
};

export const getStateJson = (language: string) => {
  switch (language) {
    case 'english':
      return englishStates;
    case 'italian':
      return italianStates;
  }
};

export const getCitiesJson = (language: string) => {
  switch (language) {
    case 'english':
      return englishCities;
    case 'italian':
      return italianCities;
  }
};

export const getProvinceJson = (language: string) => {
  switch (language) {
    case 'english':
      return englishProvince;
    case 'italian':
      return italianProvince;
  }
};
