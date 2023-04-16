import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Home} from './components/home'
import {Adapters} from './components/adapters'

function App() {
    return (
        <div style={{fontSize: '1vw'}}>
            <Router>
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/adapters' element={<Adapters/>}/>
                </Routes>
            </Router>
        </div>
    )
}

export default App;
