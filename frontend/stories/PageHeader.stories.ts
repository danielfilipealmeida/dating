import PageHeader from "@/app/components/PageHeader";

const meta: Meta<typeof PageHeader> = {
    title: 'Components/PageHeader',
    component: PageHeader,
    decorators: []
}
export default meta;
type Story = StoryObj<typeof meta>
export const Default: Story = {
    args: {}
}