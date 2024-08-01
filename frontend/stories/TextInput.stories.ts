import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import TextInput from "../app/components/TextInput"

const meta = {
    title: 'Components/TextInput',
    component: TextInput
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Placeholder string',
    type: 'input',
    name: 'textInput',
    required: true
  }
}