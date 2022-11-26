import React from "react";
import { Flex } from "crox-new-uikit";
import { useFetchCakeVault } from "./cakehooks";
import { useFetchBabyVault } from './babyhooks'
import VPotsHeader from './VPotsHeader';
import VPotsBody from './VPotsBody';
import VPotsFooter from './VPotsFooter';
import './vpots.scss'

const VPots = () => {
    const cakeVPotsData = useFetchCakeVault()
    const babyVPotsData = useFetchBabyVault()

    const VPotsData = {
        stakerCount: [babyVPotsData.stakerCount, cakeVPotsData.stakerCount],
        jackpotCounters: [babyVPotsData.jackpotCounters, cakeVPotsData.jackpotCounters],
        feeDistributed: [babyVPotsData.feeDistributed, cakeVPotsData.feeDistributed],
        feeUSDValue: [babyVPotsData.feeUSDValue, cakeVPotsData.feeUSDValue],
        totalValueLocked: [babyVPotsData.totalValueLocked, cakeVPotsData.totalValueLocked],
        APY: [babyVPotsData.APY, cakeVPotsData.APY],
        totalFeeReward: [babyVPotsData.totalFeeReward, cakeVPotsData.totalFeeReward],
        endTime: [babyVPotsData.endTime, cakeVPotsData.endTime],
        jackpotTotalReward: [babyVPotsData.jackpotTotalReward, cakeVPotsData.jackpotTotalReward],
        rewardDebt: [babyVPotsData.rewardDebt, cakeVPotsData.rewardDebt],
        userStartTime: [babyVPotsData.userStartTime, cakeVPotsData.userStartTime],
        pendingRewardPerUser: [babyVPotsData.pendingRewardPerUser, cakeVPotsData.pendingRewardPerUser]
    }

    return (
        <Flex justifyContent='center' flexDirection='column' alignItems='center'>
            <VPotsHeader title="VPOTS" />
            <VPotsBody
                APY={babyVPotsData.APY}
            />
            <VPotsFooter
                stakerCount={VPotsData.stakerCount}
                jackpotCounters={VPotsData.jackpotCounters}
                feeDistributed={VPotsData.feeDistributed}
                feeUSDValue={VPotsData.feeUSDValue}
                totalValueLocked={VPotsData.totalValueLocked}
                APY={VPotsData.APY}
                totalFeeReward={VPotsData.totalFeeReward}
                // endTime={VPotsData.endTime}
                // jackpotTotalReward={VPotsData.jackpotTotalReward}
                // rewardDebt={VPotsData.rewardDebt}
                // userStartTime={VPotsData.userStartTime}
                pendingRewardPerUser={VPotsData.pendingRewardPerUser}
            />
        </Flex>
    )
}

export default VPots
