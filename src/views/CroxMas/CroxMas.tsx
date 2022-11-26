import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from "react-redux";
import { useWallet } from "@binance-chain/bsc-use-wallet";
import {
  Flex, Text, Button, Link
} from 'crox-new-uikit'
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import PoolIcon from '@mui/icons-material/Pool';
import { Swiper, SwiperSlide } from "swiper/react";
import Grid from '@mui/material/Grid';
import SwiperCore, { EffectCoverflow, EffectCube, Autoplay, Pagination } from "swiper/core";
import EventNoteIcon from '@mui/icons-material/EventNote';
import useMediaQuery from "@mui/material/useMediaQuery";
import InfoIcon from '@mui/icons-material/Info';
import BigNumber from "bignumber.js";
import {
  useGrandPools,
  usePriceCakeBusd,
  usePriceBnbBusd,
} from "state/hooks";
import useRefresh from "hooks/useRefresh";
import { fetchGrandPoolsUserDataAsync } from 'state/grandPool';
import { getAPYAndTVLofGrandPools } from 'utils/defi';
import CroxmasPools from './components/CroxmasPools'
import GrandBtn from './components/GrandBtn';
import GrandPoolConfig from './components/grandPool_config'
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css"
import "swiper/components/effect-cube/effect-cube.min.css"
import "swiper/components/effect-coverflow/effect-coverflow.min.css"
import './croxmas.scss'

SwiperCore.use([EffectCoverflow, EffectCube, Autoplay, Pagination]);

