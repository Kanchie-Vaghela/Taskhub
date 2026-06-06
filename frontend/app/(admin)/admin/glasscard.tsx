type GlassCardProps = {
  title: string;
  value: number;
  color: string;
};

const GlassCard = ({
  title,
  value,
  color,
}: GlassCardProps) => {
  
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-3xl
      border border-white/50
      bg-white/30
      backdrop-blur-2xl
      p-6
      shadow-xl
      hover:-translate-y-1
      hover:shadow-cyan-300/30
      transition-all duration-300
    "
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-10`}
      />

      <div className="relative z-10">
        <p className="text-slate-500 text-sm font-medium">
          {title}
        </p>

        <h2 className="text-5xl font-bold mt-2 text-slate-800">
          {value}
        </h2>
      </div>
    </div>
  );
};

export default GlassCard;