import React from 'react'
import { Box, Heading, Button, Layer } from 'grommet'
import { storeContractInstance } from '../redux/actions'
import Upload from '../components/Upload'
import { connect } from 'react-redux'

class FirstScreen extends React.Component {

    state = {
        showUploadModal: false
    }

    componentDidMount() {
        this.props.storeContractInstance({ web3: this.props.web3, contract: this.props.contract, accounts: this.props.accounts })
    }

    closeModal = () => {
        this.setState({ showUploadModal: false })
    }

    render() {
        console.log(this.props)
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