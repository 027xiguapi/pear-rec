import { useContext } from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import { ImgListContext } from './imgListContext';

const ImgKonva = (props) => {
  const { imgList, setImgList } = useContext(ImgListContext);
  const [image, status] = useImage(props.url, 'anonymous');
  // const [width, setWidth] = useState<any>(window.innerWidth);
  // const [height, setHeight] = useState<any>(window.innerHeight);

  if (status == 'loaded') {
    // let img = {
    //   width: image.width,
    //   height: image.height,
    //   url: props.url,
    // };
    // console.log(img);
    // setImgList(img);
    // let _height = (image.height * image.width) / window.innerWidth;
    // setHeight(_height);
  }

  return <Image image={image} x={0} y={0 + props.index * props.move} />;
};

export default ImgKonva;
