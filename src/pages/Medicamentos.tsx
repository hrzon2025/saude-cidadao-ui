import { AppHeader } from "@/components/ui/app-header";

export default function Medicamentos() {
  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <AppHeader title="Medicamentos" />
      
      <div className="h-[calc(100vh-8rem)]">
        <iframe
          src="https://sus-suzano.web.app/#/"
          className="w-full h-full border-none"
          title="Sistema de Medicamentos"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}