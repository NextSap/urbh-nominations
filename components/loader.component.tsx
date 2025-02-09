import React from 'react';
import {Spinner} from "@heroui/spinner";

const LoaderComponent = () => {
    return (
        <div className="h-[100vh] flex flex-col gap-3 justify-center items-center">
            <p>Data are loading...</p>
            <Spinner/>
        </div>
    );
};

export default LoaderComponent;