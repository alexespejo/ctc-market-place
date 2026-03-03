"use client";

import { useEffect } from "react";
import { UserProfile } from "@/lib/types";
import {
 DAYS_SHORT,
 WEEKDAY_INDICES,
 SLOT_COUNT,
 slotToMinutes,
 formatMinutes,
 getNextAvailableLabel,
} from "@/lib/availability";

interface Props {
 user: UserProfile;
 isViewerSignedIn: boolean;
 onClose: () => void;
}

const formatPhoneNumber = (phone: string) => {
 const cleaned = phone.replace(/\D/g, "");
 if (cleaned.length === 10) {
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
 }
 return phone;
};

const SELECTED_COLOR = "#10b981";
const CELL_H = 14;
const LABEL_W = 36;

export default function UserProfileDialog({
 user,
 isViewerSignedIn,
 onClose,
}: Props) {
 useEffect(() => {
  const handler = (e: KeyboardEvent) => {
   if (e.key === "Escape") onClose();
  };
  window.addEventListener("keydown", handler);
  return () => window.removeEventListener("keydown", handler);
 }, [onClose]);

 useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => {
   document.body.style.overflow = "";
  };
 }, []);

 const nextAvailable =
  !user.isActive && user.availability
   ? getNextAvailableLabel(user.availability)
   : null;

 const hourLabels = Array.from({ length: SLOT_COUNT }, (_, i) => {
  const mins = slotToMinutes(i);
  return mins % 60 === 0 ? formatMinutes(mins) : "";
 });

 const hasAvailability =
  user.availability &&
  Object.values(user.availability).some((slots) => slots && slots.length > 0);

 return (
  <div
   className="fixed inset-0 z-50 flex items-center justify-center p-4"
   style={{ backgroundColor: "rgba(0,0,0,0.2)", backdropFilter: "blur(1px)" }}
   onClick={onClose}
  >
   <div
    className="bento-card w-full max-w-md max-h-[90vh] overflow-y-auto relative"
    onClick={(e) => e.stopPropagation()}
   >
    {/* Close button */}
    <button
     onClick={onClose}
     className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:opacity-70"
     style={{ backgroundColor: "var(--border)" }}
     aria-label="Close"
    >
     <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
      style={{ color: "var(--muted)" }}
     >
      <path
       fillRule="evenodd"
       d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
       clipRule="evenodd"
      />
     </svg>
    </button>

    {/* Header */}
    <div
     className="p-8 pb-6 flex flex-col items-center text-center relative overflow-hidden"
     style={{
      background:
       "linear-gradient(to bottom right, rgba(196, 181, 160, 0.2), rgba(196, 181, 160, 0.05))",
     }}
    >
     <div
      className="absolute top-0 right-0 w-32 h-32 organic-shape -translate-y-8 translate-x-8"
      style={{ backgroundColor: "rgba(196, 181, 160, 0.1)" }}
     />

     <div className="relative mb-4">
      {!isViewerSignedIn ? (
       <div className="shimmer w-24 h-24 rounded-full border-4 border-white shadow-lg" />
      ) : user.photoURL ? (
       <img
        src={user.photoURL}
        alt={user.displayName}
        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
       />
      ) : (
       <div
        className="w-24 h-24 rounded-full flex items-center justify-center border-4 border-white shadow-lg"
        style={{ backgroundColor: "var(--accent)" }}
       >
        <span className="text-3xl font-serif font-bold text-white">
         {user.displayName.charAt(0).toUpperCase()}
        </span>
       </div>
      )}
      {user.isActive && (
       <div className="absolute -top-1 -right-1">
        <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm pulse-soft" />
       </div>
      )}
     </div>

     <h2
      className="font-serif text-2xl font-semibold tracking-tight mb-2"
      style={{ color: "var(--foreground)" }}
     >
      {isViewerSignedIn ? (
       user.displayName
      ) : (
       <span
        className="inline-block rounded"
        style={{
         backgroundColor: "var(--border)",
         color: "transparent",
         userSelect: "none",
         minWidth: "8rem",
        }}
       >
        ████████
       </span>
      )}
     </h2>

     <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
       user.isActive
        ? "bg-emerald-100 text-emerald-700"
        : "bg-gray-100 text-gray-600"
      }`}
     >
      {user.isActive ? "● Available now" : "○ Unavailable"}
     </div>
     {nextAvailable && (
      <p className="text-xs mt-1.5" style={{ color: "var(--muted)" }}>
       Next: {nextAvailable}
      </p>
     )}
    </div>

    {/* Details */}
    <div className="p-6 space-y-4">
     {/* Quick stats */}
     <div className="grid grid-cols-3 gap-3 text-center">
      <div
       className="rounded-xl p-3"
       style={{ backgroundColor: "var(--background)" }}
      >
       <div className="text-xl mb-1">📍</div>
       <div className="text-xs" style={{ color: "var(--muted)" }}>
        Location
       </div>
       <div
        className="text-sm font-semibold mt-0.5"
        style={{ color: "var(--foreground)" }}
       >
        {user.diningHall}
       </div>
      </div>
      <div
       className="rounded-xl p-3"
       style={{ backgroundColor: "var(--background)" }}
      >
       <div className="text-xl mb-1">🎫</div>
       <div className="text-xs" style={{ color: "var(--muted)" }}>
        Swipes
       </div>
       <div
        className="text-sm font-semibold mt-0.5"
        style={{ color: "var(--accent)" }}
       >
        {user.swipeCount}
       </div>
      </div>
      <div
       className="rounded-xl p-3"
       style={{ backgroundColor: "var(--background)" }}
      >
       <div className="text-xl mb-1">💰</div>
       <div className="text-xs" style={{ color: "var(--muted)" }}>
        Rate
       </div>
       <div
        className="text-sm font-semibold mt-0.5"
        style={{
         color:
          user.paymentRate && user.paymentRate > 0 ? "#059669" : "var(--muted)",
        }}
       >
        {user.paymentRate && user.paymentRate > 0
         ? `$${user.paymentRate.toFixed(2)}`
         : "Free"}
       </div>
      </div>
     </div>

     {/* Phone */}
     <div
      className="flex items-center gap-3 p-4 rounded-xl"
      style={{ backgroundColor: "var(--background)" }}
     >
      <span className="text-xl">📞</span>
      <div className="flex-1">
       <div className="text-xs mb-0.5" style={{ color: "var(--muted)" }}>
        Phone
       </div>
       {isViewerSignedIn ? (
        <div
         className="text-sm font-semibold"
         style={{ color: "var(--foreground)" }}
        >
         {formatPhoneNumber(user.phone)}
        </div>
       ) : (
        <span
         className="text-sm inline-block rounded"
         style={{
          backgroundColor: "var(--border)",
          color: "transparent",
          userSelect: "none",
          minWidth: "7rem",
         }}
        >
         ██████████
        </span>
       )}
      </div>
      {!isViewerSignedIn && (
       <a
        href="/auth"
        className="text-xs font-semibold shrink-0"
        style={{ color: "var(--accent)" }}
       >
        Sign in →
       </a>
      )}
     </div>

     {/* Availability */}
     <div>
      <h4
       className="font-serif text-base font-semibold mb-3"
       style={{ color: "var(--foreground)" }}
      >
       Typical Availability
      </h4>
      {hasAvailability ? (
       <div className="select-none pointer-events-none">
        {/* Day headers */}
        <div style={{ display: "flex", paddingLeft: LABEL_W, marginBottom: 4 }}>
         {WEEKDAY_INDICES.map((day, i) => (
          <div key={day} style={{ flex: 1, textAlign: "center" }}>
           <span
            style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)" }}
           >
            {DAYS_SHORT[i]}
           </span>
          </div>
         ))}
        </div>
        {/* Grid */}
        <div
         style={{
          display: "flex",
          border: "1px solid var(--border)",
          borderRadius: 12,
          overflow: "hidden",
         }}
        >
         {/* Hour labels */}
         <div style={{ width: LABEL_W, flexShrink: 0 }}>
          {hourLabels.map((label, i) => (
           <div
            key={i}
            style={{
             height: CELL_H,
             display: "flex",
             alignItems: "center",
             justifyContent: "flex-end",
             paddingRight: 5,
             borderTop:
              slotToMinutes(i) % 60 === 0 && i > 0
               ? "1px solid var(--border)"
               : "1px solid transparent",
            }}
           >
            {label && (
             <span
              style={{
               fontSize: 8,
               color: "var(--muted)",
               whiteSpace: "nowrap",
              }}
             >
              {label}
             </span>
            )}
           </div>
          ))}
         </div>
         {/* Day columns */}
         {WEEKDAY_INDICES.map((day) => (
          <div
           key={day}
           style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
           {Array.from({ length: SLOT_COUNT }, (_, slot) => {
            const selected = user.availability?.[day]?.includes(slot) ?? false;
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
               opacity: selected ? 1 : 0.25,
              }}
             />
            );
           })}
          </div>
         ))}
        </div>
        {/* End label */}
        <div style={{ display: "flex", paddingLeft: LABEL_W, marginTop: 2 }}>
         <div style={{ flex: 1 }} />
         <span style={{ fontSize: 8, color: "var(--muted)", paddingRight: 4 }}>
          11:00pm
         </span>
        </div>
       </div>
      ) : (
       <p
        className="text-sm text-center py-3"
        style={{ color: "var(--muted)" }}
       >
        No availability schedule set
       </p>
      )}
     </div>
    </div>
   </div>
  </div>
 );
}
