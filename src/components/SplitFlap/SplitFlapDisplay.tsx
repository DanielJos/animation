// SplitFlapBank.tsx
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import Stack from "@mui/material/Stack";
import type { SxProps, Theme } from "@mui/material/styles";
import SplitFlapSingle, {
  SplitFlapHandle,
  SplitFlapProps,
} from "./SplitFlapSingle/SplitFlap";

export type SplitFlapDisplayHandle = {
  spinTo: (word: string) => void;
  stop: () => void;
};

export type SplitFlapDisplayProps = {
  target?: string;
  gap?: number | string;
  charset?: string;
  cellStyle?: React.CSSProperties;
  bankSx?: SxProps<Theme>;
  onComplete?: () => void;
  duration?: number;
};

const DEFAULT_CHARSET =
  " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

const SplitFlapDisplay = forwardRef<
  SplitFlapDisplayHandle,
  SplitFlapDisplayProps
>(
  (
    {
      target = "",
      gap = 1,
      charset = DEFAULT_CHARSET,
      cellStyle,
      bankSx,
      onComplete,
      duration = 0.1,
    },
    ref
  ) => {
    // Normalise target (apply uppercase if requested, ensure spaces exist in charset).
    const activeCharset = useMemo(() => {
      // Guarantee space exists so padding works
      return charset.includes(" ") ? charset : ` ${charset}`;
    }, [charset]);

    const cells = useMemo(() => target.split(""), [target]);

    useEffect(() => {
      console.log("cells", cells);
    }, [cells]);

    // Refs for each cell
    const refs = useRef<SplitFlapHandle[]>([]);
    // Ensure refs array matches cells length
    useEffect(() => {
      refs.current = Array(cells.length)
        .fill(null)
        .map((_, i) => refs.current[i] || ({} as SplitFlapHandle));
    }, [cells.length]);

    // Drive children when target changes, with stagger
    useEffect(() => {
      let cancelled = false;
      const timers: number[] = [];

      cells.forEach((ch, i) => {
        const run = () => refs.current[i]?.spinTo?.(ch);
        const id = window.setTimeout(run, i * 1000);
        timers.push(id);
      });

      // Fire onComplete when last staggered cell should have finished
      if (onComplete) {
        const lastIndex = Math.max(0, cells.length - 1);
        const eta = lastIndex * 1000;
        const finalId = window.setTimeout(() => {
          if (!cancelled) onComplete();
        }, eta);
        timers.push(finalId);
      }

      return () => {
        cancelled = true;
        timers.forEach(clearTimeout);
      };
    }, [target, cells.length, onComplete]);

    // Expose imperative API
    useImperativeHandle(ref, () => ({
      spinTo: (word: string) => {
        word.split("").forEach((ch, i) => {
          const delay = i;
          window.setTimeout(() => refs.current[i]?.spinTo?.(ch), delay);
        });
      },
      stop: () => {
        refs.current.forEach((r) => r?.stop?.());
      },
    }));

    return (
      <Stack
        direction="row"
        spacing={gap}
        sx={{
          alignItems: "center",
          ...bankSx,
        }}
      >
        {cells.map((_, i) => (
          <SplitFlapSingle
            ref={(el) => {
              if (el) refs.current[i] = el;
            }}
            duration={duration}
            targetChar={cells[i]}
            charset={activeCharset}
            cellStyle={cellStyle}
          />
        ))}
      </Stack>
    );
  }
);

export default SplitFlapDisplay;
