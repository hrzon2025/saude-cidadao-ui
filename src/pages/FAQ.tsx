import { AppHeader } from "@/components/ui/app-header";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const navigate = useNavigate();

  const faqData = [
    {
      question: "Como faço para marcar uma consulta na unidade de saúde?",
      answer: "As consultas podem ser marcadas diretamente na unidade de saúde mais próxima, levando um documento de identidade e o cartão do SUS. Algumas unidades também aceitam marcação por telefone ou aplicativo, dependendo do município."
    },
    {
      question: "Preciso levar algum documento para ser atendido?",
      answer: "Sim. É necessário levar um documento com foto e o cartão do SUS. Caso ainda não tenha o cartão do SUS, a unidade pode orientar sobre como emitir um."
    },
    {
      question: "Tem médico todo dia na unidade?",
      answer: "O funcionamento e escala médica varia de acordo com cada unidade de saúde. Recomendamos consultar os horários de funcionamento da unidade mais próxima através da seção 'Unidades' neste aplicativo."
    },
    {
      question: "Posso ser atendido mesmo sem estar cadastrado na unidade?",
      answer: "Sim, é possível ser atendido sem cadastro prévio na unidade. Porém, é recomendável fazer o cadastro para facilitar futuros atendimentos e ter acesso completo aos serviços oferecidos."
    },
    {
      question: "Tem atendimento para crianças e idosos?",
      answer: "Sim, todas as unidades de saúde oferecem atendimento especializado para crianças e idosos, incluindo pediatria, geriatria e programas específicos para estas faixas etárias."
    },
    {
      question: "Os atendimentos são gratuitos?",
      answer: "Sim, todos os atendimentos nas unidades de saúde do SUS são completamente gratuitos, incluindo consultas, exames básicos, medicamentos da farmácia básica e procedimentos."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle pb-6">
      <AppHeader 
        title="Perguntas Frequentes" 
        showBack 
        onBack={() => navigate(-1)} 
      />
      
      <div className="max-w-md mx-auto p-6">
        <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
          Aqui você encontra respostas para as dúvidas mais comuns sobre o atendimento nas unidades de saúde.
        </p>
        
        <Accordion type="single" collapsible className="space-y-3">
          {faqData.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card rounded-lg border border-border shadow-sm"
            >
              <AccordionTrigger className="px-4 py-4 text-left font-medium text-foreground hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}