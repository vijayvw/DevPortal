import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiCode,
  FiFolder,
  FiBook,
  FiMail,
  FiImage,
  FiSettings,
  FiUser,
} from "react-icons/fi";

const menu = [
  { to: "/admin", label: "Dashboard", icon: FiGrid },
  { to: "/admin/skills", label: "Skills", icon: FiCode },
  { to: "/admin/projects", label: "Projects", icon: FiFolder },
  { to: "/admin/blog", label: "Blog", icon: FiBook },
  { to: "/admin/contact", label: "Contacts", icon: FiMail },
  { to: "/admin/media", label: "Media", icon: FiImage },
  { to: "/admin/about", label: "About", icon: FiUser },
  { to: "/admin/settings", label: "Settings", icon: FiSettings },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-800 h-screen">
      <div className="p-6 border-b border-neutral-800">
        <h2 className="text-white text-xl font-bold">
          DevPortal
        </h2>

        <p className="text-neutral-400 text-sm">
          Admin Panel
        </p>
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
