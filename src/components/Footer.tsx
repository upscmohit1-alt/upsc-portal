import { Instagram, Send, Youtube } from "lucide-react";

const quickLinks = [
  "Daily Current Affairs",
  "MCQ Practice",
  "PYQ Bank",
  "Free PDF Downloads",
  "Test Series",
];

const gsNotes = [
  "Polity & Governance",
  "Indian Economy",
  "Environment",
  "History & Culture",
  "Geography",
  "Science & Tech",
];

const supportLinks = ["About Us", "Contact", "Privacy Policy", "Terms of Use", "Advertise"];

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-[#191613] text-white/80">
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="grid gap-10 border-b border-white/10 pb-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">
              Crash Course <span className="text-red">Civil Services</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              End-to-end UPSC prep with daily current affairs, topic notes, MCQ practice and PYQ-focused revision.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="#"
                aria-label="Telegram"
                className="rounded border border-white/20 p-2 text-white/70 transition hover:border-saffron hover:text-saffron"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="rounded border border-white/20 p-2 text-white/70 transition hover:border-saffron hover:text-saffron"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="rounded border border-white/20 p-2 text-white/70 transition hover:border-saffron hover:text-saffron"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">Quick Links</h4>
            <ul className="mt-3 space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/65 transition hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">GS Notes</h4>
            <ul className="mt-3 space-y-2.5">
              {gsNotes.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/65 transition hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">Support</h4>
            <ul className="mt-3 space-y-2.5">
              {supportLinks.map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-white/65 transition hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-4 text-xs text-white/40">© 2026 Mohit. All rights reserved.</div>
      </div>
    </footer>
  );
}
