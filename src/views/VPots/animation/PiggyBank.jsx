import React from 'react'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Flex } from 'crox-new-uikit';

const PiggyBank = () => {
    return (
        <Flex>
            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets5.lottiefiles.com/packages/lf20_d7raikbb.json"
                style={{ width: '115px' }}
            />
        </Flex>
    )
}

export default PiggyBank