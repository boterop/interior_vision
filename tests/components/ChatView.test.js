import React from 'react';
import {ChatView} from '../../src/components';
import {create} from 'react-test-renderer';
import {FlatList, Text} from 'react-native';

const messages = [
  {role: 'system', content: 'test system msg'},
  {role: 'assistant', content: 'test assistant msg'},
  {role: 'user', content: 'test user msg'},
];

const thinking = 'thinking';
const mockTranslate = jest.fn(() => thinking);

it('renders correctly', () => {
  const component = create(
    <ChatView
      translate={mockTranslate}
      messages={messages}
      isThinking={false}
    />,
  );

  const flatList = component.root.findByType(FlatList);
  const chatItems = flatList.findAllByType(Text);

  const styleAssistant = JSON.stringify(chatItems[0].props.style);
  const styleUser = JSON.stringify(chatItems[1].props.style);
  const thinkingText = component.root.findAllByType(Text)[2];

  expect(thinkingText).not.toBeDefined();
  expect(Object.keys(chatItems).length).toEqual(2);
  expect(chatItems[0].props.children.toLowerCase()).toEqual(
    messages[1].content,
  );
  expect(chatItems[1].props.children.toLowerCase()).toEqual(
    messages[2].content,
  );
  expect(styleAssistant).toContain('paddingRight');
  expect(styleUser).toContain('paddingLeft');
});

it('is thinking', () => {
  const component = create(
    <ChatView
      translate={mockTranslate}
      messages={messages}
      isThinking={true}
    />,
  );

  const thinkingText = component.root.findAllByType(Text)[2];

  expect(thinkingText).toBeDefined();
  expect(thinkingText.props.children).toMatchObject([thinking, '...']);
});
