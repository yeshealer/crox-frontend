import React from 'react'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Flex } from 'crox-new-uikit';

const NotFound = () => {
    return (
        <Flex>
            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets1.lottiefiles.com/packages/lf20_tmsiddoc.json"
                style={{ width: '150px' }}
            />
        </Flex>
    )
}

export default NotFound