import React from 'react'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Flex } from 'crox-new-uikit';

const Success = () => {
    return (
        <Flex>
            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets4.lottiefiles.com/packages/lf20_rgdnbvya.json"
                style={{ width: '70px' }}
            />
        </Flex>
    )
}

export default Success