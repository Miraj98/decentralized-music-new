import React from 'react'
import { Box, Heading, Button, Layer } from 'grommet'
import { Redirect } from 'react-router-dom'
import { storeContractInstance } from '../redux/actions'
import Upload from '../components/Upload'
import { connect } from 'react-redux'

class FirstScreen extends React.Component {

    state = {
        showUploadModal: false,
        isBrowseClicked: false
    }

    closeModal = () => {
        this.setState({ showUploadModal: false })
    }

    render() {
        console.log(this.props)
        if(this.state.isBrowseClicked) return <Redirect to="/browse" />
        return (
            <Box fill align='center' justify='center'>
                <Box>
                    <Heading level={2}>Let's get started!</Heading>
                </Box>
                <Box margin='small' direction='row'>
                    <Box pad='small'>
                        <Button
                            label='Publish music'
                            primary
                            hoverIndicator='background'
                            onClick={() => this.setState({ showUploadModal: true })}
                        />
                        {
                            this.state.showUploadModal && (
                                <Layer
                                    onEsc={() => this.setState({ showUploadModal: false })}
                                    onClickOutside={() => this.setState({ showUploadModal: false })}
                                >
                                    <Upload closeModal={this.closeModal} />
                                </Layer>
                            )
                        }
                    </Box>
                    <Box pad='small'>
                        <Button
                            label='Browse music'
                            primary
                            hoverIndicator='background'
                            onClick={() => this.setState({ isBrowseClicked: true })}
                        />
                    </Box>
                </Box>
            </Box>
        )
    }
}

const mapStateToProps = state => ({
    _web3: state.web3,
    _contract: state.contract,
    _accounts: state.accounts
})

const mapDispatchToProps = {
    storeContractInstance
}

export default connect(mapStateToProps, mapDispatchToProps)(FirstScreen)