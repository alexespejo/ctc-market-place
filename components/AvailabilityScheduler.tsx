"use client";

import { useState, useEffect, useRef } from "react";
import {
 DAYS_SHORT,
 WEEKDAY_INDICES,
 SLOT_COUNT,
 slotToMinutes,
 formatMinutes,
} from "@/lib/availability";
import type { AvailabilitySchedule } from "@/lib/availability";

interface Props {
 value: AvailabilitySchedule;
 onChange: (schedule: AvailabilitySchedule) => void;
}

interface DragPos {
 colIndex: number; // 0–4 within WEEKDAY_INDICES
 slot: number;
}

interface DragState {
 start: DragPos;
 end: DragPos;
 mode: "select" | "deselect";
}

const CELL_H = 16;
const LABEL_W = 40;
const SELECTED_COLOR = "#10b981";

// Pure helper — no closure deps, safe to call from native event handlers
function getCellFromPoint(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): DragPos | null {
  const relX = clientX - rect.left - LABEL_W;
  const relY = clientY - rect.top;
  if (relX < 0 || relY < 0 || relX > rect.width - LABEL_W || relY > rect.height)
    return null;
  const colWidth = (rect.width - LABEL_W) / WEEKDAY_INDICES.length;
  const colIndex = Math.min(
    Math.floor(relX / colWidth),
    WEEKDAY_INDICES.length - 1,
  );
  const slot = Math.min(Math.floor(relY / CELL_H), SLOT_COUNT - 1);
  return { colIndex, slot };
}

