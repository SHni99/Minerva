import React from "react";

import { useNavigate } from "react-router-dom";
import { Column } from "components/Column";
import { Stack } from "components/Stack";
import { Image } from "components/Image";
import { Row } from "components/Row";
import { Button } from "components/Button";
import { Text } from "components/Text";
import { Line } from "components/Line";

const LandingPagePage = () => {
  const navigate = useNavigate();

  const handleNavigate23 = () => navigate("/listingspage");
  const handleNavigate17 = () => navigate("/listingspage");
  const handleNavigate18 = () => navigate("/loginpage");
  const handleNavigate24 = () => navigate("/registerpage");
  const handleNavigate7 = () => navigate("/aboutuspage");
  const handleNavigate9 = () => navigate("/registerpage");
  const handleNavigate8 = () => navigate("/aboutuspage");

  return (
    <>
      <Column className="bg-white_A700 font-nunitosans items-center justify-start mx-[auto] w-[100%]">
        <Stack className="lg:h-[583px] xl:h-[667px] h-[749px] 2xl:h-[750px] 3xl:h-[900px] w-[100%]">
          <Image
            src="img_books1.png"
            className="absolute lg:h-[583px] xl:h-[667px] h-[749px] 2xl:h-[750px] 3xl:h-[900px] inset-[0] object-cover w-[100%]"
            alt="books1"
          />
          <Column className="absolute inset-x-[0] items-start justify-start mx-[auto] top-[4%] w-[95%]">
            <Column className="w-[100%]">
              <Column className="items-start justify-start w-[100%]">
                <Column className="w-[100%]">
                  <Row className="items-start justify-between w-[100%]">
                    <Image
                      src="img_minervalogo1.png"
                      className="h-[100px] 2xl:h-[101px] 3xl:h-[121px] lg:h-[78px] xl:h-[89px] object-contain w-[29%]"
                      alt="MINERVALOGO1"
                    />
                    <Row className="items-start justify-between lg:mb-[6px] xl:mb-[7px] mb-[8px] 3xl:mb-[9px] lg:mt-[17px] xl:mt-[19px] mt-[22px] 3xl:mt-[26px] w-[33%]">
                      <Stack className="font-inter lg:h-[55px] xl:h-[63px] h-[70px] 2xl:h-[71px] 3xl:h-[85px] w-[33%]">
                        <div
                          className="common-pointer absolute lg:h-[45px] xl:h-[51px] h-[57px] 2xl:h-[58px] 3xl:h-[69px] shadow-bs top-[0] w-[100%]"
                          onClick={handleNavigate23}
                        ></div>
                        <Column className="absolute inset-[0] rounded-radius50 shadow-bs w-[100%]">
                          <Button
                            className="common-pointer bg-light_blue_900 border border-light_blue_900 border-solid font-medium lg:mb-[17px] xl:mb-[19px] mb-[22px] 3xl:mb-[26px] lg:py-[12px] xl:py-[14px] py-[16px] 3xl:py-[19px] rounded-radius12 shadow-bs text-center lg:text-fs12 xl:text-fs14 text-fs16 3xl:text-fs19 text-white_A700 w-[100%]"
                            onClick={handleNavigate17}
                          >{`View listings`}</Button>
                        </Column>
                      </Stack>
                      <Button
                        className="common-pointer font-bold font-nunitosans lg:mb-[17px] xl:mb-[19px] mb-[22px] 3xl:mb-[26px] lg:py-[11px] xl:py-[13px] py-[15px] 3xl:py-[18px] rounded-radius4 text-center lg:text-fs14 xl:text-fs16 text-fs18 3xl:text-fs21 text-gray_50 w-[22%]"
                        onClick={handleNavigate18}
                      >{`Log in`}</Button>
                      <Column className="font-inter lg:mb-[17px] xl:mb-[19px] mb-[22px] 3xl:mb-[26px] rounded-radius34 w-[39%]">
                        <Button
                          className="common-pointer bg-gray_50 border border-gray_50 border-solid font-medium lg:py-[12px] xl:py-[14px] py-[16px] 3xl:py-[19px] rounded-radius19 text-center lg:text-fs12 xl:text-fs14 text-fs16 3xl:text-fs19 text-gray_900 w-[100%]"
                          onClick={handleNavigate24}
                        >{`Register`}</Button>
                      </Column>
                    </Row>
                  </Row>
                </Column>
                <Text className="font-bold lg:leading-lh37 xl:leading-lh42 2xl:leading-lh48 leading-lh4800 3xl:leading-lh57 lg:mt-[63px] xl:mt-[72px] mt-[81px] 3xl:mt-[97px] lg:mx-[55px] xl:mx-[63px] mx-[71px] 3xl:mx-[85px] lg:text-fs31 xl:text-fs35 text-fs40 3xl:text-fs48 text-indigo_900 text-left tracking-ls1 w-[29%]">{`Can’t find suitable tutors/tutees?`}</Text>
              </Column>
            </Column>
            <Stack className="font-inter lg:h-[158px] xl:h-[181px] h-[203px] 2xl:h-[204px] 3xl:h-[244px] lg:mx-[55px] xl:mx-[63px] mx-[71px] 3xl:mx-[85px] w-[32%]">
              <Button
                className="common-pointer absolute bg-gray_901 border border-gray_901 border-solid bottom-[11%] font-medium lg:py-[12px] xl:py-[14px] py-[16px] 3xl:py-[19px] right-[22%] rounded-radius11 text-center lg:text-fs12 xl:text-fs14 text-fs16 3xl:text-fs19 text-white_A700 w-[35%]"
                onClick={handleNavigate7}
              >{`About Us`}</Button>
              <Stack className="absolute lg:h-[158px] xl:h-[181px] h-[203px] 2xl:h-[204px] 3xl:h-[244px] inset-[0] w-[100%]">
                <Column className="absolute bottom-[0] font-inter left-[0] rounded-radius1 w-[35%]">
                  <Button className="bg-light_blue_900 border border-blue_900 border-solid font-medium lg:mb-[17px] xl:mb-[19px] mb-[22px] 3xl:mb-[26px] lg:py-[12px] xl:py-[14px] py-[16px] 3xl:py-[19px] rounded-radius11 text-center lg:text-fs12 xl:text-fs14 text-fs16 3xl:text-fs19 text-white_A700 w-[100%]">{`See How It Works`}</Button>
                </Column>
                <Text className="absolute font-normal font-nunitosans lg:leading-lh24 xl:leading-lh28 2xl:leading-lh32 leading-lh3200 3xl:leading-lh38 not-italic lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 text-indigo_901 text-left top-[0] w-[100%]">{`Minerva can help with its easy-to-use and convenient tuition-matching service. Get started with just three simple steps!`}</Text>
              </Stack>
            </Stack>
          </Column>
        </Stack>
        <Column className="bg-gray_902 items-center justify-start w-[100%]">
          <Text className="font-extrabold lg:mt-[58px] xl:mt-[66px] mt-[75px] 3xl:mt-[90px] mx-[auto] lg:text-fs49 xl:text-fs56 text-fs64 3xl:text-fs76 text-left text-white_A700">{`WHY MINERVA?`}</Text>
          <Row className="items-start justify-start lg:mt-[45px] xl:mt-[51px] mt-[58px] 3xl:mt-[69px] w-[100%]">
            <Column className="items-start justify-start lg:mb-[44px] xl:mb-[50px] mb-[57px] 3xl:mb-[68px] lg:ml-[40px] xl:ml-[46px] ml-[52px] 3xl:ml-[62px] w-[48%]">
              <Column className="w-[100%]">
                <Image
                  src="img_communicationd.png"
                  className="lg:h-[290px] xl:h-[331px] h-[372px] 2xl:h-[373px] 3xl:h-[447px] object-cover w-[100%]"
                  alt="communicationd"
                />
              </Column>
              <Text className="font-extrabold ml-[10px] 3xl:ml-[12px] lg:ml-[7px] xl:ml-[8px] lg:mt-[33px] xl:mt-[38px] mt-[43px] 3xl:mt-[51px] lg:text-fs12 xl:text-fs14 text-fs16 3xl:text-fs19 text-left text-white_A700">{`FAST & EFFICIENT`}</Text>
              <Column className="items-start lg:mt-[17px] xl:mt-[19px] mt-[22px] 3xl:mt-[26px] w-[100%]">
                <Text className="font-extrabold font-nunitosans lg:ml-[23px] xl:ml-[26px] ml-[30px] 3xl:ml-[36px] lg:text-fs31 xl:text-fs36 text-fs41 3xl:text-fs49 text-right text-white_A700">{`USER-FRIENDLY INTERFACES`}</Text>
                <Text className="font-inter font-normal leading-lh10000 lg:ml-[23px] xl:ml-[26px] ml-[30px] 3xl:ml-[36px] lg:mt-[29px] xl:mt-[33px] mt-[38px] 3xl:mt-[45px] not-italic lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 text-right text-white_A700 w-[96%]">
                  {
                    <>
                      {`Say goodbye to messy walls of text.`}
                      <br />
                      {``}
                      <br />
                      {`Minerva enables easy filtering of listings through clean and simple menus.`}
                      <br />
                      {``}
                      <br />
                      {`Make use of the intuitive and straightforward controls to make your experience smoother!`}
                    </>
                  }
                </Text>
              </Column>
            </Column>
            <Column className="items-start justify-start 3xl:ml-[111px] lg:ml-[72px] xl:ml-[82px] ml-[93px] lg:mt-[57px] xl:mt-[65px] mt-[74px] 3xl:mt-[88px] w-[35%]">
              <Text className="font-extrabold font-nunitosans mr-[10px] 3xl:mr-[12px] lg:mr-[7px] xl:mr-[8px] lg:text-fs12 xl:text-fs14 text-fs16 3xl:text-fs19 text-left text-white_A700">{`FAST & EFFICIENT`}</Text>
              <Text className="font-extrabold font-nunitosans lg:mt-[13px] xl:mt-[15px] mt-[17px] 3xl:mt-[20px] lg:text-fs31 xl:text-fs36 text-fs41 3xl:text-fs49 text-left text-white_A700">{`DIRECT MATCHING`}</Text>
              <Text className="font-inter font-normal leading-lh10000 lg:mt-[13px] xl:mt-[15px] mt-[17px] 3xl:mt-[20px] not-italic lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 text-left text-white_A700 w-[100%]">
                {
                  <>
                    {`Chat directly with your chosen tutor/tutee!`}
                    <br />
                    {``}
                    <br />
                    {`Avoid delays caused by manual matching processes by agencies.`}
                  </>
                }
              </Text>
              <Image
                src="img_happysunshine.png"
                className="lg:h-[332px] xl:h-[379px] h-[426px] 2xl:h-[427px] 3xl:h-[512px] mr-[10px] 3xl:mr-[12px] lg:mr-[7px] xl:mr-[8px] lg:mt-[38px] xl:mt-[43px] mt-[49px] 3xl:mt-[58px] object-contain w-[85%]"
                alt="happysunshine"
              />
            </Column>
          </Row>
          <Row className="items-end justify-start 3xl:mb-[115px] lg:mb-[74px] xl:mb-[85px] mb-[96px] xl:mt-[1px] lg:mt-[1px] mt-[2px] w-[100%]">
            <Image
              src="img_multitaskingma.png"
              className="lg:h-[251px] xl:h-[287px] h-[322px] 2xl:h-[323px] 3xl:h-[387px] lg:ml-[63px] xl:ml-[72px] ml-[82px] 3xl:ml-[98px] object-contain w-[24%]"
              alt="multitaskingma"
            />
            <Column className="items-start justify-start lg:ml-[48px] xl:ml-[55px] ml-[62px] 3xl:ml-[74px] 3xl:mt-[100px] lg:mt-[65px] xl:mt-[74px] mt-[84px] w-[48%]">
              <Text className="font-extrabold font-nunitosans mr-[10px] 3xl:mr-[12px] lg:mr-[7px] xl:mr-[8px] lg:text-fs12 xl:text-fs14 text-fs16 3xl:text-fs19 text-left text-white_A700">{`FLEXIBLE`}</Text>
              <Text className="font-extrabold font-nunitosans lg:mt-[13px] xl:mt-[15px] mt-[17px] 3xl:mt-[20px] lg:text-fs31 xl:text-fs36 text-fs41 3xl:text-fs49 text-left text-white_A700">{`HIGHLY CUSTOMISABLE LISTINGS`}</Text>
              <Text className="font-inter font-normal leading-lh10000 lg:mt-[18px] xl:mt-[21px] mt-[24px] 3xl:mt-[28px] not-italic lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 text-left text-white_A700 w-[100%]">
                {
                  <>
                    {`Want to teach for free? Only able to teach certain topics of a subject?`}
                    <br />
                    {`Wish to only teach online?`}
                    <br />
                    {``}
                    <br />
                    {`Fret not! Minerva can handle all these requests. Simply add more fields and let Minerva do the rest.`}
                  </>
                }
              </Text>
            </Column>
          </Row>
        </Column>
        <Stack className="font-inter lg:h-[620px] xl:h-[709px] h-[796px] 2xl:h-[797px] 3xl:h-[956px] w-[100%]">
          <Image
            src="img_hm1.png"
            className="absolute lg:h-[620px] xl:h-[709px] h-[796px] 2xl:h-[797px] 3xl:h-[956px] inset-[0] object-cover rounded-radius11 w-[100%]"
            alt="hm1"
          />
          <Stack className="absolute bg-gray_51 lg:h-[516px] xl:h-[590px] h-[663px] 2xl:h-[664px] 3xl:h-[797px] inset-[0] justify-center m-[auto] rounded-radius20 shadow-bs1 w-[83%]">
            <Stack className="absolute bottom-[7%] lg:h-[112px] xl:h-[128px] h-[143px] 2xl:h-[144px] 3xl:h-[172px] left-[8%] w-[33%]">
              <Button
                className="common-pointer absolute bg-orange_500 border border-orange_500 border-solid bottom-[3%] font-normal inset-x-[0] mx-[auto] lg:py-[11px] xl:py-[13px] py-[15px] 3xl:py-[18px] rounded-radius10 text-center lg:text-fs14 xl:text-fs16 text-fs18 3xl:text-fs21 text-gray_900 w-[61%]"
                onClick={handleNavigate9}
              >{`Sign up now`}</Button>
              <Text className="absolute font-normal inset-[0] leading-lh10000 not-italic text-black_900 text-center lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 w-[100%]">{`Minerva provides a quick and easy solution to find tutors and tutees through our online platform.`}</Text>
            </Stack>
            <Row className="absolute items-start justify-between left-[3%] top-[5%] w-[77%]">
              <Column className="font-nunitosans items-center justify-start xl:mb-[111px] mb-[125px] 3xl:mb-[150px] lg:mb-[97px] w-[55%]">
                <Image
                  src="img_wamen1.png"
                  className="lg:h-[225px] xl:h-[258px] h-[289px] 2xl:h-[290px] 3xl:h-[348px] object-cover w-[100%]"
                  alt="wamen1"
                />
                <Text className="font-bold leading-lh10000 lg:mt-[21px] xl:mt-[24px] mt-[27px] 3xl:mt-[32px] mx-[auto] text-black_900 text-center lg:text-fs37 xl:text-fs42 text-fs48 3xl:text-fs57 w-[92%]">
                  {
                    <>
                      {`Get started with`}
                      <br />
                      {` Minerva today`}
                    </>
                  }
                </Text>
              </Column>
              <Text className="font-inter font-normal lg:leading-lh18 xl:leading-lh21 2xl:leading-lh24 leading-lh2400 3xl:leading-lh28 lg:mt-[35px] xl:mt-[40px] mt-[45px] 3xl:mt-[54px] text-black_900 lg:text-fs14 xl:text-fs16 text-fs18 3xl:text-fs21 text-left w-[31%]">
                <span className="text-black_900 text-fs32 tracking-ls1 font-nunitosans font-bold lg:text-fs24 xl:text-fs28 3xl:text-fs38">
                  <>
                    {`Step 1`}
                    <br />
                    {``}
                  </>
                </span>
                <span className="text-black_900 font-medium">
                  <>
                    {`Create a member account or log in as guest to view listings`}
                    <br />
                    {``}
                  </>
                </span>
                <span className="text-black_900">
                  <>
                    {``}
                    <br />
                    {``}
                    <br />
                    {``}
                  </>
                </span>
                <span className="text-black_900 text-fs32 tracking-ls1 font-nunitosans font-bold lg:text-fs24 xl:text-fs28 3xl:text-fs38">
                  <>
                    {`Step 2`}
                    <br />
                    {``}
                  </>
                </span>
                <span className="text-black_900 font-medium">
                  <>
                    {`Search and filter listings based on your preferences`}
                    <br />
                    {``}
                  </>
                </span>
                <span className="text-black_900">
                  <>
                    {``}
                    <br />
                    {``}
                    <br />
                    {``}
                  </>
                </span>
                <span className="text-black_900 text-fs32 tracking-ls1 font-nunitosans font-bold lg:text-fs24 xl:text-fs28 3xl:text-fs38">
                  <>
                    {`Step 3 `}
                    <br />
                    {``}
                  </>
                </span>
                <span className="text-black_900 font-medium">
                  <>{`Communicate with tutors/tutees through private chat`}</>
                </span>
              </Text>
            </Row>
          </Stack>
        </Stack>
        <footer className="font-inter w-[100%]">
          <Column className="items-center justify-start lg:mt-[22px] xl:mt-[25px] mt-[29px] 3xl:mt-[34px] w-[100%]">
            <Line className="h-[2px] mx-[auto] w-[83%]" />
            <Row className="bg-orange_200 items-center justify-start lg:mt-[22px] xl:mt-[25px] mt-[29px] 3xl:mt-[34px] w-[100%]">
              <Text className="font-normal lg:leading-lh12 xl:leading-lh14 2xl:leading-lh16 leading-lh1600 3xl:leading-lh19 lg:mb-[10px] xl:mb-[12px] mb-[14px] 3xl:mb-[16px] lg:ml-[17px] xl:ml-[20px] ml-[23px] 3xl:ml-[27px] lg:mt-[11px] xl:mt-[13px] mt-[15px] 3xl:mt-[18px] not-italic text-black_901 lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 text-left w-[9%]">
                {
                  <>
                    {`2022 © Minerva`}
                    <br />
                    {`All rights reserved.`}
                  </>
                }
              </Text>
              <Row className="items-center justify-center lg:mb-[4px] xl:mb-[5px] mb-[6px] 3xl:mb-[7px] lg:ml-[199px] xl:ml-[228px] ml-[256.5px] 2xl:ml-[256px] 3xl:ml-[307px] lg:mt-[5px] xl:mt-[6px] mt-[7px] 3xl:mt-[8px] w-[42%]">
                <Button className="font-medium lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius4 text-black_901 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[7%]">{`Home`}</Button>
                <Button className="font-medium 3xl:ml-[119px] lg:ml-[77px] xl:ml-[88px] ml-[99.5px] 2xl:ml-[99px] lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius4 text-black_901 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[15%]">{`Privacy Policy`}</Button>
                <Button className="font-medium ml-[100px] 3xl:ml-[120px] lg:ml-[77px] xl:ml-[88px] lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius4 text-black_901 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[19%]">{`Terms of Service`}</Button>
                <Button
                  className="common-pointer font-medium ml-[100px] 3xl:ml-[120px] lg:ml-[77px] xl:ml-[88px] lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius4 text-black_901 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[10%]"
                  onClick={handleNavigate8}
                >{`About Us`}</Button>
              </Row>
              <Row className="items-center justify-center lg:ml-[169px] xl:ml-[193px] ml-[218px] 3xl:ml-[261px] lg:my-[13px] xl:my-[15px] my-[17px] 3xl:my-[20px] w-[7%]">
                <Image
                  src="img_instagram1.png"
                  className="lg:h-[21px] xl:h-[25px] h-[27px] 2xl:h-[28px] 3xl:h-[33px] object-contain lg:w-[21px] xl:w-[24px] w-[27px] 3xl:w-[32px]"
                  alt="instagram1"
                />
                <Image
                  src="img_twitter1.png"
                  className="lg:h-[18px] xl:h-[20px] h-[22px] 2xl:h-[23px] 3xl:h-[27px] xl:mb-[1px] lg:mb-[1px] mb-[2px] lg:ml-[11px] xl:ml-[13px] ml-[15px] 3xl:ml-[18px] xl:mt-[2px] lg:mt-[2px] mt-[3px] object-contain w-[25%]"
                  alt="twitter1"
                />
                <Image
                  src="img_facebook1.png"
                  className="lg:h-[21px] xl:h-[24px] h-[26px] 2xl:h-[27px] 3xl:h-[32px] xl:ml-[10px] ml-[12.19px] 2xl:ml-[12px] 3xl:ml-[14px] lg:ml-[9px] mt-[1px] object-contain lg:w-[20px] xl:w-[23px] w-[26px] 3xl:w-[31px]"
                  alt="facebook1"
                />
              </Row>
            </Row>
          </Column>
        </footer>
      </Column>
    </>
  );
};

export default LandingPagePage;
