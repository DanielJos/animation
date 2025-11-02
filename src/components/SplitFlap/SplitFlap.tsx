import { Button, Typography } from "@mui/material";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  AnimationPlaybackControls,
} from "framer-motion";
import { useRef } from "react";

export type SplitFlapProps = { duration?: number };

const coverBottom = {
  maskImage: "linear-gradient(to bottom, black 50%, transparent 50%)",
};
const coverTop = {
  maskImage: "linear-gradient(to top, black 50%, transparent 50%)",
};

// Concave times ⇒ acceleration
const makeTimes = (n: number, p = 2) =>
  Array.from({ length: n }, (_, i) => Math.pow(i / (n - 1), p));

export const SplitFlap = ({ duration = 0.2 }: SplitFlapProps) => {
  // Shared clock 0..1
  const t = useMotionValue(0);
  const animRef = useRef<AnimationPlaybackControls | null>(null);

  // Keyframes
  const values = [-1, -0.66, -0.33, 0, 0.33, 0.66, 1, 1];
  const times = makeTimes(values.length, 0.5);

  // Map clock → props
  const scaleYBackFront = useTransform(t, times, values); // accelerating flip
  const scaleYFrontBack = useTransform(t, times, values.reverse()); // accelerating flip
  const firstOpacity = useTransform(t, [0, 0.8499, 0.85, 1], [1, 1, 0, 0]); // reveal after halfway
  const secondOpacity = useTransform(t, [0, 0.5499, 0.55, 1], [0, 0, 1, 1]); // reveal after halfway

  const handleClick = () => {
    // restart the clock for a single cycle
    animRef.current?.stop();
    t.set(0);
    animRef.current = animate(t, 1, { duration, ease: "linear" }); // no repeat = one flip
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        height: "100px",
        backgroundColor: "white",
      }}
    >
      {/* Initial number */}
      <motion.div
        style={{
          transformOrigin: "50% 50%",
          scaleY: scaleYFrontBack,
          opacity: firstOpacity,
          zIndex: 10,
          backgroundColor: "inherit",
        }}
      >
        <div style={{ backgroundColor: "inherit" }}>
          <Typography fontSize={40} lineHeight={1}>
            7
          </Typography>
        </div>
      </motion.div>

      {/* Next bottom */}
      <motion.div
        initial={{ scaleY: 0 }}
        style={{
          scaleY: scaleYBackFront,
          opacity: secondOpacity,
          transformOrigin: "50% 50%",
          position: "absolute",
          zIndex: 10,
          backgroundColor: "transparent",
        }}
      >
        <div style={{ backgroundColor: "inherit", ...coverTop }}>
          <Typography fontSize={40} lineHeight={1}>
            8
          </Typography>
        </div>
      </motion.div>

      {/* Next top */}
      <motion.div
        initial={{
          scaleY: 1,
        }}
        style={{
          transformOrigin: "50% 50%",
          position: "absolute",
          zIndex: 9,
          backgroundColor: "inherit",
        }}
      >
        <div style={{ backgroundColor: "inherit", ...coverBottom }}>
          <Typography fontSize={40} lineHeight={1}>
            8
          </Typography>
        </div>
      </motion.div>

      <Button variant="contained" onClick={handleClick}>
        Flip
      </Button>
    </div>
  );
};

export default SplitFlap;
