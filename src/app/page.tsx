import { FeedRenderer } from "@/features/laningPage/presentation/FeedRenderer";
import { Hero } from "@/features/laningPage/presentation/Hero";
import Navbar from "@/features/laningPage/presentation/Navbar";

const App = async () => {
    return (
        <>
            <Navbar></Navbar>
            <Hero></Hero>
            <FeedRenderer></FeedRenderer>
        </>
    )
};

export default App;