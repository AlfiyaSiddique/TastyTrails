import { faL } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useRef } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa';

const ShareComponent = ({ url, setShareOption, shareOption }) => {

    const shareRef = useRef(null);

    const handleOutsideClick = (event) => {
        if (shareRef.current && !shareRef.current.contains(event.target)) {
            setShareOption(false);
        }
    };

    useEffect(() => {
        // Add event listener for clicks outside the share component
        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            // Cleanup the event listener when the component unmounts
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const shareToFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        setShareOption(false)
    };

    const shareToTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank');
        setShareOption(false)
    };

    const shareToLinkedin = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        setShareOption(false)
    };

    const shareToWhatsapp = () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
        setShareOption(false)
    };

    return (
        <div>
            {shareOption && (
                <div
                    ref={shareRef}
                    className={`fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 transform ${shareOption ? 'translate-y-0' : 'translate-y-full'
                        } transition-transform duration-300`}
                    style={{ zIndex: 999 }}
                >
                    <h3 className="text-center mb-4">Share this content</h3>
                    <h5 className='text-center mb-2'>Link copied to clipboard: {url}</h5>
                    <div className="flex justify-center space-x-5 flex-wrap">

                        <button onClick={shareToFacebook} className="text-blue-600">
                            <FaFacebook size={30} />
                        </button>
                        <button onClick={shareToTwitter} className="text-blue-400">
                            <FaTwitter size={30} />
                        </button>
                        <button onClick={shareToLinkedin} className="text-blue-700">
                            <FaLinkedin size={30} />
                        </button>
                        <button onClick={shareToWhatsapp} className="text-green-500">
                            <FaWhatsapp size={30} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShareComponent;

