import { useSignal } from "@preact/signals";
import { useScript } from "@deco/deco/hooks";
import Image from "apps/website/components/Image.tsx";
import Section from "../../components/ui/Section.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import { RichText } from "apps/admin/widgets.ts";

// Tipos de dados para perguntas, navegação e conteúdo do componente
type TextArea = string;

interface Question {
  question: string;
  answer: string;
}

interface NavItem {
  title: string;
  href: string;
}

interface Props {
  introText: TextArea;
  introContent?: RichText;
  introImage: ImageWidget;
  navItemPrinciapl: { title: string; questions: Question[] };
  navItems: NavItem[];
}

const smoothScrollTo = (targetId: number) => {
  event?.preventDefault();
  const targetElement = document.getElementById(`faq-${targetId}`);

  if (targetElement) {
    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = targetPosition - 130;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
};

// Componente FAQ para exibir perguntas e respostas
function FAQ({ questions }: { questions: Question[] }) {
  return (
    <section class="mb-8">
      <ul>
        {questions.map((question, index) => (
          <li key={index} id={`faq-${index}`} class="mb-3">
            <details class="collapse collapse-arrow border-none bg-base-100 rounded-md">
              <summary class="collapse-title min-h-fit text-lg font-medium">{question.question}</summary>
              <div class="collapse-content" dangerouslySetInnerHTML={{ __html: question.answer }} />
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DynamicInstitutionalLayout({
  introText,
  introContent,
  introImage,
  navItemPrinciapl,
  navItems,
}: Props) {
  const activeNav = useSignal(navItemPrinciapl.title);

  return (
    <div class="w-full flex flex-col bg-base-100">
      {/* Seção de introdução */}
      <section class="mb-8 w-full custom-container md:px-[10px] px-2">
        <div class="flex flex-col md:flex-row gap-12 ">
          <div class="wrapper w-full md:w-4/6">
            <p class="font-bold text-base-content lg:text-3xl sm:text-lg mb-3">{introText}</p>
            {introContent && (
              <div class="leading-tight md:text-sm sm:text-xs" dangerouslySetInnerHTML={{ __html: introContent }} />
            )}
          </div>
          <div class="w-full hidden  md:w-1/6 md:block">
            <Image width={250} height={250} src={introImage} alt="Intro image" class="h-auto" />
          </div>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <div class="bg-[#f7f7f7] md:py-3 py-2 ">
        <main class="custom-container gap-5 flex flex-col md:flex-row py-4 md:px-[10px] px-2">
          {/* Navegação Lateral */}
          <nav class="w-full md:w-3/12 hidden md:block">
            <ul>
              <li class="mb-0">
                <div class="flex items-center cursor-default justify-between w-full px-4 py-4 rounded bg-[#282828] text-primary-content">
                  <span class="font-semibold text-lg">{navItemPrinciapl.title}</span>
                </div>
              </li>
              <div className="wrapper py-4 px-3 shadow-md rounded-b-lg bg-base-100 mb-3">
                {navItemPrinciapl.questions.map((question, index) => (
                  <li key={index} class="mb-2">
                    <a
                      href={`#faq-${index}`}
                      hx-on:click={useScript(smoothScrollTo, index)}
                      class=" flex items-center justify-between w-full  hover:opacity-90"
                    >
                      <span>{question.question}</span>
                    </a>
                  </li>
                ))}
              </div>

              {navItems.map((item) => (
                <li key={item.href} class="mb-3">
                  <a
                    href={item.href}
                    class="flex items-center hover:opacity-90 justify-between w-full px-4 py-4 rounded bg-[#282828] text-primary-content"
                  >
                    <span class="text-primary-content font-semibold text-lg">{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Seções FAQ */}
          <section class="w-full md:w-4/6">
            {activeNav.value === navItemPrinciapl.title && <FAQ questions={navItemPrinciapl.questions} />}
          </section>
        </main>
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="645px" />;
