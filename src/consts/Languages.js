const values = [
  {icon: require('../assets/icons/english.png'), name: 'english', code: 'en'},
  {icon: require('../assets/icons/spanish.png'), name: 'spanish', code: 'es'},
  {icon: require('../assets/icons/french.png'), name: 'french', code: 'fr'},
];

const Languages = {
  get: () => values,
  getLanguageByCode: code => values.filter(lang => lang.code === code)[0],
};

export default Languages;
