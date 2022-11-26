import React from 'react'
import * as LottiePlayer from "@lottiefiles/lottie-player";
import { Flex } from 'crox-new-uikit';

const Congratulation = () => {
    return (
        <Flex>
            <lottie-player
                autoplay
                loop
                mode="normal"
                src="https://assets8.lottiefiles.com/packages/lf20_fnjH1K.json"
                style={{ width: '250px' }}
            />
        </Flex>
    )
}

export default Congratulation