import { BrowserRouter } from "react-router";

import MainRoutes from "./MainRoutes";

const App = () => {
    return (
        <BrowserRouter>
            <MainRoutes />
        </BrowserRouter>
    );
};

export default App;
