import React from 'react';
import { useContext, createContext, forwardRef } from 'react';
import getConfig from 'next/config';
import { jsx } from '@emotion/core';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/authentication';
import Meta from '../../components/Meta';
import { useQuery, gql, useMutation } from '@apollo/client';
import Navbar from '../../components/Navbar';

import { makeStyles } from '@material-ui/core/styles';
import { styled } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ShareIcon from '@material-ui/icons/Share';
import FacebookIcon from '@material-ui/icons/Facebook';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import EmailIcon from '@material-ui/icons/Email';
import Loading from '../../components/Loading';
import Rating from '@material-ui/lab/Rating';


const MyButton = styled(Button)({
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  });

const FetchDish = gql`
query($type:String!){
    allDishes(where:{type_i:$type}){
        name
        image{
            publicUrl
        }
        type

    }
}
`;

const useStylesC = makeStyles((theme) => ({
    root: {
      maxWidth: 400,
      minHeight:350,
      maxHeight:400
    },
      media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
      },
  }));

export default function MainCourse(){
    
    const classesC = useStylesC();
    const {loading,error,data} = useQuery(FetchDish,{variables:{type:"Main Course"}});
    
    if(loading){
        return(<Loading/>);
    }

    if(error){
        return(<div><h1>Something went wrong! </h1></div>);
    }

    const RenderMainCourse = data.allDishes.map((dish)=>{
        return(
          <div className="col-4 mt-3">
          <Card className={classesC.root} raised>
          <CardHeader
            title={dish.name}
            subheader={dish.type}
          />
          <CardMedia
            className={classesC.media}
            image={dish.image.publicUrl}
            title={dish.name}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {dish.des}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
          <div className="offset-4">
           <MyButton  href={`/recipes/${dish.id}`}>
              Recipe
            </MyButton>
            </div>
            </CardActions>
        </Card>
        </div>
        );
      });

    return(
        <div>
        <Meta titleExclusive="Main Course | Recipes.com"  />
        <Navbar/>
        <h1>Main Course</h1>
        <div className="container">
        <div className="row">
        {RenderMainCourse}
        </div>
        </div>
        </div>
    );
}