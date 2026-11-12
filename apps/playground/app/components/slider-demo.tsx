"use client";

import { useState } from "react";
import Slider, { RangeSlider } from "@chatool/ui/slider";
import VolumeOffRounded from "@chatool/icons/VolumeOffRounded";
import VolumeUpRounded from "@chatool/icons/VolumeUpRounded";

/**
 * Controlled sliders in a client island: `value` + `onValueChange`, an inset
 * icon that is a function of the value (volume → mute at 0), and a range
 * slider whose handles stay `minStepsBetweenThumbs` apart.
 */
export function SliderControlled() {
  const [volume, setVolume] = useState(40);
  const [committed, setCommitted] = useState(40);
  const [price, setPrice] = useState<[number, number]>([200, 700]);

  return (
    <div className="gap-10 max-w-lg flex w-full flex-col">
      <div className="gap-2 flex flex-col">
        <Slider
          aria-label="Volume"
          size="m"
          value={volume}
          onValueChange={setVolume}
          onValueCommit={setCommitted}
          icon={(v) => (v === 0 ? <VolumeOffRounded /> : <VolumeUpRounded />)}
        />
        <span className="text-body-small text-on-surface-variant">
          value {volume} · committed {committed}
        </span>
      </div>
      <div className="gap-2 flex flex-col">
        <RangeSlider
          aria-label="Price"
          thumbLabels={["Minimum price", "Maximum price"]}
          min={0}
          max={1000}
          step={50}
          stops
          minStepsBetweenThumbs={2}
          value={price}
          onValueChange={setPrice}
          valueIndicator
          format={{
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }}
        />
        <span className="text-body-small text-on-surface-variant">
          ${price[0]} – ${price[1]}
        </span>
      </div>
    </div>
  );
}
