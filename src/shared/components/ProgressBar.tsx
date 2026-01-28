type Props = {
    progress: number;
}

export const ProgressBar = ({ progress }: Props) => {
    return (
        <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="text-sm">Your progress</p>
                <p className="text-sm text-[var(--primary-accent)]">{progress}%</p>
            </div>
            <div className="w-full h-4 bg-[var(--secondary-bg)] rounded-full overflow-hidden">
                <div
                    style={{
                        width: `${progress+1}%`
                    }}
                    className="bg-[var(--primary-accent)] h-full rounded-full"
                />
            </div>
        </div>
    );
};