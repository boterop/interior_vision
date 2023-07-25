const {Languages} = require('../../src/consts');

it('get languages', () => {
  const languages = Languages.get();

  expect(languages[0]).toMatchObject({name: 'english', code: 'en'});
  expect(languages.length).toEqual(3);
});

it('get language by code', () => {
  expect(Languages.getLanguageByCode('en')).toMatchObject({
    name: 'english',
    code: 'en',
  });
  expect(Languages.getLanguageByCode('es')).toMatchObject({
    name: 'spanish',
    code: 'es',
  });
  expect(Languages.getLanguageByCode('fr')).toMatchObject({
    name: 'french',
    code: 'fr',
  });
});
