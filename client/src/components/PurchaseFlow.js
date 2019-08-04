import React from 'react'
import { Box, Text, Heading, Button } from 'grommet'
import { data } from '../utils/data'
import { connect } from 'react-redux'
import { getUserSongs } from '../redux/actions'

class PurchaseFlow extends React.Component {

    state = {
        price: "--"
    }

    async componentDidMount() {
        const response = await this.props.contract.methods.songsIdToSong(this.props.songId).call()
        this.setState({ price: response.price })
    }

    purchaseMusic = async () => {
       const response = await this.props.contract.methods.buySong(this.props.songId).send({ from: this.props.accounts[0], value: this.state.price })
       const _userSongs = await this.props.contract.methods.getUserSongs(this.props.accounts[0]).call()
       this.props.getUserSongs(_userSongs)
       if(response) this.props.closeModal()
    }

    render() {
        return (
            <Box pad='large' justify='center' align='center'>
                <Text weight='bold' margin={{ bottom: 'medium' }} size='xsmall'>PURCHASE DETAILS</Text>
                <Box gap='medium' align='center' justify='evenly' direction='row' padding='small'>
                    <Box pad='small'>
                        <img src={data[this.props.songId].albumArt} alt='thumbnail' style={{ height: 100, width: 100, borderRadius: 8 }} />
                    </Box>
                    <Box pad='small'>
                        <Text weight='bold'>{data[this.props.songId].songName}</Text>
                        <Text>Album: {data[this.props.songId].album}</Text>
                        <Text>by {data[this.props.songId].artist}</Text>
                    </Box>
                    <Box align='center' justify='center' pad='small'>
                        <Heading margin='none' level={2}>{this.state.price}</Heading>
                        <Text weight='bold'>wei</Text>
                    </Box>
                </Box>
                <Button onClick={this.purchaseMusic} margin={{ top: 'medium' }} label='Purchase' primary hoverIndicator='background' />
            </Box>
        )
    }
}

const mapStateToProps = state => ({
    contract: state.contract,
    accounts: state.accounts
})

const mapDispatchToProps = {
    getUserSongs
}

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseFlow)