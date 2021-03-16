import { FC, Fragment } from 'react';

interface DisplayUserPhotoProps {
  photo: string;
}

const DisplayUserPhoto: FC<DisplayUserPhotoProps> = ({
  photo,
}): JSX.Element => {
  // If user doesn't have photo then render default photo
  if (photo === process.env.REACT_APP_NO_PHOTO_FILE)
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
        <img
          key={photo}
          style={{ width: 200, height: 200 }}
          alt={photo}
          src={`${process.env.REACT_APP_API_URI}/uploads/users/${photo}`}
          crossOrigin="anonymous"
        />
      </Fragment>
    );
};

export default DisplayUserPhoto;
