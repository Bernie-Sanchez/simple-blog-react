import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
        } else if (data.session) {
            // Session automatically stored in localStorage by supabase-js v2
            console.log('Logged in user:', data.user);
            navigate('/dashboard');
        }
    };

    return (
        <div>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-lg-4 col-md-3"></div>
                    <div className="col-lg-4 col-md-6 col-sm-12 mt-5">
                        <div className="login-body mt-5">
                            <h1 className="mb-4"><b>Login</b></h1>

                            <form onSubmit={handleLogin}>
                                <input className="form-control form-control-sm mb-1" style={{ border: '1px solid black', borderRadius: '10px' }} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <br />

                                <input className="form-control form-control-sm mb-1" style={{ border: '1px solid black', borderRadius: '10px' }} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <p className="mt-3 p-text">Create Account? <Link to="/register">Register Here</Link></p>
                                <br />

                                <Link to="/"><button className="shadow-xl back-button" type="button"><b>Back</b></button></Link>
                                <button className="shadow-xl login-button" type="submit"><b>Login</b></button>
                            </form>

                            {message && <p>{message}</p>}
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-3"></div>
                </div>
            </div>
        </div>
    );
};

export default Login;