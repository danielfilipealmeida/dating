import Profile from "@/app/components/Profile";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Profile> = {
    title: 'Components/Profile',
    component: Profile,
    decorators: [
        (Story) => (
            <div style={{width: "600px"}}>
                <Story />
            </div>
        )
    ]
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        data: {
            pictures: [
                {
                    path: "8241649609f88ccd2a0a5b233a07a538ec313ff6adf695aa44a969dbca39f67d/01.png"
                },
                {
                    path: "e3d6c4d4599e00882384ca981ee287ed961fa5f3828e2adb5e9ea890ab0d0525/01.png"
                },
                {
                    path: "8241649609f88ccd2a0a5b233a07a538ec313ff6adf695aa44a969dbca39f67d/01.png"
                }
            ],
            name: "Jane Doe",
            bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tristique congue posuere. Donec viverra ipsum at suscipit placerat. In varius urna at turpis dapibus dignissim. Ut interdum molestie accumsan. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer sem nisl, iaculis id nunc et, rhoncus molestie velit. Etiam vitae urna commodo, egestas odio vel, lacinia nunc. Mauris auctor, odio non maximus cursus, ex quam imperdiet mi, ut porta est neque ac nisi. Donec nisl nibh, blandit a ornare in, tempus vitae diam.",
            sex: "FEMALE"
        }
    }
}