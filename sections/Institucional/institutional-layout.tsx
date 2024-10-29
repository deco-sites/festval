import { useSignal } from "@preact/signals";
import { useId } from "preact/hooks";
import Image from "apps/website/components/Image.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import { RichText } from "apps/admin/widgets.ts";

type TextArea = string;

interface Question {
  question: string;
  answer: string;
}

interface NavItem {
  title: string;
  href: string;
  contentType: string;
  children?: Question[];
}

interface Props {
  introText: TextArea;
  introContent?: RichText;
  introImage: ImageWidget;

  navItems: NavItem[];
}

function FAQ({ questions }: { questions: Question[] }) {
  return (
    <section class="mb-8">
      <ul>
        {questions.map((question, index) => (
          <li key={index} id={`faq-${index}`} class="mb-4">
            <details class="collapse collapse-arrow border-t border-base-200">
              <summary class="collapse-title text-lg font-medium">{question.question}</summary>
              <div class="collapse-content" dangerouslySetInnerHTML={{ __html: question.answer }} />
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DynamicInstitutionalLayout({ introText, introContent, introImage, navItems }: Props) {
  const activeNav = useSignal(navItems[0]?.href);
  const expandedFAQs = useSignal<string[]>([]);

  const toggleFAQ = (href: string) => {
    expandedFAQs.value = expandedFAQs.value.includes(href)
      ? expandedFAQs.value.filter((item) => item !== href)
      : [...expandedFAQs.value, href];
  };

  return (
    <div class="custom-container w-full flex flex-row md:flex-col min-h-screen bg-base-100">
      {/* Intro Section */}
      <section class="mb-8">
        <div class="flex flex-row md:flex-row gap-5 justify-between">
          <div class="wrapper">
            <h1 class="font-bold text-base-content text-[40px]">{introText}</h1>
            {introContent && <div dangerouslySetInnerHTML={{ __html: introContent }} />}
          </div>
          <div class="w-fit">
            <Image width={300} height={300} src={introImage} alt="Intro image" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main class="flex flex-row p-4">
        {/* Sidebar Navigation */}
        <nav class="w-2/6 bg-base-200 p-4">
          <ul>
            {navItems.map((item) => {
              const menuId = useId();
              return (
                <li key={item.href} class="mb-2">
                  <button
                    class={`flex items-center justify-between w-full p-2 rounded ${
                      activeNav.value === item.href ? "bg-primary text-primary-content" : "hover:bg-base-300"
                    }`}
                    onClick={() => {
                      activeNav.value = item.href;
                      toggleFAQ(item.href);
                    }}
                  >
                    <span>{item.title}</span>
                  </button>
                  {item.children && expandedFAQs.value.includes(item.href) && (
                    <ul class="ml-4 mt-2">
                      {item.children.map((subItem, index) => (
                        <li key={index} class="mb-1">
                          <a
                            href={`#faq-${menuId}-${index}`}
                            class="block p-1 text-sm hover:underline"
                            onClick={(e) => {
                              e.preventDefault();
                              const element = document.getElementById(`faq-${menuId}-${index}`);
                              element?.scrollIntoView({ behavior: "smooth" });
                            }}
                          >
                            {subItem.question}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* FAQ Sections */}
        {navItems.map((item) => (item.children ? <FAQ key={item.href} questions={item.children} /> : null))}
      </main>
    </div>
  );
}
