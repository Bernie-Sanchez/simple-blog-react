import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        console.log('Current user:', user);

        if (!user) {
            navigate('/login')
            return;
        }

        let imageUrl: string | null = null;

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

        const { error } = await supabase.from('blogs').insert({
            user_id: user.id, // Must match auth.uid() for RLS
            title,
            content,
            image_url: imageUrl,
        });

        if (error) {
            alert(error.message);
        } else {
            alert('Blog created successfully!');
            navigate('/dashboard');
        }

        setLoading(false);
    };

    return (
        <div>
            <nav>
                <Link className="nav-text-1 ms-4 mt-3 btn btn-sm" to=""><b>Create Blog</b></Link>
            </nav>
            <hr />

            <div className="container">
                <div className="row mt-5">
                    <div className="col-lg-3 col-md-2"></div>
                    <div className="col-lg-6 col-md-8 col-sm-12">
                        <div className="card">
                            <div className="card-header border-card rounded-top" style={{ backgroundColor: 'rgb(131, 72, 0)', color: 'white' }}>
                                <label htmlFor="" className="text-size-17"><b>Creating Blog</b></label>
                            </div>
                            <div className="card-body border-card rounded-bottom">
                                <form onSubmit={handleCreate}>
                                    <div className="container-fluid">
                                        <label htmlFor="" className="ms-2 mb-1 text-size-14"><b><i>Title</i></b></label>
                                        <input className="form-control form-control-sm mb-2" style={{ border: '1px solid black', borderRadius: '10px' }} type="text" placeholder="Title of the blog..." value={title} onChange={(e) => setTitle(e.target.value)} required />

                                        <label htmlFor="" className="ms-2 mb-1 text-size-14"><b><i>Content</i></b></label>
                                        <textarea className="form-control form-control-sm mb-2" style={{ border: '1px solid black', borderRadius: '10px' }} placeholder="Content of the blog..." rows={10} value={content} onChange={(e) => setContent(e.target.value)} required />

                                        <label htmlFor="" className="ms-2 mb-1 text-size-14"><b><i>Picture/Image</i></b></label>
                                        <input className="form-control form-control-sm mb-4" style={{ border: '1px solid black', borderRadius: '10px' }} type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                                    </div>
                                    <button className="shadow-xl createBlog-button float-end" disabled={loading}>
                                        <b>{loading ? 'Creating...' : 'Create Blog'}</b>
                                    </button>
                                    <Link to="/dashboard"><button className="shadow-xl back-button float-end" type="button"><b>Back</b></button></Link>
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

export default CreateBlog;