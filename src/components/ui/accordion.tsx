"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown, CircleMinus, CirclePlus } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

// const AccordionTrigger = React.forwardRef<
//   React.ElementRef<typeof AccordionPrimitive.Trigger>,
//   React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
// >(({ className, children, ...props }, ref) => {
//   const isOpen = props["data-state"] === "open";
//   console.log("ISOPEN:", isOpen);

//   return (
//     <AccordionPrimitive.Header className="flex">
//       <AccordionPrimitive.Trigger
//         ref={ref}
//         className={cn(
//           "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left ",
//           className
//         )}
//         {...props}
//       >
//         {children}
//         {/** Use `data-state` to toggle icons */}
//         {(props as any)["data-state"] === "open" ? (
//           <CircleMinus className="h-4 w-4 shrink-0   text-primary transition-transform duration-200" />
//         ) : (
//           <CirclePlus className="h-4 w-4 shrink-0 text-primary transition-transform duration-200" />
//         )}

//         {(props as any)["data-state"] === "open" ? (
//           <div>OPEN</div>
//         ) : (
//           <div>CLOSED</div>
//         )}
//       </AccordionPrimitive.Trigger>
//     </AccordionPrimitive.Header>
//   );
// });

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  console.log("ISOPEN:", isOpen);

  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        onClick={handleToggle}
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
          className
        )}
        {...props}
      >
        {children}
        <CirclePlus
          className={` h-4 w-4 shrink-0 text-primary transition-transform duration-300 ${
            isOpen ? "rotate-180 opacity-0" : "opacity-100 rotate-0"
          }`}
        />
        <CircleMinus
          className={`h-4 w-4 shrink-0 text-primary transition-transform duration-200  ${
            isOpen ? "block rotate-0" : " rotate-180 hidden"
          }`}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
});

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
