import React, {
  DragEvent,
  useRef,
  useState,
  MouseEvent,
  useEffect,
} from "react";
import "./../styles/Home.scss";

type Props = {};

interface ScrollEventTarget extends EventTarget {
  scrollTop: number;
  clientHeight: number;
  scrollHeight: number;
  innerHeight: number;
}

export default (props: Props) => {
  const {} = props;
  const homeRef = useRef();
  const [context, setContext] = useState<any>();
  const [imgObj, setImgObj] = useState<any>();
  const frameCount = 122;

  const currentFrame = (index: number) => {
    return `galaxy/ga/galaxy-${index.toString().padStart(3, "0")}.jpg`;
  };

  useEffect(() => {
    const canvas: any = document.getElementById("canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    setContext(ctx);

    const preloadImages = () => {
      for (let i = 1; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
      }
    };

    const img = new Image();
    img.src = currentFrame(1);
    canvas.width = 1920;
    canvas.height = 1080;
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
    setImgObj(img);

    const homeEle: any = homeRef.current;
    if (!homeEle) return;

    preloadImages();
  }, []);

  const updateImage = (index: number) => {
    if (!imgObj || !context) return;
    imgObj.src = currentFrame(index);
    context.drawImage(imgObj, 0, 0);
  };

  const onScroll = (eventTarget: any) => {
    if (!eventTarget) return;
    const scrollTop = eventTarget.scrollTop;
    const maxScrollTop = eventTarget.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    const frameIndex = Math.min(
      frameCount - 1,
      Math.ceil(scrollFraction * frameCount)
    );
    requestAnimationFrame(() => updateImage(frameIndex + 1));
  };
  return (
    <div className="home_container" onScroll={(e) => onScroll(e.target)}>
      <div className="wrap">
        <div className="mask">
          <canvas className="canvas" id="canvas"></canvas>
        </div>
      </div>
    </div>
  );
};
