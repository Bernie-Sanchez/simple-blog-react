import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [blogs, setBlogs] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            navigate('/login');
            return;
        }

        const { data } = await supabase
            .from('blogs')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false});
        if (data) setBlogs(data);
    };

    const handleDelete = async (blogID: string) => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            navigate('/login');
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmDelete) return;

        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', blogID);

        if (error) {
            alert("Delete failed: " + error.message);
        } else {
            alert("Blog successfully deleted");
            window.location.href = "/dashboard";
        }
    };

    return (
        <div>
            <nav>
                <Link className="nav-text-1 ms-2 mt-3 btn btn-sm" to=""><b>Timeline</b></Link>
                <Link className="nav-text-2 nav-button ms-2 mt-3 btn btn-sm" to="/"><b>Home</b></Link>
                <Link className="nav-text-2 nav-button ms-2 mt-3 btn btn-sm" to="/profile"><b>Profile</b></Link>
                <Link className="float-end me-4 nav-text-2 nav-button btn btn-sm" style={{ marginTop: '20px' }} to="/logout"><b>Logout</b></Link>
            </nav>
            <hr />

            <div className="container mt-4">
                <div className="row">
                    <div className="col-lg-2 col-md-3 col-sm-6">
                        <Link to="/create"><button className="shadow-xl create-button mb-5 ms-3" type="button"><b>+ Create Blog</b></button></Link>
                    </div>
                </div>
                <div className="row">
                    {blogs.map(blog => (
                        <div className="col-lg-3 col-md-4 col-sm-6" key={blog.id}>
                            <div className="dashboard-body mb-3">
                                <b className="text-size-17">{blog.title}</b>
                                <p className="text-size-12">{new Date(blog.created_at).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})}</p>
                                <br /><br />

                                <Link className="btn" to={`/view/${blog.id}`}><i className="fa-solid fa-eye buttons"></i></Link> | {' '}
                                <Link className="btn" to={`/edit/${blog.id}`}><i className="fa-solid fa-pen-to-square buttons"></i></Link> | {' '}
                                <button className="btn" onClick={() => handleDelete(blog.id)}><i className="fa-solid fa-trash-can buttons"></i></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;