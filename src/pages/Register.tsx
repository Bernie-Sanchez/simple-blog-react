import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
        } else {
            navigate("/login");
        }
    };

    return (
        <div>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-lg-4 col-md-3"></div>
                    <div className="col-lg-4 col-md-6 col-sm-12 mt-5">
                        <div className="register-body mt-5">
                            <h1 className="mb-4"><b>Register</b></h1>
                            
                            <form onSubmit={handleRegister}>
                                <input className="form-control form-control-sm shadow mb-1 border border-3" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <br />

                                <input className="form-control form-control-sm shadow mb-1 border border-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <p className="mt-3 p-text">Have an Account? <Link to="/login">Login Here</Link></p>
                                <br />

                                <button className="shadow-xl register-button" type="submit"><b>Register</b></button>
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

export default Register;