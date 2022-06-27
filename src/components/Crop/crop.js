import React, {useState} from "react";
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

function CropDemo({ src }) {
    const [crop, setCrop] = useState()
    return (
      <ReactCrop crop={crop} onChange={c => setCrop(c)}>
        <img src={src} />
      </ReactCrop>
    )
  }

  export default CropDemo;