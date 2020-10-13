import React from 'react';
import { useAuth } from '../lib/authentication';
import Loading from './Loading';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/core/styles';


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

const favQuery = gql`
query($user:ID!){
    allDishFavs(where:{user:{id:$user}}){
        dish{
            name
            image
            des
        }
        id
    }
}
`;

const delFav = gql`
mutation($fav:ID!){
  deleteDishFav(id:$fav){
    id
  }
}
`;

const useStyles = makeStyles((theme) => ({
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

const Fav = () => {
    const classes = useStyles();
    const { isAuthenticated, user, isLoading } = useAuth();
    const {loading,error,data} = useQuery(favQuery,{variables:{user:user.id}});
    const [delfav] = useMutation(delFav);
    if(error){
      return(
      <div className="container"><h1>Something went wrong :(</h1></div>
      );
    }
    if(isLoading){
        return(<Loading/>)
    }
    if(!isAuthenticated){
    return(
        <div className="container"><h1>Please logIn to see your favourites</h1></div>   
    );
    }
    if(loading){
      return(<Loading/>)
      } 
      if(data.allDishFavs.length===0){
       return(<div className="container"><h1>Add some Favourites!</h1></div>);
     }
    //  console.log(data);
     const favRender = data.allDishFavs.map((dish)=>{
        return(
          <div className="col-12 col-md-4 mt-3">
          <Card className={classes.root} raised>
          <CardHeader
            title={dish.dish.name}/>
          <CardMedia
            className={classes.media}
            image={dish.dish.image}
            title={dish.dish.name}
          />
          <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {dish.dish.des}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
          <IconButton aria-label="share">
              <FavoriteIcon onClick={()=>{
                delfav({variables:{fav:dish.id}});
                location.reload();
              }}/>
            </IconButton>
            <MyButton  size="small" color="primary"  className="ml-auto">
              Recipe
            </MyButton>
            </CardActions>
        </Card>
        </div>
        );
      });
    return(
        <div className="container">
        <h1>Here are your Favourite Dishes!</h1>
            <div className="row">
            {favRender}
            </div>
        </div>
    );
};

export default Fav;