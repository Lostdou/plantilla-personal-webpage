import { useState } from "react";
import { Link } from "react-router-dom";
import { getAge } from "../lib/age";

const literallyMe = [
  "https://i.pinimg.com/736x/34/a0/cd/34a0cdced50ae4dd8a533ea04a809242.jpg",
  "https://i.pinimg.com/736x/1f/1b/e3/1f1be388277579226edfb1b3cb431b4f.jpg",
  "https://i.pinimg.com/736x/c5/ee/bf/c5eebff962bdf642abce3cf2a88f70e2.jpg",
];

function AboutTab() {
  return (
    <div className="space-y-4">
      <div className="bg-amber-200">
        Ainda vou reescrever essa página, relendo ela hoje em dia, senti muito odio na forma como escrevi na epoca, mas mesmo assim me resume bem xD
      </div>

      <div className="space-y-1">
        <div className="bg-[#ACB8F3]/50 font-bold text-[#6A6CC3] px-2 rounded">{"-> "}SOBRE MIM</div>
        <div className="space-y-2 pl-2">
          <p>
            sou a YourName, gosto de visual novels, anime, mangá, jogos e etc... tenho {getAge()} anos, e odeio a ideia de envelhecer e
            morrer, sou uma pessoa estranha e indecisa, mas ao mesmo tempo tenho opiniões fortes sobre coisas que gosto.
          </p>
          <p>me interesso por computadores e programação, jogo no PC desde criança, então isso resume minha vida até agora, atualmente estou terminando a faculdade.</p>
          <p>gosto de coisas fofas e moe, mas eu não sou muito fofa, então decidi reescrever essa página pra refletir minha personalidade de verdade.</p>
          <p>meu "sonho" é ter uma condição boa o suficiente pra não precisar me preocupar com o amanhã.</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="bg-[#F3ACC8]/50 font-bold text-[#C36A8E] px-2 rounded">{"-> "}SOBRE MEUS HOBBIES</div>
        <div className="space-y-2 pl-2">
          <p>como eu disse antes, gosto de: visual novels, anime, mangá, jogos, etc, se quiser ver mais dá uma olhada na página do medialog.</p>
          <p>
            também tenho programação como hobby, mas é difícil equilibrar isso já que também é com o que eu trabalho, então, goste ou não, às vezes
            fica cansativo, mas se quiser perguntar algo sobre programação, ou qualquer outra coisa, fique à vontade.
          </p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="bg-[#95C3CD]/50 font-bold text-[#8DA674] px-2 rounded">{"-> "}SOBRE O EXAMPLE.COM</div>
        <div className="space-y-2 pl-2">
          <p>esse é um site pra falar sobre mim mesmo, sempre quis ter meu próprio blog, e aqui está, esse site é uma representação minha na internet</p>
          <p>se quiser saber como o site foi feito, frontend: react, ts, react-router, tailwind... backend: node, ts, express...</p>
          <p>se quiser saber por que usei isso, é porque é comodo.</p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="bg-[#6E62CC]/40 font-bold text-[#6E62CC] px-2 rounded">{"-> "}LITERALMENTE EU</div>
        <div className="flex gap-2 flex-wrap items-center justify-center">
          {literallyMe.map((src) => (
            <a key={src} href={src} target="_blank" className="border border-transparent hover:border-black hover:opacity-80">
              <img src={src} className="h-50 object-cover" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

type TabId = "about" | "setup" | "100questions";
const tabs: { id: TabId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "setup", label: "Setup" },
  { id: "100questions", label: "100 Questions" },
];
const tabBase = "py-1 px-2 font-bold text-[#0E088B] text-white-border border border-[#3D1B74] rounded";
const tabActive = "bg-[linear-gradient(180deg,#6E62CC_10%,#574CC2_100%)]";
const tabIdle = "bg-[linear-gradient(180deg,#A0A5E6_0%,#6E62CC_100%)] hover:bg-[linear-gradient(180deg,#6E62CC_0%,#A0A5E6_100%)]";

function Tabs({ activeTab, onChange }: { activeTab: TabId; onChange: (id: TabId) => void }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 min-w-max text-sm md:text-base">
        {tabs.map((t) => (
          <button key={t.id} className={`${tabBase} ${t.id === activeTab ? tabActive : tabIdle}`} onClick={() => onChange(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const questions = [
  { question: "Há quanto tempo você faz sites?", answer: "Uns 5 anos (escrevi isso em 2026)" },
  { question: "O que te fez entrar nesse hobby?", answer: "Sempre gostei de criar coisas, e sempre gostei de computadores, então meio que aconteceu" },
  { question: "Qual editor de texto você prefere?", answer: "VS Code" },
  { question: "Você atualiza seu site com frequência?", answer: "Sim, sou obcecada" },
  { question: "Seu gosto musical", answer: "Música geek" },
  { question: "Você acredita em astrologia?", answer: "Não, eu não acredito em nada sobrenatural, místico, religioso, e por aí vai" },
  { question: "Você estressa fácil?", answer: "Infelizmente" },
  { question: "Qual é/foi sua matéria favorita no colégio?", answer: "Matemática" },
  { question: "Você já teve fase emo, goth, otaku, etc.?", answer: "Nem preciso responder isso, né" },
  { question: "Você sabe cozinhar?", answer: "Não" },
  { question: "Qual foi a última música que você ouviu?", answer: "Safe In Your Skin - Title Flight [28/01/26 - o momento em que estou escrevendo isso]" },
  { question: "Se você pudesse reviver um momento, qual seria?", answer: "Jogar Muv-Luv, Hanachirasu, Sayoshi, Elden Ring, Cyberpunk 2077 pela primeira vez" },
  { question: "Quando você está mal, o que você faz pra se sentir melhor?", answer: "Fujo da realidade" },
  { question: "Qual sistema operacional você usa?", answer: "Windows 11. apesar de preferir Linux, mas ele ainda tem uma barreira enorme de compatibilidade infelizmente..." },
  { question: "Com que frequência e por quanto tempo você fica online?", answer: "Sempre que estou acordada" },
  { question: "Série favorita", answer: "House MD" },
];

function QuestionsTab() {
  return (
    <ol className="list-decimal list-inside space-y-3">
      {questions.map((q, i) => (
        <li key={i}>
          <span className="bg-[#ACB8F3]/50 font-bold text-[#6A6CC3] px-1 rounded">{q.question}</span>
          <br />
          <div className="ml-10">{q.answer}</div>
        </li>
      ))}
    </ol>
  );
}

type Social = { label: string; value: string; href?: string };
const setup: { specs: string; img: string; socials?: Social[] }[] = [
  {
    specs: "RTX 4060, i5 10400f, 32gb RAM",
    img: "/assets/about/setup/main-pc.webp",
    socials: [
      { label: "discord", value: "yourname" },
      { label: "steam", value: "yourname", href: "https://steamcommunity.com/id/yourname/" },
    ],
  },
  { specs: "Playstation 5", img: "/assets/about/setup/ps5.webp", socials: [{ label: "psn", value: "yourname" }] },
  { specs: "Playstation Vita", img: "/assets/about/setup/ps-vita.webp" },
  { specs: "Playstation Portable Go", img: "/assets/about/setup/psp-go.webp" },
  { specs: "Playstation 2 Slim", img: "/assets/about/setup/ps2.webp" },
];

function SetupTab() {
  return (
    <div className="grid sm:grid-cols-2 gap-2">
      {setup.map((s) => (
        <div key={s.specs} className="border-2 border-[#F3D5AC]/50 rounded-lg overflow-hidden flex flex-col transition-colors">
          <div className="bg-[#F3D5AC]/10 flex items-center justify-center p-2">
            <img src={s.img} alt={s.specs} className="w-full h-70 object-cover rounded-lg" />
          </div>
          <div className="px-2 pb-1 space-y-1">
            <p className="font-bold text-[14px]">{s.specs}</p>
            {s.socials && (
              <div className="flex flex-wrap gap-1 text-[12px]">
                {s.socials.map((a) =>
                  a.href ? (
                    <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer" className="bg-[#ACB8F3]/30 text-[#6A6CC3] rounded-full px-2 hover:bg-[#ACB8F3]">
                      {a.label}: {a.value}
                    </a>
                  ) : (
                    <span key={a.label} className="bg-[#ACB8F3]/30 text-[#6A6CC3] rounded-full px-2">
                      {a.label}: {a.value}
                    </span>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AboutPage() {
  const [tab, setTab] = useState<TabId>("about");
  return (
    <div
      className="bg-white text-white flex flex-col justify-center items-center min-h-screen overflow-x-hidden px-4 font-[Arial]"
      style={{ backgroundImage: "url(/assets/about/background.png)" }}
    >
      <div className="relative z-5 w-full max-w-230">
        <Link to="/" className="px-1 font-bold text-[#0E088B] text-white-border hover:text-[#6E62CC] select-none text-[12px] font-pixel">
          {"< "}Home
        </Link>
        <div className="bg-[#6E62CC] border-2 border-[#6E62CC] border-inset-style rounded-[10px] p-1.5 w-full space-y-1 mb-2 md:mb-0">
          <img src="/assets/about/banner.jpg" alt="About page header" className="rounded-[10px] border border-[#6E62CC] w-full h-25 sm:h-35 md:h-55 object-cover" />
          <Tabs activeTab={tab} onChange={setTab} />
          <div className="space-y-2 p-2 text-black text-white-border bg-white rounded border-2 border-[#6E62CC] h-122 overflow-y-scroll">
            {tab === "about" && <AboutTab />}
            {tab === "100questions" && <QuestionsTab />}
            {tab === "setup" && <SetupTab />}
          </div>
        </div>
        <img src="/assets/about/floating-char.webp" alt="Decorative" className="absolute -z-1 bottom-0 -right-80 hidden md:block" />
      </div>
    </div>
  );
}
