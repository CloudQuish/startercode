// import React from "react";

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { qnas } from "@/__data__/qna";
// import { Dot, MoveUpRight } from "lucide-react";
// import { Button } from "../ui/button";
// export default function Questions() {
//   return (
//     <div className=" xl:container px-4 py-10">
//       <section className=" flex w-full ">
//         {/* 1ST DIV */}
//         <div className=" border w-full justify-between flex flex-col flex-1 h-[649px] rounded-3xl p-4 py-10 pl-10 bg-[#F6F6F6]">
//           <div className=" space-y-16">
//             <h2 className=" text-5xl">
//               Questions About Our
//               <br /> JumboTax?
//             </h2>
//             <div className=" ">
//               <Accordion type="single" collapsible className="w-full">
//                 {qnas.map((q, idx) => (
//                   <AccordionItem key={idx} value={q.question}>
//                     <AccordionTrigger>{q.question}</AccordionTrigger>
//                     <AccordionContent className="text-muted-foreground text-xs">
//                       {q.answer}
//                     </AccordionContent>
//                   </AccordionItem>
//                 ))}
//               </Accordion>
//             </div>
//           </div>

//           <div className=" flex justify-end  text-right mt-8">
//             <p className=" max-w-xs">
//               We've got answers. If you have some other questions, feel free to
//                <span className=" underline cursor-pointer">contact us.</span>
//             </p>
//           </div>
//         </div>

//         {/* 2ND DIV */}
//         <div className="p-4 border relative  overflow-hidden w-[40%] flex justify-between flex-col rounded-3xl py-10 pl-10">
//           <div className="space-y-4">
//             <h2 className="text-6xl ">
//               Evaluate Your
//               <br /> Potential
//               <br /> Savings
//             </h2>
//             <div className="max-w-[200px] space-y-6">
//               <ul className=" text-xs text-muted-foreground">
//                 <li className=" flex items-center">
//                   {" "}
//                   <Dot /> No upfront costs
//                 </li>
//                 <li className=" flex items-center">
//                   {" "}
//                   <Dot />
//                   No Credit Card Required
//                 </li>
//                 <li className=" flex items-center">
//                   {" "}
//                   <Dot /> Quick signup: Less than 30 minute
//                 </li>
//                 <li className=" flex items-center">
//                   {" "}
//                   <Dot /> Pay 25% of what you save. No hidden costs
//                 </li>
//               </ul>

//               <Button className=" text-xs flex items-center px-10 rounded-full w-full  bg-black">
//                 Join Now <MoveUpRight size={16} />{" "}
//               </Button>
//             </div>
//           </div>

//           <div className="p-4 rounded-2xl border space-y-2">
//             <p className="font-thin text-xs text-muted-foreground">
//               Join +1 Million Users Around The World{" "}
//             </p>
//             <div className="flex">
//               {Array.from({ length: 8 }).map((_, idx) => {
//                 return (
//                   <div
//                     key={idx}
//                     className="h-10 w-10 bg-gray-200 rounded-full border-2 border-white -mr-3 last:mr-0"
//                   ></div>
//                 );
//               })}
//             </div>
//           </div>

//           <div className=" bg-gray-200 absolute -right-[10%] translate-x-[0%] top-[20%] -translate-y-[10%] -rotate-12 rounded-3xl h-[340px] w-[300px]"></div>
//         </div>
//       </section>
//     </div>
//   );
// }

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { qnas } from "@/__data__/qna";
import { Dot, MoveUpRight } from "lucide-react";
import { Button } from "../ui/button";
import NormalFadeUp from "../animation/NormalFadeUp";
import RightSlide from "../animation/RightSlide";

