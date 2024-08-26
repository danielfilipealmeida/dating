import PictureGallery from "@/app/components/PictureGallery";
import { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof PictureGallery> = {
    title: 'Components/PictureGallery',
    component: PictureGallery,
    decorators: [
        (Story) => (
            <div className="flex flex-cols w-64" style={{height: '300px'}}>
                <Story />
            </div>
    )
    ]
}

export default meta;
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
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
        ]
    },
    

}