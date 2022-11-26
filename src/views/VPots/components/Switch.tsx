import React from "react";
import { Flex } from "crox-new-uikit";
import { useMediaQuery } from '@mui/material'

const Switch = () => {
    const ismobile = useMediaQuery("(max-width: 600px)")
    return (
        <Flex mt={20}>
            <label className="switch">
                <input type='checkbox' />
                <span className='base-color'>
                    <span className='toggle-slider' />
                    <span className='cash'>All Pools</span>
                    <span className='token'>My Pools</span>
                </span>
            </label>
        </Flex>
    )
}

export default Switch;