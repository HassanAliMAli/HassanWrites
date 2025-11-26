import React from 'react';
import { Image as ImageIcon, Video as VideoIcon, Quote as QuoteIcon, Code, AlertTriangle, Link as LinkIcon, Grid } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { StreamVideoPlayer } from '@/components/blog/StreamVideoPlayer';

export const ParagraphBlock = ({ content, onChange, autoFocus }) => (
    <textarea
        className="editor-textarea"
        placeholder="Tell your story..."
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={1}
        autoFocus={autoFocus}
        onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        }}
    />
);

export const HeadingBlock = ({ content, onChange, autoFocus }) => (
    <input
        className="editor-heading"
        placeholder="Heading"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
    />
);

export const QuoteBlock = ({ content, onChange, autoFocus }) => (
    <div className="editor-quote-wrapper">
        <div className="editor-quote-icon"><QuoteIcon size={24} /></div>
        <textarea
            className="editor-quote"
            placeholder="Quote..."
            value={content}
            onChange={(e) => onChange(e.target.value)}
            rows={1}
            autoFocus={autoFocus}
            onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            }}
        />
    </div>
);

export const ImageBlock = ({ content, onChange }) => (
    <div className="editor-media-placeholder">
        {content ? (
            <img src={content} alt="Uploaded" className="editor-media-preview" />
        ) : (
            <div className="editor-media-empty">
                <ImageIcon size={48} className="text-muted" />
                <p>Drag an image or click to upload</p>
                <Input
                    placeholder="Or paste image URL..."
                    className="mt-4 max-w-sm"
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        )}
    </div>
);

export const VideoBlock = ({ content, onChange }) => (
    <div className="editor-media-placeholder">
        {content ? (
            <div className="editor-video-preview">
                <StreamVideoPlayer src={content} />
                <div className="mt-2 text-xs text-muted text-center">{content}</div>
            </div>
        ) : (
            <div className="editor-media-empty">
                <VideoIcon size={48} className="text-muted" />
                <p>Paste video URL (YouTube, Vimeo, etc.)</p>
                <Input
                    placeholder="Video URL..."
                    className="mt-4 max-w-sm"
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        )}
    </div>
);

export const CodeBlock = ({ content, onChange, autoFocus }) => (
    <div className="editor-block-wrapper">
        <div className="editor-code-icon"><Code size={20} /></div>
        <textarea
            className="editor-code"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste code here..."
            autoFocus={autoFocus}
            spellCheck="false"
            onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            }}
        />
    </div>
);

export const CalloutBlock = ({ content, onChange, autoFocus }) => (
    <div className="editor-callout">
        <div className="callout-icon"><AlertTriangle size={24} /></div>
        <textarea
            className="editor-callout-text"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Add a callout..."
            autoFocus={autoFocus}
            rows={1}
            onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            }}
        />
    </div>
);

export const EmbedBlock = ({ content, onChange, autoFocus }) => (
    <div className="editor-embed">
        <div className="editor-embed-header">
            <LinkIcon size={16} className="mr-2" />
            <input
                className="editor-embed-input"
                value={content}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Paste embed URL (YouTube, Twitter, etc.)..."
                autoFocus={autoFocus}
            />
        </div>
        {content && (
            <div className="embed-preview">
                <p className="text-muted text-sm text-center py-4">Embed preview for: {content}</p>
            </div>
        )}
    </div>
);

export const GalleryBlock = () => (
    <div className="editor-gallery">
        <div className="gallery-placeholder">
            <Grid size={48} className="mb-2 opacity-50" />
            <p>Gallery Block (Drag & Drop images here)</p>
        </div>
    </div>
);
