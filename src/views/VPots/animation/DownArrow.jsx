import React from 'react'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Flex } from 'crox-new-uikit';

const DownArrow = () => {
    return (
        <Flex>
            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets8.lottiefiles.com/private_files/lf30_NnBW3K.json"
                style={{ width: '40px' }}
            />
        </Flex>
    )
}

export default DownArrow