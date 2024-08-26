import { Meta } from '@storybook/react';
import {H1} from '../app/components/Headers'

const meta: Meta<typeof H1> = {
    title: 'Components/Headers',
    component: H1
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children:'H1 title'
    },
}