"use client"
import LandingpageTemplate from "@/ui/components/templates/landingpageTemplate";
import {Providers} from './providers'


export default function Page() {
  return (
    <Providers>
        <div>   
          <LandingpageTemplate />
        </div>
    </Providers>
    
  );
}
