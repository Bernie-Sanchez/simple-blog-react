import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditBlog = () => {
    const { id: blogID } = useParams<{ id: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
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
                alert("Blog not found");
                navigate('/dashboard');
                return;
            }

            if (data.user_id !== user.id) {
                navigate('/dashboard');
                return;
            }

            setTitle(data.title);
            setContent(data.content);
            setExistingImage(data.image_url);
        };

        if (blogID) {
            fetchBlog();
        }
    }, [blogID, navigate]);

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!blogID) {
            alert("Invalid Blog ID");
            setLoading(false);
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            navigate('/login');
            return;
        }

        let imageUrl = existingImage;

        if (image) {
            const fileName = `${user.id}/${Date.now()}-${image.name}`;

            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(fileName, image);

            if (uploadError) {
                alert(uploadError.message);
                setLoading(false);
                return;
            }

            const { data } = supabase.storage
                .from('blog-images')
                .getPublicUrl(fileName);

            imageUrl = data.publicUrl;
        }

        const { data, error } = await supabase
            .from('blogs')
            .update({
                title,
                content,
                image_url: imageUrl,
            })
            .eq('id', blogID)
            .select();

        if (error || !data || data.length === 0) {
            alert('Update failed');
            setLoading(false);
            return;
        }

        alert("Blog successfully updated");
        setLoading(false);
        navigate('/dashboard');
    };

    return (
        <div>
            <nav>
                <Link className="nav-text-1 ms-4 mt-3 btn btn-sm" to=""><b>Edit Blog</b></Link>
            </nav>
            <hr />

            <div className="container">
                <div className="row mt-3">
                    <div className="col-lg-3 col-md-2"></div>
                    <div className="col-lg-6 col-md-8 col-sm-12">
                        <div className="card mb-5">
                            <div className="card-header border-card rounded-top" style={{ backgroundColor: 'rgb(131, 72, 0)', color: 'white' }}>
                                <label htmlFor="" className="text-size-17"><b>Editing Blog</b></label>
                            </div>
                            <div className="card-body border-card rounded-bottom">
                                <form onSubmit={handleEdit}>
                                    <div className="container-fluid">
                                        <label htmlFor="" className="ms-2 mb-1 text-size-14"><b><i>Title</i></b></label>
                                        <input className="form-control form-control-sm mb-2" style={{ border: '1px solid black', borderRadius: '10px' }} type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

                                        <label htmlFor="" className="ms-2 mb-1 text-size-14"><b><i>Content</i></b></label>
                                        <textarea className="form-control form-control-sm mb-2" style={{ border: '1px solid black', borderRadius: '10px' }} placeholder="Content" rows={7} value={content} onChange={(e) => setContent(e.target.value)} required />

                                        <label htmlFor="" className="ms-2 mb-1 text-size-14"><b><i>Picture/Image</i></b></label>
                                        <input className="form-control form-control-sm mb-2" style={{ border: '1px solid black', borderRadius: '10px' }} type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                                        {existingImage && (<img src={existingImage} alt="Current Image" className="mt-2 existing-image mb-5"/>)}
                                        
                                        <button className="shadow-xl createBlog-button float-end" disabled={loading}>
                                            <b>{loading ? 'Updating...' : 'Update Blog'}</b>
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

export default EditBlog;