"use client";

import { useEffect, useState } from "react";
import { Button } from "@chatool/ui/button";
import LinearProgress from "@chatool/ui/linear-progress";
import CircularProgress from "@chatool/ui/circular-progress";

export function ProgressDemo() {
  const [run, setRun] = useState(0);
  const [value, setValue] = useState<number | undefined>(undefined);

  useEffect(() => {
    setValue(undefined);
    const timers = [
      setTimeout(() => setValue(30), 2600),
      setTimeout(() => setValue(70), 3800),
      setTimeout(() => setValue(100), 5200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [run]);

  return (
    <div className="gap-4 flex w-full items-center">
      <CircularProgress value={value} aria-label="Syncing" />
      <LinearProgress value={value} aria-label="Syncing" className="flex-1" />
      <Button variant="tonal" size="xs" onClick={() => setRun(run + 1)}>
        Restart
      </Button>
    </div>
  );
}
