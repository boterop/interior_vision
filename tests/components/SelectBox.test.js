import 'react-native';
import React from 'react';
import {LangDescription, Modal, SelectBox} from '../../src/components';
import {act, create} from 'react-test-renderer';
import {Image, Pressable, View} from 'react-native';

const values = [
  {
    icon: require('../../src/assets/icons/english.png'),
    name: 'english',
    code: 'en',
  },
  {
    icon: require('../../src/assets/icons/spanish.png'),
    name: 'spanish',
    code: 'es',
  },
  {
    icon: require('../../src/assets/icons/french.png'),
    name: 'french',
    code: 'fr',
  },
];

it('renders correctly', () => {
  const mockOnSelectLanguage = jest.fn();
  const component = create(
    <SelectBox
      values={values}
      onSelectLanguage={mockOnSelectLanguage}
      icon={values[0].icon}
    />,
  );

  const image = component.root.findByType(Image).props;

  expect(image.source).toMatchObject(values[0].icon);
});

it('can select language correctly', async () => {
  let languageSelected;
  const mockOnSelectLanguage = jest.fn(lang => (languageSelected = lang));
  let component;

  act(() => {
    component = create(
      <SelectBox
        values={values}
        onSelectLanguage={mockOnSelectLanguage}
        icon={values[0].icon}
      />,
    );
  });

  const viewBeforeClick = component.root.findByType(View).props;
  const props = component.root.findByType(Pressable).props;

  await act(() => {
    props.onPress();
  });

  const viewAfterClick = component.root.findByType(View).props;
  const langOptions = component.root
    .findByType(Modal)
    .findAllByType(LangDescription);

  await act(() => {
    langOptions[2].findByType(Pressable).props.onPress();
  });

  expect(viewBeforeClick.children[1]).toBeNull();
  expect(viewAfterClick.children[1]).not.toBeNull();
  expect(langOptions.length).toEqual(3);
  expect(languageSelected.code).toEqual('fr');
  expect(mockOnSelectLanguage).toHaveBeenCalled();
});
