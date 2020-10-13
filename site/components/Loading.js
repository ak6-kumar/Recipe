import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function Loading() {
  const classes = useStyles();

  return (
    <div className="container">
        <div className="d-flex justify-content-center align-items-center ">
      <div className={classes.root}>
      <CircularProgress />
    </div>
    </div>
    </div>
  );
}