import React from 'react'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Flex } from 'crox-new-uikit';

const Question = () => {
    return (
        <Flex>
            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets5.lottiefiles.com/packages/lf20_EMpZFW.json"
                style={{ width: '40px' }}
            />
        </Flex>
    )
}

export default Question