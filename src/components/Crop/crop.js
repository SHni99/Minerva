import React from "react";
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

function CropDemo({ src }) {
    const [crop, setCrop] = useState({
        unit: '%', // Can be 'px' or '%'
        x: 25,
        y: 25,
        width: 50,
        height: 50
      })
    return (
      <ReactCrop crop={crop} onChange={c => setCrop(c)}>
        <img src={src} />
      </ReactCrop>
    )
  }

  export default CropDemo;