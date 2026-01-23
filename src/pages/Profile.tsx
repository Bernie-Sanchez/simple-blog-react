import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const [email, setEmail] = useState<string | null | undefined>(undefined);
    const [fname, setFname] = useState('');
    const [mname, setMname] = useState('');
    const [lname, setLname] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            navigate('/login');
            return;
        }

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        setEmail(user.email);
        if (data) {
            setDisplayName(data.display_name ?? '');
            setFname(data.first_name ?? '');
            setMname(data.middle_name ?? '');
            setLname(data.last_name ?? '');
        } else {
            setDisplayName('');
            setFname('');
            setMname('');
            setLname('');
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            navigate('/');
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: user.id,
                first_name: fname,
                middle_name: mname,
                last_name: lname,
                display_name: displayName,
            });

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            alert("Profile successfully updated");
            navigate('/dashboard');
            setLoading(false);
            return;
        }
    };

    return (
        <div>
            <nav>
                <Link className="nav-text-1 ms-4 mt-3 btn btn-sm" to=""><b>Profile</b></Link>
            </nav>
            <hr />
            
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-2"></div>
                    <div className="col-lg-6 col-md-8 col-sm-12">
                        <div className="card">
                            <div className="card-header border-card rounded-top" style={{ backgroundColor: 'rgb(131, 72, 0)', color: 'white' }}>
                                <label htmlFor="" className="text-size-17"><b>Updating Profile</b></label>
                            </div>
                            <div className="card-body border-card rounded-bottom">
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="container-fluid">
                                        <label htmlFor="" className="ms-2 mb-1 text-size-14"><b><i>Display Name</i></b></label>
                                        <input className="form-control form-control-sm mb-2" style={{ border: '1px solid black', borderRadius: '10px' }} type="text" placeholder="Display Name" value={displayName ?? ''} onChange={(e) => setDisplayName(e.target.value)} required />
                                        
                                        <label htmlFor="" className="ms-2 mb-1 text-size-14"><b><i>First Name</i></b></label>
                                        <input className="form-control form-control-sm mb-2" style={{ border: '1px solid black', borderRadius: '10px' }} type="text" placeholder="Firt Name" value={fname ?? ''} onChange={(e) => setFname(e.target.value)} required />
                                        
                                        <label htmlFor="" className="ms-2 mb-1 text-size-14"><b><i>Middle Name</i></b></label>
                                        <input className="form-control form-control-sm mb-2" style={{ border: '1px solid black', borderRadius: '10px' }} type="text" placeholder="Middle Name" value={mname ?? ''} onChange={(e) => setMname(e.target.value)} required />
                                        
                                        <label htmlFor="" className="ms-2 mb-1 text-size-14"><b><i>Last Name</i></b></label>
                                        <input className="form-control form-control-sm mb-2" style={{ border: '1px solid black', borderRadius: '10px' }} type="text" placeholder="Last Name" value={lname ?? ''} onChange={(e) => setLname(e.target.value)} required />
                                        
                                        <label htmlFor="" className="ms-2 mb-1 text-size-14"><b><i>Email</i></b></label>
                                        <input className="form-control form-control-sm mb-5" style={{ border: '1px solid black', borderRadius: '10px' }} type="email" placeholder="Email" value={email ?? ''} onChange={(e) => setEmail(e.target.value)} required />
                                        
                                        <button className="shadow-xl createBlog-button float-end" disabled={loading}>
                                            <b>{loading ? 'Updating...' : 'Update Profile'}</b>
                                        </button>
                                        <Link to="/dashboard"><button className="shadow-xl back-button float-end" type="button"><b>Back</b></button></Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-2"></div>
                </div>
            </div>
        </div>
    );
};

export default Profile;