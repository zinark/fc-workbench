import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {Home} from './components/home'
import {Adapters} from './components/adapters'
import {ImportAdapter} from "./components/import-adapter";

function App() {
    return (
        <div style={{fontSize: '1vw'}}>
            <Router>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/adapters' element={<Adapters/>}/>
                    <Route path='/import-adapter' element={<ImportAdapter/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App;
