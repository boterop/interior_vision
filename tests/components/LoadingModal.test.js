import React from 'react';
import {LoadingModal} from '../../src/components';
import {create} from 'react-test-renderer';
import {Image} from 'react-native';

it('renders correctly', () => {
  const component = create(<LoadingModal isVisible={false} />);

  expect(component.toJSON()).toBeNull();
});

it('is showed correctly', () => {
  const expectedImage = require('../../src/assets/icons/loading.gif');
  const component = create(<LoadingModal isVisible={true} />);

  const image = component.root.findByType(Image).props;

  expect(image.source).toMatchObject(expectedImage);
});
