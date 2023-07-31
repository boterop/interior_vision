import React from 'react';
import {ChatInput} from '../../src/components';
import {act, create} from 'react-test-renderer';
import {Image, Pressable, TextInput} from 'react-native';

it('renders correctly', () => {
  const mockOnSendMessage = jest.fn();
  const component = create(<ChatInput onSendMessage={mockOnSendMessage} />);

  const image = component.root.findByType(Image).props;

  expect(image.source).toMatchObject(
    require('../../src/assets/icons/send.png'),
  );
  expect(mockOnSendMessage).not.toHaveBeenCalled();
});

it('can send messages', async () => {
  const MESSAGE = 'This is a msg';
  const mockOnSendMessage = jest.fn(msg => (message = msg));
  let message = '';
  let component;

  act(
    () => (component = create(<ChatInput onSendMessage={mockOnSendMessage} />)),
  );

  await act(() =>
    component.root.findByType(TextInput).props.onChangeText(MESSAGE),
  );

  const inputBeforeSend = component.root.findByType(TextInput).props;
  const presableProps = component.root.findByType(Pressable).props;

  await act(() => presableProps.onPress());

  const inputAfterSend = component.root.findByType(TextInput).props;

  expect(inputBeforeSend.value).toEqual(MESSAGE);
  expect(inputAfterSend.value).toEqual('');
  expect(message).toEqual(MESSAGE);
  expect(mockOnSendMessage).toHaveBeenCalled();
}, 20000);
