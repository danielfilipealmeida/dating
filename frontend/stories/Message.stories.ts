
import Message from '@/app/components/Message';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Components/Message',
    component: Message
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children:"A message box to display some messages"
    }
}