export default function AvailabilityScheduler({ value, onChange }: Props) {
 // React state drives rendering — no refs read during render
 const [drag, setDrag] = useState<DragState | null>(null);

 // Refs for use inside effects / global handlers (avoid stale closures)
 const dragRef = useRef<DragState | null>(null);
 const valueRef = useRef(value);
 const onChangeRef = useRef(onChange);
 const gridRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
  valueRef.current = value;
 }, [value]);
 useEffect(() => {
  onChangeRef.current = onChange;
 }, [onChange]);

 // Apply the rectangle defined by a completed drag to the schedule
 const commitRectRef = useRef((d: DragState) => {
  const minCol = Math.min(d.start.colIndex, d.end.colIndex);
  const maxCol = Math.max(d.start.colIndex, d.end.colIndex);
  const minSlot = Math.min(d.start.slot, d.end.slot);
  const maxSlot = Math.max(d.start.slot, d.end.slot);

  const next = { ...valueRef.current };
  for (let col = minCol; col <= maxCol; col++) {
   const day = WEEKDAY_INDICES[col];
   const current = new Set(next[day] ?? []);
   for (let s = minSlot; s <= maxSlot; s++) {
    if (d.mode === "select") current.add(s);
    else current.delete(s);
   }
   next[day] = Array.from(current);
  }
  onChangeRef.current(next);
 });

 // Commit drag on mouse-up or touch-end (registered once)
 useEffect(() => {
  const finish = () => {
   const d = dragRef.current;
   if (d) commitRectRef.current(d);
   dragRef.current = null;
   setDrag(null);
  };
  window.addEventListener("mouseup", finish);
  window.addEventListener("touchend", finish);
  return () => {
   window.removeEventListener("mouseup", finish);
   window.removeEventListener("touchend", finish);
  };
 }, []);

 // Touch drag — must use native listeners with { passive: false } to allow
 // preventDefault() which stops the page from scrolling during a drag
 useEffect(() => {
  const el = gridRef.current;
  if (!el) return;

  const onTouchStart = (e: TouchEvent) => {
   e.preventDefault();
   const touch = e.touches[0];
   const pos = getCellFromPoint(touch.clientX, touch.clientY, el.getBoundingClientRect());
   if (!pos) return;
   const day = WEEKDAY_INDICES[pos.colIndex];
   const mode: DragState["mode"] = valueRef.current[day]?.includes(pos.slot)
    ? "deselect"
    : "select";
   const newDrag: DragState = { start: pos, end: pos, mode };
   dragRef.current = newDrag;
   setDrag(newDrag);
  };

  const onTouchMove = (e: TouchEvent) => {
   e.preventDefault();
   if (!dragRef.current) return;
   const touch = e.touches[0];
   const pos = getCellFromPoint(touch.clientX, touch.clientY, el.getBoundingClientRect());
   if (!pos) return;
   const updated: DragState = { ...dragRef.current, end: pos };
   dragRef.current = updated;
   setDrag(updated);
  };

  el.addEventListener("touchstart", onTouchStart, { passive: false });
  el.addEventListener("touchmove", onTouchMove, { passive: false });
  return () => {
   el.removeEventListener("touchstart", onTouchStart);
   el.removeEventListener("touchmove", onTouchMove);
  };
 }, []);

 const handleMouseDown = (colIndex: number, slot: number) => {
  const day = WEEKDAY_INDICES[colIndex];
  const mode: DragState["mode"] = value[day]?.includes(slot)
   ? "deselect"
   : "select";
  const newDrag: DragState = {
   start: { colIndex, slot },
   end: { colIndex, slot },
   mode,
  };
  dragRef.current = newDrag;
  setDrag(newDrag);
 };

 const handleMouseEnter = (colIndex: number, slot: number) => {
  if (!dragRef.current) return;
  const updated: DragState = { ...dragRef.current, end: { colIndex, slot } };
  dragRef.current = updated;
  setDrag(updated);
 };

 // Pure render helper — uses `drag` state and `value` prop, no refs
 const getCellSelected = (
  day: number,
  colIndex: number,
  slot: number,
 ): boolean => {
  if (drag) {
   const minCol = Math.min(drag.start.colIndex, drag.end.colIndex);
   const maxCol = Math.max(drag.start.colIndex, drag.end.colIndex);
   const minSlot = Math.min(drag.start.slot, drag.end.slot);
   const maxSlot = Math.max(drag.start.slot, drag.end.slot);
   if (
    colIndex >= minCol &&
    colIndex <= maxCol &&
    slot >= minSlot &&
    slot <= maxSlot
   ) {
    return drag.mode === "select";
   }
  }
  return value[day]?.includes(slot) ?? false;
 };

 const clearDay = (day: number) => {
  onChangeRef.current({ ...valueRef.current, [day]: [] });
 };

 const hourLabels = Array.from({ length: SLOT_COUNT }, (_, i) => {
  const mins = slotToMinutes(i);
  return mins % 60 === 0 ? formatMinutes(mins) : "";
 });

 return (
  <div className="select-none">
   <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
    Click or drag to mark when you&apos;re typically available.
   </p>

   <div style={{ display: "flex", flexDirection: "column" }}>
    {/* Day headers */}
    <div style={{ display: "flex", paddingLeft: 40, marginBottom: 4 }}>
     {WEEKDAY_INDICES.map((day, i) => (
      <div
       key={day}
       style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
       }}
      >
       <span style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)" }}>
        {DAYS_SHORT[i]}
       </span>
       <button
        type="button"
        onClick={() => clearDay(day)}
        title={`Clear ${DAYS_SHORT[i]}`}
        style={{
         fontSize: 10,
         lineHeight: 1,
         color: "var(--muted)",
         opacity: 0.5,
         background: "none",
         border: "none",
         cursor: "pointer",
         padding: 0,
        }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.opacity = "1")}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.opacity = "0.5")}
       >
        ×
       </button>
      </div>
     ))}
    </div>

    {/* Grid */}
    <div
     ref={gridRef}
     style={{
      display: "flex",
      border: "1px solid var(--border)",
      borderRadius: 12,
      overflow: "hidden",
     }}
    >
     {/* Hour labels */}
     <div style={{ width: 40, flexShrink: 0 }}>
      {hourLabels.map((label, i) => (
       <div
        key={i}
        style={{
         height: CELL_H,
         display: "flex",
         alignItems: "center",
         justifyContent: "flex-end",
         paddingRight: 6,
         borderTop:
          slotToMinutes(i) % 60 === 0 && i > 0
           ? "1px solid var(--border)"
           : "1px solid transparent",
        }}
       >
        {label && (
         <span
          style={{ fontSize: 9, color: "var(--muted)", whiteSpace: "nowrap" }}
         >
          {label}
         </span>
        )}
       </div>
      ))}
     </div>

     {/* Day columns */}
     {WEEKDAY_INDICES.map((day, colIndex) => (
      <div
       key={day}
       style={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
       {Array.from({ length: SLOT_COUNT }, (_, slot) => {
        const selected = getCellSelected(day, colIndex, slot);
        const isHour = slotToMinutes(slot) % 60 === 0 && slot > 0;
        return (
         <div
          key={slot}
          style={{
           height: CELL_H,
           backgroundColor: selected ? SELECTED_COLOR : "transparent",
           borderTop: isHour
            ? "1px solid var(--border)"
            : "1px solid transparent",
           borderLeft: "1px solid var(--border)",
           cursor: "crosshair",
           opacity: selected ? 1 : 0.3,
           // Disable transition during active drag for snappiness
           transition: drag ? "none" : "background-color 0.06s",
          }}
          onMouseDown={() => handleMouseDown(colIndex, slot)}
          onMouseEnter={() => handleMouseEnter(colIndex, slot)}
         />
        );
       })}
      </div>
     ))}
    </div>

    {/* 11pm end label */}
    <div style={{ display: "flex", paddingLeft: 40, marginTop: 2 }}>
     <div style={{ flex: 1 }} />
     <span style={{ fontSize: 9, color: "var(--muted)", paddingRight: 4 }}>
      11:00pm
     </span>
    </div>
   </div>
  </div>
 );
}
