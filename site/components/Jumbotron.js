import {
    Jumbotron,
  } from 'reactstrap';

  export default function Jumbo(){
      return(
    <div>
    <Jumbotron>
      <h1 className="display-3">Recipes.com</h1>
      <p className="lead"></p>
      <hr className="my-2" />
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
      <p className="offset-1"></p>
    </Jumbotron>
  </div>
      );}