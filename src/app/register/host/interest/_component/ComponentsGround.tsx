"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import InterestPikerBox from "./InterestPickerBox";
import SuccessButton from "@/app/register/_components/SuccessButton";

export default function ComponentsGround() {
  return (
    <div className="flex flex-col items-center gap-y-8">
      <div className="sm:h1-bold h2-bold text-primary-900">Interests</div>
      <InterestPikerBox />
      <div className="absolute bottom-6 sm:static">
        <SuccessButton />
      </div>
    </div>
  );
}