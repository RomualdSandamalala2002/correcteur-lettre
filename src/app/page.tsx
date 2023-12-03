import SpellChecker from "@/components/SpellChecker";

export default function Home() {
  return (<>
    <div className="w-full p-10 flex flex-col items-center">
      <div className="text-3xl text-center font-bold">Voici un correcteur orthographique très simple</div>
      <SpellChecker />
    </div>
  </>
  )
}
