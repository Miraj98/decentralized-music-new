import React from 'react'
import { Box, Heading, Button, Layer } from 'grommet'
import Upload from '../components/Upload'

class FirstScreen extends React.Component {

    state = {
        showUploadModal: false
    }

    render() {
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
                                    <Upload/>
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

export default FirstScreen