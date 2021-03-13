import { FC } from 'react';

interface DisplayProductPhotosProps {
  photos: string[];
  _id: string;
}

const DisplayProductPhotos: FC<DisplayProductPhotosProps> = ({
  photos,
  _id,
}) => {
  if (photos.length === 0)
    return (
      <>
        <img
          key="no image"
          style={{ width: 200, height: 200 }}
          alt="no_image.jpg"
          src={`${process.env.REACT_APP_API_URL}/${process.env.REACT_APP_NO_PHOTO_FILE}`}
        />
      </>
    );
  else
    return (
      <>
        {photos.map((photo: string) => {
          return (
            <img
              key={photo}
              style={{ width: 200, height: 200 }}
              alt={photo}
              src={`${process.env.REACT_APP_API_URL}/uploads/products/${_id}/${photo}`}
            />
          );
        })}
      </>
    );
};

export default DisplayProductPhotos;
