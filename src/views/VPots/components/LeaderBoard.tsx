import React, { useState } from "react";
import styled from "styled-components";
import { Flex, Text } from "crox-new-uikit";
import { Icon } from '@iconify/react';
import { useMediaQuery } from "@mui/material";

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? "100%" : "0px")};
  overflow: hidden;
  transition: 1so
`;

const LeaderBoard = ({ isPot, claimHistory }) => {
    const [showExpandableSection, setShowExpandableSection] = useState(false);
    const ismobile = useMediaQuery("(max-width: 600px)")
    const account = "0xf2F4a752ae2cEB6d71f32498d96595b5023256B3";
    return (
        <Flex className="leaderBoard" flexDirection='column' justifyContent='flex-start'>
            <Flex className="header" alignItems='flex-start' mb='10px'>
                <Text ml='5px' fontSize="20px" bold>{isPot ? "Players" : "Claim History"}</Text>
            </Flex>
            {ismobile ? (
                <>
                    <Flex className="mobileTd" flexDirection='column' mb='5px'>
                        <Flex justifyContent='space-between' alignItems='center' onClick={() => {
                            setShowExpandableSection(!showExpandableSection)
                        }}>
                            <Text className="rank">#1</Text>
                            <Text>{account.slice(0, 15)}...{account.slice(-15)}</Text>
                        </Flex>
                        <ExpandingWrapper expanded={showExpandableSection}>
                            <Flex flexDirection='column'>
                                <Text mr='3px'>Deposited: 500 CAKE</Text>
                                <Text mr='3px'>Fee Rewards: 200 CAKE</Text>
                            </Flex>
                        </ExpandingWrapper>
                    </Flex>
                    <Flex className="mobileTd" flexDirection='column' mb='5px'>
                        <Flex justifyContent='space-between' alignItems='center' onClick={() => setShowExpandableSection(!showExpandableSection)}>
                            <Text className="rank">#2</Text>
                            <Text>{account.slice(0, 15)}...{account.slice(-15)}</Text>
                        </Flex>
                        <ExpandingWrapper expanded={showExpandableSection}>
                            <Flex flexDirection='column'>
                                <Text mr='3px'>Deposited: 500 CAKE</Text>
                                <Text mr='3px'>Fee Rewards: 200 CAKE</Text>
                            </Flex>
                        </ExpandingWrapper>
                    </Flex>
                    <Flex className="mobileTd" flexDirection='column' mb='5px'>
                        <Flex justifyContent='space-between' alignItems='center' onClick={() => setShowExpandableSection(!showExpandableSection)}>
                            <Text className="rank">#3</Text>
                            <Text>{account.slice(0, 15)}...{account.slice(-15)}</Text>
                        </Flex>
                        <ExpandingWrapper expanded={showExpandableSection}>
                            <Flex flexDirection='column'>
                                <Text mr='3px'>Deposited: 500 CAKE</Text>
                                <Text mr='3px'>Fee Rewards: 200 CAKE</Text>
                            </Flex>
                        </ExpandingWrapper>
                    </Flex>
                    <Flex className="mobileTd" flexDirection='column'>
                        <Flex justifyContent='space-between' alignItems='center' onClick={() => setShowExpandableSection(!showExpandableSection)}>
                            <Text className="rank">#4</Text>
                            <Text>{account.slice(0, 15)}...{account.slice(-15)}</Text>
                        </Flex>
                        <ExpandingWrapper expanded={showExpandableSection}>
                            <Flex flexDirection='column'>
                                <Text mr='3px'>Deposited: 500 CAKE</Text>
                                <Text mr='3px'>Fee Earned: 200 CAKE</Text>
                            </Flex>
                        </ExpandingWrapper>
                    </Flex>
                </>
            ) : (
                <>
                    <table>
                        <tr>
                            <th>{isPot ? "Farmed" : "Date"}</th>
                            <th>Transactions</th>
                            <th>Token</th>
                            <th>{isPot ? "Odds" : "Fee Claimed"}</th>
                        </tr>
                        {claimHistory.map((history, index) => {
                            const timeStamp = parseInt(history.timeStamp) * 1000
                            const date = new Date(timeStamp)
                            const feeClaimed = parseInt(history.value) / 10 ** parseInt(history.tokenDecimal)
                            return (
                                <tr>
                                    <td>{date.getFullYear()} {date.toLocaleString('default', { month: 'short' })} {date.getUTCDate()}th {date.getHours()}:{date.getMinutes()}:{date.getSeconds()}</td>
                                    <td><a href={`https://bscscan.com/tx/${history.hash}`} target="_blank" rel="noreferrer">{history.hash}</a></td>
                                    <td>{history.tokenSymbol.toUpperCase()}</td>
                                    <td>{feeClaimed.toFixed(12)}...</td>
                                </tr>
                            )
                        })}
                    </table >
                </>
            )}
        </Flex >
    )
}

export default LeaderBoard