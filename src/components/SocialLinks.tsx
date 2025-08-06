import { Instagram, Twitter, Youtube } from "lucide-react";

const SocialLinks = () => {
  return (
    <div className="flex items-center gap-4">
      <a
        href="https://www.instagram.com/zuptin_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-glow"
      >
        <Instagram className="h-5 w-5 text-white" />
      </a>
      <a
        href="https://youtube.com/@zuptin-w7h?si=sZgNX-z7veJZvwo-"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-glow"
      >
        <Youtube className="h-5 w-5 text-white" />
      </a>
      <a
        href="https://x.com/zuptin07"
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-glow"
      >
        <Twitter className="h-5 w-5 text-white" />
      </a>
    </div>
  );
};

export default SocialLinks;
