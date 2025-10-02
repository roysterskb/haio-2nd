"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, value, defaultValue, min = 0, max = 100, step = 1, ...props }, ref) => {
  const primitiveValue = React.useMemo(
    () => value !== undefined ? Array.isArray(value) ? value : [value] : undefined,
    [value]
  );

  const primitiveDefaultValue = React.useMemo(
    () => defaultValue !== undefined ? Array.isArray(defaultValue) ? defaultValue : [defaultValue] : undefined,
    [defaultValue]
  );

  const _values = React.useMemo(() => {
    if (value !== undefined) {
      return Array.isArray(value) ? value : [value];
    }
    if (defaultValue !== undefined) {
      return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [min];
  }, [value, defaultValue, min]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      min={min}
      max={max}
      step={step}
      value={primitiveValue}
      defaultValue={primitiveDefaultValue}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className={cn(
        "relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted",
        "[&>*]:!bg-primary"
      )}>
        <SliderPrimitive.Range />
      </SliderPrimitive.Track>
      {_values.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={cn(
            "block size-4 rounded-full border border-primary ring-offset-background transition-shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            "shadow-lg hover:shadow-md focus-visible:shadow-xl"
          )}
        />
      ))}
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider }