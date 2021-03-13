import { FC } from 'react';

interface DisplayUserPhotoProps {
  photo: string;
  _id: string;
}

const DisplayUserPhoto: FC<DisplayUserPhotoProps> = ({ photo, _id }) => {
  // If user doesn't have photo then render default photo
  if (photo === process.env.REACT_APP_NO_PHOTO_FILE)
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
        <img
          key={photo}
          style={{ width: 200, height: 200 }}
          alt={photo}
          src={`${process.env.REACT_APP_API_URL}/uploads/users/${photo}`}
        />
      </>
    );
};

export default DisplayUserPhoto;
