import React from 'react';
import { Play } from 'lucide-react';
import './StreamVideoPlayer.css';

export const StreamVideoPlayer = ({ src, poster, autoplay = false }) => {


    return (
        <div className="stream-player-wrapper">
            <div className="stream-player-container">
                {src ? (
                    <video
                        className="stream-video"
                        src={src}
                        poster={poster}
                        controls
                        autoPlay={autoplay}
                        playsInline
                    />
                ) : (
                    <div className="stream-placeholder">
                        <Play size={48} className="stream-play-icon" />
                        <p>Video Placeholder</p>
                    </div>
                )}
            </div>
        </div>
    );
};
