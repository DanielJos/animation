// src/components/RetroMtrltyLoader.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import SplitFlap from "./SplitFlap";

const meta = {
  title: "Loaders/SplitFlap",
  component: SplitFlap,
  parameters: {
    layout: "fullscreen",
  },
  args: {},
  argTypes: {},
  decorators: [
    (Story) => (
      <div
        style={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
          boxSizing: "border-box",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SplitFlap>;

export default meta;

type Story = StoryObj<typeof SplitFlap>;

export const Standard: Story = {
  render: (args) => {
    return <SplitFlap {...args} />;
  },
};
