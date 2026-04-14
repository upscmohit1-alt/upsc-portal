import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const links = ["Home", "GS Notes", "Current Affairs", "MCQ Practice", "PYQ", "Test Series", "Books & PDFs"];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-blackish/90 bg-white/75 backdrop-blur-md">
      <div className="mx-auto flex h-[62px] max-w-[1240px] items-center px-6">
        <div className="mr-6 border-r border-borderTone pr-7">
          <div className="font-serif text-xl font-bold leading-none text-blackish">
            Crash Course <em className="not-italic text-red">Civil Services</em>
          </div>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted">UPSC IAS Preparation</p>
        </div>

        <nav className="flex flex-1 items-center gap-1">
          {links.map((link, index) => (
            <a
              key={link}
              href="#"
              className={`rounded-sm px-3 py-1.5 text-[13px] font-medium ${
                index === 0 ? "text-red" : "text-mid hover:bg-bg2 hover:text-blackish"
              }`}
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <ThemeToggle />
          <button className="p-1.5 text-mid hover:text-blackish" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
          <Button variant="outline" className="h-8 px-3.5 text-[13px] font-medium">
            Log in
          </Button>
          <Button className="h-8 bg-red px-4 text-[13px] hover:bg-[#a0302a]">Enroll Free →</Button>
        </div>
      </div>
    </header>
  );
}
