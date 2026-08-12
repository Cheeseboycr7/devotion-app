import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Sunrise, Shuffle, RotateCcw, Star, Check, ChevronDown, ChevronUp,
  NotebookPen, History, Clock, BookOpen, Settings, User, LogOut,
  Plus, Share2, Printer, Download, ListMusic, X, Maximize2, Minimize2,
  CalendarDays, MessageCircleQuestion, Link2, Users, ChevronLeft, ChevronRight, Mail,
} from "lucide-react";
import { DEVOTIONS } from "./devotions.js";
import { DISCUSSION_QUESTIONS, RELATED_VERSES } from "./extras.js";
import { supabase } from "./supabaseClient.js";

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

function weekKey(date) {
  return `${date.getFullYear()}-W${String(isoWeekNumber(date)).padStart(2, "0")}`;
}

function addDays(date, n) {
  return new Date(date.getTime() + n * DAY_MS);
}

function mondayOfWeek(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0 Sun, 1 Mon, ... 6 Sat
  const diff = day === 0 ? -6 : 1 - day; // shift back to Monday
  return addDays(d, diff);
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

function estimateReadMinutes(paragraphs) {
  const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 130));
}

// --- top-level: auth gate ---
export default function App() {
  const [session, setSession] = useState(undefined); // undefined = loading

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => setSession(sess));
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="min-h-screen w-full bg-[#EEF2EF]" />;
  }
  if (!session) {
    return <AuthScreen />;
  }
  return <DevotionApp key={session.user.id} userId={session.user.id} userEmail={session.user.email} />;
}

