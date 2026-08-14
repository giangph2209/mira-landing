import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

const TECH_CATEGORIES = [
  {
    label: "Frontend",
    techs: ["React", "Next.js", "Vue", "Angular", "TypeScript"],
  },
  { label: "Backend", techs: ["Node.js", "Python", "Java", "Go", ".NET"] },
  {
    label: "Mobile",
    techs: ["React Native", "Flutter", "iOS (Swift)", "Android (Kotlin)"],
  },
  {
    label: "AI / ML",
    techs: ["TensorFlow", "PyTorch", "OpenAI", "LangChain", "Hugging Face"],
  },
  {
    label: "Cloud & DevOps",
    techs: ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform"],
  },
  {
    label: "Data",
    techs: ["PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Kafka"],
  },
];

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

export default function TechnicalExpertiseSection() {
  return (
    <section
      id="expertise"
      className="section--muted py-12 sm:py-14 lg:py-16"
    >
      <div className="section-container">
        <Reveal>
          <SectionHeader
            eyebrow="Tech stack"
            title={
              <>
                Technical <span className="text-accent">Expertise</span>
              </>
            }
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TECH_CATEGORIES.map((category, i) => (
            <Reveal key={category.label} delay={i * 60}>
              <article className="card !p-8">
                <h4 className="mb-4 border-b border-primary/10 pb-3 text-base font-semibold text-primary">
                  {category.label}
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
