import React from 'react'
import { Box, Text, Button } from 'grommet'

function Music({ songName, album, artist, albumArt, isBought, updateState, onPlayPressed, disabledPlayButton }) {
    return (
        <Box
            flex={false}
            background="white"
            padding='small'
            margin={{ top: 'medium' }}
            elevation='medium'
            width="48rem"
            round='medium'
            border={{ size: 'xxsmall', color: 'border' }}
            align='center' justify='evenly' direction='row'>
            <Box pad='small'>
                <img src={albumArt} alt='thumbnail' style={{ height: 100, width: 100, borderRadius: 8 }} />
            </Box>
            <Box>
                <Text weight='bold'>{songName}</Text>
                <Text>Album: {album}</Text>
                <Text>by {artist}</Text>
            </Box>
            {/* <Box align='center' justify='center'>
                <Text>$10</Text>
                <Text size='small'>PRICE</Text>
            </Box> */}
            <Box>
                <Button onClick={() => {
                    if(!isBought) updateState()
                    else onPlayPressed()
                }} disabled={disabledPlayButton === true ? true : false} primary hoverIndicator='background' label={isBought ? 'Play' : 'Buy'} />
            </Box>
        </Box>
    )
}

export default Music