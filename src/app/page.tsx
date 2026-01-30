import { FeedRenderer } from "@/features/laningPage/presentation/FeedRenderer";
import { FeedLoader } from "@/features/laningPage/presentation/FeedRenderer/FeedLoader";
import { Hero } from "@/features/laningPage/presentation/Hero";
import Navbar from "@/features/laningPage/presentation/Navbar";
import { Suspense } from "react";

const App = async () => {
    return (
        <>
            <Navbar></Navbar>
            <Hero></Hero>
            <Suspense fallback={<FeedLoader></FeedLoader>}>
                <FeedRenderer></FeedRenderer>
            </Suspense>
        </>
    )
};

export default App;