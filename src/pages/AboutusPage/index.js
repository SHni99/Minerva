import React from "react";

import { useNavigate } from "react-router-dom";
import { Column } from "components/Column";
import { Row } from "components/Row";
import { Image } from "components/Image";
import { Button } from "components/Button";
import { Stack } from "components/Stack";
import { Line } from "components/Line";
import { Text } from "components/Text";

const AboutusPagePage = () => {
  const navigate = useNavigate();

  const handleNavigate5 = () => navigate("/");
  const handleNavigate2 = () => navigate("/");
  const handleNavigate1 = () => navigate("/listingspage");
  const handleNavigate4 = () => navigate("/loginpage");
  const handleNavigate3 = () => navigate("/registerpage");
  const handleNavigate6 = () => navigate("/");

  return (
    <>
      <Column className="bg-white_A700 font-nunitosans mx-[auto] w-[100%]">
        <Column className="items-center justify-start lg:mt-[39px] xl:mt-[45px] mt-[51px] 3xl:mt-[61px] w-[100%]">
          <header className="mx-[auto] w-[86%]">
            <Row className="items-center justify-start w-[100%]">
              <Image
                src="img_minervalogo1_3.png"
                className="common-pointer 3xl:h-[112px] lg:h-[73px] xl:h-[83px] h-[93px] 2xl:h-[94px] object-contain w-[24%]"
                onClick={handleNavigate5}
                alt="MINERVALOGO1"
              />
              <Row className="font-inter items-center justify-center xl:mb-[20px] mb-[23px] 3xl:mb-[27px] lg:ml-[29px] xl:ml-[33px] ml-[38px] 3xl:ml-[45px] xl:mt-[19px] mt-[22px] 3xl:mt-[26px] lg:my-[17px] w-[22%]">
                <Button
                  className="common-pointer font-medium lg:py-[10px] xl:py-[12px] py-[14px] 3xl:py-[16px] rounded-radius4 text-black_901 text-center lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 w-[20%]"
                  onClick={handleNavigate2}
                >{`Home`}</Button>
                <Button
                  className="common-pointer font-medium lg:ml-[27px] xl:ml-[31px] ml-[35px] 3xl:ml-[42px] lg:py-[10px] xl:py-[12px] py-[14px] 3xl:py-[16px] rounded-radius4 text-black_901 text-center lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 w-[27%]"
                  onClick={handleNavigate1}
                >{`Listings`}</Button>
                <Button className="font-medium lg:ml-[18px] xl:ml-[21px] ml-[24px] 3xl:ml-[28px] lg:py-[10px] xl:py-[12px] py-[14px] 3xl:py-[16px] rounded-radius4 text-center lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 text-indigo_700 w-[32%]">{`About Us`}</Button>
              </Row>
              <Button
                className="common-pointer font-normal lg:mb-[13px] xl:mb-[15px] mb-[17px] 3xl:mb-[20px] lg:ml-[312px] xl:ml-[357px] ml-[402px] 3xl:ml-[482px] lg:mt-[12px] xl:mt-[14px] mt-[16px] 3xl:mt-[19px] not-italic lg:py-[15px] xl:py-[17px] py-[20px] 3xl:py-[24px] rounded-radius4 text-center lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 text-light_blue_900 w-[8%]"
                onClick={handleNavigate4}
              >{`Log in`}</Button>
              <Button
                className="common-pointer bg-light_blue_900 border border-light_blue_900 border-solid font-normal xl:mb-[20px] mb-[23px] 3xl:mb-[27px] 3xl:ml-[10px] lg:ml-[7px] xl:ml-[8px] ml-[9px] xl:mt-[19px] mt-[22px] 3xl:mt-[26px] lg:my-[17px] not-italic lg:py-[10px] xl:py-[12px] py-[14px] 3xl:py-[16px] rounded-radius11 text-center lg:text-fs15 xl:text-fs17 text-fs20 3xl:text-fs24 text-white_A700 w-[9%]"
                onClick={handleNavigate3}
              >{`Sign up`}</Button>
            </Row>
          </header>
          <Stack className="font-inter lg:h-[1159px] xl:h-[1325px] h-[1489px] 2xl:h-[1491px] 3xl:h-[1788px] w-[100%]">
            <footer className="absolute bottom-[0] w-[100%]">
              <Column className="items-center justify-start w-[100%]">
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
                    <Button
                      className="common-pointer font-medium lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius4 text-black_901 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[7%]"
                      onClick={handleNavigate6}
                    >{`Home`}</Button>
                    <Button className="font-medium 3xl:ml-[119px] lg:ml-[77px] xl:ml-[88px] ml-[99.5px] 2xl:ml-[99px] lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius4 text-black_901 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[15%]">{`Privacy Policy`}</Button>
                    <Button className="font-medium ml-[100px] 3xl:ml-[120px] lg:ml-[77px] xl:ml-[88px] lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius4 text-black_901 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[19%]">{`Terms of Service`}</Button>
                    <Button className="font-medium ml-[100px] 3xl:ml-[120px] lg:ml-[77px] xl:ml-[88px] lg:py-[13px] xl:py-[15px] py-[17px] 3xl:py-[20px] rounded-radius4 text-black_901 text-center lg:text-fs10 xl:text-fs12 text-fs14 3xl:text-fs16 w-[10%]">{`About Us`}</Button>
                  </Row>
                  <Row className="items-center justify-center lg:ml-[170px] xl:ml-[194px] ml-[219px] 3xl:ml-[262px] lg:my-[13px] xl:my-[15px] my-[17px] 3xl:my-[20px] w-[7%]">
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
            <Column className="absolute inset-[0] items-center justify-start w-[100%]">
              <Text className="font-poppins font-semibold lg:mt-[60px] xl:mt-[69px] mt-[78px] 3xl:mt-[93px] mx-[auto] text-black_900 lg:text-fs49 xl:text-fs56 text-fs64 3xl:text-fs76 text-left lg:tracking-ls1 tracking-ls128 3xl:tracking-ls2 2xl:tracking-ls2 xl:tracking-ls2">{`About us`}</Text>
              <Column className="font-poppins lg:mt-[254px] xl:mt-[290px] mt-[327px] 3xl:mt-[392px] w-[100%]">
                <Row className="items-center justify-center w-[100%]">
                  <Line className="bg-black_900_00 h-[1px] w-[18%]" />
                  <Line className="bg-black_900_00 h-[1px] lg:ml-[171px] xl:ml-[195px] ml-[220px] 3xl:ml-[264px] w-[16%]" />
                </Row>
                <Row className="items-center justify-center lg:mb-[4px] xl:mb-[5px] mb-[6px] 3xl:mb-[7px] lg:mt-[31px] xl:mt-[36px] mt-[41px] 3xl:mt-[49px] w-[100%]">
                  <Text className="font-semibold lg:leading-lh3 2xl:leading-lh4 xl:leading-lh4 leading-lh450 3xl:leading-lh5 text-black_900 text-center lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 tracking-ls1 w-[18%]">
                    <span className="text-black_900 font-poppins">
                      <>
                        {`Ni Shenghan`}
                        <br />
                        {``}
                      </>
                    </span>
                    <span className="text-black_900 font-poppins font-normal">
                      <>
                        {`Telegram: @boba_fatt`}
                        <br />
                        {`GitHub: SHni99`}
                      </>
                    </span>
                  </Text>
                  <Text className="font-semibold lg:leading-lh3 2xl:leading-lh4 xl:leading-lh4 leading-lh450 3xl:leading-lh5 lg:ml-[182px] xl:ml-[208px] ml-[234px] 3xl:ml-[280px] text-black_900 text-center lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 tracking-ls1 w-[15%]">
                    <span className="text-black_900 font-poppins">
                      <>
                        {`Kok Chun Zhi`}
                        <br />
                        {``}
                      </>
                    </span>
                    <span className="text-black_900 font-poppins font-normal">
                      <>
                        {`Telegram: @kokcz`}
                        <br />
                        {`GitHub: chunzkok`}
                      </>
                    </span>
                  </Text>
                </Row>
              </Column>
              <Line className="bg-black_900 h-[1px] lg:mt-[57px] xl:mt-[65px] mt-[74px] 3xl:mt-[88px] mx-[auto] w-[69%]" />
              <Text className="font-inter font-normal lg:leading-lh24 xl:leading-lh27 2xl:leading-lh31 leading-lh3100 3xl:leading-lh37 lg:mt-[44px] xl:mt-[50px] mt-[57px] 3xl:mt-[68px] mx-[auto] not-italic text-black_900 text-center lg:text-fs18 xl:text-fs21 text-fs24 3xl:text-fs28 tracking-ls1 w-[78%]">
                {
                  <>
                    {`Hello! We are two students studying Computer Science in NUS.`}
                    <br />
                    {`This project was created as part of Orbital 2022, and it is meant to tackle the lack of proper tuition-matching services in Singapore.`}
                    <br />
                    {`We hope that this project can benefit both tutors and tutees by making the matching process easier and simpler!`}
                  </>
                }
              </Text>
              <Line className="bg-black_900 h-[1px] lg:mt-[63px] xl:mt-[72px] mt-[81px] 3xl:mt-[97px] mx-[auto] w-[69%]" />
              <Text className="font-poppins font-semibold lg:leading-lh24 xl:leading-lh27 2xl:leading-lh31 leading-lh3100 3xl:leading-lh37 lg:mb-[15px] xl:mb-[17px] mb-[20px] 3xl:mb-[24px] lg:mt-[36px] xl:mt-[41px] mt-[47px] 3xl:mt-[56px] mx-[auto] text-black_900 text-center lg:text-fs62 xl:text-fs71 text-fs80 3xl:text-fs96 tracking-ls2 w-[76%]">
                <span className="text-black_900 text-fs64 lg:text-fs49 xl:text-fs56 3xl:text-fs76">
                  <>
                    {`Our mission `}
                    <br />
                    {``}
                  </>
                </span>
                <span className="text-black_900 text-fs24 font-inter font-normal lg:text-fs18 xl:text-fs21 3xl:text-fs28">
                  <>
                    {`The team name, Minerva, was chosen as the Roman goddess epitomises wisdom, presenting an image befitting of our vision for the project.`}
                    <br />
                    {`The main goal of this project is to create a convenient platform for tutors and tutees to connect, facilitating the proliferation of knowledge.`}
                  </>
                </span>
              </Text>
            </Column>
          </Stack>
        </Column>
      </Column>
    </>
  );
};

export default AboutusPagePage;
