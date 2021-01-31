import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import AvatarEditor from 'react-avatar-editor'
import { Slider } from "react-semantic-ui-range"

const ImageEditor = ({ imgUrl, saveAfterChange }) => {
    const [scale, setScale] = useState(1.2);
    //const [simulatedEvent, setSimulatedEvent ] = useState(document.createEvent("MouseEvent"));

    const settings = {
        start: 1.2,
        min: 1,
        max: 2,
        step: 0.01,
        onChange: value => {
            setScale(value);
        }
    };

    const simulatedEvent = document.createEvent("MouseEvent");

    const touchHandler = (event) => {
        event.preventDefault()
        var touches = event.changedTouches,
            first = touches[0],
            type = "mousemove";
        
        simulatedEvent.initMouseEvent(type, true, true, window, 1,
            first.screenX, first.screenY,
            first.clientX, first.clientY, false,
            false, false, false, 0, null);

        first.target.dispatchEvent(simulatedEvent);
    }

    const imageRef = useRef();

    const onImageChange = () => {
        const canvas = imageRef.current.getImage().toDataURL();
        fetch(canvas)
            .then(res => res.blob())
            .then(blob => saveAfterChange(window.URL.createObjectURL(blob)));
    }

    const onImageReady = (event) => {
        if (imageRef && imageRef.current) {
            ReactDOM.findDOMNode(imageRef.current).addEventListener("touchmove", touchHandler);
        }
        const canvas = imageRef.current.getImage().toDataURL();
        fetch(canvas)
            .then(res => res.blob())
            .then(blob => saveAfterChange(window.URL.createObjectURL(blob)));
    }

    return (
        <>
            <AvatarEditor className="image-editor"
                ref={imageRef}
                onImageChange={onImageChange}
                onImageReady={onImageReady}
                image={imgUrl}
                borderRadius={150}
                color={[200, 200, 200, 0.6]} // RGBA
                scale={scale}
                rotate={0}
            />
            <Slider value={scale} color="blue" settings={settings} />
        </>
    )
}

export default ImageEditor
