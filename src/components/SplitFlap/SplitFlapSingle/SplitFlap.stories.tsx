// src/components/RetroMtrltyLoader.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import SplitFlapSingle from "./SplitFlap";
import { getNext10, getNextAlphabetic } from "../getNext";

const meta = {
  title: "Loaders/SplitFlap",
  component: SplitFlapSingle,
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
} satisfies Meta<typeof SplitFlapSingle>;

export default meta;

type Story = StoryObj<typeof SplitFlapSingle>;

export const Standard: Story = {
  render: (args) => {
    return <SplitFlapSingle {...args} />;
  },
};
