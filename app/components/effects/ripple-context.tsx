"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

export const RIPPLE_DURATION_MS = 1500;
const FIELD_CELL_SIZE = 18;
const RIPPLE_SPEED = 0.3;
const FIXED_TIME_STEP = 1 / 60;
const MAX_FRAME_DELTA = 1 / 20;
const MAX_SUBSTEPS = 3;
const DROP_RADIUS = 79;
const DROP_STRENGTH = 4.6;
const DRAG_DROP_RADIUS = 25;
const DRAG_DROP_STRENGTH = 0.32;
const DRAG_MIN_DISTANCE = 3;
const SPRING_STRENGTH = 7;
const MOTION_DAMPING = 11;
const RIPPLE_FORCE = 28500;

export type RippleInstance = {
  id: number;
  x: number;
  y: number;
  startTime: number;
  size: number;
};

type Value = {
  ripples: RippleInstance[];
  addRipple: (x: number, y: number) => void;
  addDragRippleTrail: (fromX: number, fromY: number, toX: number, toY: number) => void;
  gradientAt: (x: number, y: number) => { x: number; y: number };
  surfaceHeightAt: (x: number, y: number) => number;
  physics: {
    springStrength: number;
    motionDamping: number;
    rippleForce: number;
  };
};

const RippleContext = createContext<Value | null>(null);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

class RippleField {
  private width: number;
  private height: number;
  private readonly cellSize: number;
  private columns = 0;
  private rows = 0;
  private heights = new Float32Array();
  private velocities = new Float32Array();
  private nextHeights = new Float32Array();
  private nextVelocities = new Float32Array();

  constructor(width: number, height: number, cellSize: number) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.resize(width, height);
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.columns = Math.max(2, Math.ceil(width / this.cellSize) + 1);
    this.rows = Math.max(2, Math.ceil(height / this.cellSize) + 1);
    const size = this.columns * this.rows;
    this.heights = new Float32Array(size);
    this.velocities = new Float32Array(size);
    this.nextHeights = new Float32Array(size);
    this.nextVelocities = new Float32Array(size);
  }

  disturb(x: number, y: number, radius: number, strength: number) {
    const minColumn = Math.max(0, Math.floor((x - radius) / this.cellSize));
    const maxColumn = Math.min(this.columns - 1, Math.ceil((x + radius) / this.cellSize));
    const minRow = Math.max(0, Math.floor((y - radius) / this.cellSize));
    const maxRow = Math.min(this.rows - 1, Math.ceil((y + radius) / this.cellSize));

    for (let row = minRow; row <= maxRow; row += 1) {
      for (let column = minColumn; column <= maxColumn; column += 1) {
        const sx = column * this.cellSize;
        const sy = row * this.cellSize;
        const distance = Math.hypot(sx - x, sy - y);
        if (distance > radius) continue;
        const normalizedDistance = 1 - distance / radius;
        const drop = 0.5 - Math.cos(normalizedDistance * Math.PI) * 0.5;
        this.heights[this.index(column, row)] += drop * strength;
      }
    }
  }

  step() {
    for (let row = 0; row < this.rows; row += 1) {
      for (let column = 0; column < this.columns; column += 1) {
        const index = this.index(column, row);
        const height = this.heights[index];
        const average =
          (this.heightAt(column - 1, row) +
            this.heightAt(column + 1, row) +
            this.heightAt(column, row - 1) +
            this.heightAt(column, row + 1)) *
          0.25;

        let velocity = this.velocities[index];
        velocity += (average - height) * RIPPLE_SPEED;
        velocity *= 0.995;
        this.nextVelocities[index] = velocity;
        this.nextHeights[index] = height + velocity;
      }
    }
    [this.heights, this.nextHeights] = [this.nextHeights, this.heights];
    [this.velocities, this.nextVelocities] = [this.nextVelocities, this.velocities];
  }

  gradientAt(x: number, y: number) {
    const epsilon = this.cellSize;
    const left = this.sampleHeight(x - epsilon, y);
    const right = this.sampleHeight(x + epsilon, y);
    const top = this.sampleHeight(x, y - epsilon);
    const bottom = this.sampleHeight(x, y + epsilon);
    return { x: (right - left) / (epsilon * 2), y: (bottom - top) / (epsilon * 2) };
  }

  surfaceHeightAt(x: number, y: number) {
    return this.sampleHeight(x, y);
  }

  private sampleHeight(x: number, y: number) {
    const clampedX = clamp(x, 0, this.width);
    const clampedY = clamp(y, 0, this.height);
    const gridX = clampedX / this.cellSize;
    const gridY = clampedY / this.cellSize;
    const x0 = Math.floor(gridX);
    const y0 = Math.floor(gridY);
    const x1 = Math.min(this.columns - 1, x0 + 1);
    const y1 = Math.min(this.rows - 1, y0 + 1);
    const tx = gridX - x0;
    const ty = gridY - y0;
    const h00 = this.heights[this.index(x0, y0)];
    const h10 = this.heights[this.index(x1, y0)];
    const h01 = this.heights[this.index(x0, y1)];
    const h11 = this.heights[this.index(x1, y1)];
    const top = lerp(h00, h10, tx);
    const bottom = lerp(h01, h11, tx);
    return lerp(top, bottom, ty);
  }

  private heightAt(column: number, row: number) {
    const clampedColumn = clamp(Math.round(column), 0, this.columns - 1);
    const clampedRow = clamp(Math.round(row), 0, this.rows - 1);
    return this.heights[this.index(clampedColumn, clampedRow)];
  }

  private index(column: number, row: number) {
    return row * this.columns + column;
  }
}

