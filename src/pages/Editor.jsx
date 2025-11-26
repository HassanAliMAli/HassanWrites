import React, { useState, useRef } from 'react';
import {
    Save, ArrowLeft, Image as ImageIcon, Type, Video as VideoIcon,
    MoreHorizontal, Quote as QuoteIcon, Heading as HeadingIcon,
    Code, AlertTriangle, Link as LinkIcon, Grid, UploadCloud
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
    const [title, setTitle] = useState('');
    const [seoDesc, setSeoDesc] = useState('');
    const [blocks, setBlocks] = useState([{ id: '1', type: 'paragraph', content: '' }]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const { addToast } = useToast();
    const fileInputRef = useRef(null);

    const handleAddBlock = (type) => {
        const newBlock = { id: Date.now().toString(), type, content: '' };
        setBlocks([...blocks, newBlock]);
    };

    const handleContentChange = (id, content) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content } : b));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await api.savePost({ title, blocks });
            addToast({ title: 'Draft saved', type: 'success' });
        } catch {
            addToast({ title: 'Failed to save', type: 'error' });
        } finally {
            setIsSaving(false);
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
            // In a real app, upload to R2 here. For now, create object URLs.
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
                        <span className="editor-status text-muted">Draft</span>
                        <Button variant="ghost" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button>Publish</Button>
                    </div>
                </header>

                <div className="editor-container">
                    <Input
                        className="editor-title-input"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                        <Input placeholder="url-slug" className="text-sm" />
                    </div>
                    <div className="sidebar-field">
                        <label>Tags</label>
                        <Input placeholder="Add tags..." className="text-sm" />
                    </div>
                </div>

                <div className="sidebar-section">
                    <h3 className="sidebar-title">SEO & Social</h3>

                    {/* SERP Preview */}
                    <div className="serp-preview-card">
                        <div className="serp-preview-header">
                            <span className="serp-icon">G</span>
                            <span className="serp-domain">edgemaster.io › post › {title.toLowerCase().replace(/\s+/g, '-') || 'url-slug'}</span>
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
                            onChange={(e) => setSeoDesc(e.target.value)}
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
