import 'react-native';
import React from 'react';
import { Button } from '../../src/components';
import { act, create } from 'react-test-renderer';
import { Pressable } from 'react-native';

it('renders correctly', () => {
    const mockOnPress = jest.fn();
    const component = create(<Button text="HI WORLD" onPress={mockOnPress} />).toJSON();

    expect(JSON.stringify(component)).toContain("HI WORLD");
});

it('is pressed correctly', () => {
    const mockOnPress = jest.fn();
    let component;

    act(() => {
        component = create(<Button text="HI WORLD" onPress={mockOnPress} />)
    });

    const props = component.root.findByType(Pressable).props;
    props.onPress();

    expect(mockOnPress).toHaveBeenCalled();
});