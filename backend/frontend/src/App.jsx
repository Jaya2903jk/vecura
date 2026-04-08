
import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import PageLoader from "./components/PageLoader";

function App() {
    const [loading, setLoading] = useState(false);

    return (
        <>
            {loading && <PageLoader />}
            <AppRoutes setLoading={setLoading} />
        </>
    );
}

export default App;
