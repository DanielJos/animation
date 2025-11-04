// src/components/SplitFlapBank.stories.tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import SplitFlapDisplay from "./SplitFlapDisplay";
import { useState } from "react";

const meta = {
  title: "SplitFlapBank",
  component: SplitFlapDisplay,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    target: "HELLO WORLD",
    duration: 0.1,
  },
  argTypes: {
    target: { control: "text" },
    duration: { control: "number" },
  },
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
          background: "#f6f7fb",
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SplitFlapDisplay>;

export default meta;

type Story = StoryObj<typeof SplitFlapDisplay>;

export const Standard: Story = {
  render: (args) => <SplitFlapDisplay {...args} />,
};

export const FixedWidthInteractable: Story = {
  args: {
    duration: 0.1,
  },
  render: (args) => {
    const [target, setTarget] = useState<string>("SOME WORDS");
    const [inputValue, setInputValue] = useState<string>("");

    return (
      <div
        style={{
          height: "100px",
        }}
      >
        <SplitFlapDisplay
          {...args}
          target={target}
          cellStyle={{
            // width: "40px",
            backgroundColor: "white",
            fontFamily: "'Roboto Mono', 'Courier New', monospace",
            fontSize: 40,
          }}
        />
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={(e) => setTarget(inputValue)}>Set Target</button>
      </div>
    );
  },
};

export const NumericTicker: Story = {
  args: {
    target: "2025 11 03",
    duration: 0.08,
    charset: " 0123456789",
  },
  render: (args) => <SplitFlapDisplay {...args} />,
};
