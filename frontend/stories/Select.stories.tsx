import Select from "@/app/components/Select";

const meta = {
    title: "Components/Select",
    component: Select
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        options: {
            'VAL1': 'Value 1',
            'VAL2': 'Value 2',
            'VAL3': 'Value 3'
        }
    }
}