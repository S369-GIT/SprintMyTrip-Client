import { IconBrandX, IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";

const socialLinks = [
  {
    name: "X",
    href: "https://x.com/Savitabh_Singh",
    icon: IconBrandX,
  },
  {
    name: "GitHub",
    href: "https://github.com/S369-GIT",
    icon: IconBrandGithub,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/savitabh-singh",
    icon: IconBrandLinkedin,
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-3 px-4 sm:px-8 transition-colors">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Designed & Developed</span>
          <span>by</span>
          <a
            href="https://www.linkedin.com/in/savitabh-singh"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Savitabh Singh
          </a>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {socialLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit Savitabh Singh's ${item.name} profile`}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon size={18} stroke={1.75} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
