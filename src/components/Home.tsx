import React, {
  DragEvent,
  useRef,
  useState,
  MouseEvent,
  useEffect,
} from "react";
import "./../styles/Home.scss";
import { initializeApp } from "firebase/app";
import * as firebase from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

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
  // console.log("ref", ref);
  const firebaseConfig = {
    apiKey: "AIzaSyAT6HulJrCrNuuVzRUXqNF5flg8CuM746I",
    authDomain: "scrollingframes.firebaseapp.com",
    projectId: "scrollingframes",
    storageBucket: "scrollingframes.appspot.com",
    messagingSenderId: "1148924997",
    appId: "1:1148924997:web:bb1c9af91d94de1986df2c",
    measurementId: "G-9GJJ48DWKH",
  };
  // const database = firebase.database();
  // const database = firebase.database();
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  // const storage = getStorage(app);
  // console.log("storage", storage);
  const storage = getStorage(app);
  console.log("storage", storage);
  const storageRef = ref(storage);
  console.log("storageRef", storageRef);
  const imagesRef = ref(storageRef, "images");
  console.log("imagesRef", imagesRef);
  const fileName = "galaxy-001.jpg";
  const spaceRef = ref(imagesRef, fileName);
  const path = spaceRef.fullPath;
  console.log("path", path);
  const listRef = ref(storage, "images");
  console.log("listRef", listRef);
  // var storageRef = firebase.storage().ref("your_folder");
  useEffect(() => {
    // Find all the prefixes and items.
    listAll(storageRef)
      .then((res) => {
        console.log("res", res);
        res.prefixes.forEach((folderRef) => {
          console.log("folderRef", folderRef);
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
        });
        res.items.forEach((itemRef) => {
          console.log("itemRef", itemRef);
          // All the items under listRef.
        });
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  }, [storageRef]);

  const currentFrame = (index: number) => {
    return `galaxy/galaxy-${index.toString().padStart(3, "0")}.jpg`;
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
          {/* <img src="https://firebasestorage.googleapis.com/v0/b/scrollingframes.appspot.com/o/images%2Fgalaxy-001.jpg?alt=media&token=fcd5993a-767d-44fc-883c-42d409ec48a7"></img> */}
        </div>
      </div>
    </div>
  );
};
