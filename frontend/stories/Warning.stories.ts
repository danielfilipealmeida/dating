import Warning from "@/app/components/Warning";
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Components/Warning',
    component: Warning
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children:"A warning box to display some messages"
    }
}