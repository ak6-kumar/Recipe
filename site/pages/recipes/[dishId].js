import React,{useState} from 'react';
import { useAuth } from '../../lib/authentication';
import { useRouter } from 'next/router'
import CssBaseline from '@material-ui/core/CssBaseline';
import { useQuery, gql, useMutation } from '@apollo/client';
import Navbar from '../../components/Navbar';
import Link from 'next/link';
// import Jumbo from '../../components/Navbar'
import Footer from "../../components/Footer";
import Loading from '../../components/Loading';
import Image from 'react-bootstrap/Image';
import ReactMarkdown from 'react-markdown';
import Rating from '@material-ui/lab/Rating';
import ReactDOM from 'react-dom';
import Draggable from "react-draggable";
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button'
import Drag from '../../components/drag';
import AlarmIcon from '@material-ui/icons/Alarm';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import CreateIcon from '@material-ui/icons/Create';

const fetchRecipe = gql`
query($id:ID!){
  allRecipes(where:{dish:{id:$id}}){
	title
    des
    id
    prep{
      steps
      stepno
    }
    timeP
    timeM
    timeT
    submittedby{
      name
    }
    dish{
      image{
        publicUrl
      }
    }
  }
}
`;

const RecipeRating = gql`
mutation($user:ID!,$recipe:ID!,$valueF:Int!,$valueI:Int!,$valueT:Int!,$valueD:Int!,$valueO:Int!){
  createRecipeRating(data:{
    user:{connect:{id:$user}}
    recipe:{connect:{id:$recipe}}
    ratingF:$valueF
    ratingI:$valueI
    ratingT:$valueT
    ratingD:$valueD
    ratingO:$valueO
  }){
    id
  }
}
`;


export default function Recipe(){
    const router = useRouter();
    const id = router.query;
    const { isAuthenticated, user, isLoading } = useAuth();
    const {loading,error,data} = useQuery(fetchRecipe,{variables:{id:id.dishId}});
    const [RRating] = useMutation(RecipeRating)
    // console.log(router.query);
    // console.log(id.dishId );
    const [valueF, setValueF] = useState(0);
    const [valueI, setValueI] = useState(0);
    const [valueT, setValueT] = useState(0);
    const [valueD, setValueD] = useState(0);
    const [valueO, setValueO] = useState(0);
    
    if(loading){
      return(<Loading/>);
    }
    if(error){
      // var err = new Error(error);
      console.log(error);
      return(<div><h1>Something went wrong :({error.message}</h1></div>)
    }
    // console.log(data.allRecipes[0].dish.image);
    if(!data.allRecipes.length){
      return(<div><h1>Add some recipes for the dish</h1></div>);
    }
    // console.log();

    const RenderRating = (recipeid) =>{
      if(!isAuthenticated){
        return(<div className="container mt-3"><h3>Please login to give us rating!</h3></div>);
      }
      else{
      return(
        <div className="container mt-3">
        <div >
      <Accordion expanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography ><h6>We're still new mind to give us rating?</h6></Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <div className="row">
          <div className="col-6">
              <h6>How easy was the recipe to follow</h6>
              </div>
              <div className="col-6">
              <Rating
              name="Follow Rating"
              value={valueF}
              onChange={(event, newValueF) => {
                setValueF(newValueF);
                event.preventDefault();
              }}
            />
              </div>
              <div className="col-6">
              <h6>How easy were the ingrediants to find</h6>
              </div>
              <div className="col-6">
              <Rating
              name="Ingrediants Rating"
              value={valueI}
              onChange={(event, newValueI) => {
                setValueI(newValueI);
                event.preventDefault();

              }}
            />
              </div>
              <div className="col-6">
              <h6>Did the process take longer than specified</h6>
              </div>
              <div className="col-6">
              <Rating
              name="Time Rating"
              value={valueT}
              onChange={(event, newValueT) => {
                setValueT(newValueT);
                event.preventDefault();

              }}
            />
              </div>
              <div className="col-6">
              <h6>How was the taste of the dish that you prepared</h6>
              </div>
              <div className="col-6">
              <Rating
              name="Taste Rating"
              value={valueD}
              onChange={(event, newValueD) => {
                setValueD(newValueD);
                event.preventDefault();

              }}
            />
              </div>
              <div className="col-6">
              <h6>Overall Rating to the Recipe</h6>
              </div>
              <div className="col-6 ">
              <Rating
              name="Overall Rating"
              value={valueO}
              onChange={(event, newValueO) => {
                setValueO(newValueO);
                event.preventDefault();
              }}
            />
              </div>
          </div>
          <div className='ml-auto'>
          <Button color="primary" variant="outlined" onClick={()=>{
            console.log(recipeid);
            RRating({variables:{user:user.id,recipe:recipeid.recipeid,valueF:valueF,valueI:valueI,valueT:valueT,valueD:valueD,valueO:valueO}});
            alert("Thank you for your time!\nYour Rating has been submitted!")
          }}>Submit</Button>
        </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
          </div>
      );
              }
    }

    const RenderSteps = data.allRecipes.map((recipe)=>{
      return(
        <p>{recipe.prep.steps}</p>
      );
    })

    const RenderRecipe = data.allRecipes.map((recipe)=>{
      return(
        <>
        <div>
      <div className="container mt-2">
      <div className="d-flex justify-content-center">
      <Image src={recipe.dish.image.publicUrl} alt="error" />
      </div>
      </div>
        <div className="container"> 
        <h1>{recipe.title}</h1>
        <p className='col'>Submitted by - {recipe.submittedby.name}</p>
        
       </div>
        </div>
        <div className="container">
        <div className="d-flex   justify-content-center"> 
        <Button
        variant="contained"
        className="m-2"
        color="secondary"
        
        startIcon={< AlarmIcon/>}
      >
        Time in preparation {recipe.timeP}min
      </Button>
      <Button
        variant="contained"
        color="secondary"
        className="m-2"
        startIcon={< AlarmIcon/>}
      >
        Time in Making {recipe.timeM}min
      </Button> 
      <div className="offset-1">
      <Button
        variant="contained"
        color="secondary"
        className="m-2"
        startIcon={< AlarmIcon/>}
      >
        Total Time {recipe.timeT}min
      </Button>
      </div>
        </div>
        </div>
        <RenderRating recipeid={recipe.id}/>
        </>
      );
    });

    const RenderEdit = () => {
      return(
        <>
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="add"
          style={{ position: 'fixed',
            bottom: '23px',
            right: '0px',
           }}
        >
          <CreateIcon />
          Add your own Recipe
        </Fab>
        </>
      );
    }


    return(
        <>
        <Navbar/>
        <CssBaseline />
        {RenderRecipe}
       <Link href="/recipes/edit"><RenderEdit/></Link>
        <Footer/>
        </>
    );
}