import { FC } from "react";
import { Slide } from "react-slideshow-image";

import "react-slideshow-image/dist/styles.css";
import styles from "./ProductSlideShow.module.css";

interface Props {
  images: string[];
}

export const ProductSlideShow: FC<Props> = ({ images }) => {
  return (
    <Slide easing="ease" duration={7000} indicators={true}>
      {images.map((image, index) => {
        return (
          <div className={styles["each-slide"]} key={index}>
            <div
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
              }}
            ></div>
          </div>
        );
      })}
    </Slide>
  );
};
