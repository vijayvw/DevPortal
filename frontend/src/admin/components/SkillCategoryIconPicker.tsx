import {
  Activity,
  Award,
  Bell,
  BookOpen,
  Boxes,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Cloud,
  CloudCog,
  Code,
  Code2,
  Container,
  Cpu,
  Database,
  FileCode2,
  FileText,
  Folder,
  GitBranch,
  GitCommit,
  Github,
  Globe,
  HardDrive,
  KeyRound,
  Laptop,
  Layers,
  Link,
  Lock,
  Mail,
  Monitor,
  Network,
  Package,
  PanelsTopLeft,
  Puzzle,
  Router,
  Search,
  Server,
  Settings,
  Shield,
  ShieldCheck,
  Share2,
  Smartphone,
  Sparkles,
  SquareTerminal,
  Terminal,
  TestTube,
  Truck,
  Upload,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const ICONS = [
  { name: "Award", icon: Award },
  { name: "Activity", icon: Activity },
  { name: "Bell", icon: Bell },
  { name: "BookOpen", icon: BookOpen },
  { name: "Boxes", icon: Boxes },
  { name: "Briefcase", icon: Briefcase },
  { name: "Building2", icon: Building2 },
  { name: "Calendar", icon: Calendar },
  { name: "CheckCircle", icon: CheckCircle },
  { name: "Cloud", icon: Cloud },
  { name: "CloudCog", icon: CloudCog },
  { name: "Code", icon: Code },
  { name: "Code2", icon: Code2 },
  { name: "Container", icon: Container },
  { name: "Cpu", icon: Cpu },
  { name: "Database", icon: Database },
  { name: "FileCode2", icon: FileCode2 },
  { name: "FileText", icon: FileText },
  { name: "Folder", icon: Folder },
  { name: "GitBranch", icon: GitBranch },
  { name: "GitCommit", icon: GitCommit },
  { name: "Github", icon: Github },
  { name: "Globe", icon: Globe },
  { name: "HardDrive", icon: HardDrive },
  { name: "KeyRound", icon: KeyRound },
  { name: "Laptop", icon: Laptop },
  { name: "Layers", icon: Layers },
  { name: "Link", icon: Link },
  { name: "Lock", icon: Lock },
  { name: "Mail", icon: Mail },
  { name: "Monitor", icon: Monitor },
  { name: "Network", icon: Network },
  { name: "Package", icon: Package },
  { name: "PanelsTopLeft", icon: PanelsTopLeft },
  { name: "Puzzle", icon: Puzzle },
  { name: "Router", icon: Router },
  { name: "Search", icon: Search },
  { name: "Server", icon: Server },
  { name: "Settings", icon: Settings },
  { name: "Shield", icon: Shield },
  { name: "ShieldCheck", icon: ShieldCheck },
  { name: "Share2", icon: Share2 },
  { name: "Smartphone", icon: Smartphone },
  { name: "Sparkles", icon: Sparkles },
  { name: "SquareTerminal", icon: SquareTerminal },
  { name: "Terminal", icon: Terminal },
  { name: "TestTube", icon: TestTube },
  { name: "Truck", icon: Truck },
  { name: "Upload", icon: Upload },
  { name: "Users", icon: Users },
  { name: "Wrench", icon: Wrench },
  { name: "Zap", icon: Zap },
];

function isImageUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

export default function SkillCategoryIconPicker({
  value,
  onChange,
}: Props) {
  const selectedIcon = ICONS.find(
    (item) => item.name === value
  );

  const SelectedIcon = selectedIcon?.icon;

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-300">
        Category Icon
      </label>

      <div className="max-h-64 overflow-y-auto rounded border border-neutral-700 bg-neutral-800 p-3">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
          {ICONS.map(({ name, icon: Icon }) => {
            const selected = value === name;

            return (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => onChange(name)}
                className={`flex min-h-[68px] flex-col items-center justify-center gap-1 rounded-lg p-2 transition ${
                  selected
                    ? "border border-primary-500 bg-primary-500/10 text-primary-400"
                    : "border border-transparent text-neutral-400 hover:border-neutral-600 hover:bg-neutral-700 hover:text-white"
                }`}
              >
                <Icon size={22} />

                <span className="text-[10px] leading-tight">
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-sm font-medium text-neutral-300">
          Custom Icon URL
        </label>

        <input
          type="url"
          placeholder="https://example.com/icon.svg"
          value={isImageUrl(value) ? value : ""}
          onChange={(e) => {
            const url = e.target.value.trim();

            if (url) {
              onChange(url);
            } else if (isImageUrl(value)) {
              onChange("");
            }
          }}
          className="w-full rounded border border-neutral-700 bg-neutral-800 p-3 text-white placeholder-neutral-500"
        />

        <p className="mt-1 text-xs text-neutral-500">
          Use a direct image or SVG URL if the icon isn't available above.
        </p>
      </div>

      {value && (
        <div className="mt-4 flex items-center gap-4 rounded-lg border border-neutral-700 bg-neutral-800 p-3">
          <span className="text-sm text-neutral-400">
            Preview:
          </span>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900">
            {SelectedIcon ? (
              <SelectedIcon
                size={24}
                className="text-primary-500"
              />
            ) : isImageUrl(value) ? (
              <img
                src={value}
                alt="Custom category icon"
                className="h-7 w-7 object-contain"
              />
            ) : (
              <Terminal size={24} className="text-primary-500" />
            )}
          </div>

          <span className="truncate text-sm text-neutral-300">
            {value}
          </span>
        </div>
      )}
    </div>
  );
}
