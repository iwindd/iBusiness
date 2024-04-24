import { Star } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { debounce } from 'lodash';
import React, { useEffect } from 'react'

const Favorite = (props: {
  onChange: (state: boolean) => void,
  default: boolean
}) => {
  const [isFavorite, setFavorite] = React.useState<boolean>(props.default);
  const [FavCache, setFavCache] = React.useState<boolean>(props.default);

  const onFavorite = () => {
    setFavorite(!isFavorite);
  }

  useEffect(() => {
    const debouncedFunction = debounce(() => {
      if (FavCache == isFavorite) return;

      setFavCache(isFavorite);
      props.onChange(isFavorite);
    }, 100);

    debouncedFunction();

    return () => {
      debouncedFunction.cancel();
    };
  }, [isFavorite]);

  return (
    <IconButton onClick={onFavorite} color={isFavorite ? "primary" : "secondary"}>
      <Star />
    </IconButton>
  )
}

export default Favorite