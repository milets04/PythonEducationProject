"use client";
import LandingpageTemplate from "@/ui/components/templates/landingpageTemplate";
import NavegationArrows from "@/ui/components/atoms/navegationArrows";

export default function Page() {
  const handlePrevious = () => {
  };
  
  const handleNext = () => {
  };
  
  return (
    <div>
      <NavegationArrows onPrevious={handlePrevious} onNext={handleNext} />
      <LandingpageTemplate />
    </div>
  );
}
