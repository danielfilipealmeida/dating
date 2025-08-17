import { Meta, StoryObj } from "@storybook/react";
import PageFooter from "@/app/components/PageFooter";

const meta: Meta<typeof PageFooter> = {
    title: 'Components/PageFooter',
    component: PageFooter,
    decorators: [],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};