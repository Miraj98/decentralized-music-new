import React from 'react'
import { Box, InfiniteScroll, Heading, Layer } from 'grommet'
import Music from '../components/Music'
import { connect } from 'react-redux'
import { getSongsId, getUserSongs, getSongToPlay } from '../redux/actions'
import { data } from '../utils/data'
import PurchaseFlow from '../components/PurchaseFlow';
import { getDataFromIpfs } from '../utils/ipfs'

const createSoundWithBuffer = (buffer) => {
    var context = new AudioContext();

  var audioSource = context.createBufferSource();
  audioSource.connect( context.destination );

  context.decodeAudioData( buffer, function( res ) {

    audioSource.buffer = res;

    /*
       Do something with the sound, for instance, play it.
       Watch out: all the sounds will sound at the same time!
    */
      audioSource.noteOn( 0 );

  } );
}


function extractBuffer( src, offset, length ) {

    var dstU8 = new Uint8Array( length );
    var srcU8 = new Uint8Array( src, offset, length );
    dstU8.set( srcU8 );
    return dstU8;
  
  }

const preProcess = (data) => {
    var bb = new DataView( data );
    var offset = 0;
  
    while( offset < bb.byteLength ) {
  
      var length = bb.getUint32( offset, true );
      offset += 4;
      var sound = extractBuffer( data, offset, length );
      offset += length;
  
      createSoundWithBuffer( sound.buffer );
    }
}

class BrowseScreen extends React.Component {

    state = {
        showPurchaseModal: false,
        songIdToPassToModal: null,
        dataFromIPFS: null,
        disablePlayButton: false
    }

    setIPFSData = data => {
        console.log("Being called")
        this.setState({ dataFromIPFS: data })
    }

    componentDidMount() {
        this.props.contract.methods.songsId().call()
        .then(response => this.props.getSongsId(response))

        this.props.contract.methods.getUserSongs(this.props.accounts[0]).call()
        .then(response => this.props.getUserSongs(response))
    }

    updatesSongIdToPass = songIdToPassToModal => this.setState({ songIdToPassToModal, showPurchaseModal: true })
    closePurchaseModal = () => this.setState({ showPurchaseModal: false, songIdToPassToModal: null })

    onPlayPressed = async songId => {
        this.setState({ disablePlayButton: true })
        const songObject = await this.props.contract.methods.songsIdToSong(songId).call()
        const ipfsHash = songObject.ipfsHash
        getDataFromIpfs(ipfsHash, (err, result) => {
            const arrayBuffer = this.base64ToBuffer(result)
            if(arrayBuffer === null) return
            this.props.getSongToPlay(arrayBuffer)
            console.log("Audio buffer: ", this.props.musicBuffer)
            preProcess(this.props.musicBuffer)
        })
    }

    base64ToBuffer = function (binary) {
        if(binary === null || binary === undefined) return null
        var buffer = new ArrayBuffer(binary.length);
        var bytes = new Uint8Array(buffer);
        for (var i = 0; i < buffer.byteLength; i++) {
            bytes[i] = binary.charCodeAt(i) & 0xFF;
        }
        return buffer;
    };

    render() {
        console.log(this.state.disablePlayButton)
        return (
            <Box  background="light-3" justify='start' align='center' style={{ wordWrap: "anywhere" }} pad='medium' fill overflow={{ vertical: "scroll" }}>
                {
                    this.props.userSongs.allIds.length === 0 ? null :
                    <Heading level={2}>Your Music</Heading>
                }
                {
                    this.props.userSongs.allIds.length === 0 ? null :
                    <InfiniteScroll items={this.props.userSongs.allIds}>
                    {
                        item => (
                            <Music disablePlayButton={this.state.disablePlayButton} onPlayPressed={() => this.onPlayPressed(item)} isBought={true} key={item} {...data[item]} />
                        )
                    }
                    </InfiniteScroll>
                }
                {
                    this.props.userSongs.length === 0 ? null :
                    <Heading level={2}>Other stuff</Heading>
                }
                <InfiniteScroll items={this.props.songsId.filter(id => this.props.userSongs.byId[id] !== true)}>
                    {
                        item => (
                            <Music updateState={() => this.updatesSongIdToPass(item)} isBought={false} key={item} {...data[item]} />
                        )
                    }
                </InfiniteScroll>
                {
                    this.state.showPurchaseModal && (
                        <Layer>
                            <PurchaseFlow closeModal={this.closePurchaseModal} songId={this.state.songIdToPassToModal} />
                        </Layer>
                    )
                }
            </Box>
        )
    }
}

const mapStateToProps = state => ({
    contract: state.contract,
    songsId: state.songsId,
    userSongs: state.userSongs,
    accounts: state.accounts,
    musicBuffer: state.musicPlayer.currentMusic
})

const mapDispatchToProps = {
    getSongsId,
    getUserSongs,
    getSongToPlay
}

export default connect(mapStateToProps, mapDispatchToProps)(BrowseScreen)