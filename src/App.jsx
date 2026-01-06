import { useState, useEffect, useCallback, useRef } from "react";

const App = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(8);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);

  const [savePasswordName, setSavePasswordName] = useState("");
  const [savePassword, setSavePassword] = useState("");

  const [savedPasswords, setSavedPasswords] = useState(() => {
    const storedPassword = localStorage.getItem("savedPasswords");
    return storedPassword ? JSON.parse(storedPassword) : [];
  });

  const passwordRef = useRef(null);
  const namePassRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let string = "abcdefghijklmnopqrstuvwxyz";

    if (includeNumbers) {
      string += "0123456789";
    }

    if (includeSymbols) {
      string += "!@#$%^&*()_+";
    }

    for (let index = 0; index < length; index++) {
      let randomCharacter = Math.floor(Math.random() * string.length);
      pass += string.charAt(randomCharacter);
    }

    setPassword(pass);
  }, [length, includeNumbers, includeSymbols, setPassword]);

  const copyPassword = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, password.length);
    window.navigator.clipboard.writeText(password);
    setSavePassword(password);
  }, [password, setSavePassword]);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    passwordGenerator();
  }, [
    length,
    includeNumbers,
    includeSymbols,
    passwordGenerator,
    savedPasswords,
  ]);

  // Persist on change
  useEffect(() => {
    localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
  }, [savedPasswords]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-4 text-white">
      {/* Wrapper */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= LEFT CARD ================= */}
        <div className="rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-2xl p-6 space-y-8">
          {/* Header */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-wide">
              Password Generator
            </h1>
            <p className="text-sm text-slate-400">
              Generate secure passwords instantly
            </p>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type="text"
              placeholder="Generated password"
              value={password}
              readOnly
              ref={passwordRef}
              className="w-full rounded-xl bg-slate-800 px-4 py-3 pr-12 text-lg outline-none border border-white/10 focus:border-emerald-400 transition"
            />
            <button
              className="
                absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-lg bg-slate-700/60 backdrop-blur  border border-white/10 p-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-600/60 transition active:scale-95"
              onClick={() => {
                copyPassword(), namePassRef.current.focus();
              }}
            >
              📋
            </button>
          </div>

          {/* Length Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-slate-300">
              <span>Password Length</span>
              <span className="font-semibold text-emerald-400">{length}</span>
            </div>

            <input
              type="range"
              min={4}
              max={50}
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            <label
              className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-xl cursor-pointer hover:bg-slate-700 transition border border-white/10"
              title="0123456789"
            >
              <input
                type="checkbox"
                className="accent-emerald-400 scale-125"
                value={includeNumbers}
                onChange={() => setIncludeNumbers((val) => !val)}
              />
              <span className="text-sm">Numbers</span>
            </label>

            <label
              className="flex items-center gap-3 bg-slate-800 px-4 py-3 rounded-xl cursor-pointer hover:bg-slate-700 transition border border-white/10"
              title="!@#$%^&*()_+"
            >
              <input
                type="checkbox"
                className="accent-emerald-400 scale-125"
                value={includeSymbols}
                onChange={() => setIncludeSymbols((val) => !val)}
              />
              <span className="text-sm">Symbols</span>
            </label>
          </div>
        </div>

        {/* ================= RIGHT CARD ================= */}
        <div className="rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/10 shadow-2xl p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-wide">
              Saved Passwords
            </h2>
          </div>

          {/* Save Password */}
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              placeholder="Label (e.g. Gmail, GitHub)"
              value={savePasswordName}
              onChange={(e) => setSavePasswordName(e.target.value)}
              className="w-full rounded-xl bg-slate-800 px-4 py-3 outline-none border border-white/10 focus:border-emerald-400 transition"
              ref={namePassRef}
            />

            <input
              type="text"
              placeholder="Password"
              value={savePassword}
              onChange={(e) => setSavePassword(e.target.value)}
              className="w-full rounded-xl bg-slate-800 px-4 py-3 outline-none border border-white/10 focus:border-emerald-400 transition"
            />
          </div>
          <button
            className="w-full shrink-0 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-semibold px-5 py-2 transition active:scale-95"
            onClick={() => {
              if (!savePasswordName || !savePassword) return;

              setSavedPasswords((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  name: savePasswordName,
                  password: savePassword,
                },
              ]);
              setSavePasswordName("");
              setSavePassword("");
            }}
          >
            Save
          </button>

          {/* Saved Passwords list */}
          <div className="space-y-3">
            {/* Heading */}
            <h3 className="text-sm font-semibold text-slate-300 tracking-wide px-1">
              Saved Passwords
            </h3>

            {/* List */}
            <ul className="w-full rounded-xl bg-slate-900/60 border border-white/10 px-4 py-3 flex flex-col gap-y-3">
              {savedPasswords.map((item, index) => (
                <li
                  key={item.id}
                  className=" bg-slate-800/70 backdrop-blur border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between text-sm text-slate-200 transition hover:bg-slate-700/70"
                  title="Click on name or password to copy it"
                >
                  {/* Left side: ID + Name */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-slate-400">
                      #{index + 1}
                    </span>

                    <span
                      className="cursor-pointer font-medium text-white hover:text-emerald-400 transition"
                      title="Click to copy name"
                      onClick={() => copyText(item.name)}
                    >
                      {item.name}
                    </span>
                  </div>

                  {/* Right side: Password */}
                  <span
                    className="cursor-pointer font-mono tracking-wider text-slate-300 hover:text-emerald-400 transition"
                    title="Click to copy password"
                    onClick={() => copyText(item.password)}
                  >
                    {item.password}
                    {/* {"*".repeat(item.password.length)} */}
                  </span>
                </li>
              ))}
              {/* Empty State */}
              {savedPasswords.length === 0 && (
                <div className="text-center text-sm text-slate-400 border border-dashed border-white/10 rounded-xl py-6">
                  No saved passwords yet
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
