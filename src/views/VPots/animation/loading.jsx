import React from 'react'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Flex } from 'crox-new-uikit';

const Loading = () => {
    return (
        <Flex>
            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets2.lottiefiles.com/packages/lf20_kkmsef80.json"
                style={{ width: '50px' }}
            />
        </Flex>
    )
}

export default Loading