import { useCallback, useEffect, useRef, useState, type MouseEvent, type WheelEvent } from "react";
import { Pause, Play, Repeat, Volume2, VolumeX } from "lucide-react";
import Panel from "./Panel";

const J = "https://files.example.com/f/yourname/Jukebox/";

const tracks = [
  { title: "Kouhai Teito Ni", artist: "大山 曜", src: `${J}Kouhai%20Teito%20Ni.mp3`, cover: `${J}hanachirasu.jpg` },
  { title: "BLADE ARTS II", artist: "大山 曜", src: `${J}BLADE%20ARTS%20II.mp3`, cover: `${J}hanachirasu.jpg` },
  { title: "Despair", artist: "Hideki Taniuchi", src: `${J}Despair.mp3`, cover: `${J}kaiji.jpg` },
  { title: "Vow of sword", artist: "ZIZZ STUDIO", src: `${J}Vow%20of%20sword.mp3`, cover: `${J}cyber.jpg` },
  { title: "Acid rain", artist: "ZIZZ STUDIO", src: `${J}Acid%20rain.mp3`, cover: `${J}cyber.jpg` },
  { title: "マブラヴ - オルタネイティヴ ver.", artist: "Kuribayashi Minami", src: `${J}muvluvending.mp3`, cover: `${J}muvluv.jpg` },
];

const fmt = (s: number) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, "0")}`;

export default function Jukebox() {
  const audio = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const track = tracks[index];

  const play = useCallback(() => {
    audio.current?.play();
    setPlaying(true);
  }, []);
  const pause = () => {
    audio.current?.pause();
    setPlaying(false);
  };
  const next = useCallback(() => setIndex((i) => (i === tracks.length - 1 ? 0 : i + 1)), []);
  const toggleMute = () => {
    if (!audio.current) return;
    audio.current.muted = !muted;
    setMuted(!muted);
  };

  const seek = (e: MouseEvent<HTMLDivElement>) => {
    if (!audio.current || !duration) return;
    const r = e.currentTarget.getBoundingClientRect();
    audio.current.currentTime = ((e.clientX - r.left) / r.width) * duration;
  };
  const setVolumeFromClick = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const v = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    setVolume(v);
    if (v > 0 && muted) setMuted(false);
  };
  const setVolumeFromWheel = (e: WheelEvent<HTMLDivElement>) => {
    const d = e.deltaY > 0 ? -0.02 : 0.02;
    setVolume((v) => Math.max(0, Math.min(1, v + d)));
  };

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const onTime = () => setTime(el.currentTime);
    const onMeta = () => setDuration(el.duration);
    const onEnd = () => next();
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("ended", onEnd);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("ended", onEnd);
    };
  }, [next]);

  useEffect(() => {
    if (audio.current) audio.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (playing) {
      audio.current?.load();
      audio.current?.play();
    }
  }, [index, playing]);

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <Panel title="Jukebox" className="flex flex-col overflow-hidden min-w-0">
      <audio ref={audio} src={track.src} preload="metadata" loop={loop} />
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {track.cover && (
          <div
            key={track.cover}
            className="absolute inset-0 bg-cover bg-center blur-xs opacity-65 pointer-events-none"
            style={{ backgroundImage: `url(${track.cover})` }}
          />
        )}
        <div className="absolute inset-0 bg-(--home-primary-dark)/50 pointer-events-none" />
        <div className="relative h-full py-1.5 px-1 flex flex-col overflow-y-auto">
          <div className="flex-1 overflow-y-auto flex flex-col mb-1.5">
            {tracks.map((t, i) => (
              <button
                key={i}
                onClick={() => {
                  setIndex(i);
                  setPlaying(true);
                }}
                className={`w-full text-left px-1 transition-colors ${
                  i === index
                    ? "bg-linear-to-t from-(--home-accent)/35 via-transparent to-(--home-accent)/35 text-(--home-text)"
                    : "hover:bg-(--home-accent)/15 text-(--home-text)"
                }`}
              >
                <p className=" text-[8px] font-pixel truncate">{t.title}</p>
                <p className="text-[10px] text-(--home-accent-text) truncate">{t.artist}</p>
              </button>
            ))}
          </div>

          <div className="shrink-0 space-y-1">
            <div className="w-full h-1.5 bg-(--home-accent)/20" onClick={seek}>
              <div className="h-full bg-(--home-text-highlight) transition-[width] duration-200" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-[8px] font-pixel text-(--home-accent-text)">
              <span>{fmt(time)}</span>
              <span>{fmt(duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={playing ? pause : play} className="text-(--home-text-highlight) hover:opacity-80 transition-opacity shrink-0" title={playing ? "Pause" : "Play"}>
                {playing ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={() => setLoop((l) => !l)}
                className={`hover:text-(--home-text) transition-colors shrink-0 ${loop ? "text-(--home-text-highlight)" : "text-(--home-accent-text)"}`}
                title={loop ? "Loop on" : "Loop off"}
                aria-pressed={loop}
              >
                <Repeat size={14} />
              </button>
              <button onClick={toggleMute} className="text-(--home-accent-text) hover:text-(--home-text) transition-colors shrink-0" title={muted ? "Unmute" : "Mute"}>
                {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <div className="flex-1 h-1.5 bg-(--home-accent)/20" onClick={setVolumeFromClick} onWheel={setVolumeFromWheel}>
                <div className="h-full bg-(--home-accent) transition-[width] duration-100" style={{ width: `${(muted ? 0 : volume) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
