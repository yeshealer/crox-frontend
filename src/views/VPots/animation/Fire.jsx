import React from 'react'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Flex } from 'crox-new-uikit';

const Fire = () => {
    return (
        <Flex>
            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets4.lottiefiles.com/packages/lf20_ko9ahj1s.json"
                style={{ width: '30px' }}
            />
        </Flex>
    )
}

export default Fire