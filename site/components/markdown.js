import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

class Markdown extends React.Component {
  handleEditorChange = (content, editor) => {
    console.log('Content was updated:', content);
  }

  render() {
    return (
      <Editor
        apiKey='ts5nzuoo54qo8te5kj7ruqnngxhlf5an1tyzjkrinu9wdgik'
        initialValue="<p>This is the initial content of the editor</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help'
        }}
        onEditorChange={this.handleEditorChange}
      />
    );
  }
}

export default Markdown;
