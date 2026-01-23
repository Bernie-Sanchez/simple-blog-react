import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const PAGE_SIZE = 10;
    const [blogs, setBlogs] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        fetchBlog();
    }, [page]);

    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user || null);
    };

    const fetchBlog = async () => {
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE;

        const { data, count, error } = await supabase
            .from('blogs')
            .select(`*, profiles (*)`, { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) {
            alert(error.message);
        }

        if (data) setBlogs(data);
        if (count !== null) setTotal(count);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate('/');
    };
    
    return (
        <div>
            <nav>
                <Link className="nav-text-1 ms-2 mt-3 btn btn-sm" to=""><b>Home</b></Link>
                {user ? (
                    <>
                        <button className="float-end me-4 nav-text-2 nav-button btn btn-sm" style={{ marginTop: '20px' }} onClick={handleLogout}><b>Logout</b></button>
                        <Link className="nav-text-2 nav-button ms-2 mt-3 btn btn-sm" to="/dashboard"><b>Timeline</b></Link>
                    </>
                ) : (
                    <Link className="float-end me-4 nav-text-2 nav-button mt-3 btn btn-sm" to="/login"><b>Login</b></Link>
                )}
            </nav>
            <hr />

            <div className="container mt-4">
                <div className="row">
                    {blogs.map(blog => (
                    <div className="col-lg-6 col-md-6 col-sm-6" key={blog.id}>
                        <div className="card mt-3">
                            <div className="card-header border-card rounded-top" style={{ backgroundColor: 'rgb(131, 72, 0)', color: 'white' }}>
                                <label htmlFor="" className="text-size-17"><b>{blog.profiles.display_name ?? 'Unknown Author'}</b></label>
                                <p className="text-size-12">{new Date(blog.created_at).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})}</p>
                            </div>
                            <div className="card-body border-card">
                                <label htmlFor="" className="text-size-15 text-color-1 mb-3"><b>{blog.title}</b></label><br />
                                <label htmlFor="" className="text-size-14 text-color-1 mb-2 text-content text-truncate"><i>{blog.content}</i></label>
                                {blog.image_url && (<img src={blog.image_url} alt="Current Image" className="img-fluid mb-1 home-image"/>)}
                            </div>
                            <div className="card-footer border-card rounded-bottom">
                                <Link className="btn float-end" to={`/comment/${blog.id}`}><i className="fs-4 fa-solid fa-comment-dots buttons"></i></Link>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
                    <button className="btn btn-sm btn-outline-secondary" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                    <span className="text-color-1">Page {page} of {Math.ceil(total / PAGE_SIZE)}</span>
                    <button className="btn btn-sm btn-outline-secondary" disabled={page >= Math.ceil(total / PAGE_SIZE)} onClick={() => setPage(page + 1)}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Home;