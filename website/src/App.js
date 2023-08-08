import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from "./pages/Main.js"
import Stats from "./pages/Stats.js"
import Faq from "./pages/Faq.js"
 
function App() {
    return (
        <Router>
            <Routes>
                <Route exact path='/' element={<Main />} />
                <Route path='/stats' element={<Stats />} />
                <Route path='/faq' element={<Faq />} />
                <Route path="*" element={<Main />} />
            </Routes>
        </Router>
    );
}
 
export default App;