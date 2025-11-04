import { Button, Typography } from "@mui/material";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  AnimationPlaybackControls,
} from "framer-motion";
import {
  CSSProperties,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { distanceForward, nextInSet } from "../getNext";

export type SplitFlapHandle = {
  spinTo: (target: string) => void;
  stop: () => void;
};

export type SplitFlapProps = {
  duration?: number;
  targetChar?: string; // optional: when provided, spin to char
  // Optional
  charset?: string;
  cellStyle?: CSSProperties;
};

const coverBottom = {
  maskImage: "linear-gradient(to bottom, black 50%, transparent 50%)",
};
const coverTop = {
  maskImage: "linear-gradient(to top, black 50%, transparent 50%)",
};

// Concave times ⇒ acceleration
const makeTimes = (n: number, p = 2) =>
  Array.from({ length: n }, (_, i) => Math.pow(i / (n - 1), p));

const defaultCharset =
  " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const SplitFlapSingle = forwardRef<SplitFlapHandle, SplitFlapProps>(
  (
    { duration = 0.1, targetChar, charset = defaultCharset, cellStyle },
    ref
  ) => {
    const [currentChar, setCurrentChar] = useState(charset[0] ?? "0");
    const [nextChar, setNextChar] = useState(
      nextInSet(charset[0] ?? "0", charset)
    );

    // Shared clock
    const t = useMotionValue(0);
    const animRef = useRef<AnimationPlaybackControls | null>(null);
    const stepsLeftRef = useRef(0);
    const runningRef = useRef(false);

    // Keyframes
    const valuesForward = useMemo(
      () => [-1, -0.66, -0.33, 0, 0.33, 0.66, 1, 1],
      []
    );
    const valuesBackward = useMemo(
      () => [...valuesForward].reverse(),
      [valuesForward]
    );
    const times = useMemo(
      () => makeTimes(valuesForward.length, 0.5),
      [valuesForward.length]
    );

    // Map clock → props
    const scaleYBackFront = useTransform(t, times, valuesForward); // accelerating flip
    const scaleYFrontBack = useTransform(t, times, valuesBackward); // accelerating flip
    const firstOpacity = useTransform(t, [0, 0.8499, 0.85, 1], [1, 1, 0, 0]);
    const secondOpacity = useTransform(t, [0, 0.5499, 0.55, 1], [0, 0, 1, 1]);

    const flipOnce = (onDone?: () => void) => {
      animRef.current?.stop();
      t.set(0);
      animRef.current = animate(t, 1, {
        duration,
        ease: "linear",
        onComplete: () => {
          // Promote next → current
          setCurrentChar((prev) => {
            const newCurr = nextCharRef.current;
            return newCurr;
          });

          // Decrement steps and either continue or finish
          stepsLeftRef.current -= 1;

          if (stepsLeftRef.current > 0 && runningRef.current) {
            // Prepare next step
            const n = nextInSet(nextCharRef.current, charset);
            setNextChar(n);
            nextCharRef.current = n;
            // Chain next flip
            flipOnce(onDone);
          } else {
            runningRef.current = false;
            onDone?.();
          }
        },
      });
    };

    // Keep a ref of nextChar to avoid stale closures inside onComplete
    const nextCharRef = useRef(nextChar);
    useEffect(() => {
      nextCharRef.current = nextChar;
    }, [nextChar]);

    const startSequence = (target: string) => {
      if (!charset.length) return;
      // Cancel any running sequence
      runningRef.current = false;
      animRef.current?.stop();

      const steps = distanceForward(currentChar, target, charset);
      if (steps === 0) return;

      // check nextChar is one step ahead
      const firstNext =
        steps === 0 ? currentChar : nextInSet(currentChar, charset);
      setNextChar(firstNext);
      nextCharRef.current = firstNext;

      stepsLeftRef.current = steps;
      runningRef.current = true;
      flipOnce();
    };

    // API
    useImperativeHandle(ref, () => ({
      spinTo: (target: string) => startSequence(target),
      stop: () => {
        runningRef.current = false;
        animRef.current?.stop();
      },
    }));

    // Auto-run when targetChar changes
    useEffect(() => {
      if (targetChar && charset.includes(targetChar)) {
        startSequence(targetChar);
      }
    }, [targetChar, charset]);

    const handleManualFlip = () => {
      // Single manual flip (useful for testing)
      if (runningRef.current) return;
      stepsLeftRef.current = 1;
      runningRef.current = true;
      // Ensure next is correct
      const n = nextInSet(currentChar, charset);
      setNextChar(n);
      nextCharRef.current = n;
      flipOnce();
    };

    return (
      <div
        className="cell-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          backgroundColor: "white",
          position: "relative",
          ...cellStyle,
        }}
      >
        {/* Current (front) */}
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
            <p>{currentChar}</p>
          </div>
        </motion.div>

        {/* Next bottom (revealed during flip) */}
        <motion.div
          initial={{ scaleY: 0 }}
          style={{
            scaleY: scaleYBackFront,
            opacity: secondOpacity,
            transformOrigin: "50% 50%",
            position: "absolute",
            zIndex: 10,
            backgroundColor: "transparent",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <div style={{ backgroundColor: "inherit", ...coverTop }}>
            <p>{nextChar}</p>
          </div>
        </motion.div>

        {/* Next top (covers upper half during flip) */}
        <motion.div
          initial={{ scaleY: 1 }}
          style={{
            transformOrigin: "50% 50%",
            position: "absolute",
            zIndex: 9,
            backgroundColor: "inherit",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <div style={{ backgroundColor: "inherit", ...coverBottom }}>
            <p>
              {/* If the current char is a space, 
              then we want it to be seen as empty 
              and we don't line up the next char */}
              {currentChar != " " && nextChar}
            </p>
          </div>
        </motion.div>
      </div>
    );
  }
);

export default SplitFlapSingle;
