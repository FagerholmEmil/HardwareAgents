import FPVSchematic from '@/components/fpvSchematic';
import IdeasAgent from '@/components/IdeasAgent';
import PartsAgent from '@/components/PartsAgent';


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-5 rounded-xl">
      {/* <h1 className="text-4xl font-bold mb-8 text-white">FPV Drone Components Flow Chart</h1>*/}
      {/* <PartsAgent /> */}
      {/* <IdeasAgent /> */}
      <FPVSchematic />
    </main>
  );
}