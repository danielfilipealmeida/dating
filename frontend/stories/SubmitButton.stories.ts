import SubmitButton from '@/app/components/SubmitButton';
import type { Meta, StoryObj } from '@storybook/react';
//import { fn } from '@storybook/test';

const meta =  {
  title: 'Components/SubmitButton',
  component: SubmitButton,
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Submit Button',
    disabled: true
  }
}