export function RippleProvider({ children }: { children: ReactNode }) {
  const [ripples, setRipples] = useState<RippleInstance[]>([]);
  const idRef = useRef(0);
  const fieldRef = useRef<RippleField | null>(null);
  const previousTimeRef = useRef(0);
  const accumulatedTimeRef = useRef(0);

  useEffect(() => {
    fieldRef.current = new RippleField(window.innerWidth, window.innerHeight, FIELD_CELL_SIZE);
    const onResize = () => {
      fieldRef.current?.resize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const frame = (time: number) => {
      const dt = previousTimeRef.current === 0 ? FIXED_TIME_STEP : (time - previousTimeRef.current) / 1000;
      previousTimeRef.current = time;
      accumulatedTimeRef.current += Math.min(dt, MAX_FRAME_DELTA);

      let steps = 0;
      while (accumulatedTimeRef.current >= FIXED_TIME_STEP && steps < MAX_SUBSTEPS) {
        fieldRef.current?.step();
        accumulatedTimeRef.current -= FIXED_TIME_STEP;
        steps += 1;
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const addRipple = useCallback((x: number, y: number) => {
    const id = ++idRef.current;
    const startTime = performance.now();
    const size =
      typeof window !== "undefined"
        ? Math.max(window.innerWidth, window.innerHeight) * 0.4
        : 320;
    setRipples((prev) => [...prev, { id, x, y, startTime, size }]);
    fieldRef.current?.disturb(x, y, DROP_RADIUS, DROP_STRENGTH);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, RIPPLE_DURATION_MS);
  }, []);

  const addDragRippleTrail = useCallback((fromX: number, fromY: number, toX: number, toY: number) => {
    const distance = Math.hypot(toX - fromX, toY - fromY);
    if (distance < DRAG_MIN_DISTANCE) return;
    const steps = Math.max(1, Math.ceil(distance / DRAG_MIN_DISTANCE));
    for (let i = 1; i <= steps; i += 1) {
      const t = i / steps;
      const x = lerp(fromX, toX, t);
      const y = lerp(fromY, toY, t);
      fieldRef.current?.disturb(x, y, DRAG_DROP_RADIUS, DRAG_DROP_STRENGTH);
    }
  }, []);

  const gradientAt = useCallback((x: number, y: number) => {
    return fieldRef.current?.gradientAt(x, y) ?? { x: 0, y: 0 };
  }, []);

  const surfaceHeightAt = useCallback((x: number, y: number) => {
    return fieldRef.current?.surfaceHeightAt(x, y) ?? 0;
  }, []);

  const physics = useMemo(
    () => ({
      springStrength: SPRING_STRENGTH,
      motionDamping: MOTION_DAMPING,
      rippleForce: RIPPLE_FORCE,
    }),
    [],
  );

  const value = useMemo(
    () => ({
      ripples,
      addRipple,
      addDragRippleTrail,
      gradientAt,
      surfaceHeightAt,
      physics,
    }),
    [ripples, addRipple, addDragRippleTrail, gradientAt, surfaceHeightAt, physics],
  );

  return <RippleContext.Provider value={value}>{children}</RippleContext.Provider>;
}

export function useRippleContext() {
  const ctx = useContext(RippleContext);
  if (!ctx) throw new Error("RippleProvider required");
  return ctx;
}

/** Matches `.ripple-circle`: transform scale 0.1 → 2.2, cubic ease-out over RIPPLE_DURATION_MS. */
export function ringRadiusAtTime(startTime: number, now: number, size: number) {
  const t = Math.min(1, (now - startTime) / RIPPLE_DURATION_MS);
  const ease = 1 - Math.pow(1 - t, 3);
  const scale = 0.1 + ease * 2.1;
  return (size * scale) / 2;
}
