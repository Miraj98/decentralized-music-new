import React from  'react'
import { Box, Heading, Button, Text, TextInput } from 'grommet'
import { addToIpfs } from '../utils/ipfs'
import { connect } from 'react-redux'
import './Upload.css'

function isNumeric(value) {
    return /^-{0,1}\d+$/.test(value);
}

class Upload extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            files: [],
            fileBuffer: null,
            ipfsHash: null,
            price: '',
        };
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
        const ipfsHash = await addToIpfs(this.state.fileBuffer)
        this.setState({ ipfsHash })
    }

    submitOnChain = () => {
        console.log("This is being p[ressed!")
        this.props.contract.methods.addSong(this.state.ipfsHash, this.state.price).send({ from: this.props.accounts[0] })
        .then(response => {
            console.log(response.transactionHash)
            this.props.closeModal()
        })
        // .then(json => {
        //     if(json.events.songAdded.type === 'mined') {
        //         return fetch("http://localhost:8151/derive_policy_encrypting_key/" + json.events.songAdded.returnValues.songId)
        //     } else return -1
        // })
        // .then(policy_return => {
        //     if(policy_return !== -1) return policy_return.json()
        // })
        // .then(console.log)
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
            <form style={{ padding: '0.5em' }} onSubmit={this.onSubmit}>
                <input type='file' onChange={this.captureFile} />
                <Button type="submit" primary label="Submit" hoverIndicator='background' />
            </form>
          );
        }
    }

    render() {
        console.log(this.state.fileBuffer)
        if(this.state.ipfsHash === null) {
            return (
                <Box pad='large' justify='center' align='center'>
                    <div className="Upload">
                        <Heading level={2}>Upload Files</Heading>
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
        } else {
            return (
                <Box pad='large' justify='center'>
                    <Text weight='bold'>IPFS Hash of content</Text>
                    <Text>{this.state.ipfsHash}</Text>
                    <Text margin={{ top: 'medium' }} weight='bold'>Active wallet</Text>
                    <Text>{this.props.accounts[0]}</Text>
                    <Text margin={{ top: 'medium', bottom: 'xsmall' }} weight='bold'>Set a price in wei</Text>
                    <TextInput
                        placeholder='0'
                        value={this.state.price}
                        onChange={event => isNumeric(event.target.value) ? this.setState({ price: event.target.value }) : this.state.price}
                    />
                    <Box pad={{ top: 'medium' }} direction='row' justify='end'>
                        <Button onClick={this.submitOnChain} primary label='Put this on Ethereum' />
                    </Box>
                </Box>
            )
        }
    }
}

const mapStateToProps = state => ({
    accounts: state.accounts,
    contract: state.contract,
    web3: state.web3
})

export default connect(mapStateToProps)(Upload)