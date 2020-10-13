/** @jsx jsx */
import { useQuery,gql, useLazyQuery } from '@apollo/client';
import getConfig from 'next/config';
import { jsx } from '@emotion/core';
import { useState } from "react";
import Link from 'next/link';
import Navbar from '../components/navbar';
import Footer from '../components/Footer';
import Meta from '../components/Meta';
import Jumbo from '../components/Jumbotron';
import Loading from '../components/Loading';
// import { useQuery, gql, useMutation } from '@apollo/client';

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { red } from '@material-ui/core/colors';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';


const FetchFeatured = gql`
query{  
  allFeaturedRecipes{
    dish{
      name
      image{
        publicUrl
      }
      type
      id
    }
  }
}
 `;

 const images = [
  {
    url: '/static/path/bread.png',
    title: 'Indian Breads',
    width: '30%',
    type:'breads'
  },
  {
    url: '/static/path/fast.png',
    title: 'Fast Food',
    width: '30%',
    type:'fastfood'
  },
  {
    url: '/static/path/main.png',
    title: 'Main Course',
    width: '30%',
    type:'maincourse'
  },
  {
    url: '/static/path/dessert.png',
    title: 'Dessert',
    width: '30%',
    type:'dessert'
  },
  {
    url: '/static/path/starters.png',
    title: 'Starters',
    width: '30%',
    type:'starters'
  },
  {
    url: '/static/path/sweets.png',
    title: 'Sweets',
    width: '30%',
    type:'sweets'
  },
];

const { publicRuntimeConfig } = getConfig();

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 370,
    minHeight: 400,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    margin: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const useStylesType = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: 300,
    width: '100%',
  },
  image: {
    position: 'relative',
    margin: '10px',
    height: 200,
    [theme.breakpoints.down('xs')]: {
      width: '100% !important', // Overrides inline-style
      height: 100,
    },
    '&:hover, &$focusVisible': {
      zIndex: 1,
      '& $imageBackdrop': {
        opacity: 0.15,
      },
      '& $imageMarked': {
        opacity: 0,
      },
      '& $imageTitle': {
        border: '4px solid currentColor',
      },
    },
  },
  focusVisible: {},
  imageButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.common.white,
  },
  imageSrc: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center 40%',
  },
  imageBackdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.palette.common.black,
    opacity: 0.4,
    transition: theme.transitions.create('opacity'),
  },
  imageTitle: {
    position: 'relative',
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(1) + 6}px`,
  },
  imageMarked: {
    height: 3,
    width: 18,
    backgroundColor: theme.palette.common.white,
    position: 'absolute',
    bottom: -2,
    left: 'calc(50% - 9px)',
    transition: theme.transitions.create('opacity'),
  },
}));

const Home = ({ now }) => {
  const { meetup } = publicRuntimeConfig;
  const {loading,error,data} = useQuery(FetchFeatured);
  const classes = useStyles();
  const classesType = useStylesType();

  if(loading){
    return(
      <Loading/>
    );
  }

  if(error){
    return(<div><h1>Something went wrong :(</h1></div>);
  }

  const RenderFeatured = data.allFeaturedRecipes.map((dish)=>{
    return(
      <div className="col-12 col-md-4 m-2">
      <Card className={classes.root}>
      <CardHeader
        title={dish.dish.name}
        subheader={dish.dish.type}
      />
      <CardMedia
        className={classes.media}
        image={dish.dish.image.publicUrl}
        title={dish.dish.name}
      />

      <CardActions className="justify-content-center mt-4">        
        <Button variant="contained" color="secondary" href={`/recipes/${dish.dish.id}`}>
        Recipe
      </Button>
      </CardActions>
      </Card>
      </div>
    );
  });

  const RenderCategories = () => {
    return(
      <div>
      <div className={classesType.root}>
      {images.map((image) => (
        <Link href={`/types/${image.type}`}><ButtonBase
          focusRipple
          key={image.title}
          className={classesType.image}
          focusVisibleClassName={classes.focusVisible}
          style={{
            width: image.width,
          }}
        >
          <span
            className={classesType.imageSrc}
            style={{
              backgroundImage: `url(${image.url})`,
            }}
          />
          <span className={classesType.imageBackdrop} />
          <span className={classesType.imageButton}>
            <Typography
              component="span"
              variant="subtitle1"
              color="inherit"
              className={classesType.imageTitle}
            >
              {image.title}
              <span className={classesType.imageMarked} />
            </Typography>
          </span>
        </ButtonBase></Link>
      ))}
    </div>
      </div>
    );
  }

  return (
    <div>
      <Meta titleExclusive={meetup.name} description={meetup.intro} />
      <Navbar />
      <Jumbo/>
      <h1 className="d-flex justify-content-center">Our Featured recipes</h1>
      <div className="container">
      <div className="d-flex justify-content-center">  
        {RenderFeatured}
      </div>
      </div>
      <hr/>
      <h1 className="d-flex justify-content-center">Browse Recipes</h1>
      <div className="container">
      <div className="offset-1 justify-content-center">
        <RenderCategories />
      </div>
      </div>
      <Footer />
    </div>
  );
};


export default Home;

