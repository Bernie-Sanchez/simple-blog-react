import { useState } from 'react';
import { supabase } from '../lib/supabase';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
        } else {
            setMessage('Registration successful! You can now log in.');
        }
    };

    return (
        <div>
            <h1>Register</h1>
            
            <form onSubmit={handleRegister}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <br />

                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <br />

                <button type="submit">Register</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Register;