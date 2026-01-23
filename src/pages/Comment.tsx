import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Comment = () => {
    const { id: BlogID } = useParams<{ id: string }>();
    const [comments, setComments] = useState<any[]>([]);
    const [displayName, setDisplayName] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [existingImage, setExistingImage] = useState<string | null>(null);
    const [createdDateTime, setCreatedDateTime] = useState('');
    const [comment, setComment] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect (() => {
        fetchBlogUser();
        fetchComment();
    }, []);

    const fetchBlogUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            navigate('/login');
            return;
        }

        const { data, error } = await supabase
            .from('blogs')
            .select(`*, profiles (*)`)
            .eq('id', BlogID)
            .single();

        if (error) {
            alert(error.message);
        }

        if (data) {
            setDisplayName(data.profiles.display_name ?? 'Unknown Author');
            setTitle(data.title ?? '');
            setContent(data.content ?? '');
            setExistingImage(data.image_url ?? '');
            setCreatedDateTime(data.created_at ?? '');
        } else {
            setDisplayName('Unknown Author');
            setTitle('');
            setContent('');
            setExistingImage('');
            setCreatedDateTime('');
        }
    };

    const fetchComment = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            navigate('/login');
            return;
        }

        const { data, error } = await supabase
            .from('comments')
            .select(`*, profiles (*)`)
            .eq('blog_id', BlogID)
            .order('created_at', { ascending: false });

        if (error) {
            alert(error.message);
        }

        if (data) setComments(data);
    };

    const handleComment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            navigate('/login');
            return;
        }

        let imageUrl: string | null = null;

        if (image) {
            const fileName = `${user.id}/${Date.now()}-${image.name}`;
            const { error: uploadError } = await supabase.storage
                .from('comment-images')
                .upload(fileName, image);

            if (uploadError) {
                alert(uploadError.message);
                setLoading(false);
                return;
            }

            const { data } = supabase.storage
                .from('comment-images')
                .getPublicUrl(fileName);

            imageUrl = (data.publicUrl);
        }

        const { error } = await supabase.from('comments').insert({
            user_id: user.id,
            blog_id: BlogID,
            content: comment,
            image_url: imageUrl,
        });

        if (error) {
            alert(error.message);
        } else {
            alert('Comment posted successfully!');
            setLoading(false);
            navigate(`/comment/${BlogID}`);
        }
    };

    return (
        <div>
            <nav>
                <Link className="nav-text-1 ms-4 mt-3 btn btn-sm" to=""><b>Comment</b></Link>
            </nav>
            <hr />

            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-2"></div>
                    <div className="col-lg-6 col-md-8 col-sm-12">
                        <div className="card">
                            <div className="card-header border-card rounded-top" style={{ backgroundColor: 'rgb(131, 72, 0)', color: 'white' }}>
                                <Link to="/"><button className="shadow-xl back-button float-end mt-2" type="button"><b><i className="fa-solid fa-arrow-right"></i></b></button></Link>
                                <label htmlFor="" className="text-size-17"><b>{displayName}</b></label>
                                <p className="text-size-12">{new Date(createdDateTime).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})}</p>
                            </div>
                            <div className="card-body border-card">
                                <label htmlFor="" className="text-size-15 text-color-1 mb-3"><b>{title}</b></label><br />
                                <label htmlFor="" className="text-size-14 text-color-1 mb-3"><i>{content}</i></label>
                                {existingImage && (<img src={existingImage} alt="Current Image" className="img-fluid mb-1 comment-image"/>)}
                                <hr style={{ border: '1px solid black' }} />
                                <p className="text-size-12 text-center mb-3 text-color-1"><b><i>Comments</i></b></p>
                                {comments.map(com => (
                                <div className="comment-border mb-2">
                                    <div className="container-fluid">
                                        <label htmlFor="" className="text-color-1"><b className="text-size-15">{com.profiles.display_name ?? 'Unknown Author'}</b> - <i className="text-size-10">{new Date(com.created_at).toLocaleDateString('en-US', {month: 'short', day: '2-digit', year: 'numeric'})}</i></label>
                                        <p className="text-size-13 text-color-1"> - <i>{com.content}</i></p>
                                        {com.image_url && (<img src={com.image_url} alt="Current Image" className="img-fluid mb-2 comments-image"/>)}
                                    </div>
                                </div>
                                ))}
                                
                            </div>
                            <div className="card-footer border-card rounded-bottom" style={{ backgroundColor: 'rgb(131, 72, 0)', color: 'white' }}>
                                <form onSubmit={handleComment}>
                                    <div className="row">
                                        <div className="col-3">
                                            <input className="form-control form-control-sm" style={{ border: '1px solid black', borderRadius: '10px' }} type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                                        </div>
                                        <div className="col-7">
                                            <input className="form-control form-control-sm" style={{ border: '1px solid black', borderRadius: '10px' }} type="text" placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} required />
                                        </div>
                                        <div className="col-2">
                                            <button className="shadow-xl comment-button float-end" disabled={loading}>
                                                <b>{loading ? 'Posting...' : 'Post'}</b>
                                            </button>
                                        </div>
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

export default Comment;