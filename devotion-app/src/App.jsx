import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Sunrise, Shuffle, RotateCcw, Star, Check, ChevronDown, ChevronUp,
  NotebookPen, History, Clock, BookOpen, Settings, Lock, Unlock, User,
  Plus, Share2, Printer, Download, ListMusic, X, Copy,
} from "lucide-react";
import { DEVOTIONS } from "./devotions.js";

// ---------------------------------------------------------------------------
// Verse bank — public domain (KJV) text, curated for Monday workplace devotion:
// new beginnings, diligence, integrity, courage, rest, service, unity, wisdom.
// ---------------------------------------------------------------------------
const VERSES = [
  { id: "col3-23", ref: "Colossians 3:23-24", theme: "Diligence", text: "And whatsoever ye do, do it heartily, as to the Lord, and not unto men; Knowing that of the Lord ye shall receive the reward of the inheritance: for ye serve the Lord Christ.", reflection: "The measure of our work was never meant to be the applause of a manager or the size of a paycheck. It's who we're ultimately doing it for.", application: "Before your first task this week, silently dedicate the work of your hands to God — even the boring parts." },
  { id: "prov16-3", ref: "Proverbs 16:3", theme: "New Beginnings", text: "Commit thy works unto the LORD, and thy thoughts shall be established.", reflection: "A new week brings a blank page. Anxiety fills a blank page with worry; commitment fills it with trust.", application: "Name one task you're dreading this week and hand it over in prayer before you start it." },
  { id: "phil4-13", ref: "Philippians 4:13", theme: "Strength", text: "I can do all things through Christ which strengtheneth me.", reflection: "Not a promise of ease, but of enough — enough strength for whatever Monday actually requires of you.", application: "Whatever meeting or deadline feels heaviest today, remember the strength isn't manufactured by you." },
  { id: "josh1-9", ref: "Joshua 1:9", theme: "Courage", text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.", reflection: "Joshua needed courage to lead into unfamiliar territory. Most of us just need courage to walk into an unfamiliar week.", application: "Wherever you go today — your desk, a job site, a client call — you don't go there alone." },
  { id: "ecc9-10", ref: "Ecclesiastes 9:10", theme: "Diligence", text: "Whatsoever thy hand findeth to do, do it with thy might.", reflection: "Solomon, who had seen every kind of striving turn to vapor, still landed here: give it your full effort anyway.", application: "Pick the one task today you're most tempted to phone in, and give it your best instead." },
  { id: "gen2-2", ref: "Genesis 2:2-3", theme: "Rest", text: "And on the seventh day God ended his work which he had made; and he rested on the seventh day from all his work which he had made. And God blessed the seventh day, and sanctified it.", reflection: "Rest isn't a reward you earn after work — it's built into the pattern before the work week even starts.", application: "Look at your week ahead and protect one boundary that lets you actually stop, not just slow down." },
  { id: "prov3-5", ref: "Proverbs 3:5-6", theme: "Trust", text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.", reflection: "Monday planning usually means leaning hard on our own understanding. This verse asks for a different kind of leaning.", application: "In your first planning moment today, ask for direction before you rely on your own read of the situation." },
  { id: "gal6-9", ref: "Galatians 6:9", theme: "Perseverance", text: "And let us not be weary in well doing: for in due season we shall reap, if we faint not.", reflection: "Some of the good work we're doing right now won't show fruit for months. Weariness lies about that.", application: "Think of one thing you've kept doing faithfully with no visible payoff yet — that's not wasted." },
  { id: "col3-17", ref: "Colossians 3:17", theme: "Purpose", text: "And whatsoever ye do in word or deed, do all in the name of the Lord Jesus, giving thanks to God the Father by him.", reflection: "Emails, reports, small talk in the hallway — the instruction covers all of it, not just the spiritual-looking parts.", application: "Choose one routine task today and consciously do it 'in the name of' rather than on autopilot." },
  { id: "isa40-31", ref: "Isaiah 40:31", theme: "Renewal", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, they shall walk, and not faint.", reflection: "Notice the order: mounting up, then running, then just walking without fainting. Renewal covers even our slowest days.", application: "If this week feels more like 'walking without fainting' than soaring, that's still the promise at work." },
  { id: "prov13-4", ref: "Proverbs 13:4", theme: "Diligence", text: "The soul of the sluggard desireth, and hath nothing: but the soul of the diligent shall be made fat.", reflection: "Desire alone changes nothing. It's the diligent soul, not the wishful one, that the proverb calls satisfied.", application: "Turn one thing you've only been wishing for this week into one concrete action today." },
  { id: "eph4-32", ref: "Ephesians 4:32", theme: "Unity", text: "And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ's sake hath forgiven you.", reflection: "Office friction is rarely about the actual disagreement. Kindness offered first tends to change the whole exchange.", application: "If there's tension with a coworker right now, let today be the day you extend the first kindness." },
  { id: "prov21-5", ref: "Proverbs 21:5", theme: "Diligence", text: "The thoughts of the diligent tend only to plenteousness; but of every one that is hasty only to want.", reflection: "Hurry feels productive but often produces the least. Careful, steady thought is the quieter path to abundance.", application: "Before rushing into your first task, take five unhurried minutes to actually think it through." },
  { id: "matt6-33", ref: "Matthew 6:33", theme: "Priorities", text: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.", reflection: "'These things' were food, clothing, provision — the very things a Monday to-do list is usually built around.", application: "Whatever's at the top of your list today, put one act of seeking God even higher than it." },
  { id: "1cor10-31", ref: "1 Corinthians 10:31", theme: "Purpose", text: "Whether therefore ye eat, or drink, or whatsoever ye do, do all to the glory of God.", reflection: "'Whatsoever' is doing a lot of work in that sentence — it was written to cover ordinary, unglamorous moments.", application: "Let your posture in one ordinary interaction today — a call, an email — be shaped by this verse." },
  { id: "prov27-17", ref: "Proverbs 27:17", theme: "Unity", text: "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.", reflection: "Sharpening involves friction, not just comfort. The colleagues who challenge you may be doing you a favor.", application: "Reach out to one coworker today whose honesty has made you better, and tell them so." },
  { id: "phil2-3", ref: "Philippians 2:3-4", theme: "Humility", text: "Let nothing be done through strife or vainglory; but in lowliness of mind let each esteem other better than themselves.", reflection: "Workplace ambition and biblical humility aren't automatically opposed, but they do require this kind of check.", application: "In your next meeting, practice esteeming a colleague's idea before pushing your own." },
  { id: "james1-2", ref: "James 1:2-3", theme: "Perseverance", text: "My brethren, count it all joy when ye fall into divers temptations; Knowing this, that the trying of your faith worketh patience.", reflection: "Nobody feels joy at a Monday full of problems. James isn't asking for a feeling — he's pointing at what the trial produces.", application: "Name one recurring frustration at work and ask what patience it might actually be building in you." },
  { id: "prov16-9", ref: "Proverbs 16:9", theme: "Trust", text: "A man's heart deviseth his way: but the LORD directeth his steps.", reflection: "Plans get made every Monday morning; not all of them survive till Tuesday. This is why that's not a crisis.", application: "Hold today's plan loosely — make it, but leave room for it to be redirected." },
  { id: "rom12-11", ref: "Romans 12:11", theme: "Diligence", text: "Not slothful in business; fervent in spirit; serving the Lord.", reflection: "Paul ties business diligence directly to spiritual fervor — as if the two were never meant to be separated.", application: "Bring the same fervor to your inbox today that you'd bring to something you called 'spiritual.'" },
  { id: "psalm90-17", ref: "Psalm 90:17", theme: "Purpose", text: "And let the beauty of the LORD our God be upon us: and establish thou the work of our hands; establish thou the work of our hands.", reflection: "Moses repeats the line — a request said twice because he really meant it. Our work needs establishing, not just effort.", application: "Pray this verse over one specific project you're starting or continuing this week." },
  { id: "prov22-29", ref: "Proverbs 22:29", theme: "Diligence", text: "Seest thou a man diligent in his business? he shall stand before kings; he shall not stand before mean men.", reflection: "Skill and diligence were noticed then and are noticed now, even when no one seems to be watching.", application: "Do the one task today that no one will check on as if someone important were watching." },
  { id: "heb13-16", ref: "Hebrews 13:16", theme: "Service", text: "But to do good and to communicate forget not: for with such sacrifices God is well pleased.", reflection: "Not every offering to God looks like worship music. Some of it looks like sharing what you have with a coworker.", application: "Look for one practical way to help a colleague today, even if it costs you time." },
  { id: "prov15-22", ref: "Proverbs 15:22", theme: "Wisdom", text: "Without counsel purposes are disappointed: but in the multitude of counsellors they are established.", reflection: "The lone-genius approach to work rarely finishes what it starts. Wisdom keeps asking for other eyes.", application: "Before finalizing a decision this week, deliberately ask one more person for their perspective." },
  { id: "matt5-16", ref: "Matthew 5:16", theme: "Purpose", text: "Let your light so shine before men, that they may see your good works, and glorify your father which is in heaven.", reflection: "The good work itself is the sermon most coworkers will actually hear this week.", application: "Let your conduct in one difficult interaction today be the clearest thing you preach." },
  { id: "prov12-24", ref: "Proverbs 12:24", theme: "Diligence", text: "The hand of the diligent shall bear rule: but the slothful shall be under tribute.", reflection: "Diligence isn't just about output — it shapes the kind of freedom or constraint we live under long-term.", application: "Choose diligence in the small, unseen task today rather than the one that will be noticed." },
  { id: "1thess5-16", ref: "1 Thessalonians 5:16-18", theme: "Gratitude", text: "Rejoice evermore. Pray without ceasing. In every thing give thanks: for this is the will of God in Christ Jesus concerning you.", reflection: "Three commands, and the middle one — pray without ceasing — is what makes the other two possible on a hard Monday.", application: "Set a reminder partway through today to pause and give thanks for one specific thing." },
  { id: "prov11-25", ref: "Proverbs 11:25", theme: "Service", text: "The liberal soul shall be made fat: and he that watereth shall be watered also.", reflection: "Generosity toward colleagues has a strange way of coming back around — not as payback, but as provision.", application: "Give something away today — time, credit, help — without keeping score." },
  { id: "psalm118-24", ref: "Psalm 118:24", theme: "New Beginnings", text: "This is the day which the LORD hath made; we will rejoice and be glad in it.", reflection: "The verse doesn't wait for Monday to earn our gladness. It simply names the day as His and asks us to rejoice anyway.", application: "Before checking your inbox, say this verse out loud as a decision, not just a feeling." },
  { id: "prov10-4", ref: "Proverbs 10:4", theme: "Diligence", text: "He becometh poor that dealeth with a slack hand: but the hand of the diligent maketh rich.", reflection: "Not every kind of poverty is financial — a slack hand can also cost us skill, trust, and opportunity.", application: "Notice where you've been coasting lately and choose one deliberate act of diligence today." },
  { id: "col3-12", ref: "Colossians 3:12", theme: "Character", text: "Put on therefore, as the elect of God, holy and beloved, bowels of mercies, kindness, humbleness of mind, meekness, longsuffering.", reflection: "Paul describes character as clothing — something put on deliberately each morning, not a mood we wait to feel.", application: "Choose one quality from this list to intentionally 'wear' in your hardest meeting today." },
  { id: "prov19-21", ref: "Proverbs 19:21", theme: "Trust", text: "There are many devices in a man's heart; nevertheless the counsel of the LORD, that shall stand what shall stand.", reflection: "Our five-year plans and Monday to-do lists are both devices. Only one counsel outlasts every version of them.", application: "Hold today's agenda with an open hand, ready for it to be rearranged." },
  { id: "matt11-28", ref: "Matthew 11:28", theme: "Rest", text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", reflection: "This invitation was given to laborers, not the idle. Rest in Christ was always meant to meet us mid-work.", application: "If you're carrying something heavy into this week, name it honestly before you name your tasks." },
  { id: "prov3-9", ref: "Proverbs 3:9-10", theme: "Stewardship", text: "Honour the LORD with thy substance, and with the firstfruits of all thine increase: So shall thy barns be filled with plenty.", reflection: "Firstfruits means giving before you know what's left over — an act of trust before the results are in.", application: "Consider one way to honor God with the 'firstfruits' of your effort this week, not just the leftovers." },
  { id: "james1-19", ref: "James 1:19", theme: "Character", text: "Wherefore, my beloved brethren, let every man be swift to hear, slow to speak, slow to wrath.", reflection: "Reverse the order in a tense meeting — quick to speak, slow to listen — and see how much harder Monday gets.", application: "In your next disagreement today, deliberately listen twice as long as you speak." },
  { id: "prov24-27", ref: "Proverbs 24:27", theme: "Priorities", text: "Prepare thy work without, and make it fit for thyself in the field; and afterwards build thine house.", reflection: "Order matters. Get the foundational work done first, and let the rest be built on something solid.", application: "Identify the one foundational task today that everything else depends on, and start there." },
  { id: "psalm127-1", ref: "Psalm 127:1", theme: "Trust", text: "Except the LORD build the house, they labour in vain that build it: except the LORD keep the city, the watchman waketh but in vain.", reflection: "Effort without dependence on God is still effort — the verse doesn't call it worthless, just vain, empty of its intended weight.", application: "Before your biggest project of the week, ask God to build it with you, not just bless it after." },
  { id: "gal6-2", ref: "Galatians 6:2", theme: "Service", text: "Bear ye one another's burdens, and so fulfil the law of Christ.", reflection: "Most burdens at work are carried silently. Noticing them is often the first step to bearing them.", application: "Ask one coworker today what's actually weighing on them, and really listen to the answer." },
  { id: "prov4-23", ref: "Proverbs 4:23", theme: "Character", text: "Keep thy heart with all diligence; for out of it are the issues of life.", reflection: "We guard deadlines and budgets carefully. This verse asks for that same diligence toward our own heart.", application: "Take one honest inventory today of what's shaping your heart before the workday shapes it for you." },
  { id: "isa41-10", ref: "Isaiah 41:10", theme: "Courage", text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee.", reflection: "Four promises stacked together for one anxious moment — presence, strength, help, and a steadying hand.", application: "Whatever's making you anxious about this week, hold it up against these four promises one at a time." },
];

const DAY_MS = 24 * 60 * 60 * 1000;

function isoWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / DAY_MS + 1) / 7);
}

function weekIndex(date, length) {
  const week = isoWeekNumber(date);
  const year = date.getFullYear();
  return (year * 53 + week) % length;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function estimateReadMinutes(paragraphs) {
  const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 130));
}

function lsGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
}

export default function App() {
  const today = useMemo(() => new Date(), []);

  // --- privacy / profile ---
  const [pin, setPin] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinReady, setPinReady] = useState(false);
  const [pinAttempt, setPinAttempt] = useState("");
  const [pinError, setPinError] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  // --- verse data ---
  const [customVerses, setCustomVerses] = useState([]);
  const allVerses = useMemo(() => [...VERSES, ...customVerses], [customVerses]);
  const defaultIndex = useMemo(() => weekIndex(today, allVerses.length), [today, allVerses.length]);
  const [index, setIndex] = useState(0);

  // --- content state ---
  const [note, setNote] = useState("");
  const [saveState, setSaveState] = useState("idle");
  const [favorites, setFavorites] = useState({});
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [presentedToday, setPresentedToday] = useState(false);
  const [devotionOpen, setDevotionOpen] = useState(true);
  const [lengthMode, setLengthMode] = useState("full"); // full | short

  // --- series mode ---
  const [seriesTheme, setSeriesTheme] = useState(null);
  const [seriesPicker, setSeriesPicker] = useState(false);
  const [seriesPos, setSeriesPos] = useState(0);

  // --- custom verse form ---
  const [addVerseOpen, setAddVerseOpen] = useState(false);
  const [newVerse, setNewVerse] = useState({ ref: "", theme: "", text: "", devotion: "", reflection: "", application: "" });

  // --- share feedback ---
  const [copyFeedback, setCopyFeedback] = useState("");

  // Load persisted app-level data
  useEffect(() => {
    setPin(lsGet("devotion.pin", null));
    setProfileName(lsGet("devotion.profileName", ""));
    setCustomVerses(lsGet("devotion.customVerses", []));
    setFavorites(lsGet("devotion.favorites", {}));
    setHistory(lsGet("devotion.history", []));
    setUnlocked(sessionStorage.getItem("devotion.unlocked") === "1");
    setPinReady(true);
  }, []);

  // Set default verse index once verse list is ready
  useEffect(() => {
    setIndex(defaultIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customVerses.length]);

  const seriesList = seriesTheme ? allVerses.filter((v) => v.theme === seriesTheme) : null;
  const verse = seriesList ? seriesList[seriesPos] : allVerses[index] || allVerses[0];
  const isDefaultWeek = !seriesTheme && index === defaultIndex;

  const fullDevotionParagraphs = DEVOTIONS[verse?.id] || (verse?.devotion ? verse.devotion : []);
  const devotionParagraphs =
    lengthMode === "short" && fullDevotionParagraphs.length > 1
      ? [fullDevotionParagraphs[0], fullDevotionParagraphs[fullDevotionParagraphs.length - 1]]
      : fullDevotionParagraphs;
  const readMinutes = estimateReadMinutes(devotionParagraphs);

  useEffect(() => {
    setNote(lsGet(`devotion.note.${verse?.id}`, ""));
    setDevotionOpen(true);
  }, [verse?.id]);

  useEffect(() => {
    if (!verse) return;
    const todayStr = today.toDateString();
    setPresentedToday(history.some((h) => h.verseId === verse.id && h.dateStr === todayStr));
  }, [history, verse, today]);

  const saveNote = useCallback(
    (text) => {
      if (!verse) return;
      setSaveState("saving");
      lsSet(`devotion.note.${verse.id}`, text);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 1200);
    },
    [verse]
  );

  useEffect(() => {
    if (!verse) return;
    const handle = setTimeout(() => saveNote(note), 600);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note]);

  const toggleFavorite = () => {
    if (!verse) return;
    const next = { ...favorites, [verse.id]: !favorites[verse.id] };
    if (!next[verse.id]) delete next[verse.id];
    setFavorites(next);
    lsSet("devotion.favorites", next);
  };

  const markPresented = () => {
    if (!verse) return;
    const entry = { verseId: verse.id, ref: verse.ref, dateStr: today.toDateString(), date: today.toISOString() };
    const next = [entry, ...history.filter((h) => !(h.verseId === verse.id && h.dateStr === today.toDateString()))].slice(0, 100);
    setHistory(next);
    lsSet("devotion.history", next);
  };

  const shuffle = () => {
    if (seriesTheme) {
      setSeriesPos((seriesPos + 1) % seriesList.length);
      return;
    }
    let next = Math.floor(Math.random() * allVerses.length);
    if (next === index) next = (next + 1) % allVerses.length;
    setIndex(next);
  };

  const resetToWeek = () => {
    setSeriesTheme(null);
    setIndex(defaultIndex);
  };

  // --- PIN handling ---
  const submitPinSetup = (value) => {
    lsSet("devotion.pin", value);
    setPin(value);
    setUnlocked(true);
    sessionStorage.setItem("devotion.unlocked", "1");
  };
  const removePin = () => {
    localStorage.removeItem("devotion.pin");
    setPin(null);
  };
  const tryUnlock = () => {
    if (pinAttempt === pin) {
      setUnlocked(true);
      sessionStorage.setItem("devotion.unlocked", "1");
      setPinError("");
      setPinAttempt("");
    } else {
      setPinError("That PIN doesn't match. Try again.");
      setPinAttempt("");
    }
  };
  const saveProfileName = (name) => {
    setProfileName(name);
    lsSet("devotion.profileName", name);
  };

  // --- custom verse form ---
  const submitNewVerse = () => {
    if (!newVerse.ref.trim() || !newVerse.text.trim()) return;
    const paragraphs = newVerse.devotion.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    const entry = {
      id: `custom-${Date.now()}`,
      ref: newVerse.ref.trim(),
      theme: newVerse.theme.trim() || "My Verses",
      text: newVerse.text.trim(),
      reflection: newVerse.reflection.trim() || "Take a moment to reflect on what this verse means for your week.",
      application: newVerse.application.trim() || "Consider one practical way to live this out today.",
      devotion: paragraphs.length ? paragraphs : undefined,
    };
    const next = [...customVerses, entry];
    setCustomVerses(next);
    lsSet("devotion.customVerses", next);
    setNewVerse({ ref: "", theme: "", text: "", devotion: "", reflection: "", application: "" });
    setAddVerseOpen(false);
  };

  // --- share / print / export ---
  const buildShareText = () => {
    if (!verse) return "";
    const lines = [
      `"${verse.text}"`,
      `— ${verse.ref}${VERSES.find((v) => v.id === verse.id) ? " (KJV)" : ""}`,
      "",
      ...devotionParagraphs,
    ];
    return lines.join("\n\n");
  };

  const handleShare = async () => {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({ title: `Devotion: ${verse.ref}`, text });
        return;
      } catch (e) {
        /* user cancelled or unsupported, fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback("Copied to clipboard");
      setTimeout(() => setCopyFeedback(""), 2000);
    } catch (e) {
      setCopyFeedback("Couldn't copy — select and copy manually");
      setTimeout(() => setCopyFeedback(""), 2500);
    }
  };

  const handlePrint = () => window.print();

  const handleExportNotes = () => {
    const parts = ["# Monday Devotion — Notes Export", `Exported ${formatDate(today)}`, ""];
    allVerses.forEach((v) => {
      const noteText = lsGet(`devotion.note.${v.id}`, "");
      if (noteText && noteText.trim()) {
        parts.push(`## ${v.ref}`, "", noteText.trim(), "");
      }
    });
    parts.push("---", "", "## Devotion History", "");
    if (history.length === 0) {
      parts.push("No devotions marked as presented yet.");
    } else {
      history.forEach((h) => {
        parts.push(`- ${h.ref} — ${new Date(h.date).toLocaleDateString()}`);
      });
    }
    const blob = new Blob([parts.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "devotion-notes-export.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const themes = useMemo(() => {
    const map = {};
    allVerses.forEach((v) => {
      map[v.theme] = (map[v.theme] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [allVerses]);

  if (!pinReady) return null;

  // --- lock screen ---
  if (pin && !unlocked) {
    return (
      <div className="min-h-screen w-full bg-[#EEF2EF] text-[#1B2A2E] font-sans flex items-center justify-center px-6">
        <div className="max-w-sm w-full bg-[#FBFAF7] border border-[#E2E7E1] rounded-2xl px-7 py-8 text-center">
          <Lock className="w-6 h-6 mx-auto mb-3 text-[#5C7269]" />
          <h1 className="text-lg font-semibold mb-1">Enter your PIN</h1>
          <p className="text-sm text-[#5C7269] mb-4">This devotion space is private{profileName ? ` for ${profileName}` : ""}.</p>
          <input
            type="password"
            inputMode="numeric"
            value={pinAttempt}
            onChange={(e) => setPinAttempt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
            className="w-full text-center tracking-[0.5em] text-lg rounded-xl border border-[#D7DED9] bg-white px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#3F6B5E]/30"
            placeholder="••••"
            autoFocus
          />
          {pinError && <p className="text-sm text-red-600 mb-3">{pinError}</p>}
          <button onClick={tryUnlock} className="w-full bg-[#1B2A2E] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#28393E] transition-colors">
            <Unlock className="w-4 h-4 inline mr-1.5 -mt-0.5" /> Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#EEF2EF] text-[#1B2A2E] font-sans">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>
      <div className="max-w-2xl mx-auto px-6 py-10 sm:py-14">
        <Horizon />

        <div className="mt-8 flex items-center justify-between gap-3 no-print">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#5C7269] font-semibold">
            Monday Devotion{profileName ? ` · ${profileName}` : ""}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#8A9A93]">{formatDate(today)}</div>
            <button onClick={() => setSettingsOpen(!settingsOpen)} className="text-[#8A9A93] hover:text-[#1B2A2E] transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-1 mb-6 h-px w-full bg-[#D7DED9] no-print" />

        {settingsOpen && (
          <SettingsPanel
            profileName={profileName}
            saveProfileName={saveProfileName}
            pin={pin}
            submitPinSetup={submitPinSetup}
            removePin={removePin}
            onClose={() => setSettingsOpen(false)}
          />
        )}

        {/* Series controls */}
        <div className="flex items-center justify-between mb-4 no-print flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#E4E9E1] text-[#3F6B5E] border border-[#CFDACD]">
              {verse?.theme}
            </span>
            {seriesTheme && (
              <span className="text-xs text-[#8A9A93]">
                Series: {seriesPos + 1} of {seriesList.length}
              </span>
            )}
            <button
              onClick={() => setSeriesPicker(!seriesPicker)}
              className="inline-flex items-center gap-1 text-xs text-[#5C7269] hover:text-[#1B2A2E] transition-colors"
            >
              <ListMusic className="w-3.5 h-3.5" /> {seriesTheme ? "Change series" : "Start a series"}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLengthMode(lengthMode === "full" ? "short" : "full")}
              className="text-xs text-[#5C7269] hover:text-[#1B2A2E] transition-colors underline decoration-dotted"
            >
              {lengthMode === "full" ? "Switch to 2-min version" : "Switch to 5-min version"}
            </button>
            {!isDefaultWeek && (
              <button onClick={resetToWeek} className="inline-flex items-center gap-1 text-xs text-[#5C7269] hover:text-[#1B2A2E] transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> This week's verse
              </button>
            )}
          </div>
        </div>

        {seriesPicker && (
          <div className="mb-4 bg-white border border-[#E2E7E1] rounded-xl p-4 no-print">
            <div className="text-xs font-semibold text-[#5C7269] mb-2">Pick a theme to run as a series</div>
            <div className="flex flex-wrap gap-2">
              {themes.map(([theme, count]) => (
                <button
                  key={theme}
                  onClick={() => {
                    setSeriesTheme(theme);
                    setSeriesPos(0);
                    setSeriesPicker(false);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full border border-[#D7DED9] hover:border-[#3F6B5E] hover:text-[#3F6B5E] transition-colors"
                >
                  {theme} ({count})
                </button>
              ))}
            </div>
          </div>
        )}

        {verse && (
          <div className="bg-[#FBFAF7] border border-[#E2E7E1] rounded-2xl px-7 py-8 sm:px-10 sm:py-10 shadow-[0_1px_2px_rgba(27,42,46,0.04)]">
            <p className="text-[1.55rem] sm:text-[1.85rem] leading-[1.45] text-[#1B2A2E] font-serif">"{verse.text}"</p>
            <p className="mt-4 text-sm font-semibold tracking-wide text-[#C89B3C]">
              — {verse.ref}{VERSES.find((v) => v.id === verse.id) ? " (KJV)" : ""}
            </p>

            {devotionParagraphs.length > 0 && (
              <div className="mt-7 pt-6 border-t border-[#EAEDE9]">
                <button onClick={() => setDevotionOpen(!devotionOpen)} className="w-full flex items-center justify-between mb-1 no-print">
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#8A9A93] font-semibold">
                    <BookOpen className="w-3.5 h-3.5" /> {lengthMode === "short" ? "2-Minute" : "5-Minute"} Devotion
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#8A9A93]">
                      <Clock className="w-3 h-3" /> ~{readMinutes} min
                    </span>
                    {devotionOpen ? <ChevronUp className="w-4 h-4 text-[#8A9A93]" /> : <ChevronDown className="w-4 h-4 text-[#8A9A93]" />}
                  </span>
                </button>
                {devotionOpen && (
                  <div className="mt-3 space-y-3.5">
                    {devotionParagraphs.map((p, i) => (
                      <p key={i} className="text-[0.95rem] leading-relaxed text-[#3A4A46]">{p}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-7 pt-6 border-t border-[#EAEDE9] space-y-4">
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#8A9A93] font-semibold mb-1">Quick reflection</div>
                <p className="text-[0.95rem] leading-relaxed text-[#3A4A46]">{verse.reflection}</p>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.14em] text-[#8A9A93] font-semibold mb-1">For the workplace</div>
                <p className="text-[0.95rem] leading-relaxed text-[#3A4A46]">{verse.application}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action row */}
        <div className="mt-4 flex flex-wrap items-center gap-2 no-print">
          <button onClick={shuffle} className="inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg bg-white border border-[#D7DED9] hover:border-[#B7C4BB] transition-colors text-[#3A4A46]">
            <Shuffle className="w-4 h-4" /> {seriesTheme ? "Next in series" : "Preview another"}
          </button>
          <button
            onClick={toggleFavorite}
            className={`inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg border transition-colors ${
              verse && favorites[verse.id] ? "bg-[#FBF3DE] border-[#E7CE86] text-[#8A6A15]" : "bg-white border-[#D7DED9] hover:border-[#B7C4BB] text-[#3A4A46]"
            }`}
          >
            <Star className={`w-4 h-4 ${verse && favorites[verse.id] ? "fill-[#C89B3C] text-[#C89B3C]" : ""}`} />
            {verse && favorites[verse.id] ? "Saved" : "Save"}
          </button>
          <button
            onClick={markPresented}
            disabled={presentedToday}
            className={`inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg border transition-colors ${
              presentedToday ? "bg-[#E4EFE7] border-[#BFDBC7] text-[#33684A] cursor-default" : "bg-[#1B2A2E] border-[#1B2A2E] text-white hover:bg-[#28393E]"
            }`}
          >
            <Check className="w-4 h-4" /> {presentedToday ? "Presented today" : "Mark as presented"}
          </button>
          <button onClick={handleShare} className="inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg bg-white border border-[#D7DED9] hover:border-[#B7C4BB] transition-colors text-[#3A4A46]">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button onClick={handlePrint} className="inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg bg-white border border-[#D7DED9] hover:border-[#B7C4BB] transition-colors text-[#3A4A46]">
            <Printer className="w-4 h-4" /> Print
          </button>
          {copyFeedback && <span className="text-xs text-[#5C7269]">{copyFeedback}</span>}
        </div>

        {/* Notes */}
        <div className="mt-6 no-print">
          <div className="flex items-center justify-between mb-1.5">
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#8A9A93] font-semibold">
              <NotebookPen className="w-3.5 h-3.5" /> Your notes for devotion
            </div>
            <div className="text-[11px] text-[#8A9A93] h-4">{saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : ""}</div>
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Jot down what you want to say Monday morning — an opening story, a personal application, a question to ask the room…"
            rows={4}
            className="w-full rounded-xl border border-[#D7DED9] bg-white px-4 py-3 text-sm leading-relaxed text-[#1B2A2E] placeholder-[#A7B4AE] focus:outline-none focus:ring-2 focus:ring-[#3F6B5E]/30 focus:border-[#3F6B5E] resize-none"
          />
        </div>

        {/* Add custom verse */}
        <div className="mt-6 border-t border-[#D7DED9] pt-4 no-print">
          <button onClick={() => setAddVerseOpen(!addVerseOpen)} className="inline-flex items-center gap-1.5 text-sm text-[#5C7269] hover:text-[#1B2A2E] transition-colors">
            <Plus className="w-4 h-4" /> Add your own verse
          </button>
          {addVerseOpen && (
            <div className="mt-3 bg-white border border-[#E2E7E1] rounded-xl p-4 space-y-2.5">
              <input placeholder="Reference (e.g. Romans 8:28)" value={newVerse.ref} onChange={(e) => setNewVerse({ ...newVerse, ref: e.target.value })} className="w-full text-sm rounded-lg border border-[#D7DED9] px-3 py-2" />
              <input placeholder="Theme (optional)" value={newVerse.theme} onChange={(e) => setNewVerse({ ...newVerse, theme: e.target.value })} className="w-full text-sm rounded-lg border border-[#D7DED9] px-3 py-2" />
              <textarea placeholder="Verse text" value={newVerse.text} onChange={(e) => setNewVerse({ ...newVerse, text: e.target.value })} rows={2} className="w-full text-sm rounded-lg border border-[#D7DED9] px-3 py-2 resize-none" />
              <textarea placeholder="Devotion paragraphs (separate paragraphs with a blank line)" value={newVerse.devotion} onChange={(e) => setNewVerse({ ...newVerse, devotion: e.target.value })} rows={4} className="w-full text-sm rounded-lg border border-[#D7DED9] px-3 py-2 resize-none" />
              <input placeholder="Quick reflection (optional)" value={newVerse.reflection} onChange={(e) => setNewVerse({ ...newVerse, reflection: e.target.value })} className="w-full text-sm rounded-lg border border-[#D7DED9] px-3 py-2" />
              <input placeholder="Workplace application (optional)" value={newVerse.application} onChange={(e) => setNewVerse({ ...newVerse, application: e.target.value })} className="w-full text-sm rounded-lg border border-[#D7DED9] px-3 py-2" />
              <div className="flex gap-2 pt-1">
                <button onClick={submitNewVerse} className="text-sm bg-[#1B2A2E] text-white rounded-lg px-4 py-2 hover:bg-[#28393E] transition-colors">Save verse</button>
                <button onClick={() => setAddVerseOpen(false)} className="text-sm text-[#8A9A93] px-2">Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Export */}
        <div className="mt-4 no-print">
          <button onClick={handleExportNotes} className="inline-flex items-center gap-1.5 text-sm text-[#5C7269] hover:text-[#1B2A2E] transition-colors">
            <Download className="w-4 h-4" /> Export all notes &amp; history (.md)
          </button>
        </div>

        {/* History */}
        <div className="mt-6 border-t border-[#D7DED9] pt-4 no-print">
          <button onClick={() => setHistoryOpen(!historyOpen)} className="inline-flex items-center gap-1.5 text-sm text-[#5C7269] hover:text-[#1B2A2E] transition-colors">
            <History className="w-4 h-4" />
            Devotion history ({history.length})
            {historyOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {historyOpen && (
            <ul className="mt-3 space-y-2">
              {history.length === 0 && <li className="text-sm text-[#8A9A93]">Nothing marked as presented yet.</li>}
              {history.map((h, i) => (
                <li key={i} className="flex items-center justify-between text-sm bg-white border border-[#E2E7E1] rounded-lg px-3.5 py-2">
                  <span className="text-[#3A4A46] font-medium">{h.ref}</span>
                  <span className="text-[#8A9A93] text-xs">{new Date(h.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsPanel({ profileName, saveProfileName, pin, submitPinSetup, removePin, onClose }) {
  const [nameInput, setNameInput] = useState(profileName);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");

  const handleSetPin = () => {
    if (newPin.length < 4) {
      setPinMsg("PIN should be at least 4 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      setPinMsg("PINs don't match.");
      return;
    }
    submitPinSetup(newPin);
    setNewPin("");
    setConfirmPin("");
    setPinMsg("PIN set.");
  };

  return (
    <div className="mb-6 bg-white border border-[#E2E7E1] rounded-xl p-4 no-print">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-[#1B2A2E]">Settings</div>
        <button onClick={onClose}><X className="w-4 h-4 text-[#8A9A93]" /></button>
      </div>

      <div className="mb-4">
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#8A9A93] font-semibold mb-1.5 inline-flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" /> Profile name
        </div>
        <div className="flex gap-2">
          <input value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="Your name" className="flex-1 text-sm rounded-lg border border-[#D7DED9] px-3 py-2" />
          <button onClick={() => saveProfileName(nameInput)} className="text-sm bg-[#1B2A2E] text-white rounded-lg px-3 py-2 hover:bg-[#28393E]">Save</button>
        </div>
      </div>

      <div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-[#8A9A93] font-semibold mb-1.5 inline-flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> Privacy PIN
        </div>
        <p className="text-xs text-[#8A9A93] mb-2">
          {pin ? "A PIN is currently set. Anyone opening this app on your device will need it." : "Set a PIN so your notes stay private on this device. This is a device-level privacy lock, not a secure account system."}
        </p>
        {pin ? (
          <button onClick={removePin} className="text-sm text-red-600 hover:text-red-700">Remove PIN</button>
        ) : (
          <div className="space-y-2">
            <input type="password" inputMode="numeric" placeholder="New PIN (4+ digits)" value={newPin} onChange={(e) => setNewPin(e.target.value)} className="w-full text-sm rounded-lg border border-[#D7DED9] px-3 py-2" />
            <input type="password" inputMode="numeric" placeholder="Confirm PIN" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value)} className="w-full text-sm rounded-lg border border-[#D7DED9] px-3 py-2" />
            <button onClick={handleSetPin} className="text-sm bg-[#1B2A2E] text-white rounded-lg px-4 py-2 hover:bg-[#28393E]">Set PIN</button>
            {pinMsg && <p className="text-xs text-[#5C7269]">{pinMsg}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Horizon() {
  return (
    <div className="relative h-14 overflow-hidden rounded-xl bg-gradient-to-b from-[#F6EFDD] to-[#EEF2EF] no-print">
      <svg viewBox="0 0 400 56" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <line x1="0" y1="40" x2="400" y2="40" stroke="#D7DED9" strokeWidth="1" />
        <circle cx="200" cy="40" r="16" fill="#C89B3C" opacity="0.9">
          <animate attributeName="cy" from="70" to="40" dur="1.1s" fill="freeze" />
          <animate attributeName="opacity" from="0" to="0.9" dur="1.1s" fill="freeze" />
        </circle>
        <path d="M 168 40 A 32 32 0 0 1 232 40" fill="none" stroke="#C89B3C" strokeWidth="1.5" opacity="0.5">
          <animate attributeName="opacity" from="0" to="0.5" dur="1.4s" fill="freeze" />
        </path>
      </svg>
      <div className="absolute inset-0 flex items-center gap-2 pl-3">
        <Sunrise className="w-4 h-4 text-[#8A6A15] opacity-70" />
      </div>
    </div>
  );
}
