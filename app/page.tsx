import Image from "next/image";
import SelectMood from "./components/SelectMood";


export default function Home() {
  return (
    <div className="w-full items-center justify-center flex min-h-screen p-8 pb-20 gap-16 bg-gradient-to-r from-[#0f172a]  to-[#334155] sm:p-20 font-[family-name:var(--font-geist-sans)]">
      
      <div>
        <h1 className="text-blue-300 font-mono text-6xl">Mood Chat</h1>
        {/* Create id for user */}
       
      </div>
<SelectMood/>
    
    </div>
  );
}
