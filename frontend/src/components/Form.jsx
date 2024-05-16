import { useState } from "react";
import api from '../api';
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import '../styles/Form.css';
import Loadingindicator from "./Loadingindicator";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const name = method === "Login" ? "Login" : "Register";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            alert("Please provide both username and password.");
            return;
        }

        setLoading(true);

        try {
            const res = await api.post(route, { username, password });
            const { access, refresh } = res.data;
            if (method.toLowerCase() === "login") {
                localStorage.setItem(ACCESS_TOKEN, access);
                localStorage.setItem(REFRESH_TOKEN, refresh);
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form_input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />

            <input
                className="form_input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            {loading && <Loadingindicator />}

            <button className="form-button" type="submit" disabled={loading}>
                {loading ? 'Loading...' : name}
            </button>
        </form>
    );
}

export default Form;