const CroxMas: React.FC = () => {

  const lg = useMediaQuery("(max-width: 1024px)");
  const [grandPoolTime, setGrandPoolTime] = useState("")
  const cakePrice = usePriceCakeBusd();
  const bnbPrice = usePriceBnbBusd();
  const disableGrand = useRef(true)
  const grandpool = useGrandPools();
  const calcStartTime = () => {
    const diff = 1640663940000 - new Date().getTime()
    const second = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 60000) % 60);
    const hours = Math.floor((diff / 3600000) % 24);
    const days = Math.floor(diff / 3600000 / 24);

    return (
      (days > 0 ? `${days}d : ` : "") +
      (hours >= 0 ? `${hours}h : ` : "") +
      (minutes >= 0 ? `${minutes}m : ` : "") +
      (second >= 0 ? `${second}s` : "")
    );
  };

  const dispatch = useDispatch();
  const { fastRefresh } = useRefresh();
  const { account } = useWallet();
  useEffect(() => {
    if (account) {
      dispatch(fetchGrandPoolsUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);
  const calcGrandStartTime = () => {
    const diff = 1641250800000 - new Date().getTime()
    const second = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / 60000) % 60);
    const hours = Math.floor((diff / 3600000) % 24);
    const days = Math.floor(diff / 3600000 / 24);

    return (
      (days > 0 ? `${days}d : ` : "") +
      (hours >= 0 ? `${hours}h : ` : "") +
      (minutes >= 0 ? `${minutes}m : ` : "") +
      (second >= 0 ? `${second}s` : "")
    );
  };

  const { apys, totalGrandValue } = getAPYAndTVLofGrandPools(grandpool, { cakePrice, bnbPrice })
  let apySum = new BigNumber(0);
  for (let i = 0; i < apys.length; i++) {
    apySum = apySum.plus(apys[i])
  }
  useEffect(() => {
    if (calcGrandStartTime() === "") {
      disableGrand.current = false;
    }
    const handle = setInterval(() => {
      const time = calcGrandStartTime();
      if (time === "") {
        disableGrand.current = false;
        clearInterval(handle);
      } else {
        setGrandPoolTime(time);
      }
    }, 1000);
    return () => clearInterval(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div>
        <ul className="lightrope">
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>
        <div className='croxmas_header'>
          <Flex justifyContent='center' alignItems='center'>
            <div className="card_croxmas">
              <Text className='croxmas_text'>CROXMAS</Text>
              <Text className='pool_party' color='white'>POOL PARTY</Text>
              <Text mt="2vw" className='begins_at' color='white'>From</Text>
              <Text mb='6.2vw' className='start_time' color='white'>24th Dec, 2021 to Jan 3rd, 2022</Text>
            </div>
          </Flex>
        </div>
        {/* <div className='croxmas_detail'>
          <Text color='lightgrey' className='sponsore_text'>Sponsored ad</Text>
          <Swiper
            centeredSlides
            navigation={false}
            pagination={{
              "dynamicBullets": true
            }}
            loop
            className='mySwiper'
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            breakpoints={{
              200: {
                slidesPerView: 1,
                spaceBetween: 0,
              },
            }}
          >
            <SwiperSlide>
              <div className='detail_group'>
                <Flex className="title" alignItems='center'>
                  {!lg ? <HourglassTopIcon className="title-part line-1" sx={{ fontSize: '2.5vw', marginRight: '10px', color: '#33C5EE' }} /> : <HourglassTopIcon className="title-part line-1" sx={{ fontSize: '4vw', marginRight: '10px', color: '#33C5EE' }} />}
                  <span className="title-part line-1">24 hours of non-stop pool party</span>
                </Flex>
                <Flex className="title" alignItems='center'>
                  {!lg ? <PoolIcon className="title-part line-1" sx={{ fontSize: '2.5vw', marginRight: '10px', color: '#33C5EE' }} /> : <PoolIcon className="title-part line-1" sx={{ fontSize: '4vw', marginRight: '10px', color: '#33C5EE' }} />}
                  <span className="title-part line-1">Launching one new staking pool every hour on 24th Dec </span>
                </Flex>
                <Flex className='title' alignItems='center'>
                  {!lg ? <EventNoteIcon className="title-part line-1" sx={{ fontSize: '2.5vw', marginRight: '10px', color: '#33C5EE' }} /> : <EventNoteIcon className="title-part line-1" sx={{ fontSize: '4vw', marginRight: '10px', color: '#33C5EE' }} />}
                  <span className="title-part line-1">Pool party duration: 7 days</span>
                </Flex>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <Link external href="https://app.airnfts.com/creators/RastaNFT">
                {!lg ? <img src="/images/advertisement/rasta_ad.png" alt="rasta" /> : <img src="/images/advertisement/rasta_ad_lg.png" alt="rasta" />}
              </Link>
            </SwiperSlide>
            <SwiperSlide>
              <Link external href="https://bitcrush.com">
                {!lg ? <img src="/images/advertisement/bitcrush_ad.png" alt="bitcrush" height='200px' /> : <img src="/images/advertisement/bitcrush_ad_lg.png" alt="bitcrush" />}
              </Link>
            </SwiperSlide> 
          </Swiper>
        </div> */}
        <div className='croxmas_back'>
          <Flex className="follow_us" alignItems='center' justifyContent='right' flexDirection='column'>
            <Flex className='title' alignItems='center' justifyContent='center'>
              <Text className="title-part line-2">Follow us on</Text>
            </Flex>
            <Flex justifyContent='center' alignItems='center'>
              <Flex className="christmasball color_red" justifyContent='center' alignItems='center'>
                <a href="https://t.me/croxswap">
                  <img
                    src="/icon_telegram.svg"
                    alt="telegram"
                  />
                </a>
              </Flex>
              <Flex className="christmasball color_green" justifyContent='center' alignItems='center'>
                <a href="https://twitter.com/croxswap">
                  <img
                    src="/icon_twitter.svg"
                    alt="twitter"
                  />
                </a>
              </Flex>
              <Flex className="christmasball color_orangered" justifyContent='center' alignItems='center'>
                <a href="https://github.com/croxswap">
                  <img
                    src="/icon_github.svg"
                    alt="github"
                  />
                </a>
              </Flex>
              <Flex className="christmasball color_purple" justifyContent='center' alignItems='center'>
                <a href="https://www.youtube.com/channel/UCPEJ2aiaH03VwKe4YoFWSGw">
                  <img
                    src="/icon_youtube.svg"
                    alt="youtube"
                  />
                </a>
              </Flex>
              <Flex className="christmasball color_blue" justifyContent='center' alignItems='center'>
                <a href="https://croxswap.medium.com">
                  <img
                    src="/icon_medium.svg"
                    alt="blog"
                  />
                </a>
              </Flex>
              <Flex className="christmasball color_orange" justifyContent='center' alignItems='center'>
                <a href="https://reddit.com/r/croxswap">
                  <img
                    src="/icon_reddit.svg"
                    alt="reddit"
                  />
                </a>
              </Flex>
            </Flex>
          </Flex>
        </div>
        <div className='pool_detail'>
          <Text fontSize='3vw' pt='1vw' className="croxmas_text" bold mt="0">Grand Pool</Text>
          <div id="container">
            <div className="bubble menu_snow">
              <div className="rectangle">
                <ul className="ribbon-badge">
                  <li className="inner"><img src="/footer_logo.svg" alt="logo" width='70px' /></li>
                  <li className="strip" />
                  <li className="strip" />
                  <li className="strip" />
                  <li className="strip" />
                  <li className="strip" />
                  <li className="strip" />
                  <li className="tail" />
                </ul>
                <div className='image_group'>
                  <Text bold className='closed_text'>Closed</Text>
                  {GrandPoolConfig.map((entry) => (
                    <img src={`/images/farms/${entry.label}.svg`} alt="logo" width='45px' className='image_grand' />
                  ))}
                </div>
              </div>
              <div className="triangle-l" />
              <div className="triangle-r" />
              <div className="info">
                {/*  <Flex justifyContent='space-between' alignItems='center' pb='20px'>
                  <Text fontSize='25px' bold>Launches in</Text>
                  <Text fontSize='25px' bold className="grand_pool_timer">{grandPoolTime}</Text>
                </Flex> */}
                <Flex justifyContent='space-between' alignItems='center' className='info_header' pb='20px'>
                  <div>
                    <h2 className='text_effect_header'>Stake CROX, Earn up to 15 tokens</h2>
                  </div>
                  <Flex justifyContent='right' flexDirection='column'>
                    <Flex>
                      <Text color='#0ff' fontSize='18px'>APR:</Text>
                      <Text color='#92ffff' fontSize='18px' bold ml='5px' className='text_effect_small'>{Math.min(
                        100000,
                        apySum.times(new BigNumber(100)).toNumber()
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}%</Text>
                    </Flex>
                    <Flex>
                      <Text fontSize='18px' color='#0ff'>Burn Fee:</Text>
                      <Text fontSize='18px' color='#92ffff' bold ml='4px' className='text_effect_small'>2%</Text>
                    </Flex>
                    <Flex>
                      <Text fontSize='18px' color='#0ff'>Total Liquidity:</Text>
                      <Text fontSize='18px' color='#92ffff' bold ml='4px' className='text_effect_small'>${totalGrandValue.toNumber().toFixed(0)}</Text>
                    </Flex>
                  </Flex>
                </Flex>
                <div className='info_group'>
                  <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 1, md: 1 }}>
                    {GrandPoolConfig.map((entry, index) => (
                      <Grid className="image_grid_grand" item xs={12} sm={4} md={3} lg={2.4}>
                        <Flex justifyContent='space-between' alignItems='center' className='image_detail'>
                          <div>
                            <img src={`/images/farms/${entry.label}.svg`} className='image_grand' alt="logo" />
                            <Text fontSize='14px' color='lightgrey' style={{ textAlign: 'center' }}>{entry.label.toUpperCase()}</Text>
                          </div>
                          <div>
                            <Text color='#0ff' fontSize='18px' style={{ textAlign: 'center' }}>APR:</Text>
                            <div>
                              <Text color='#92ffff' fontSize='18px' bold className='text_effect_small'>{Math.min(
                                100000,
                                apys[index].times(new BigNumber(100)).toNumber()
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}%</Text>
                            </div>
                          </div>
                        </Flex>
                      </Grid>
                    ))}
                  </Grid>
                </div>
                <GrandBtn grandpool={grandpool} />
              </div>
            </div>
          </div>
          <CroxmasPools />
        </div>
      </div>
    </>
  )
}

export default CroxMas;
