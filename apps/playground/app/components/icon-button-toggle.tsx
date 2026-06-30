"use client";

import { useState } from "react";
import { Button } from "@chatool/ui/button";
import IconButton from "@chatool/ui/icon-button";
import FavoriteOutlined from "@chatool/icons/FavoriteOutlined";
import FavoriteFilled from "@chatool/icons/FavoriteFilled";

const VARIANTS = ["standard", "filled", "tonal", "outlined"] as const;

/** Client island: MD3 toggle icon buttons (controlled `selected`/`aria-pressed`). */
export function IconButtonToggle() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setOn((s) => ({ ...s, [key]: !s[key] }));

  return (
    <>
      {VARIANTS.map((variant) => (
        <IconButton
          key={variant}
          variant={variant}
          aria-label="Add to favorites"
          selected={!!on[variant]}
          selectedIcon={<FavoriteFilled />}
          onClick={() => toggle(variant)}
        >
          <FavoriteOutlined />
        </IconButton>
      ))}
    </>
  );
}

/** Client island: MD3 toggle buttons (controlled `selected`/`aria-pressed`). */
export function ButtonToggle() {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setOn((s) => ({ ...s, [key]: !s[key] }));

  return (
    <>
      {(["filled", "tonal", "elevated", "outlined", "text"] as const).map(
        (variant) => (
          <Button
            key={variant}
            variant={variant}
            startIcon={<FavoriteOutlined />}
            selectedIcon={<FavoriteFilled />}
            selected={!!on[variant]}
            onClick={() => toggle(variant)}
          >
            Favorite
          </Button>
        ),
      )}
    </>
  );
}
