import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { UserPlus, UserCheck } from 'lucide-react';

const FollowButton = ({ initialIsFollowing = false }) => {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

    const toggleFollow = () => {
        setIsFollowing(!isFollowing);

    };

    return (
        <Button
            variant={isFollowing ? "outline" : "default"}
            size="sm"
            onClick={toggleFollow}
            className={isFollowing ? "text-muted-foreground" : ""}
        >
            {isFollowing ? (
                <>
                    <UserCheck size={16} className="mr-2" />
                    Following
                </>
            ) : (
                <>
                    <UserPlus size={16} className="mr-2" />
                    Follow
                </>
            )}
        </Button>
    );
};

export default FollowButton;
