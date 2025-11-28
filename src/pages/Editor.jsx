import React, { useState, useRef, useEffect } from 'react';
import {
    ArrowLeft, Image as ImageIcon, Type, Video as VideoIcon,
    Quote as QuoteIcon, Heading as HeadingIcon,
    Code, AlertTriangle, Link as LinkIcon, Grid, UploadCloud
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/toast-context';
import { api } from '@/lib/api';
import {
    ParagraphBlock, HeadingBlock, QuoteBlock, ImageBlock,
    VideoBlock, CodeBlock, CalloutBlock, EmbedBlock, GalleryBlock
} from '@/components/editor/EditorBlocks';
import './Editor.css';
import '@/components/editor/EditorBlocks.css';

const Editor = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [urlSlug, setUrlSlug] = useState(slug || '');
    const [seoDesc, setSeoDesc] = useState('');
    const [isPremium, setIsPremium] = useState(false);
    const [tags, setTags] = useState('');
    const [blocks, setBlocks] = useState([{ id: '1', type: 'paragraph', content: '' }]);
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const { addToast } = useToast();
    const fileInputRef = useRef(null);
    const wsRef = useRef(null);

    // Session ID for Durable Object (use slug if editing, or random for new)
    const [sessionId] = useState(() => slug || crypto.randomUUID());

    useEffect(() => {
        // Connect to WebSocket (Durable Object)
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/api/editor/session/${sessionId}`;

        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            setIsConnected(true);
            addToast({ title: 'Connected to session', type: 'success' });
        };

        ws.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                if (msg.type === 'init' || msg.type === 'update') {
                    if (msg.data) {
                        if (msg.data.title) setTitle(msg.data.title);
                        if (msg.data.slug) setUrlSlug(msg.data.slug);
                        if (msg.data.isPremium !== undefined) setIsPremium(msg.data.isPremium);
                        if (msg.data.blocks) setBlocks(msg.data.blocks);
                        if (msg.data.tags) setTags(msg.data.tags);
                        if (msg.data.seoDesc) setSeoDesc(msg.data.seoDesc);
                    }
                }
            } catch {
                // Error handled silently
            }
        };

        ws.onclose = () => setIsConnected(false);

        return () => {
            ws.close();
        };
    }, [sessionId, addToast]);

    const sendUpdate = (data) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'update', data }));
        }
    };

    const handleAddBlock = (type) => {
        const newBlock = { id: crypto.randomUUID(), type, content: '' };
        const newBlocks = [...blocks, newBlock];
        setBlocks(newBlocks);
        sendUpdate({ title, slug: urlSlug, isPremium, blocks: newBlocks, tags, seoDesc });
    };

    const handleContentChange = (id, content) => {
        const newBlocks = blocks.map(b => b.id === id ? { ...b, content } : b);
        setBlocks(newBlocks);
        sendUpdate({ title, slug: urlSlug, isPremium, blocks: newBlocks, tags, seoDesc });
    };

    // Debounced Title Update
    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // Auto-generate slug from title if slug is empty
        if (!urlSlug && !slug) {
            const generatedSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            setUrlSlug(generatedSlug);
        }
        sendUpdate({ title: newTitle, slug: urlSlug, isPremium, blocks, tags, seoDesc });
    };

    const getPostData = () => ({
        title,
        slug: urlSlug,
        excerpt: seoDesc,
        content: blocks.map(b => {
            // Convert blocks to HTML (simplified for now)
            if (b.type === 'heading') return `<h2>${b.content}</h2>`;
            if (b.type === 'image') return `<img src="${b.content}" alt="" />`;
            return `<p>${b.content}</p>`;
        }).join('\n'),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        is_premium: isPremium
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save to Durable Object
            sendUpdate({ title, slug: urlSlug, isPremium, blocks, tags, seoDesc });

            // Save to Database (Draft)
            const postData = getPostData();

            if (slug) {
                await api.updatePost(slug, { ...postData, status: 'draft' });
            } else {
                await api.savePost({ ...postData, status: 'draft' });
                // If new post, navigate to edit URL
                if (urlSlug) {
                    navigate(`/admin/editor/${urlSlug}`, { replace: true });
                }
            }

            addToast({ title: 'Draft saved', type: 'success' });
        } catch (error) {
            console.error('Save error:', error);
            addToast({ title: 'Failed to save', description: error.message, type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!title || !urlSlug) {
            addToast({ title: 'Title and Slug required', type: 'error' });
            return;
        }

        setIsPublishing(true);
        try {
            const postData = getPostData();
            await api.publishPost(slug, postData);
            addToast({ title: 'Published successfully!', type: 'success' });
            navigate(`/post/${urlSlug}`);
        } catch (error) {
            console.error('Publish error:', error);
            addToast({ title: 'Failed to publish', description: error.message, type: 'error' });
        } finally {
            setIsPublishing(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length > 0) {
            imageFiles.forEach(file => {
                const url = URL.createObjectURL(file);
                const newBlock = { id: Date.now().toString() + Math.random(), type: 'image', content: url };
                setBlocks(prev => [...prev, newBlock]);
            });
            addToast({ title: `${imageFiles.length} image(s) added`, type: 'success' });
        }
    };

    const renderBlock = (block) => {
        const props = {
            content: block.content,
            onChange: (val) => handleContentChange(block.id, val),
            autoFocus: true
        };

        switch (block.type) {
            case 'heading': return <HeadingBlock {...props} />;
            case 'quote': return <QuoteBlock {...props} />;
            case 'image': return <ImageBlock {...props} />;
            case 'video': return <VideoBlock {...props} />;
            case 'code': return <CodeBlock {...props} />;
            case 'callout': return <CalloutBlock {...props} />;
            case 'embed': return <EmbedBlock {...props} />;
            case 'gallery': return <GalleryBlock {...props} />;
            default: return <ParagraphBlock {...props} />;
        }
    };

    return (
        <div
            className={`editor-layout ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Left Toolbar */}
            <aside className="editor-toolbar-left">
                <div className="toolbar-group">
                    <Button variant="ghost" size="icon" onClick={() => handleAddBlock('paragraph')} title="Text"><Type size={20} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleAddBlock('heading')} title="Heading"><HeadingIcon size={20} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleAddBlock('quote')} title="Quote"><QuoteIcon size={20} /></Button>
                </div>
                <div className="toolbar-divider" />
                <div className="toolbar-group">
                    <Button variant="ghost" size="icon" onClick={() => handleAddBlock('image')} title="Image"><ImageIcon size={20} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleAddBlock('video')} title="Video"><VideoIcon size={20} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleAddBlock('gallery')} title="Gallery"><Grid size={20} /></Button>
                </div>
                <div className="toolbar-divider" />
                <div className="toolbar-group">
                    <Button variant="ghost" size="icon" onClick={() => handleAddBlock('code')} title="Code"><Code size={20} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleAddBlock('callout')} title="Callout"><AlertTriangle size={20} /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleAddBlock('embed')} title="Embed"><LinkIcon size={20} /></Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="editor-main">
                <header className="editor-header">
                    <Link to="/">
                        <Button variant="ghost" size="icon"><ArrowLeft size={20} /></Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className={`editor-status ${isConnected ? 'text-success' : 'text-warning'}`}>
                            {isConnected ? 'Connected' : 'Reconnecting...'}
                        </span>
                        <span className="editor-status text-muted">Draft</span>
                        <Button variant="ghost" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Draft'}
                        </Button>
                        <Button onClick={handlePublish} disabled={isPublishing}>
                            {isPublishing ? 'Publishing...' : 'Publish'}
                        </Button>
                    </div>
                </header>

                <div className="editor-container">
                    <Input
                        className="editor-title-input"
                        placeholder="Title"
                        value={title}
                        onChange={handleTitleChange}
                    />

                    <div className="editor-blocks">
                        {blocks.map((block) => (
                            <div key={block.id} className="editor-block">
                                <div className="editor-block__content">
                                    {renderBlock(block)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {blocks.length === 0 && (
                        <div className="editor-empty-state">
                            <p className="text-muted">Start writing or drag and drop images...</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Right Sidebar */}
            <aside className="editor-sidebar-right">
                <div className="sidebar-section">
                    <h3 className="sidebar-title">Post Settings</h3>
                    <div className="sidebar-field">
                        <label>Slug</label>
                        <Input
                            placeholder="url-slug"
                            className="text-sm"
                            value={urlSlug}
                            onChange={(e) => {
                                setUrlSlug(e.target.value);
                                sendUpdate({ title, slug: e.target.value, isPremium, blocks, tags, seoDesc });
                            }}
                        />
                    </div>
                    <div className="sidebar-field">
                        <label>Tags (comma separated)</label>
                        <Input
                            placeholder="tech, writing, news"
                            className="text-sm"
                            value={tags}
                            onChange={(e) => {
                                setTags(e.target.value);
                                sendUpdate({ title, slug: urlSlug, isPremium, blocks, tags: e.target.value, seoDesc });
                            }}
                        />
                    </div>
                    <div className="sidebar-field flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            id="isPremium"
                            checked={isPremium}
                            onChange={(e) => {
                                setIsPremium(e.target.checked);
                                sendUpdate({ title, slug: urlSlug, isPremium: e.target.checked, blocks, tags, seoDesc });
                            }}
                            className="w-4 h-4"
                        />
                        <label htmlFor="isPremium" className="text-sm cursor-pointer select-none">
                            Premium Content
                        </label>
                    </div>
                </div>

                <div className="sidebar-section">
                    <h3 className="sidebar-title">SEO & Social</h3>

                    {/* SERP Preview */}
                    <div className="serp-preview-card">
                        <div className="serp-preview-header">
                            <span className="serp-icon">G</span>
                            <span className="serp-domain">hassanwrites.com › post › {urlSlug || 'url-slug'}</span>
                        </div>
                        <div className="serp-title">{title || 'Page Title'}</div>
                        <div className="serp-desc">
                            {seoDesc || 'Meta description will appear here...'}
                        </div>
                    </div>

                    <div className="sidebar-field mt-4">
                        <div className="flex justify-between">
                            <label>Meta Title</label>
                            <span className={`text-xs ${title.length > 60 ? 'text-error' : 'text-muted'}`}>
                                {title.length}/60
                            </span>
                        </div>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="SEO Title"
                            className="text-sm"
                        />
                    </div>

                    <div className="sidebar-field">
                        <div className="flex justify-between">
                            <label>Meta Description</label>
                            <span className={`text-xs ${seoDesc.length > 160 ? 'text-error' : 'text-muted'}`}>
                                {seoDesc.length}/160
                            </span>
                        </div>
                        <textarea
                            className="sidebar-textarea"
                            placeholder="Summarize your post..."
                            rows={4}
                            value={seoDesc}
                            onChange={(e) => {
                                setSeoDesc(e.target.value);
                                sendUpdate({ title, slug: urlSlug, isPremium, blocks, tags, seoDesc: e.target.value });
                            }}
                        />
                    </div>
                </div>

                <div className="sidebar-section">
                    <h3 className="sidebar-title">Media</h3>
                    <div
                        className="media-dropzone"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadCloud size={24} className="mb-2" />
                        <p>Upload Media</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleFiles(Array.from(e.target.files))}
                        />
                    </div>
                </div>
            </aside>

            {isDragging && (
                <div className="drag-overlay">
                    <UploadCloud size={48} />
                    <p>Drop files to upload</p>
                </div>
            )}
        </div>
    );
};

export default Editor;
