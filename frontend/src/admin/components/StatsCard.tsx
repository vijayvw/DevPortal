import { IconType } from "react-icons";

interface Props {
  title: string;
  value: number | string;
  icon: IconType;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
}: Props) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-neutral-400">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-white">
            {value}
          </h2>
        </div>

        <Icon
          size={34}
          className="text-blue-500"
        />
      </div>
    </div>
  );
}
