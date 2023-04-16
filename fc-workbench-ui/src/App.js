import './App.css';
import './screens.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {Home} from './components/home'
import {Adapters} from './components/adapters'
import {ImportAdapter} from "./components/import-adapter";
import {Screens} from "./components/screens";

function App() {
    return (
        <div className={'App'}>
            <Router>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/adapters' element={<Adapters/>}/>
                    <Route path='/screens' element={<Screens/>}/>
                    <Route path='/import-adapter' element={<ImportAdapter/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App;
