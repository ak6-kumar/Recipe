import React,{useState} from 'react';
import Navbar from '../../components/Navbar';
import DragList from '../../components/drag';
import { Form, FormGroup,  FormText } from 'reactstrap';
import { useQuery, gql, useMutation } from '@apollo/client';
import Loading from '../../components/Loading';
import {Input,Label} from '../../primitives/forms';
import { useForm } from "react-hook-form";
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Remove';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import { Editor } from '@tinymce/tinymce-react';
import Footer from '../../components/Footer';
import {css} from '@emotion/core';

const DishQuery=gql`
query{
    allDishes{
        name
    }
}
`;

const StepQuery = gql`
query{
    allRecipeSteps{
      steps
      stepno
    }
  }
`;

export default function Edit(){
    const {loading,error,data} = useQuery(DishQuery);
    const {register,handleSubmit} = useForm();
    const [step,setStep] = useState(1);
    const [value,setValue] = useState(['']);

    const onSubmit = (dt) => {
        console.log(dt);
    }


    if(loading ){
        <Loading/>
    }

    if(error ){
        return(<div><h1>Something went wrong!</h1></div>)
    }
    if(!data){
        return(<div><h3>add</h3></div>)
    }
    const RenderDropdown = data.allDishes.map((dish)=>{
        return(
                <option  value={dish.name}>{dish.name}</option>
        );
    });

    var arr = [];
    for(var i = 1;i<=step;i++){
        arr.push(<div className="row">
            <div className="col-3 m-2">
            <Button
            variant="contained"
            color="secondary"
            >
            {`Step ${i} `}
          </Button>
              <div className="col-1">
                {
                    i===1? <AddIcon onClick={()=>{
                        setStep(step+1);
                    }
                } />
                :
                <div className="col-1">
                <AddIcon onClick={()=>{
                    setStep(step+1);
                }
            } />
            <DeleteIcon onClick={()=>{
                setStep(step-1);
            }}/>
            </div>
                }
              </div>
            </div>
            <div className="col-8"><section
            css={css`
              padding: 0;
              margin: 1rem;
              font-size: 1rem;
              color: #333;
            `}
            dangerouslySetInnerHTML={{ __html: "" }}
          />    </div>
            </div>
            );
    };

    const handleEditorChange = async (content, editor) => {
        setValue(value=>[...value,content]);
        console.log('Content was updated:', content);
        

        await console.log(value[value.length-1]);
      };
      

    
    return(
        <>
        <Navbar/>
        <div className="container">
        <h3 className="md-3">Add your own Recipe and help us grow</h3>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <FormGroup> 
                    <Label for="title" className="col-12">Title of the Recipe</Label>
                    <Input type="text" name="title" id="title" placeholder="title" className="col-6" ref={register}/>    
                </FormGroup>
                <FormGroup>
                    <Label for="des" className="col-12">Give a brief Description of your recipe</Label>
                    <Input type="textarea" name="des" id="des" placeholder="Description" className="col-6" ref={register}/>    
                </FormGroup>
                <FormGroup>
                    <Label for="dish" className="col-12">Dish Name</Label>
                    <select name="dish" className="col-3" ref={register}>
                       {RenderDropdown}
                    </select>    
                </FormGroup>
                <FormGroup>
                    <Label for="timeP" className="col-12">Approx. time for preparation</Label>
                    <Input type="text" name="timeP" id="timeP" placeholder="in minutes" className="col-6" ref={register}/>    
                </FormGroup>
                <FormGroup>
                    <Label for="timeM" className="col-12">Approx. time for making the dish</Label>
                    <Input type="text" name="timeM" id="timeM" placeholder="in minutes" className="col-6" ref={register}/>    
                </FormGroup>
                <FormGroup>
                    <Label for="timeT" className="col-12">Total Time</Label>
                    <Input type="text" name="timeT" id="timeT" placeholder="in minutes" className="col-6" ref={register}/>    
                </FormGroup>
                <FormGroup>
                    <Label for="steps" className="col-12">Mention the steps of the Recipe</Label>
                    <div className="row">
                    <div className="col-7">
                    {arr}
                    </div>
                    <div className="col-5">
                    <Editor
                    apiKey='ts5nzuoo54qo8te5kj7ruqnngxhlf5an1tyzjkrinu9wdgik'
                    init={{
                      height: 400,
                      menubar: false,
                      plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                      ],
                      toolbar:
                        'undo redo | formatselect | image  | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help',

                        image_title: true,
  /* enable automatic uploads of images represented by blob or data URIs*/
  automatic_uploads: true,
  /*
    URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
    images_upload_url: 'postAcceptor.php',
    here we add custom filepicker only to Image dialog
  */
  file_picker_types: 'image',
  /* and here's our custom image picker*/
  file_picker_callback: function (cb, value, meta) {
    var input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    /*
      Note: In modern browsers input[type="file"] is functional without
      even adding it to the DOM, but that might not be the case in some older
      or quirky browsers like IE, so you might want to add it to the DOM
      just in case, and visually hide it. And do not forget do remove it
      once you do not need it anymore.
    */

    input.onchange = function () {
      var file = this.files[0];

      var reader = new FileReader();
      reader.onload = function () {
        /*
          Note: Now we need to register the blob in TinyMCEs image blob
          registry. In the next release this part hopefully won't be
          necessary, as we are looking to handle it internally.
        */
        var id = 'blobid' + (new Date()).getTime();
        var blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        var base64 = reader.result.split(',')[1];
        var blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        /* call the callback and populate the Title field with the file name */
        cb(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  },
  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                      
                    }}
                    onEditorChange={handleEditorChange}
                  />
                    </div>
                    </div>
                </FormGroup>
                <Button type="submit"  variant="contained" color="primary">Submit</Button>
            </Form>
        </div>
        <Footer/>
        </>
    );
}