import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useParams, useNavigate } from 'react-router-dom';

const viewBlog = () => {
    const { id: blogID } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [createdDateTime, setCreatedDateTime] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlog = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/login');
                return;
            }

            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .eq('id', blogID)
                .single();

            if (error || !data) {
                alert('Blog not found');
                navigate('/dashboard');
                return;
            }

            if (data.user_id !== user.id) {
                navigate('/dashboad');
                return;
            }

            setTitle(data.title);
            setContent(data.content);
            setExistingImage(data.image_url);
            setCreatedDateTime(data.created_at);
        };

        if (blogID) {
            fetchBlog();
        }
    }, [blogID, navigate]);

    return (
        <div>
            <nav>
                <Link className="nav-text-1 ms-4 mt-3 btn btn-sm" to=""><b>View Blog</b></Link>
            </nav>
            <hr />
            
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-2"></div>
                    <div className="col-lg-6 col-md-8 col-sm-12">
                        <div className="card mt-3">
                            <div className="card-header border-card rounded-top" style={{ backgroundColor: 'rgb(131, 72, 0)', color: 'white' }}>
                                <label htmlFor="" className="text-size-17"><b>{title}</b></label>
                                <p className="text-size-12">{new Date(createdDateTime).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})}</p>
                            </div>
                            <div className="card-body border-card rounded-bottom">
                                <label htmlFor="" className="text-size-14 text-color-1">{content}</label><br />
                                {existingImage && (<img src={existingImage} alt="Current Image" className="img-fluid mt-3 show-image"/>)}
                                <Link to="/dashboard"><button className="shadow-xl back-button float-end mt-3" type="button"><b>Back</b></button></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-2"></div>
                </div>
            </div>
        </div>
    );
};

export default viewBlog;