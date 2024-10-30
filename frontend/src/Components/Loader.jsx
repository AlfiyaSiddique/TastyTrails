import React from 'react'

function Loader() {
    return (
        <div className="w-screen h-screen fixed top-0 left-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
}

export default Loader
