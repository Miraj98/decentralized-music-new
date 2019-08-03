import React from  'react'
import { Box } from 'grommet'
import { addToIpfs } from '../utils/ipfs'
import './Upload.css'

class Upload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          files: [],
          uploading: false,
          uploadProgress: {},
          successfullUploaded: false,
          fileBuffer: null
        };
    
        this.onFilesAdded = this.onFilesAdded.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        // this.sendRequest = this.sendRequest.bind(this);
        this.renderActions = this.renderActions.bind(this);
    }

    onFilesAdded(files) {
        this.setState(prevState => ({
            files: prevState.files.concat(files)
        }));
    }

    captureFile = (event) => {
        console.log("capturing file...")
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({fileBuffer: Buffer(reader.result)})
        }
    }

    onSubmit = async (event) => {
        event.preventDefault()
        console.log("on submit pressed")
        const hash = await addToIpfs(this.state.fileBuffer)
        console.log(hash)
    }

    renderActions() {
        if (this.state.successfullUploaded) {
          return (
            <button
              onClick={() =>
                this.setState({ files: [], successfullUploaded: false })
              }
            >
              Clear
            </button>
          );
        } else {
          return (
            // <button
            //   disabled={this.state.files.length < 0 || this.state.uploading}
            //   onClick={this.uploadFiles}
            // >
            //   Upload
            // </button>
            <form onSubmit={this.onSubmit}>
                <input type='file' onChange={this.captureFile} />
                <input type="submit" />
            </form>
          );
        }
    }

    async uploadFiles() {
        this.setState({ uploadProgress: {}, uploading: true });
        const promises = [];
        this.state.files.forEach(file => {
          promises.push(this.sendRequest(file));
        });
        try {
          await Promise.all(promises);
          this.setState({ successfullUploaded: true, uploading: false });
        } catch (e) {
          // Not Production ready! Do some error handling here instead...
          this.setState({ successfullUploaded: true, uploading: false });
        }
      }

    render() {
        console.log(this.state.fileBuffer)
        return (
            <Box pad='medium' justify='center' align='center'>
                <div className="Upload">
                    <span className="Title">Upload Files</span>
                    <div className="Content">
                    <div>
                    </div>
                    <div className="Files">
                        {this.state.files.map(file => {
                        return (
                            <div key={file.name} className="Row">
                            <span className="Filename">{file.name}</span>
                            </div>
                        );
                        })}
                    </div>
                    </div>
                    <div className="Actions">
                        {this.renderActions()}
                    </div>
                </div>
            </Box>
        )
    }
}

export default Upload