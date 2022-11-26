import React from 'react'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Flex } from 'crox-new-uikit';

const Fail = () => {
    return (
        <Flex>
            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets6.lottiefiles.com/packages/lf20_qp1spzqv.json"
                style={{ width: '70px' }}
            />
        </Flex>
    )
}

export default Fail
