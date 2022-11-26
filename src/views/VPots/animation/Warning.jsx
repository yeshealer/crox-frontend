import React from 'react'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Flex } from 'crox-new-uikit';

const Warning = () => {
    return (
        <Flex>
            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets2.lottiefiles.com/packages/lf20_dVJMow.json"
                style={{ width: '70px' }}
            />
        </Flex>
    )
}

export default Warning