import { useState, useEffect, useMemo, useRef } from "react";
import "./App.css";

import { TOPICS } from "./topics";
const SEED = TOPICS;

const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};
const uid = () => Math.random().toString(36).slice(2, 9);

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 1.8 + Math.random() * 1.8,
        rot: Math.random() * 720,
        c: ["#6c4bff", "#2de2a6", "#ffc933", "#ff5c7a", "#38bdf8"][i % 5],
      })),
    []
  );
  return (
    <div className="confetti" aria-hidden>
      {bits.map((b, i) => (
        <i key={i} style={{ left: b.left + "%", background: b.c, animationDelay: b.delay + "s", animationDuration: b.dur + "s", "--r": b.rot + "deg" }} />
      ))}
    </div>
  );
}

function Flash({ cards, addXp, lang }) {
  const deck = cards;
  const [i, setI] = useState(0);
  const [flip, setFlip] = useState(false);
  const [dir, setDir] = useState("right");
  const [auto, setAuto] = useState(false);
  const go = (d) => {
    const n = i + d;
    if (n < 0 || n >= deck.length) return;
    setDir(d > 0 ? "right" : "left");
    setFlip(false);
    setI(n);
    if (d > 0) addXp(1);
  };
  const speak = () => {
    try {
      const u = new SpeechSynthesisUtterance(deck[i].term);
      u.lang = lang || "en-US";
      speechSynthesis.cancel();
      speechSynthesis.speak(u);
    } catch {}
  };
  useEffect(() => {
    const h = (e) => {
      if (e.code === "Space") { e.preventDefault(); setFlip((f) => !f); }
      if (e.code === "ArrowRight") go(1);
      if (e.code === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });
  useEffect(() => {
    if (!auto) return;
    const id = setTimeout(() => {
      if (!flip) setFlip(true);
      else { setFlip(false); setDir("right"); setI((x) => (x + 1) % deck.length); }
    }, 2200);
    return () => clearTimeout(id);
  }, [auto, flip, i]);
  const tilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--tx", ((e.clientX - r.left) / r.width - 0.5) * 16 + "deg");
    e.currentTarget.style.setProperty("--ty", -((e.clientY - r.top) / r.height - 0.5) * 16 + "deg");
  };
  const c = deck[i];
  return (
    <div className="flash-wrap">
      {i === deck.length - 1 && flip && <Confetti />}
      <div className="bar"><span style={{ width: ((i + 1) / deck.length) * 100 + "%" }} /></div>
      <div className={"stage " + dir} key={i}>
        <div className="tilt" onMouseMove={tilt} onMouseLeave={(e) => { e.currentTarget.style.setProperty("--tx", "0deg"); e.currentTarget.style.setProperty("--ty", "0deg"); }}>
          <div className={"card3d" + (flip ? " flipped" : "")} onClick={() => setFlip(!flip)}>
            <div className="face front">{c.term}</div>
            <div className="face back">{c.def}</div>
          </div>
        </div>
      </div>
      <div className="row">
        <button className="btn ghost" onClick={() => go(-1)} disabled={i === 0}>←</button>
        <span className="count">{i + 1} / {deck.length}</span>
        <button className="btn" onClick={() => go(1)} disabled={i === deck.length - 1}>→</button>
      </div>
      <div className="row">
        <button className="btn ghost sm" onClick={speak}>🔊 Eshitish</button>
        <button className={"btn sm" + (auto ? "" : " ghost")} onClick={() => setAuto(!auto)}>{auto ? "⏸ To'xtatish" : "▶ Avto"}</button>
        <button className="btn ghost sm" onClick={() => { setI(0); setFlip(false); }}>↺ Boshidan</button>
      </div>
      <p className="hint">Bosib aylantiring · Space · ← →</p>
    </div>
  );
}

function Learn({ cards, addXp }) {
  const [deck, setDeck] = useState(() => shuffle(cards));
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  const opts = useMemo(() => {
    if (!deck[i]) return [];
    const others = shuffle(cards.filter((c) => c.id !== deck[i].id)).slice(0, 3);
    return shuffle([deck[i], ...others]);
  }, [i, deck]);
  if (i >= deck.length)
    return (
      <div className="result pop">
        {score === deck.length && <Confetti />}
        <h2>{score} / {deck.length}</h2>
        <p>{score === deck.length ? "Zo'r! Hammasi to'g'ri." : "Yana urinib ko'r."}</p>
        <button className="btn" onClick={() => { setDeck(shuffle(cards)); setI(0); setScore(0); setPick(null); }}>Qaytadan</button>
      </div>
    );
  const q = deck[i];
  const choose = (o) => {
    if (pick) return;
    setPick(o.id);
    if (o.id === q.id) { setScore((s) => s + 1); addXp(5); }
    setTimeout(() => { setPick(null); setI((x) => x + 1); }, 900);
  };
  return (
    <div className="learn" key={i}>
      <div className="bar"><span style={{ width: (i / deck.length) * 100 + "%" }} /></div>
      <div className="q pop">{q.term}</div>
      <div className="opts">
        {opts.map((o, k) => {
          let cls = "opt";
          if (pick) {
            if (o.id === q.id) cls += " right";
            else if (o.id === pick) cls += " wrong";
          }
          return (
            <button key={o.id} className={cls} style={{ animationDelay: k * 70 + "ms" }} onClick={() => choose(o)}>
              {o.def}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Write({ cards, addXp }) {
  const [deck, setDeck] = useState(() => shuffle(cards));
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [state, setState] = useState("");
  const [score, setScore] = useState(0);
  if (i >= deck.length)
    return (
      <div className="result pop">
        {score === deck.length && <Confetti />}
        <h2>{score} / {deck.length}</h2>
        <button className="btn" onClick={() => { setDeck(shuffle(cards)); setI(0); setScore(0); }}>Qaytadan</button>
      </div>
    );
  const q = deck[i];
  const check = (e) => {
    e.preventDefault();
    if (state) return;
    const ok = val.trim().toLowerCase() === q.term.trim().toLowerCase();
    setState(ok ? "right" : "wrong");
    if (ok) { setScore((s) => s + 1); addXp(8); }
    setTimeout(() => { setState(""); setVal(""); setI((x) => x + 1); }, ok ? 800 : 1600);
  };
  return (
    <div className="learn" key={i}>
      <div className="bar"><span style={{ width: (i / deck.length) * 100 + "%" }} /></div>
      <div className="q pop">{q.def}</div>
      <form onSubmit={check}>
        <input className={"write " + state} autoFocus value={val} onChange={(e) => setVal(e.target.value)} placeholder="Inglizchasini yoz..." />
        {state === "wrong" && <p className="answer pop">To'g'ri javob: <b>{q.term}</b></p>}
        <button className="btn" type="submit">Tekshirish</button>
      </form>
    </div>
  );
}

function Match({ cards, addXp }) {
  const make = () =>
    shuffle(
      shuffle(cards).slice(0, 6).flatMap((c) => [
        { k: c.id + "t", id: c.id, text: c.term },
        { k: c.id + "d", id: c.id, text: c.def },
      ])
    );
  const [tiles, setTiles] = useState(make);
  const [sel, setSel] = useState(null);
  const [gone, setGone] = useState([]);
  const [bad, setBad] = useState([]);
  const [t, setT] = useState(0);
  const total = tiles.length / 2;
  const won = gone.length === tiles.length;
  useEffect(() => {
    if (won) return;
    const id = setInterval(() => setT((x) => x + 0.1), 100);
    return () => clearInterval(id);
  }, [won]);
  const tap = (tile) => {
    if (gone.includes(tile.k) || bad.length || sel?.k === tile.k) return;
    if (!sel) return setSel(tile);
    if (sel.id === tile.id) {
      setGone((g) => [...g, sel.k, tile.k]);
      addXp(3);
      setSel(null);
    } else {
      setBad([sel.k, tile.k]);
      setTimeout(() => { setBad([]); setSel(null); }, 500);
    }
  };
  return (
    <div>
      {won && <Confetti />}
      <div className="row between">
        <span className="count">{gone.length / 2} / {total}</span>
        <span className="timer">{t.toFixed(1)}s</span>
      </div>
      {won ? (
        <div className="result pop">
          <h2>{t.toFixed(1)} soniyada!</h2>
          <button className="btn" onClick={() => { setTiles(make()); setGone([]); setT(0); setSel(null); }}>Qaytadan</button>
        </div>
      ) : (
        <div className="grid">
          {tiles.map((x, k) => (
            <button
              key={x.k}
              style={{ animationDelay: k * 40 + "ms" }}
              className={"tile" + (sel?.k === x.k ? " sel" : "") + (bad.includes(x.k) ? " bad" : "") + (gone.includes(x.k) ? " gone" : "")}
              onClick={() => tap(x)}
            >
              {x.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const TIME = 15;
function Test({ cards, addXp }) {
  const N = Math.min(10, cards.length);
  const build = () =>
    shuffle(cards).slice(0, N).map((c, n) => ({
      c,
      rev: n % 2 === 1,
      opts: shuffle([c, ...shuffle(cards.filter((x) => x.id !== c.id)).slice(0, 3)]),
    }));
  const [qs, setQs] = useState(build);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [miss, setMiss] = useState([]);
  const [left, setLeft] = useState(TIME);
  const finished = i >= N;
  const answer = (o) => {
    if (pick) return;
    const q = qs[i];
    const ok = !!o && o.id === q.c.id;
    setPick(o ? o.id : "none");
    if (ok) { setScore((x) => x + 1); setCombo((x) => x + 1); addXp(10 + combo * 2); }
    else { setCombo(0); setMiss((m) => [...m, q.c]); }
    setTimeout(() => { setPick(null); setLeft(TIME); setI((x) => x + 1); }, 1000);
  };
  useEffect(() => {
    if (pick || finished) return;
    if (left <= 0) return answer(null);
    const id = setTimeout(() => setLeft((l) => l - 1), 1000);
    return () => clearTimeout(id);
  }, [left, pick, finished]);
  useEffect(() => { if (finished) addXp(score * 3); }, [finished]);
  if (finished) {
    const pct = Math.round((score / N) * 100);
    return (
      <div className="result pop">
        {pct >= 80 && <Confetti />}
        <div className="grade">{pct >= 90 ? "🏆" : pct >= 70 ? "🥇" : pct >= 50 ? "👍" : "💪"}</div>
        <h2>{score} / {N}</h2>
        <p>{pct}% — +{score * 3} XP bonus</p>
        {miss.length > 0 && (
          <div className="list miss">
            {miss.map((m) => <div key={m.id}><b>{m.term}</b><span>{m.def}</span></div>)}
          </div>
        )}
        <button className="btn" onClick={() => { setQs(build()); setI(0); setScore(0); setCombo(0); setMiss([]); setLeft(TIME); }}>Yangi test</button>
      </div>
    );
  }
  const q = qs[i];
  return (
    <div className="learn" key={i}>
      <div className="row between">
        <span className="count">{i + 1} / {N}</span>
        {combo >= 2 && <span className="combo pop" key={combo}>🔥 x{combo}</span>}
        <span className={"timer" + (left <= 5 ? " hot" : "")}>{left}s</span>
      </div>
      <div className="tbar"><span key={i} style={{ animationPlayState: pick ? "paused" : "running" }} /></div>
      <div className="q pop">{q.rev ? q.c.def : q.c.term}</div>
      <div className="opts">
        {q.opts.map((o, k) => {
          let cls = "opt";
          if (pick) { if (o.id === q.c.id) cls += " right"; else if (o.id === pick) cls += " wrong"; }
          return (
            <button key={o.id} className={cls} style={{ animationDelay: k * 70 + "ms" }} onClick={() => answer(o)}>
              {q.rev ? o.term : o.def}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Wiggle({ text }) {
  return <>{[...text].map((ch, k) => <i key={k} style={{ animationDelay: k * 0.08 + "s" }}>{ch === " " ? "\u00a0" : ch}</i>)}</>;
}

function Editor({ set, onSave, onCancel }) {
  const [title, setTitle] = useState(set.title);
  const [cards, setCards] = useState(set.cards.length ? set.cards : [{ id: uid(), term: "", def: "" }]);
  const upd = (id, f, v) => setCards(cards.map((c) => (c.id === id ? { ...c, [f]: v } : c)));
  return (
    <div className="editor pop">
      <input className="title-in" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="To'plam nomi" />
      {cards.map((c, n) => (
        <div className="erow pop" key={c.id}>
          <span>{n + 1}</span>
          <input value={c.term} onChange={(e) => upd(c.id, "term", e.target.value)} placeholder="Termin" />
          <input value={c.def} onChange={(e) => upd(c.id, "def", e.target.value)} placeholder="Ta'rif" />
          <button className="x" onClick={() => setCards(cards.filter((k) => k.id !== c.id))}>✕</button>
        </div>
      ))}
      <button className="btn ghost" onClick={() => setCards([...cards, { id: uid(), term: "", def: "" }])}>+ Karta qo'shish</button>
      <div className="row">
        <button className="btn ghost" onClick={onCancel}>Bekor qilish</button>
        <button
          className="btn"
          disabled={!title.trim() || cards.filter((c) => c.term && c.def).length < 4}
          onClick={() => onSave({ ...set, title: title.trim(), cards: cards.filter((c) => c.term && c.def) })}
        >
          Saqlash
        </button>
      </div>
      <p className="hint">Kamida 4 ta to'liq karta kerak.</p>
    </div>
  );
}

const MODES = [
  ["flash", "Kartochkalar", "🃏"],
  ["learn", "O'rganish", "🧠"],
  ["test", "Test", "🏆"],
  ["write", "Yozish", "✍️"],
  ["match", "Moslashtirish", "⚡"],
];

export default function App() {
  const [sets, setSets] = useState(() => {
    try { return JSON.parse(localStorage.getItem("sets2")) || SEED; } catch { return SEED; }
  });
  const [xp, setXp] = useState(() => {
    try { return +localStorage.getItem("xp") || 0; } catch { return 0; }
  });
  const [view, setView] = useState({ name: "home" });
  const [q, setQ] = useState("");
  useEffect(() => { try { localStorage.setItem("sets2", JSON.stringify(sets)); } catch {} }, [sets]);
  useEffect(() => { try { localStorage.setItem("xp", String(xp)); } catch {} }, [xp]);
  const addXp = (n) => setXp((x) => x + n);
  const all = { id: "all", title: "Aralash: hamma mavzulardan", emoji: "🌈", cards: sets.flatMap((s) => s.cards) };
  const cur = view.id === "all" ? all : sets.find((s) => s.id === view.id);
  const save = (s) => {
    setSets((p) => (p.some((x) => x.id === s.id) ? p.map((x) => (x.id === s.id ? s : x)) : [...p, s]));
    setView({ name: "set", id: s.id });
  };
  const back = () => setView(view.name === "set" || !cur ? { name: "home" } : { name: "set", id: cur.id });
  const shown = sets.filter((s) => s.title.toLowerCase().includes(q.toLowerCase()));
  const total = sets.reduce((n, s) => n + s.cards.length, 0);
  return (
    <div className="app">
      <header>
        <button className="logo" onClick={() => setView({ name: "home" })}>Kartoch<b>ka</b></button>
        <div className="xp">
          <span key={xp} className="bump">⭐ {xp}</span>
          <em>Lv {Math.floor(xp / 100) + 1}</em>
          <div className="xbar"><span style={{ width: (xp % 100) + "%" }} /></div>
        </div>
      </header>
      {view.name !== "home" && <button className="btn ghost sm backbtn" onClick={back}>← Orqaga</button>}
      <main key={view.name + (view.id || "")} className="page">
        {view.name === "home" && (
          <>
            <h1 className="hero wg"><Wiggle text="Yodla." /> <span><Wiggle text="O'yna." /></span> <Wiggle text="Esla." /></h1>
            <p className="sub">{sets.length} ta mavzu · {total} ta savol</p>
            <button className="mega" onClick={() => setView({ name: "set", id: "all" })}>
              <span>🌈</span> Aralash test — hamma mavzulardan
            </button>
            <input className="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Mavzu qidirish..." />
            <div className="sets">
              {shown.map((s, k) => (
                <button key={s.id} className="setcard" style={{ animationDelay: k * 60 + "ms", "--c": s.color || "#6c4bff" }} onClick={() => setView({ name: "set", id: s.id })}>
                  <em>{s.emoji || "📝"}</em>
                  <h3>{s.title}</h3>
                  <span>{s.cards.length} ta karta</span>
                </button>
              ))}
              <button className="setcard new" onClick={() => setView({ name: "edit", id: uid() })}>+ Yangi to'plam</button>
            </div>
            {shown.length === 0 && <p className="hint">Hech narsa topilmadi. Boshqa so'z yozib ko'r.</p>}
          </>
        )}
        {view.name === "edit" && (
          <Editor set={cur || { id: view.id, title: "", cards: [] }} onSave={save} onCancel={() => setView(cur ? { name: "set", id: cur.id } : { name: "home" })} />
        )}
        {view.name === "set" && cur && (
          <>
            <h2 className="settitle"><span className="bigemoji">{cur.emoji || "📝"}</span> {cur.title}</h2>
            <div className="modes">
              {MODES.filter(([m]) => cur.id !== "all" || m !== "flash").map(([m, label, ic], k) => (
                <button key={m} className="mode" style={{ animationDelay: k * 90 + "ms" }} onClick={() => setView({ name: m, id: cur.id })}>
                  <em>{ic}</em>{label}
                </button>
              ))}
            </div>
            {cur.id !== "all" && (
              <>
                <div className="list">
                  {cur.cards.map((c) => <div key={c.id}><b>{c.term}</b><span>{c.def}</span></div>)}
                </div>
                <div className="row">
                  <button className="btn ghost" onClick={() => setView({ name: "edit", id: cur.id })}>Tahrirlash</button>
                  <button className="btn ghost" onClick={() => { setSets(sets.filter((s) => s.id !== cur.id)); setView({ name: "home" }); }}>O'chirish</button>
                </div>
              </>
            )}
          </>
        )}
        {view.name === "flash" && cur && <Flash cards={cur.cards} addXp={addXp} lang={cur.lang} />}
        {view.name === "learn" && cur && <Learn cards={cur.cards} addXp={addXp} />}
        {view.name === "test" && cur && <Test cards={cur.cards} addXp={addXp} />}
        {view.name === "write" && cur && <Write cards={cur.cards} addXp={addXp} />}
        {view.name === "match" && cur && <Match cards={cur.cards} addXp={addXp} />}
      </main>
    </div>
  );
}