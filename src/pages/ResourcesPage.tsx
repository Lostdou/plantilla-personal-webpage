import { Link } from "react-router-dom";
import { buttons88x31, squareButtons, tinyButtons } from "../data/resources";

const groups = [
  { size: "88x15", buttons: tinyButtons, itemClassName: "*:aspect-88/15" },
  { size: "88x31", buttons: buttons88x31, itemClassName: "*:aspect-88/31" },
  { size: "150x150", buttons: squareButtons, itemClassName: "*:aspect-150/150 *:w-37.5" },
];

export default function ResourcesPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[#EFEAD9] bg-cover"
      style={{ backgroundImage: "url(/assets/resources/background.webp)" }}
    >
      <div className="border-4 border-[#FED355] bg-[#F3FFED] rounded-2xl rounded-tl-none rounded-br-none md:max-w-lg min-h-100 mx-2 md:ml-12 p-3 space-y-3 relative ring-4 ring-[#01B2BF]">
        <Link to="/" className="flex hover:underline w-fit text-[8px] font-pixel">
          {"< "}home
        </Link>
        <div
          className="text-[#01B2BF] font-times font-bold hidden md:block absolute -top-10 -right-55 rotate-22 text-[100px] select-none"
          style={{
            filter: `
              drop-shadow(1px 1px 0 #016676)
              drop-shadow(-1px 1px 0 #016676)
              drop-shadow(0 -1px 0 #016676)
              drop-shadow(1px 0 #016676)
              drop-shadow(1px 1px 0 #ffce4b)
              drop-shadow(-1px 1px 0 #ffce4b)
              drop-shadow(0 -1px 0 #ffce4b)
              drop-shadow(1px 0 #ffce4b)
          `,
            transform: "skew(20deg) scaleX(0.7)",
          }}
        >
          RESOURCES
        </div>
        {groups.map((g) => (
          <div key={g.size}>
            <p className="font-times italic text-[#3D6857]/50 text-[14px]">{g.size}</p>
            <div className={`flex gap-2 flex-wrap ${g.itemClassName}`}>
              {g.buttons.map((b) => (
                <a key={b.src} href={b.src} download>
                  <img src={b.src} />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="text-white text-black-border">click on any image to download!</p>
    </div>
  );
}
