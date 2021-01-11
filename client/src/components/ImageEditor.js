import React, {useRef, useState} from 'react'
import AvatarEditor from 'react-avatar-editor'
import { Slider } from "react-semantic-ui-range"

const ImageEditor = ({imgUrl, saveAfterChange}) => {
    const [scale, setScale] = useState(1.2);
 
    const settings = {
        start: 1.2,
        min: 1,
        max: 2,
        step: 0.01,
        onChange: value => {
            setScale(value);
        }
    };

    const imageRef = useRef();

    const onImageChange = () => {
        const canvas = imageRef.current.getImage().toDataURL();
        fetch(canvas)
        .then(res => res.blob())
        .then(blob => saveAfterChange( window.URL.createObjectURL(blob)));
    }

    return (
        <>
        <AvatarEditor
        ref={imageRef}
        onImageChange={onImageChange}
        image={imgUrl}
        width={250}
        height={250}
        border={50}
        color={[255, 255, 255, 0.6]} // RGBA
        scale={scale}
        rotate={0}
      />
      <Slider value={scale} color="blue" settings={settings} />
      </>
    )
}

export default ImageEditor
