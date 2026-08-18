import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// Nhãn nhóm nằm ở dictionary; danh sách công nghệ là tên riêng nên không dịch.
const TECH_CATEGORIES = [
  { id: "frontend", techs: ["React", "Next.js", "Vue", "Angular", "TypeScript"] },
  { id: "backend", techs: ["Node.js", "Python", "Java", "Go", ".NET"] },
  { id: "mobile", techs: ["React Native", "Flutter", "iOS (Swift)", "Android (Kotlin)"] },
  { id: "aiml", techs: ["TensorFlow", "PyTorch", "OpenAI", "LangChain", "Hugging Face"] },
  { id: "cloud", techs: ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform"] },
  { id: "data", techs: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Kafka"] },
] as const;

const TECH_ICONS: Record<string, string> = {
  React: "⚛️",
  "Next.js": "▲",
  Vue: "💚",
  Angular: "🔴",
  TypeScript: "📘",
  "Node.js": "🟢",
  Python: "🐍",
  Java: "☕",
  Go: "🐹",
  ".NET": "💜",
  "React Native": "📱",
  Flutter: "🦋",
  "iOS (Swift)": "🍎",
  "Android (Kotlin)": "🤖",
  TensorFlow: "🧠",
  PyTorch: "🔥",
  OpenAI: "🤖",
  LangChain: "🔗",
  "Hugging Face": "🤗",
  AWS: "☁️",
  GCP: "🌐",
  Azure: "💙",
  Docker: "🐳",
  Kubernetes: "⚙️",
  Terraform: "🏗️",
  PostgreSQL: "🐘",
  MongoDB: "🍃",
  Redis: "🔴",
  Elasticsearch: "🔍",
  Kafka: "📨",
};

export default function TechnicalExpertiseSection({
  dict,
}: {
  dict: Dictionary["expertise"];
}) {
  return (
    <section
      id="expertise"
      className="section--muted py-12 sm:py-14 lg:py-16"
    >
      <div className="section-container">
        <Reveal>
          <SectionHeader
            eyebrow={dict.eyebrow}
            title={
              <>
                {dict.titleBefore}
                <span className="text-accent">{dict.titleAccent}</span>
              </>
            }
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TECH_CATEGORIES.map((category, i) => (
            <Reveal key={category.id} delay={i * 60}>
              <article className="card !p-8">
                <h4 className="mb-4 border-b border-primary/10 pb-3 text-base font-semibold text-primary">
                  {dict.categories[category.id]}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.techs.map((tech) => (
                    <span
                      key={tech}
                      className="tag transition-colors hover:bg-[#e6f7ed]"
                    >
                      <span>{TECH_ICONS[tech] || "⚡"}</span>
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
