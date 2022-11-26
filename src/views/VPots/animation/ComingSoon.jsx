import React from 'react'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Flex } from 'crox-new-uikit';

const ComingSoon = () => {
    return (
        <Flex>
            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets3.lottiefiles.com/packages/lf20_xiussssy.json"
                style={{ width: '70px' }}
            />
        </Flex>
    )
}

export default ComingSoon