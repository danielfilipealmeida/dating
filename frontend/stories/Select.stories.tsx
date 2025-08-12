import Select from "@/app/components/Select";
import { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: "Components/Select",
    component: Select
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        name: "exampleSelect",
        value: "VAL1",
        options: {
            'VAL1': 'Value 1',
            'VAL2': 'Value 2',
            'VAL3': 'Value 3'
        }
    }
}