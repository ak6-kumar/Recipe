import React from 'react';
import { useContext, createContext, forwardRef } from 'react';
import getConfig from 'next/config';
import { jsx } from '@emotion/core';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../lib/authentication';
import Meta from './Meta';

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
import Loading from './Loading';
import Rating from '@material-ui/lab/Rating';



// import Button from '@material-ui/core/Button';

import { useQuery, gql, useMutation } from '@apollo/client';

const MyButton = styled(Button)({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
});

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStylesM = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


const DishQuery = gql`
query{
  allDishes{
    name
    image{
      publicUrl
    }
    des
    id
  }
}
`;

const AddToFav = gql`
mutation AddFav($user:ID!,$dish:ID!){
  createDishFav(data:{
    user:{connect:{id:$user}}
    dish:{connect:{id:$dish}}
  }){
	id
  }
}
`;

const DishRating = gql`
mutation($user:ID!,$dish:ID!,$value:Int!){
  createDishRating(data:{
    user:{connect:{id:$user}}
    dish:{connect:{id:$dish}}
    rating:{value:$value}
  }){
	id
  }
}
`;


const useStylesC = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    minHeight:550,
    maxHeight:600
  },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
}));


const Menu = () => {
  const classesC = useStylesC();
  const { isAuthenticated, user, isLoading } = useAuth();
  const {loading,error,data} = useQuery(DishQuery);
  const [AddFav] = useMutation(AddToFav);
  const classesM = useStylesM();
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [value, setValue] = React.useState(0);

  const body = (
    <div style={modalStyle} className={classesM.paper}>
      <h2 id="simple-modal-title">Share</h2>
      <div className="container">
      <div className="row">
      <div className="fb-share-button m-1" data-href="https://developers.facebook.com/docs/plugins/" data-layout="button_count" data-size="small"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore"><FacebookIcon fontSize="large"/>{'  '}</a></div>
      <a href="https://twitter.com/intent/tweet?button_hashtag=spruceeats&ref_src=twsrc%5Etfw" className="twitter-hashtag-button m-1" data-show-count="false" ><TwitterIcon fontSize="large"/></a>
      <LinkedInIcon color="primary" fontSize="large"/>
      <a href="mailto:ak090400@gmail.com"><EmailIcon fontSize="large" color="error" /></a>
      </div>
      </div>
      </div>
  );


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  if(!isAuthenticated){
    return(<div><h1>Please Log in to see our world famous cusine!</h1></div>)
  }
  if(loading){
    return(<Loading/>)   
  } 
   if(error){
    //  var err = new Error("Something went wrong");
     return(
     <div><h1>Something went wrong :(</h1></div>
     );
   }
   if(!data){
    return(<div><h1>Add some dishes!</h1></div>);
  }
   const VegDishRender = data.allDishes.map((dish)=>{
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
        <IconButton aria-label="add to favorites">
            <FavoriteBorderIcon onClick={async ()=>{
              try{
              await AddFav({variables:{user:user.id,dish:dish.id}});
              alert(dish.name+" has been added to your favourites!");
              }
              catch(err){
                alert("Dish already present\n"+err);
              }
            }}/>
        </IconButton>
        <IconButton>
        <ShareIcon type="button" onClick={handleOpen}/>
        </IconButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
       <MyButton  color=" " variant="outlined" className="ml-auto" href={`/recipes/${dish.id}`}>
          Recipe
        </MyButton>
        </CardActions>
        <CardActions className="justify-content-center"> 
      </CardActions>
    </Card>
    </div>
    );
  });

  
  return (
    <div>
    <h1 className="offset-1">Our Menu</h1>
    <br/>
      <div className="container">
      <div className="row">
        {VegDishRender}
      </div>
      </div>
      </div>
    );
  };
export default Menu;


