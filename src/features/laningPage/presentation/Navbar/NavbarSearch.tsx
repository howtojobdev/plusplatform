import { UI_ELEMENT_ROUNDNESS } from "@/shared/constants/ui";
import { cn } from "@/shared/utils/cn";
import { Search } from "lucide-react";
import { useNavbarStore } from "../../application/state/navbarState";
import { useRef } from "react";


export const NavbarSearch = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const query = useNavbarStore(state => state.searchQuery);
    const setQuery = useNavbarStore(state => state.setSearchQuery);

    const searchClickHandle = () => {
        if(!inputRef.current) return;
        inputRef.current.focus();
    }

    return (
        <div
            onClick={searchClickHandle}
            className={cn(
                "flex items-center bg-[var(--secondary-bg)] px-4 py-2",
                "gap-2",
                UI_ELEMENT_ROUNDNESS
            )}
        >
            <Search
                className="w-4 h-4"
            ></Search>
            <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                type="text"
                className="
                    bg-transparent max-w-[150px] xl:max-w-fit
                    outline-none
                    focus:outline-none
                    focus-visible:outline-none
                    ring-0 focus:ring-0 focus-visible:ring-0
                    border-none focus:border-none
                "
                placeholder="Breach..."
            />
        </div>
    );
};