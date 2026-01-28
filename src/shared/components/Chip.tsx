type Props = {
    text: string;
};

export const Chip = ({ text }: Props) => {
    return (
        <div className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[var(--primary-bg)] px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--primary-accent)]" />
            <span className="text-xs text-[var(--secondary-font)]">{text}</span>
        </div>
    );
};