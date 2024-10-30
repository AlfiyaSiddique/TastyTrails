import React from 'react'

function Loader() {
    return (
        <div className="w-screen h-screen fixed top-0 left-0 bg-white bg-opacity-850 flex items-center justify-center z-50">
            <div className='text-2xl font-bold text-gray-800 animate-bounce'>Deliciousness loading, please hold...</div>
        </div>
    )
}

export default Loader