function AuthScreen() {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setMessage("");
    if (!email.trim() || !password) {
      setError("Enter an email and password.");
      return;
    }
    setLoading(true);
    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password });
      setLoading(false);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        setMessage("Account created. Check your email to confirm, then sign in.");
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (signInError) setError(signInError.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#EEF2EF] text-[#1B2A2E] font-sans flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <Horizon />
        <div className="mt-8 bg-[#FBFAF7] border border-[#E2E7E1] rounded-2xl px-7 py-8 text-center">
          <h1 className="text-lg font-semibold mb-1">{mode === "signup" ? "Create your account" : "Welcome back"}</h1>
          <p className="text-sm text-[#5C7269] mb-5">Monday Devotion</p>
          <div className="space-y-2.5 text-left">
            <div>
              <label className="text-[11px] uppercase tracking-[0.14em] text-[#8A9A93] font-semibold">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 text-sm rounded-lg border border-[#D7DED9] bg-white px-3 py-2.5"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-[0.14em] text-[#8A9A93] font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="w-full mt-1 text-sm rounded-lg border border-[#D7DED9] bg-white px-3 py-2.5"
                placeholder="At least 6 characters"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 mt-3 text-left">{error}</p>}
          {message && <p className="text-sm text-[#3F6B5E] mt-3 text-left">{message}</p>}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full mt-4 bg-[#1B2A2E] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#28393E] transition-colors disabled:opacity-60"
          >
            {loading ? "Please wait…" : mode === "signup" ? "Sign up" : "Log in"}
          </button>
          <button
            onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); setMessage(""); }}
            className="w-full mt-3 text-xs text-[#5C7269] hover:text-[#1B2A2E]"
          >
            {mode === "signup" ? "Already have an account? Log in" : "New here? Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DevotionApp({ userId, userEmail }) {
  const today = useMemo(() => new Date(), []);

  // --- account / profile ---
  const [profileName, setProfileName] = useState("");
  const [dataReady, setDataReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // --- verse data ---
  const [customVerses, setCustomVerses] = useState([]);
  const allVerses = useMemo(() => [...VERSES, ...customVerses], [customVerses]);
  const defaultIndex = useMemo(() => weekIndex(today, allVerses.length), [today, allVerses.length]);
  const [index, setIndex] = useState(0);

  // --- content state ---
  const [notes, setNotes] = useState({}); // { [verseId]: text }
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

  // --- presentation mode ---
  const [presentMode, setPresentMode] = useState(false);

  // --- look-ahead & week overrides ---
  const [lookAheadOpen, setLookAheadOpen] = useState(false);
  const [weekOverrides, setWeekOverrides] = useState({});

  // --- rotation tracker ---
  const [presenters, setPresenters] = useState([]);
  const [presentersOpen, setPresentersOpen] = useState(false);

  // --- custom verse form ---
  const [addVerseOpen, setAddVerseOpen] = useState(false);
  const [newVerse, setNewVerse] = useState({ ref: "", theme: "", text: "", devotion: "", reflection: "", application: "" });

  // --- share feedback ---
  const [copyFeedback, setCopyFeedback] = useState("");

  // Generic saver: updates one column on this user's row in Supabase.
  const saveField = useCallback(
    async (field, value) => {
      try {
        await supabase.from("user_data").update({ [field]: value, updated_at: new Date().toISOString() }).eq("user_id", userId);
      } catch (e) {
        console.error("Save failed", e);
      }
    },
    [userId]
  );

  // Load this user's row (created automatically on signup by a DB trigger).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      let { data, error } = await supabase.from("user_data").select("*").eq("user_id", userId).single();
      if ((error || !data) && !cancelled) {
        // Fallback in case the row wasn't created yet — create it now.
        const { data: inserted } = await supabase
          .from("user_data")
          .insert({ user_id: userId })
          .select()
          .single();
        data = inserted;
      }
      if (cancelled || !data) return;
      setProfileName(data.profile_name || "");
      setCustomVerses(data.custom_verses || []);
      setFavorites(data.favorites || {});
      setHistory(data.history || []);
      setWeekOverrides(data.week_overrides || {});
      setPresenters(data.presenters || []);
      setNotes(data.notes || {});
      setDataReady(true);
    })();
    return () => { cancelled = true; };
  }, [userId]);

  // Set default verse index once verse list is ready
  useEffect(() => {
    setIndex(defaultIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customVerses.length]);

  const seriesList = seriesTheme ? allVerses.filter((v) => v.theme === seriesTheme) : null;
  const thisWeekKey = weekKey(today);
  const overrideId = weekOverrides[thisWeekKey];
  const overrideVerse = overrideId ? allVerses.find((v) => v.id === overrideId) : null;
  const verse = seriesList ? seriesList[seriesPos] : overrideVerse || allVerses[index] || allVerses[0];
  const isDefaultWeek = !seriesTheme && !overrideVerse && index === defaultIndex;

  const setWeekOverride = (wKey, verseId) => {
    const next = { ...weekOverrides };
    if (verseId) next[wKey] = verseId;
    else delete next[wKey];
    setWeekOverrides(next);
    saveField("week_overrides", next);
  };

  const lookAheadWeeks = useMemo(() => {
    const mon = mondayOfWeek(today);
    const weeks = [];
    for (let i = 0; i < 5; i++) {
      const wDate = addDays(mon, i * 7);
      const wKey = weekKey(wDate);
      const override = weekOverrides[wKey];
      const defaultV = allVerses[weekIndex(wDate, allVerses.length)];
      const presenter = presenters.length ? presenters[weekIndex(wDate, presenters.length)] : null;
      weeks.push({
        wKey,
        date: wDate,
        verse: override ? allVerses.find((v) => v.id === override) : defaultV,
        isOverride: !!override,
        presenter,
      });
    }
    return weeks;
  }, [today, weekOverrides, allVerses, presenters]);

  const currentPresenter = presenters.length ? presenters[weekIndex(today, presenters.length)] : null;

  const savePresenters = (list) => {
    setPresenters(list);
    saveField("presenters", list);
  };

  const discussionQuestions = verse ? (DISCUSSION_QUESTIONS[verse.id] || verse.discussionQuestions || []) : [];
  const relatedVerses = verse ? (RELATED_VERSES[verse.id] || verse.relatedVerses || []) : [];

  const fullDevotionParagraphs = DEVOTIONS[verse?.id] || (verse?.devotion ? verse.devotion : []);
  const devotionParagraphs =
    lengthMode === "short" && fullDevotionParagraphs.length > 1
      ? [fullDevotionParagraphs[0], fullDevotionParagraphs[fullDevotionParagraphs.length - 1]]
      : fullDevotionParagraphs;
  const readMinutes = estimateReadMinutes(devotionParagraphs);

  useEffect(() => {
    setNote(verse?.id ? notes[verse.id] || "" : "");
    setDevotionOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const nextNotes = { ...notes, [verse.id]: text };
      setNotes(nextNotes);
      saveField("notes", nextNotes).then(() => {
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1200);
      });
    },
    [verse, notes, saveField]
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
    saveField("favorites", next);
  };

  const markPresented = () => {
    if (!verse) return;
    const entry = { verseId: verse.id, ref: verse.ref, dateStr: today.toDateString(), date: today.toISOString() };
    const next = [entry, ...history.filter((h) => !(h.verseId === verse.id && h.dateStr === today.toDateString()))].slice(0, 100);
    setHistory(next);
    saveField("history", next);
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
    if (weekOverrides[thisWeekKey]) setWeekOverride(thisWeekKey, null);
  };

  const saveProfileName = (name) => {
    setProfileName(name);
    saveField("profile_name", name);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
    saveField("custom_verses", next);
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
      const noteText = notes[v.id] || "";
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

  if (!dataReady) return <div className="min-h-screen w-full bg-[#EEF2EF]" />;

  // --- presentation mode (full-screen, distraction-free) ---
  if (presentMode && verse) {
    return (
      <div className="min-h-screen w-full bg-[#FBFAF7] text-[#1B2A2E] font-sans flex items-center justify-center px-6 py-10">
        <button
          onClick={() => setPresentMode(false)}
          className="fixed top-5 right-5 inline-flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg bg-white border border-[#D7DED9] hover:border-[#B7C4BB] transition-colors text-[#3A4A46] shadow-sm"
        >
          <Minimize2 className="w-4 h-4" /> Exit
        </button>
        <div className="max-w-2xl w-full">
          <p className="text-[1.9rem] sm:text-[2.4rem] leading-[1.4] font-serif mb-6">"{verse.text}"</p>
          <p className="text-base font-semibold tracking-wide text-[#C89B3C] mb-10">
            — {verse.ref}{VERSES.find((v) => v.id === verse.id) ? " (KJV)" : ""}
          </p>
          <div className="space-y-6">
            {devotionParagraphs.map((p, i) => (
              <p key={i} className="text-lg sm:text-xl leading-relaxed text-[#3A4A46]">{p}</p>
            ))}
          </div>
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
            userEmail={userEmail}
            handleLogout={handleLogout}
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

            {discussionQuestions.length > 0 && (
              <div className="mt-6 pt-6 border-t border-[#EAEDE9] no-print">
                <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#8A9A93] font-semibold mb-2">
                  <MessageCircleQuestion className="w-3.5 h-3.5" /> Discussion questions
                </div>
                <ul className="space-y-1.5">
                  {discussionQuestions.map((q, i) => (
                    <li key={i} className="text-[0.9rem] leading-relaxed text-[#3A4A46] flex gap-2">
                      <span className="text-[#C89B3C]">{i + 1}.</span> {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relatedVerses.length > 0 && (
              <div className="mt-5 pt-5 border-t border-[#EAEDE9] no-print">
                <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#8A9A93] font-semibold mb-2">
                  <Link2 className="w-3.5 h-3.5" /> For further study
                </div>
                <div className="flex flex-wrap gap-2">
                  {relatedVerses.map((r, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-[#F3F5F2] text-[#5C7269] border border-[#E2E7E1]">{r}</span>
                  ))}
                </div>
              </div>
            )}
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
          <button onClick={() => setPresentMode(true)} className="inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-lg bg-white border border-[#D7DED9] hover:border-[#B7C4BB] transition-colors text-[#3A4A46]">
            <Maximize2 className="w-4 h-4" /> Present
          </button>
          {copyFeedback && <span className="text-xs text-[#5C7269]">{copyFeedback}</span>}
        </div>

        {/* Look-ahead & rotation */}
        <div className="mt-6 border-t border-[#D7DED9] pt-4 no-print flex flex-wrap gap-4">
          <button onClick={() => setLookAheadOpen(!lookAheadOpen)} className="inline-flex items-center gap-1.5 text-sm text-[#5C7269] hover:text-[#1B2A2E] transition-colors">
            <CalendarDays className="w-4 h-4" /> Look ahead
            {lookAheadOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button onClick={() => setPresentersOpen(!presentersOpen)} className="inline-flex items-center gap-1.5 text-sm text-[#5C7269] hover:text-[#1B2A2E] transition-colors">
            <Users className="w-4 h-4" /> Rotation{currentPresenter ? ` · ${currentPresenter} this week` : ""}
            {presentersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {lookAheadOpen && (
          <div className="mt-3 bg-white border border-[#E2E7E1] rounded-xl p-4 no-print space-y-2.5">
            {lookAheadWeeks.map((w, i) => (
              <div key={w.wKey} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex-1">
                  <div className="text-[#8A9A93] text-xs">
                    {formatDate(w.date).split(",")[0]}, {w.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    {i === 0 ? " (this week)" : ""}
                    {w.presenter ? ` · ${w.presenter}` : ""}
                  </div>
                  <div className="text-[#1B2A2E] font-medium">
                    {w.verse?.ref} {w.isOverride && <span className="text-[10px] text-[#C89B3C] uppercase tracking-wide">swapped</span>}
                  </div>
                </div>
                <select
                  value={w.isOverride ? w.verse.id : ""}
                  onChange={(e) => setWeekOverride(w.wKey, e.target.value || null)}
                  className="text-xs border border-[#D7DED9] rounded-lg px-2 py-1.5 bg-white max-w-[140px]"
                >
                  <option value="">Default</option>
                  {allVerses.map((v) => (
                    <option key={v.id} value={v.id}>{v.ref}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {presentersOpen && (
          <PresentersPanel presenters={presenters} savePresenters={savePresenters} />
        )}

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

function PresentersPanel({ presenters, savePresenters }) {
  const [nameInput, setNameInput] = useState("");

  const addName = () => {
    if (!nameInput.trim()) return;
    savePresenters([...presenters, nameInput.trim()]);
    setNameInput("");
  };
  const removeName = (i) => {
    savePresenters(presenters.filter((_, idx) => idx !== i));
  };
  const move = (i, dir) => {
    const next = [...presenters];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    savePresenters(next);
  };

  return (
    <div className="mt-3 bg-white border border-[#E2E7E1] rounded-xl p-4 no-print">
      <p className="text-xs text-[#8A9A93] mb-3">
        Add names in the order they should rotate. Whoever's up this week is shown automatically based on the week number — stored only on this device.
      </p>
      {presenters.length === 0 && <p className="text-sm text-[#8A9A93] mb-3">No presenters added yet.</p>}
      <ul className="space-y-1.5 mb-3">
        {presenters.map((name, i) => (
          <li key={i} className="flex items-center justify-between text-sm bg-[#F7F8F6] border border-[#E2E7E1] rounded-lg px-3 py-1.5">
            <span className="text-[#3A4A46]">{name}</span>
            <div className="flex items-center gap-1">
              <button onClick={() => move(i, -1)} className="text-[#8A9A93] hover:text-[#1B2A2E]"><ChevronLeft className="w-3.5 h-3.5" /></button>
              <button onClick={() => move(i, 1)} className="text-[#8A9A93] hover:text-[#1B2A2E]"><ChevronRight className="w-3.5 h-3.5" /></button>
              <button onClick={() => removeName(i)} className="text-[#8A9A93] hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addName()}
          placeholder="Add a name"
          className="flex-1 text-sm rounded-lg border border-[#D7DED9] px-3 py-2"
        />
        <button onClick={addName} className="text-sm bg-[#1B2A2E] text-white rounded-lg px-4 py-2 hover:bg-[#28393E]">Add</button>
      </div>
    </div>
  );
}

function SettingsPanel({ profileName, saveProfileName, userEmail, handleLogout, onClose }) {
  const [nameInput, setNameInput] = useState(profileName);

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
          <Mail className="w-3.5 h-3.5" /> Account
        </div>
        <p className="text-sm text-[#3A4A46] mb-2">{userEmail}</p>
        <button onClick={handleLogout} className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700">
          <LogOut className="w-3.5 h-3.5" /> Log out
        </button>
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
