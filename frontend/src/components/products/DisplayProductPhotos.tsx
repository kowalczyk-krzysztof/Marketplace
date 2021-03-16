import { FC, Fragment } from 'react';

interface DisplayProductPhotosProps {
  photos: string[];
  _id: string;
}

const DisplayProductPhotos: FC<DisplayProductPhotosProps> = ({
  photos,
  _id,
}): JSX.Element => {
  if (photos.length === 0)
    return (
      <Fragment>
        <img
          key="no image"
          style={{ width: 200, height: 200 }}
          alt="no_image.jpg"
          src={`${process.env.REACT_APP_API_URI}/${process.env.REACT_APP_NO_PHOTO_FILE}`}
          crossOrigin="anonymous"
        />
      </Fragment>
    );
  else
    return (
      <Fragment>
        {photos.map((photo: string) => {
          return (
            <img
              key={photo}
              style={{ width: 200, height: 200 }}
              alt={photo}
              src={`${process.env.REACT_APP_API_URI}/uploads/products/${_id}/${photo}`}
              crossOrigin="anonymous"
            />
          );
        })}
      </Fragment>
    );
};

export default DisplayProductPhotos;
