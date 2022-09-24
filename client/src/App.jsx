import Home from './pages/home/home'
import Profile from './pages/Profile/Profile';
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Messenger from './pages/Messenger/Messenger'
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';


function App() {
    const { user } = useContext(AuthContext)
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path='/' element={user ? <Home /> : <Register />} />
                <Route path='/login' element={user ? <Navigate to='/' /> : <Login />} />
                <Route path='/register' element={user ? <Navigate to='/' /> : <Register />} />
                <Route path='/messenger' element={!user ? <Navigate to='/' /> : <Messenger />} />
                <Route path='/profile/:username' element={<Profile />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;