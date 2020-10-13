import Navbar from '../components/Navbar';
import Meta from '../components/Meta';
import Favourites from '../components/fav';
import {useAuth} from '../lib/authentication';
import Footer from '../components/Footer';
import Jumbo from '../components/Jumbotron';



export default function Fav(){
    const { isAuthenticated, user, isLoading } = useAuth();
    if(!isAuthenticated){
            return (
                <div className="container">
                    Please Login to view your Favourites!
                </div>
            );
    }
    return(
        <div>
        <Meta title="Favourites" description="Current user's fav dishes"/>
        <Navbar/>
        <Jumbo/>
        <Favourites/>
            <div style={{bottom: "0",width: "100%"}}>
            <Footer/>
            </div>
          </div>
    );
}