// src/components/GalleryCard.js
import * as React from "react";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { cn } from "../../lib/utils";

const GalleryCard = ({ image }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={cn("gallery-card")} style={{ height: "300px" }}>
        <img
          src={image}
          className="img-fluid"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div className="gallery-content">
          <button
            type="button"
            className="img-popup"
            onClick={() => setOpen(true)}
            aria-label="open image"
          >
            <img src={image} className="img-fluid sr-only" alt="" />
            <i className="fal fa-plus"></i>
          </button>
        </div>
      </div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: image }]}
      />
    </>
  );
};

export default GalleryCard;