export default function Questions() {
  return (
    <div className="xl:container px-4 py-10">
      <section className="flex flex-col lg:flex-row w-full">
        {/* 1ST DIV */}
        <div className="border flex flex-col justify-between w-full h-[680px] flex-1  rounded-3xl p-4 py-10 pl-10 bg-[#F6F6F6] mb-10 xl:mb-0">
          <div className="space-y-16">
            <NormalFadeUp delay={0.2}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl">
                Questions About Our
                <br /> JumboTax?
              </h2>
            </NormalFadeUp>
            <div className="">
              <Accordion type="single" collapsible className="w-full">
                {qnas.map((q, idx) => (
                  <NormalFadeUp key={idx} delay={0.3 * (idx + 1)}>
                    <AccordionItem value={q.question}>
                      <AccordionTrigger className="text-base md:text-lg">
                        {q.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-xs md:text-sm">
                        {q.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </NormalFadeUp>
                ))}
              </Accordion>
            </div>
          </div>

          <div className="flex justify-end text-right mt-8">
            <NormalFadeUp delay={0.8}>
              <p className="max-w-xs">
                We've got answers. If you have some other questions, feel free
                to <span className="underline cursor-pointer">contact us.</span>
              </p>
            </NormalFadeUp>
          </div>
        </div>

        {/* 2ND DIV */}
        <div className="p-4 border h-[680px]  relative overflow-hidden w-full lg:w-[40%] flex justify-between flex-col rounded-3xl py-10 pl-10">
          <div className="space-y-4">
            <NormalFadeUp delay={0.2}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl relative z-20">
                Evaluate Your
                <br /> Potential
                <br /> Savings
              </h2>
            </NormalFadeUp>
            <div className="max-w-[200px] space-y-6 relative z-20">
              <ul className="text-xs text-muted-foreground">
                <RightSlide delay={0.3}>
                  <li className="flex items-center">
                    <Dot size={18} /> No upfront costs
                  </li>
                </RightSlide>
                <RightSlide delay={0.5}>
                  <li className="flex items-center">
                    <Dot size={18} /> No Credit Card Required
                  </li>
                </RightSlide>
                <RightSlide delay={0.7}>
                  <li className="flex items-start">
                    <Dot size={18} /> Quick signup: Less than 30 minutes
                  </li>
                </RightSlide>
                <RightSlide delay={0.9}>
                  <li className="flex items-start">
                    <Dot size={18} /> Pay 25% of what you save.
                    <br /> No hidden costs
                  </li>
                </RightSlide>
              </ul>
              <NormalFadeUp delay={0.8}>
                <Button className="text-xs flex items-center px-10 rounded-full w-full bg-black mt-4">
                  Join Now <MoveUpRight size={16} />{" "}
                </Button>
              </NormalFadeUp>
            </div>
          </div>

          <div className="p-4 rounded-2xl border space-y-2 mt-6">
            <NormalFadeUp delay={0.2}>
              <p className="font-thin text-xs text-muted-foreground">
                Join +1 Million Users Around The World{" "}
              </p>
            </NormalFadeUp>
            <div className="flex">
              {Array.from({ length: 8 }).map((_, idx) => {
                return (
                  <RightSlide
                    key={idx}
                    delay={0.3 * (idx + 1)}
                    className="h-10 w-10 bg-gray-200 rounded-full border-2 border-white -mr-3 last:mr-0"
                  >
                    <div className=""></div>
                  </RightSlide>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-200 absolute -right-[10%] lg:translate-x-[40%] xl:translate-x-[0%] top-[20%] -translate-y-[10%] -rotate-12 rounded-3xl h-[340px] w-[300px]"></div>
        </div>
      </section>

      {/* SUCCESS RATE */}
      <section
        style={{ background: "url(/home/success-bg.jpg) center/cover" }}
        className=" w-full flex flex-col gap-20 text-white h-[50vh] mt-10 rounded-3xl  items-center justify-center"
      >
        <div className="flex flex-col gap-4 text-center">
          <NormalFadeUp delay={0.2}>
            <h2 className=" text-5xl sm:text-6xl">95%</h2>
          </NormalFadeUp>
          <NormalFadeUp delay={0.4}>
            <p className=" sm:text-base text-sm">
              of our appeals are successful.
            </p>
          </NormalFadeUp>
        </div>

        <NormalFadeUp delay={0.6}>
          <Button className="sm:text-base text-sm bg-white py-6 rounded-lg hover:bg-white hover:text-black font-semibold text-black">
            Get Started - It's Free
          </Button>
        </NormalFadeUp>
      </section>
    </div>
  );
}
5;
