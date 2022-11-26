import React from 'react'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Flex } from 'crox-new-uikit';

const New = () => {
    return (
        <Flex>
            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets2.lottiefiles.com/packages/lf20_sxpoxpks.json"
                style={{ width: '50px', marginLeft: '-10px' }}
            />
        </Flex>
    )
}

export default New